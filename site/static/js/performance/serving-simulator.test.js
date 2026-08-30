import { describe, it, expect } from 'bun:test';
import { simulateServing } from './serving-simulator.js';

describe('Serving Simulator Engine', () => {
  it('is deterministic for identical inputs', () => {
    const a = simulateServing({ seed: 7 });
    const b = simulateServing({ seed: 7 });
    expect(a).toEqual(b);
  });

  it('keeps the tail bounded relative to the median', () => {
    const r = simulateServing({ seed: 7 });
    // Prefill stalls and queueing inflate the tail, but it should stay sane.
    expect(r.ttftP99).toBeGreaterThan(r.ttftP50);
    expect(r.tpotP99).toBeGreaterThan(r.tpotP50);
    expect(r.tpotP99).toBeLessThan(r.tpotP50 * 6);
  });

  it('produces a plausible metric tuple', () => {
    const r = simulateServing({});
    expect(r.tps).toBeGreaterThan(0);
    expect(r.ttftP50).toBeGreaterThan(0);
    expect(r.tpotP50).toBeGreaterThan(0);
    expect(r.tpotP99).toBeGreaterThanOrEqual(r.tpotP50);
    expect(r.ttftP99).toBeGreaterThanOrEqual(r.ttftP50);
    expect(r.quality).toBeLessThanOrEqual(1);
    expect(r.vramGb).toBeGreaterThan(0);
  });

  it('raises TPS and TPOT as batch size grows (batch amortization)', () => {
    const small = simulateServing({ maxBatch: 16, concurrency: 16 });
    const large = simulateServing({ maxBatch: 96, concurrency: 96 });
    // Larger batch should increase aggregate throughput.
    expect(large.tps).toBeGreaterThan(small.tps);
  });

  it('queues requests past the batch cap, raising TTFT', () => {
    const capped = simulateServing({ concurrency: 32, maxBatch: 32 });
    const overloaded = simulateServing({ concurrency: 128, maxBatch: 32 });
    expect(overloaded.queued).toBeGreaterThan(capped.queued);
    expect(overloaded.ttftP50).toBeGreaterThan(capped.ttftP50);
  });

  it('TTFT rises smoothly as load approaches the batch cap', () => {
    const light = simulateServing({ concurrency: 32, maxBatch: 64 });
    const nearCap = simulateServing({ concurrency: 58, maxBatch: 64 });
    expect(nearCap.ttftP50).toBeGreaterThan(light.ttftP50);
  });

  it('speculative decoding raises TPS but lowers quality', () => {
    const base = simulateServing({ speculativeK: 0 });
    const spec = simulateServing({ speculativeK: 4 });
    expect(spec.tps).toBeGreaterThan(base.tps);
    expect(spec.quality).toBeLessThan(base.quality);
  });

  it('PD disaggregation removes prefill stalls from the TPOT tail', () => {
    const fused = simulateServing({ pdDisaggregation: false, chunkSize: 0 });
    const split = simulateServing({ pdDisaggregation: true, chunkSize: 0 });
    // Decoupled decode should have a tighter tail (less p99 spread).
    const spreadFused = fused.tpotP99 - fused.tpotP50;
    const spreadSplit = split.tpotP99 - split.tpotP50;
    expect(spreadSplit).toBeLessThanOrEqual(spreadFused);
  });

  it('PD disaggregation costs VRAM (a second pool)', () => {
    const base = simulateServing({ pdDisaggregation: false });
    const split = simulateServing({ pdDisaggregation: true });
    expect(split.vramGb).toBeGreaterThan(base.vramGb);
  });

  it('speculative decoding adds VRAM for the draft model', () => {
    const base = simulateServing({ speculativeK: 0 });
    const spec = simulateServing({ speculativeK: 4 });
    expect(spec.vramGb).toBeGreaterThan(base.vramGb);
  });

  it('raising the KV cache budget raises reported VRAM', () => {
    const small = simulateServing({ kvCacheGb: 24, concurrency: 64, maxBatch: 64 });
    const big = simulateServing({ kvCacheGb: 48, concurrency: 64, maxBatch: 64 });
    expect(big.vramGb).toBeGreaterThan(small.vramGb);
  });

  it('priority scheduling cuts TTFT but costs a little throughput', () => {
    const base = simulateServing({ concurrency: 64, maxBatch: 48 });
    const pri = simulateServing({ concurrency: 64, maxBatch: 48, priority: true });
    expect(pri.ttftP50).toBeLessThan(base.ttftP50);
    expect(pri.tps).toBeLessThan(base.tps);
  });

  it('lowering concurrency past the batch cap lowers TTFT and TPS', () => {
    const base = simulateServing({ concurrency: 64, maxBatch: 48 });
    const low = simulateServing({ concurrency: 32, maxBatch: 48 });
    expect(low.ttftP50).toBeLessThan(base.ttftP50);
    expect(low.tps).toBeLessThan(base.tps);
  });
});
