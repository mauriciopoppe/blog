/* ==========================================================================
 * Deterministic CPU-Simulated Inference Serving Engine
 *
 * A pure, testable model of a continuous-batching LLM server. It takes a
 * workload and a set of feature toggles, and deterministically produces a
 * metric tuple (TPS, TTFT, TPOT, VRAM, quality). The trade-offs EMERGE from
 * the physics of the model rather than from hardcoded curves:
 *
 *  - Decode is memory-bandwidth bound: one iteration reads the weights once
 *    for the whole batch, so iteration time is roughly flat in batch size
 *    while attention compute grows with batch * context. That produces the
 *    hockey-stick TPS-vs-TPOT curve.
 *  - Prefill is compute bound and scales with prompt length.
 *  - Requests queue as load approaches the batch cap; the expected wait grows
 *    smoothly (bursts) and then linearly past it, so TTFT bends like a hockey
 *    curve against load instead of stepping at the cap.
 *
 * Deterministic: a seeded PRNG generates the per-request token lengths, so
 * the same inputs + features always return the same metrics.
 * ========================================================================== */

// Small deterministic PRNG (mulberry32).
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const DEFAULTS = {
  // Hardware
  weightsGb: 14,          // model weights in GPU memory (7B fp16)
  bandwidthGbps: 2500,    // HBM bandwidth, GB/s
  flopsTflops: 312,       // peak compute, TFLOPS
  kvCacheGb: 24,          // GPU memory budget for KV cache
  kvBytesPerToken: 100000, // KV bytes per token per sequence (0.1 MB; exaggerated so VRAM moves visibly)

  // Workload
  inputTokens: 512,
  outputTokens: 256,
  concurrency: 32,        // concurrent in-flight requests

  // Features
  maxBatch: 64,           // max sequences per decode batch
  chunkSize: 0,           // prefill chunk size in tokens; 0 = unchunked
  pdDisaggregation: false,
  speculativeK: 0,        // draft length; 0 = off
  priority: false,        // priority scheduling: new requests jump the queue

  seed: 7,
  nRequests: 160,
};

// Attention cost in FLOPs per (sequence * kv token), tuned so it starts below
// the memory read and grows past it as batch * context rises. That makes TPOT
// flat at small batches and climb once attention dominates, giving the
// hockey-stick TPS-vs-TPOT curve.
const ATTENTION_FLOP_PER_SEQ_KV = 3e7;
// Compute FLOPs to prefill one token (forward pass through the model).
const PREFILL_FLOP_PER_TOKEN = 2.8e10;
// Speculative draft runs at ~40% of the target model's cost.
const DRAFT_COST_FRACTION = 0.4;
// Priority scheduling reorders the batch to serve new requests first, which
// slightly disrupts batching efficiency and costs a little throughput.
const PRIORITY_TPS_PENALTY = 0.9;

export function simulateServing(input = {}) {
  const cfg = { ...DEFAULTS, ...input };
  const rng = mulberry32(cfg.seed);

  const weightsBytes = cfg.weightsGb * 1e9;
  // Decode iteration: memory read of the weights once for the whole batch.
  const memIterMs = (weightsBytes / (cfg.bandwidthGbps * 1e9)) * 1000;

  // Requests queue as load grows: the expected number of requests ahead of a
  // new one follows an M/M/1-style curve (rho / (1 - rho)), capped so it stays
  // finite at capacity. Past the cap the server sheds excess load, so the
  // extra wait stays bounded instead of exploding with the oversubscription
  // count. TTFT therefore bends like a hockey curve against load instead of
  // stepping, without an extreme tail that crushes the plot scale.
  const queued = Math.max(0, cfg.concurrency - cfg.maxBatch);
  const batch = Math.min(cfg.concurrency, cfg.maxBatch);
  const load = cfg.concurrency / Math.max(1, cfg.maxBatch);
  const rho = Math.min(load, 1);
  let waiters = Math.min(24, rho / Math.max(0.001, 1 - rho));
  if (load > 1) waiters = 24 + Math.min(queued, 20) * 0.4;

  // KV cache may cap the effective batch size.
  const kvPerSeq = cfg.inputTokens + cfg.outputTokens;
  const kvFit = Math.max(1, Math.floor((cfg.kvCacheGb * 1e9) / (kvPerSeq * cfg.kvBytesPerToken)));
  const effBatch = Math.min(batch, kvFit);

  // Decode iteration time for the active batch at average context length.
  const avgKvLen = cfg.inputTokens + cfg.outputTokens / 2;
  const attnIterMs = (ATTENTION_FLOP_PER_SEQ_KV * avgKvLen * effBatch) / (cfg.flopsTflops * 1e12) * 1000;
  let decodeIterMs = memIterMs + attnIterMs;

  // Speculative decoding: draft proposes K tokens, accepted with rate r.
  let acceptRate = 0.62;
  let quality = 1.0;
  let tpsMul = 1;
  if (cfg.speculativeK > 0) {
    // Effective tokens per iteration: accepted draft tokens plus the verified token.
    tpsMul = 1 + cfg.speculativeK * acceptRate;
    // Draft adds compute each step; cheap model, so only a fraction of cost.
    decodeIterMs *= 1 + DRAFT_COST_FRACTION * cfg.speculativeK;
    // Accepted non-greedy tokens can nudge generation quality down slightly.
    quality *= 1 - 0.015 * cfg.speculativeK;
  }

  // Prefill cost for the whole prompt (compute bound).
  const prefillMs = (cfg.inputTokens * PREFILL_FLOP_PER_TOKEN) / (cfg.flopsTflops * 1e12) * 1000;

  // Per-request simulation with seeded jitter -> deterministic latency tails.
  const ttfts = [];
  const tpots = [];

  for (let i = 0; i < cfg.nRequests; i++) {
    const inputLen = Math.round(cfg.inputTokens * (0.7 + 0.6 * rng()));
    const outputLen = Math.round(cfg.outputTokens * (0.6 + 0.8 * rng()));
    const reqKv = inputLen + outputLen / 2;

    // Decode iteration for this request's context.
    const rAttnMs = (ATTENTION_FLOP_PER_SEQ_KV * reqKv * effBatch) / (cfg.flopsTflops * 1e12) * 1000;
    let rIter = memIterMs + rAttnMs;
    if (cfg.speculativeK > 0) rIter *= 1 + DRAFT_COST_FRACTION * cfg.speculativeK;

    // Prefill for this request's prompt length.
    const rPrefillMs = (inputLen * PREFILL_FLOP_PER_TOKEN) / (cfg.flopsTflops * 1e12) * 1000;

    // Queue delay: waiting for a slot in the batch. Priority scheduling cuts
    // most of that wait by serving new requests first.
    const queueMs = waiters > 0 ? waiters * rIter * (cfg.priority ? 0.2 : 1) : 0;

    // Time to first token = queue + (chunked prefill interleaves with decode).
    let ttft = queueMs + rPrefillMs;
    if (cfg.chunkSize > 0) {
      // Chunked prefill splits into steps that share the GPU with decode, so
      // the prompt takes a bit longer wall-clock but stops stalling decode.
      ttft *= 1 + 0.08 * Math.ceil(inputLen / cfg.chunkSize);
    }
    if (cfg.pdDisaggregation) {
      // Prefill runs on a separate pool; add a small KV transfer hop.
      ttft = rPrefillMs + 8;
    }

    // TPOT: per-token decode latency. With speculative decoding the step
    // emits multiple tokens, so the per-token time is the iteration time
    // divided by the tokens produced. Plus jitter spikes when an unchunked
    // prefill stalls the batch; PD disaggregation removes those stalls.
    let tpot = rIter / tpsMul;
    const stall = (cfg.chunkSize === 0 && !cfg.pdDisaggregation && rng() < 0.06)
      ? 1 + 1.2 * rng()
      : 1;
    tpot *= stall;

    ttfts.push(ttft);
    tpots.push(tpot);
  }

  const pct = (arr, q) => {
    const s = [...arr].sort((a, b) => a - b);
    return s[Math.min(s.length - 1, Math.ceil(q * s.length) - 1)];
  };

  // Throughput: a batch of effBatch sequences emits one token each per decode
  // iteration, so aggregate rate = effBatch tokens / decodeIterMs.
  let tps = (effBatch / (decodeIterMs / 1000)) * tpsMul;
  if (cfg.priority) tps *= PRIORITY_TPS_PENALTY;

  // VRAM reflects feature costs: PD disaggregation runs a second pool (roughly
  // doubling model weights), speculative decoding adds a small draft model,
  // and the KV cache occupies what the current batch uses plus reserved
  // headroom that grows with the configured budget.
  const weightsForVram = cfg.weightsGb * (cfg.pdDisaggregation ? 2 : 1);
  const draftVram = cfg.speculativeK > 0 ? cfg.weightsGb * 0.3 : 0;
  const kvUsage = (kvPerSeq * effBatch * cfg.kvBytesPerToken) / 1e9;
  const kvVram = kvUsage + cfg.kvCacheGb * 0.25;

  return {
    tps: Math.round(tps),
    ttftP50: Math.round(pct(ttfts, 0.5)),
    ttftP99: Math.round(pct(ttfts, 0.99)),
    tpotP50: Math.round(pct(tpots, 0.5)),
    tpotP99: Math.round(pct(tpots, 0.99)),
    quality: Math.round(quality * 100) / 100,
    vramGb: Math.round((weightsForVram + kvVram + draftVram) * 10) / 10,
    utilization: Math.round((cfg.concurrency / Math.max(1, cfg.maxBatch)) * 100),
    batch: effBatch,
    queued,
  };
}
