---
title: "Benchmarking & Capacity Planning for Systems Engineers"
summary: |
  A systems engineering guide to load testing and capacity planning: applying the problem statement method, characterizing production workloads, eliminating Coordinated Omission, choosing between open and closed loops, and sizing infrastructure with Little's Law.
image: /images/benchmarking-and-capacity-planning.png
tags: ["system design", "benchmarking", "load testing", "capacity planning", "distributed systems", "performance"]
date: 2026-08-28T22:59:04
favorite: true
series: "performance-series"
perf_stage: "benchmarking"
libraries: ["katex"]
mathTerms: ["systems", "queuing"]
---

Benchmarking production infrastructure is difficult. It is easy to run a naive closed-loop load test, receive a clean report claiming a "p99 latency of 12ms at 5,000 req/s", and deploy to production only to suffer catastrophic tail latency spikes under a fraction of that traffic.

The exact same illusion happens in generative AI systems: running an LLM benchmark with tools like [`inference-perf`](https://github.com/kubernetes-sigs/inference-perf) or [`aiperf`](https://github.com/ai-dynamo/aiperf) using a fixed 128-token prompt might report a "p99 Time to First Token (TTFT) of 30ms", only for the server to suffer multi-second TTFT delays and GPU KV-cache memory exhaustion when production traffic sends real-world 4,000-token conversational prompts.

Most benchmarks lie not because the hardware is broken, but because the test was designed without grounding in queuing theory. When a benchmark ignores the mechanics of waiting lines, it falls into critical measurement traps like **Coordinated Omission**, masks queue buildup behind self-throttling virtual users, and tests an artificial synthetic workload that bears no resemblance to production traffic.

Accurate capacity planning is an empirical science. It requires a disciplined problem statement, rigorous workload characterization, and open-loop measurement tooling.

To ground these principles in production practice, this guide follows two running architectures side by side:

1. **Classical Web & Database Backends**: CPU-bound worker processes, connection-pooled relational databases, and disk/memory page caches.
2. **Generative AI Inference Clusters**: GPU tensor accelerators, continuous batching iteration schedulers, and VRAM KV-cache memory pools.

While their physical hardware constraints differ (CPU cores and transactional locks vs. GPU tensor cores and High-Bandwidth Memory), both obey the exact same queuing mechanics and saturation mathematics.

*(For foundational formulas and queue derivations, see [Performance Fundamentals](/notes/performance-fundamentals/) and [Queuing Theory for Systems Engineers](/notes/queuing-theory-for-systems-engineers/).)*

## The Performance Problem Statement Method

Before launching any load testing tool, you must define the experimental parameters of the test. Running a benchmark without a formal problem statement is like running a randomized stress test: it generates CPU heat, but produces numbers you cannot safely use for sizing clusters or verifying Service Level Agreements (SLAs).

A complete performance problem statement establishes five core dimensions:

<svg viewBox="0 0 840 220" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <!-- Card 1: Objective -->
  <g transform="translate(12, 16)">
    <rect x="0" y="0" width="154" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 1</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Explicit Goal</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Capacity Knee (λ)</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">SLA verification,</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">saturation limits,</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">resilience tests</text>
  </g>
  <!-- Card 2: Baseline S -->
  <g transform="translate(176, 16)">
    <rect x="0" y="0" width="154" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 2</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Baseline Floor</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Service Time (S)</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">Zero queue wait</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">runtime floor</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">(ρ → 0, W₀ = S)</text>
  </g>
  <!-- Card 3: SLA Targets -->
  <g transform="translate(340, 16)">
    <rect x="0" y="0" width="154" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 3</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">SLA Targets</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Multipliers of S</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">P50 ≤ 1.5 × S</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">P95 ≤ 3.0 × S</text>
    <text x="12" y="156" fill="rgb(var(--primary))" font-size="13" font-weight="700">P99 ≤ 4.0 × S</text>
  </g>
  <!-- Card 4: Failure Modes -->
  <g transform="translate(504, 16)">
    <rect x="0" y="0" width="154" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 4</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Failure Modes</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Bottlenecks</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">DB pool limits,</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">lock contention,</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">KV-cache stalls</text>
  </g>
  <!-- Card 5: Test Isolation -->
  <g transform="translate(668, 16)">
    <rect x="0" y="0" width="154" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 5</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Test Isolation</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Clean Control</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">Dedicated host,</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">no noisy peers,</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">remote generator</text>
  </g>
</svg>

### Test Goals & Environmental Controls

A complete benchmark specification establishes explicit experimental controls:

- **Explicit Test Objective**: Load tests serve three distinct purposes:
  1. **Capacity Discovery**: Finding the maximum throughput ($\lambda_{\text{knee}}$) the system can sustain before crossing the operational knee ($\rho \approx$ 75%) into hyperbolic queue delays (or discovering maximum concurrent token rates before TTFT and TPOT diverge in LLM serving).
  2. **SLA / Regression Gating**: Verifying that a new release satisfies strict tail latency bounds in CI/CD pipelines ($P\_{99} \le 25\text{ ms}$ for web APIs, or $\text{TTFT}\_{99} \le 200\text{ ms}$ and $\text{TPOT}\_{99} \le 25\text{ ms/token}$ for streaming LLM endpoints).
  3. **Saturation & Resilience Mapping**: Deliberately pushing the system past 100% capacity to verify graceful degradation (circuit breakers, shedding load with HTTP 429/503, KV-cache sequence preemption, and avoiding out-of-memory crashes).
- **Anticipated Failure Modes**: Identify what resource will exhaust first across infrastructure layers: compute core saturation, database connection starvation, socket/port exhaustion (`TIME_WAIT`), GC Stop-the-World pauses, GPU VRAM KV-cache block exhaustion, or High-Bandwidth Memory (HBM) bus saturation during autoregressive decode.
- **Strict Environment Isolation**: Never run the load generator tool on the same physical host or virtual machine as the target server. Ensure network bandwidth between the load generator and server is at least $10\times$ higher than peak expected test bandwidth. In multi-GPU inference deployments, ensure Tensor Parallelism (TP) communication uses dedicated NVLink / NVSwitch fabrics rather than congested PCIe bridges.

### Baseline Service Floor ($S$) & Latency Multipliers

Before measuring contention under heavy traffic, measure the baseline execution duration ($S = W_0$) under near-zero load ($\rho <$ 5%, single request at a time). This value represents the physical execution floor of your code, database queries, and compute kernels (uncontended prefill latency $S\_{\text{prefill}}$ and decode step latency $S\_{\text{decode}}$).

Setting arbitrary millisecond SLA targets (such as "P99 must be under 50ms") is dangerous without knowing the underlying execution floor ($S$):

- **Too Loose (Hiding Collapse)**: If an API endpoint has an uncontended baseline of $S = 2\text{ ms}$, a $50\text{ ms}$ threshold allows a $25\times$ latency multiplier:

$$
\frac{W}{S} = \frac{50\text{ ms}}{2\text{ ms}} = 25, \quad \frac{1}{1 - \rho} = 25 \implies \rho = \mathbf{0.96}
$$

  This allows the system to reach **96% load** ($\rho = 0.96$), operating deep in the saturation cliff on the verge of complete collapse while alerts stay green.
- **Physically Impossible**: If a database query has a baseline execution time of $S = 30\text{ ms}$, a $50\text{ ms}$ SLA is mathematically impossible even at moderate 50% load ($W = 2S = 60\text{ ms}$).

Instead of arbitrary numbers, frame percentile SLAs as **multipliers of the baseline service duration ($S$)**, bounded by an OS jitter noise floor ($t_{\text{floor}} \approx 1\text{ to } 2\text{ ms}$ for sub-millisecond endpoints):

$$
\begin{aligned}
P_{50} &\le 1.5 \times S \\\\
P_{95} &\le 3.0 \times S \\\\
P_{99} &\le \max(4.0 \times S, t_{\text{floor}})
\end{aligned}
$$

These multipliers map directly to practical operational zones in pooled systems:

- **$P_{50} \le 1.5 \times S$ (Median)**: Below 50% load, the server is idle more than half the time ($\text{Wait} = 0$). Median requests start almost immediately, keeping $P_{50}$ close to the uncontended floor ($1.0 \times S$ to $1.5 \times S$).
- **$P_{95} \le 3.0 \times S$ (High Percentile)**: Absorbs Poisson arrival bursts and execution variance ($C_v$). At 67% load ($\rho = 0.67$), mean response time is $W = \frac{S}{1 - 0.67} = 3.0S$.
- **$P_{99} \le 4.0 \times S$ (The Operational Knee)**: At the target sizing knee ($\rho = 0.75$), multi-server pooling and deterministic execution keep 99th percentile response time within $4.0 \times S$.
- **Sub-Millisecond Baseline Clamping**: For fast cache lookups ($S = 0.2\text{ ms}$), a strict $4.0 \times S$ threshold ($0.8\text{ ms}$) will be violated by routine Linux CFS kernel scheduling jitter and network interrupts. Clamping to $\max(4.0 \times S, 2\text{ ms})$ prevents false SLA alarms on microsecond workloads.

When latency departs from linear scaling and smoothly climbs such that $P_{99} > 10 \times S$, queuing theory proves the system has breached the knee and entered the **saturation cliff ($\rho >$ 90%)**. (Isolated, bimodal tail spikes at low utilization indicate discrete runtime pauses like GC pauses or DB lock flushes rather than queue capacity exhaustion).

## Workload Characterization: Modeling Production Reality

The most common reason load tests fail to predict production outages is synthetic workload distortion. If you benchmark an API endpoint by sending millions of identical static requests, the entire dataset fits in CPU L1/L2 caches and database buffer pools, achieving an artificial $S = 0.5\text{ ms}$. In production, real traffic touches millions of distinct keys, hitting cold NVMe storage and triggering multi-millisecond disk reads.

Similarly, in generative AI systems, benchmarking an LLM inference server with fixed 128-token prompts completely masks memory fragmentation, prefix cache eviction, and the asymmetric compute profiles of real workloads.

To produce meaningful capacity data, characterize the workload across four core dimensions:

<svg viewBox="0 0 840 220" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <!-- Card 1: Variance -->
  <g transform="translate(15, 16)">
    <rect x="0" y="0" width="192" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 1</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Execution Variance</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">P-K Queue Penalty (Cᵥ)</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">W<tspan font-size="10" dy="2">q</tspan><tspan font-size="13" dy="-2"> ∝ (1 + Cᵥ²)/2</tspan></text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">Replaces static payloads</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">with polymorphic jobs</text>
  </g>
  <!-- Card 2: Skew -->
  <g transform="translate(221, 16)">
    <rect x="0" y="0" width="192" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 2</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Access Skew</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Zipfian Locality (80/20)</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">Realistic cache hit rates</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">(DB buffer pools &amp;</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">prefix KV reuse in VRAM)</text>
  </g>
  <!-- Card 3: Phase Ratios -->
  <g transform="translate(427, 16)">
    <rect x="0" y="0" width="192" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 3</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Resource Phases</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Compute vs. Memory</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">Read/write lock limits</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">vs. Prefill GEMM and</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">Decode GEMV bandwidth</text>
  </g>
  <!-- Card 4: Arrival Dynamics -->
  <g transform="translate(633, 16)">
    <rect x="0" y="0" width="192" height="188" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="45" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">DIM 4</text>
    <text x="12" y="60" fill="var(--grey-lighter)" font-size="16" font-weight="700">Arrival Dynamics</text>
    <text x="12" y="82" fill="rgb(var(--primary))" font-size="13.5" font-weight="600">Poisson &amp; Batching</text>
    <text x="12" y="112" fill="var(--grey-light)" font-size="13">Stochastic burst clumping</text>
    <text x="12" y="134" fill="var(--grey-light)" font-size="13">&amp; continuous batching</text>
    <text x="12" y="156" fill="var(--grey-light)" font-size="13">prefill-decode stalls</text>
  </g>
</svg>

- **Execution Variance ($C_v$) and Polymorphism**: As proven by the **Pollaczek–Khinchine (P-K) formula**, queue waiting time scales directly with service time variance ($W_q \propto \frac{1 + C_v^2}{2}$). In web backends, homogeneous queries ($C_v \approx 0$) artificially cut reported wait times in half compared to high-variance production lookups ($C_v \ge 1.0$). In LLM serving, variable prompt/output token lengths cause head-of-line blocking and KV-cache fragmentation that uniform test payloads completely hide.
- **Access Skew and Cache Locality (Zipfian Distributions)**: Production traffic follows power-law distributions where roughly 80% of requests target the top 20% of keys. Sampling keys with a calibrated Zipfian distribution ($s \approx 0.8$ to $1.1$) produces realistic database buffer pool hit rates and authentic GPU prefix-cache reuse in VRAM (e.g. RadixAttention in vLLM / SGLang).
- **Operational Phase Ratios (Compute vs. Memory Bandwidth)**: Backend performance shifts dramatically between read-only paths and write-heavy paths with lock contention. Similarly, LLM inference alternates between compute-bound matrix-matrix multiplication (prefill GEMM) and memory-bandwidth-bound matrix-vector streaming (decode GEMV). Workloads must calibrate the exact input/output token ratio matching production traffic.
- **Temporal Arrival Dynamics & Continuous Batching**: Clockwork arrivals eliminate queuing jitter, whereas real traffic exhibits Poisson memoryless arrival bursts. In LLM continuous batching engines, sudden bursts of compute-dense prefill requests interleave with ongoing decode loops, injecting severe tail latency jitter into streaming token generation (Time Per Output Token, TPOT).

## The Benchmark Specification & Execution Protocol

A reliable benchmark requires strict experimental protocol. Without structured execution phases, transient startup anomalies will contaminate steady-state measurements.

### The 4-Phase Lifecycle & Steady-State Distributions

A complete benchmark specification defines four sequential lifecycle phases:

<svg viewBox="0 0 840 215" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-lifecycle" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.35)" />
    </marker>
  </defs>
  <!-- Card 1: Ramp-Up (Sky) -->
  <g transform="translate(15, 18)">
    <rect x="0" y="0" width="175" height="175" rx="8" fill="var(--grey-dark)" stroke="rgba(56, 189, 248, 0.3)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="22" rx="4" fill="rgba(56, 189, 248, 0.12)" />
    <text x="45" y="27" fill="#38bdf8" font-size="11" font-weight="700" text-anchor="middle">PHASE 1</text>
    <text x="14" y="55" fill="var(--grey-lighter)" font-size="15" font-weight="700">Ramp-Up</text>
    <text x="14" y="75" fill="#38bdf8" font-size="12.5" font-weight="600">0 → Target RPS</text>
    <text x="14" y="100" fill="var(--grey-light)" font-size="11.5">Gradual socket connect</text>
    <text x="14" y="118" fill="var(--grey-light)" font-size="11.5">Avoids SYN backlogs</text>
    <line x1="14" y1="134" x2="161" y2="134" stroke="rgba(56, 189, 248, 0.18)" stroke-width="1" />
    <text x="14" y="154" fill="#38bdf8" font-size="11.5" font-weight="700">Duration: ~1 min</text>
  </g>
  <!-- Arrow 1 to 2 -->
  <line x1="195" y1="105" x2="215" y2="105" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.6" marker-end="url(#arrow-lifecycle)" />
  <!-- Card 2: Warm-Up (Orange) -->
  <g transform="translate(220, 18)">
    <rect x="0" y="0" width="175" height="175" rx="8" fill="var(--grey-dark)" stroke="rgba(251, 146, 60, 0.3)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="22" rx="4" fill="rgba(251, 146, 60, 0.12)" />
    <text x="45" y="27" fill="#fb923c" font-size="11" font-weight="700" text-anchor="middle">PHASE 2</text>
    <text x="14" y="55" fill="var(--grey-lighter)" font-size="15" font-weight="700">Warm-Up</text>
    <text x="14" y="75" fill="#fb923c" font-size="12.5" font-weight="600">Constant Target RPS</text>
    <text x="14" y="100" fill="var(--grey-light)" font-size="11.5">JIT bytecode compile</text>
    <text x="14" y="118" fill="var(--grey-light)" font-size="11.5">CUDA graphs &amp; DB pools</text>
    <line x1="14" y1="134" x2="161" y2="134" stroke="rgba(251, 146, 60, 0.18)" stroke-width="1" />
    <text x="14" y="154" fill="#fb923c" font-size="11.5" font-weight="700">Discard Data (~3 min)</text>
  </g>
  <!-- Arrow 2 to 3 -->
  <line x1="400" y1="105" x2="420" y2="105" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.6" marker-end="url(#arrow-lifecycle)" />
  <!-- Card 3: Steady-State (Primary Highlight) -->
  <g transform="translate(425, 18)">
    <rect x="0" y="0" width="190" height="175" rx="8" fill="rgba(var(--primary), 0.08)" stroke="rgba(var(--primary), 0.45)" stroke-width="1.2" />
    <rect x="12" y="12" width="66" height="22" rx="4" fill="rgba(var(--primary), 0.2)" />
    <text x="45" y="27" fill="rgb(var(--primary))" font-size="11" font-weight="700" text-anchor="middle">PHASE 3</text>
    <text x="14" y="55" fill="rgb(var(--primary))" font-size="15" font-weight="700">Steady-State</text>
    <text x="14" y="75" fill="var(--grey-lighter)" font-size="12.5" font-weight="600">Constant Target RPS</text>
    <text x="14" y="100" fill="var(--grey-lighter)" font-size="11.5">Captures GC &amp; WAL flushes</text>
    <text x="14" y="118" fill="var(--grey-lighter)" font-size="11.5">HDR Histogram collection</text>
    <line x1="14" y1="134" x2="176" y2="134" stroke="rgba(var(--primary), 0.25)" stroke-width="1" />
    <text x="14" y="154" fill="rgb(var(--primary))" font-size="11.5" font-weight="700">Record Data (5 - 15 min)</text>
  </g>
  <!-- Arrow 3 to 4 -->
  <line x1="620" y1="105" x2="640" y2="105" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.6" marker-end="url(#arrow-lifecycle)" />
  <!-- Card 4: Cooldown (Emerald) -->
  <g transform="translate(645, 18)">
    <rect x="0" y="0" width="175" height="175" rx="8" fill="var(--grey-dark)" stroke="rgba(52, 211, 153, 0.3)" stroke-width="1" />
    <rect x="12" y="12" width="66" height="22" rx="4" fill="rgba(52, 211, 153, 0.12)" />
    <text x="45" y="27" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">PHASE 4</text>
    <text x="14" y="55" fill="var(--grey-lighter)" font-size="15" font-weight="700">Cooldown</text>
    <text x="14" y="75" fill="#34d399" font-size="12.5" font-weight="600">Target RPS → 0</text>
    <text x="14" y="100" fill="var(--grey-light)" font-size="11.5">Drain socket buffers</text>
    <text x="14" y="118" fill="var(--grey-light)" font-size="11.5">Check for leaks &amp; zombies</text>
    <line x1="14" y1="134" x2="161" y2="134" stroke="rgba(52, 211, 153, 0.18)" stroke-width="1" />
    <text x="14" y="154" fill="#34d399" font-size="11.5" font-weight="700">Duration: ~1 min</text>
  </g>
</svg>

- **Phase 1: Ramp-Up Window**: Gradually scale arrival rate $\lambda$ from 0 to the target operating point over 30 to 60 seconds. Jumping instantly to high loads creates artificial TCP SYN backlogs and socket allocation panics that do not reflect normal traffic growth.
- **Phase 2: Warm-Up & JIT Priming (Discard Metrics)**: Run the target load for 2 to 5 minutes **without recording latency metrics**. This allows V8/JVM JIT compilation, database buffer pool warming (`shared_buffers`), connection pool handshakes, and inference engine CUDA graph capture (pre-allocating the PagedAttention KV-cache pool) to complete.
- **Phase 3: Steady-State Measurement**: Record high-resolution latency histograms over 5 to 15 minutes under constant rate $\lambda$, long enough to capture recurring GC cycles, database write checkpoints, and WAL flushes.
- **Phase 4: Cooldown (Drain & Health Check)**: Reduce traffic to zero over 30 to 60 seconds to drain in-flight socket buffers cleanly (preventing false `ECONNRESET` errors) and verify there are no memory leaks, unclosed connection leaks, or zombie processes.

During steady-state measurement, a single arithmetic average (mean) collapses the distribution, hiding severe tail spikes behind fast-path requests:

<svg viewBox="0 0 840 300" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <!-- Left Panel: Frequency Histogram -->
  <g transform="translate(20, 15)">
    <rect x="0" y="0" width="390" height="270" rx="8" fill="var(--grey-dark)" />
    <text x="20" y="28" fill="var(--grey-lighter)" font-size="14" font-weight="700">LATENCY DENSITY (HDR BUCKETS)</text>
    <text x="20" y="46" fill="var(--grey-light)" font-size="12">Bimodal Latency Distribution</text>
    <!-- Axes -->
    <line x1="40" y1="210" x2="365" y2="210" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
    <line x1="40" y1="70" x2="40" y2="210" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
    <!-- Histogram Bars -->
    <!-- Fast path peak -->
    <rect x="52" y="86" width="20" height="124" rx="3" fill="rgba(var(--primary), 0.75)" />
    <rect x="76" y="104" width="20" height="106" rx="3" fill="rgba(var(--primary), 0.6)" />
    <rect x="100" y="140" width="20" height="70" rx="3" fill="rgba(var(--primary), 0.4)" />
    <rect x="124" y="168" width="20" height="42" rx="3" fill="rgba(var(--primary), 0.3)" />
    <rect x="148" y="186" width="20" height="24" rx="3" fill="rgba(255, 255, 255, 0.15)" />
    <rect x="172" y="196" width="20" height="14" rx="3" fill="rgba(255, 255, 255, 0.1)" />
    <rect x="196" y="202" width="20" height="8" rx="3" fill="rgba(255, 255, 255, 0.08)" />
    <!-- Long tail / Secondary peak -->
    <rect x="256" y="182" width="20" height="28" rx="3" fill="#ffa726" fill-opacity="0.5" />
    <rect x="280" y="170" width="20" height="40" rx="3" fill="#ffa726" fill-opacity="0.75" />
    <rect x="304" y="184" width="20" height="26" rx="3" fill="#ffa726" fill-opacity="0.5" />
    <rect x="336" y="200" width="20" height="10" rx="3" fill="#ffa726" fill-opacity="0.3" />
    <!-- P50 Marker -->
    <line x1="62" y1="76" x2="62" y2="210" stroke="rgb(var(--primary))" stroke-width="1.5" stroke-dasharray="2 2" />
    <text x="62" y="70" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">P50 (5ms)</text>
    <!-- Mean Marker (Misleading) -->
    <line x1="150" y1="76" x2="150" y2="210" stroke="#ffb74d" stroke-width="1.5" stroke-dasharray="2 2" />
    <text x="150" y="70" fill="#ffb74d" font-size="12" font-weight="600" text-anchor="middle">Mean (45ms)</text>
    <!-- P99 Marker -->
    <line x1="290" y1="76" x2="290" y2="210" stroke="#ffa726" stroke-width="1.5" stroke-dasharray="2 2" />
    <text x="290" y="70" fill="#ffa726" font-size="12" font-weight="700" text-anchor="middle">P99 (220ms)</text>
    <!-- X-Axis Labels -->
    <text x="62" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">5ms</text>
    <text x="124" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">25ms</text>
    <text x="206" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">100ms</text>
    <text x="290" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">250ms</text>
    <text x="346" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">500ms</text>
    <text x="205" y="254" fill="var(--grey-lighter)" font-size="12.5" font-weight="600" text-anchor="middle">Response Latency (Log Scale)</text>
  </g>
  <!-- Right Panel: Cumulative Percentile Curve (inference-perf / wrk2 output) -->
  <g transform="translate(430, 15)">
    <rect x="0" y="0" width="390" height="270" rx="8" fill="var(--grey-dark)" />
    <text x="20" y="28" fill="var(--grey-lighter)" font-size="14" font-weight="700">CUMULATIVE PERCENTILES (CDF)</text>
    <text x="20" y="46" fill="var(--grey-light)" font-size="12">Quantile Curve (HDR Histogram)</text>
    <!-- Axes -->
    <line x1="48" y1="210" x2="368" y2="210" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
    <line x1="48" y1="60" x2="48" y2="210" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
    <!-- Percentile Curve (Strictly Convex Hockey Stick) -->
    <path d="M 48 204 C 145 204, 215 202, 260 196 C 295 188, 316 168, 326 140 C 340 114, 354 88, 362 65" fill="none" stroke="rgb(var(--primary))" stroke-width="3" stroke-linecap="round" />
    <!-- Key Quantile Dots -->
    <!-- P50 -->
    <circle cx="150" cy="203" r="4" fill="rgb(var(--primary))" />
    <line x1="150" y1="203" x2="150" y2="210" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 2" />
    <text x="150" y="193" fill="var(--grey-lighter)" font-size="11.5" font-weight="600" text-anchor="middle">5ms</text>
    <!-- P90 -->
    <circle cx="260" cy="196" r="4" fill="rgb(var(--primary))" />
    <line x1="260" y1="196" x2="260" y2="210" stroke="rgba(255, 255, 255, 0.15)" stroke-dasharray="2 2" />
    <text x="260" y="186" fill="var(--grey-lighter)" font-size="11.5" font-weight="600" text-anchor="middle">18ms</text>
    <!-- P99 -->
    <circle cx="326" cy="140" r="4.5" fill="#ffa726" />
    <line x1="326" y1="140" x2="326" y2="210" stroke="#ffa726" stroke-width="1.2" stroke-dasharray="2 2" />
    <text x="306" y="136" fill="#ffa726" font-size="12.5" font-weight="700" text-anchor="end">220ms</text>
    <!-- P99.9 -->
    <circle cx="362" cy="65" r="4.5" fill="#ff7043" />
    <line x1="362" y1="65" x2="362" y2="210" stroke="#ff7043" stroke-width="1.2" stroke-dasharray="2 2" />
    <text x="362" y="54" fill="#ff7043" font-size="13" font-weight="700" text-anchor="middle">480ms</text>
    <!-- X-Axis Labels -->
    <text x="48" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">0%</text>
    <text x="150" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">50%</text>
    <text x="260" y="228" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">90%</text>
    <text x="326" y="228" fill="#ffa726" font-size="11.5" font-weight="700" text-anchor="middle">99%</text>
    <text x="362" y="228" fill="#ff7043" font-size="11.5" font-weight="700" text-anchor="middle">99.9%</text>
    <text x="205" y="254" fill="var(--grey-lighter)" font-size="12.5" font-weight="600" text-anchor="middle">Percentile Rank (Quantile)</text>
    <!-- Y-Axis Latency Marker -->
    <text x="40" y="70" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="end">500ms</text>
    <text x="40" y="206" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="end">0ms</text>
  </g>
</svg>

### Rate-Stepped Sweeps & Statistical Replication

Never run a load test at a single arbitrary throughput number. To discover the operational knee, execute a stepped rate sweep across a series of steady-state windows:

$$
\lambda = 1\text{k} \to 2\text{k} \to 4\text{k} \to 6\text{k}\text{ req/s}
$$

Plotting average response time ($W$) and $P_{99}$ against arrival rate ($\lambda$) reveals the exact throughput threshold where latency departs from the uncontended floor and enters the hyperbolic saturation curve.

To ensure statistical confidence and prevent cloud noise from corrupting results:

- **Multi-Run Replication ($N \ge 3$)**: Run an odd number of identical, independent trials ($N = 3$ or $N = 5$) with complete ramp-up and warm-up cycles.
- **Coefficient of Variation ($C_v$) Stability Check**: Calculate the relative standard deviation across runs under identical target load ($C_v = \frac{\sigma}{\mu}$). If $C_v \le$ 3% (or under 10% on shared virtualized cloud instances), the benchmark environment is statistically stable. If $C_v >$ 10%, noisy neighbors or hypervisor steals are contaminating the measurement: discard the run set and re-test on isolated hardware.
- **Merge Raw HDR Histograms (Avoid Averaging Percentiles)**: Averaging percentile metrics across runs (such as taking the arithmetic mean of three $P_{99}$ numbers) is mathematically invalid because percentiles are non-linear quantile distributions. Export raw HdrHistogram logs from each trial and merge them into a single unified distribution to compute the true ensemble $P_{99}$ and $P_{99.9}$.
- **Noise Calibration for Pareto Evaluation**: The same multi-run distribution is the right input for setting the noise parameters used in Pareto frontier evaluation (discussed in [The Pareto Frontier in LLM Inference Serving](/notes/pareto-frontier-in-inference-serving/)). Once you have $N$ independent runs for a given configuration, you can compute the per-metric standard deviation $\sigma$ and coefficient of variation $C_v$ from the ensemble. These directly calibrate the noise band ($\sigma_{\text{noise}} \approx C_v$) and give a principled lower bound for the minimum percentage improvement threshold: an improvement must exceed the $C_v$ of the metric to be distinguishable from run-to-run variance. Using empirically measured distributions rather than a fixed hardcoded percentage makes both parameters traceable and environment-specific.
- **Minimum for Baseline Floor ($S$) vs. Ensemble for Contended Load ($\rho$)**: When measuring uncontended baseline execution time ($S = W_0$), use the **minimum** observed latency across light-load trials to filter out OS interrupts. When measuring contended load ($\rho \approx$ 75%), evaluate the merged ensemble distribution across trials to capture typical queuing behavior.

## Open-Loop vs. Closed-Loop Load Models

Choosing between an open-loop and a closed-loop load generator determines whether benchmark results will reflect production reality:

<svg viewBox="0 0 840 250" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-loop" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.4)" />
    </marker>
    <marker id="arrow-loop-pri" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgb(var(--primary))" />
    </marker>
  </defs>
  <!-- Left Panel: Closed Loop -->
  <g transform="translate(15, 15)">
    <rect x="0" y="0" width="395" height="220" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="14" y="12" width="110" height="24" rx="4" fill="rgba(255, 167, 38, 0.14)" />
    <text x="69" y="29" fill="#ffa726" font-size="12" font-weight="700" text-anchor="middle">CLOSED-LOOP</text>
    <text x="138" y="29" fill="var(--grey-lighter)" font-size="15" font-weight="700">Self-Throttling</text>
    <!-- Flow Nodes -->
    <rect x="15" y="52" width="125" height="54" rx="8" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.12)" />
    <text x="77" y="75" fill="var(--grey-lighter)" font-size="14.5" font-weight="700" text-anchor="middle">Virtual Users</text>
    <text x="77" y="94" fill="var(--grey-light)" font-size="12" text-anchor="middle">Fixed Pool</text>
    <line x1="140" y1="79" x2="235" y2="79" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.5" marker-end="url(#arrow-loop)" />
    <text x="187" y="70" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Send Request</text>
    <rect x="245" y="52" width="135" height="54" rx="8" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.12)" />
    <text x="312" y="75" fill="var(--grey-lighter)" font-size="14.5" font-weight="700" text-anchor="middle">Server</text>
    <text x="312" y="94" fill="#ffa726" font-size="12" font-weight="600" text-anchor="middle">Slowdown Stalls VU</text>
    <!-- Return Arrow -->
    <path d="M 312 106 L 312 138 L 77 138 L 77 106" fill="none" stroke="#ffa726" stroke-width="1.4" stroke-dasharray="4 4" marker-end="url(#arrow-loop)" />
    <text x="194" y="132" fill="#ffa726" font-size="12" font-weight="600" text-anchor="middle">Wait for response + Think Time</text>
    <!-- Warning Footer -->
    <rect x="14" y="165" width="367" height="42" rx="6" fill="rgba(255, 167, 38, 0.1)" />
    <text x="197" y="184" fill="#ffa726" font-size="12.5" font-weight="700" text-anchor="middle">⚠️ Self-Throttling Artifact</text>
    <text x="197" y="200" fill="var(--grey-light)" font-size="11.5" text-anchor="middle">Arrivals slow down during server pauses, masking true queues</text>
  </g>
  <!-- Right Panel: Open Loop -->
  <g transform="translate(425, 15)">
    <rect x="0" y="0" width="400" height="220" rx="8" fill="var(--grey-dark)" stroke="rgba(var(--primary), 0.35)" stroke-width="1" />
    <rect x="14" y="12" width="100" height="24" rx="4" fill="rgba(var(--primary), 0.18)" />
    <text x="64" y="29" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">OPEN-LOOP</text>
    <text x="126" y="29" fill="var(--grey-lighter)" font-size="15" font-weight="700">Production Reality</text>
    <!-- Flow Nodes -->
    <rect x="14" y="52" width="118" height="54" rx="8" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.12)" />
    <text x="73" y="75" fill="var(--grey-lighter)" font-size="14" font-weight="700" text-anchor="middle">Arrival Timer</text>
    <text x="73" y="94" fill="rgb(var(--primary))" font-size="12" font-weight="600" text-anchor="middle">λ(t) Independent</text>
    <line x1="132" y1="79" x2="160" y2="79" stroke="rgb(var(--primary))" stroke-width="1.5" marker-end="url(#arrow-loop-pri)" />
    <!-- Queue Buffer -->
    <rect x="166" y="52" width="86" height="54" rx="8" fill="rgba(var(--primary), 0.08)" stroke="rgba(var(--primary), 0.45)" />
    <text x="209" y="75" fill="rgb(var(--primary))" font-size="14.5" font-weight="700" text-anchor="middle">Queue</text>
    <text x="209" y="94" fill="var(--grey-light)" font-size="12" text-anchor="middle">Buffer</text>
    <line x1="252" y1="79" x2="276" y2="79" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.5" marker-end="url(#arrow-loop)" />
    <!-- Server -->
    <rect x="282" y="52" width="104" height="54" rx="8" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.12)" />
    <text x="334" y="75" fill="var(--grey-lighter)" font-size="14.5" font-weight="700" text-anchor="middle">Server</text>
    <text x="334" y="94" fill="var(--grey-light)" font-size="12" text-anchor="middle">Service Floor S</text>
    <!-- Arrival note -->
    <text x="200" y="135" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Arrivals continue at rate λ regardless of server delays</text>
    <!-- Success Footer -->
    <rect x="14" y="165" width="372" height="42" rx="6" fill="rgba(var(--primary), 0.12)" />
    <text x="200" y="184" fill="rgb(var(--primary))" font-size="12.5" font-weight="700" text-anchor="middle">✓ True Production Fidelity</text>
    <text x="200" y="200" fill="var(--grey-lighter)" font-size="11.5" text-anchor="middle">Server stalls cause real queue backups, capturing true tail P99</text>
  </g>
</svg>

- **Closed-Loop Model (Self-Throttling)**: The rate of new requests is strictly tied to the server's response time. If the server slows down, virtual users wait longer, automatically reducing the request arrival rate. While appropriate for modeling internal batch workers pulling from a single bounded queue, closed-loop testing must never be used for public web APIs or microservices: self-throttling virtual users mask queuing cliffs and cannot trigger production-like queue exhaustion.
- **Open-Loop Model (Independent Arrivals)**: Requests arrive at rate $\lambda(t)$ completely independent of server response time, accurately modeling public HTTP APIs, mobile clients, and multi-tenant systems. If the server pauses, incoming requests continue arriving at rate $\lambda$, filling the queue buffer and faithfully reproducing production tail latency spikes.

## Coordinated Omission: The Silent Benchmark Killer

The most widespread measurement flaw in production load testing is **Coordinated Omission**, a term coined by Gil Tene in his presentation [*How NOT to Measure Latency*](https://www.infoq.com/presentations/latency-response-time/).

When a load generator coordinates its request dispatches with the server's response rate, it hides long server pauses and reports artificially optimistic latency percentiles. Consider an intended arrival rate of 10 requests per second (one request every $100\text{ ms}$):

<svg viewBox="0 0 840 380" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <!-- Header -->
  <text x="20" y="24" fill="var(--grey-lighter)" font-size="15" font-weight="700">COORDINATED OMISSION: INTENDED TIMELINE VS. RECORDED SAMPLES</text>
  <text x="20" y="42" fill="var(--grey-light)" font-size="12">Why synchronous / closed-loop load generators hide 98% of latency spikes during server stalls</text>
  <!-- Global Time Ticks (t = Xs labels) -->
  <text x="206" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">t = 0.0s</text>
  <text x="258" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">0.1s</text>
  <text x="310" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">0.2s</text>
  <text x="362" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">0.3s</text>
  <text x="528" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">... 5.0s (100s of Intended Arrivals) ...</text>
  <text x="696" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">10.0s</text>
  <text x="752" y="62" fill="var(--grey-light)" font-size="11.5" font-weight="600" text-anchor="middle">10.1s</text>
  <!-- ROW 1: Intended Production Timeline -->
  <g transform="translate(16, 74)">
    <!-- Row Header Card -->
    <rect x="0" y="0" width="156" height="48" rx="6" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" />
    <text x="12" y="20" fill="rgb(var(--primary))" font-size="12" font-weight="700">1. INTENDED (REALITY)</text>
    <text x="12" y="36" fill="var(--grey-light)" font-size="11">λ = 10 req/s (1 req / 100ms)</text>
    <!-- Row Track -->
    <rect x="164" y="0" width="628" height="48" rx="6" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.06)" />
    <!-- Contiguous Request Blocks (Zero Gaps) -->
    <rect x="180" y="8" width="52" height="32" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.18)" />
    <text x="206" y="28" fill="var(--grey-lighter)" font-size="11.5" font-weight="600" text-anchor="middle">Req 1</text>
    <rect x="232" y="8" width="52" height="32" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.18)" />
    <text x="258" y="28" fill="var(--grey-lighter)" font-size="11.5" font-weight="600" text-anchor="middle">Req 2</text>
    <rect x="284" y="8" width="52" height="32" rx="4" fill="rgba(var(--primary), 0.1)" stroke="rgb(var(--primary))" stroke-dasharray="2 2" />
    <text x="310" y="28" fill="rgb(var(--primary))" font-size="11" font-weight="600" text-anchor="middle">Req 3</text>
    <rect x="336" y="8" width="52" height="32" rx="4" fill="rgba(var(--primary), 0.1)" stroke="rgb(var(--primary))" stroke-dasharray="2 2" />
    <text x="362" y="28" fill="rgb(var(--primary))" font-size="11" font-weight="600" text-anchor="middle">Req 4</text>
    <!-- Batch Banner -->
    <rect x="388" y="8" width="280" height="32" rx="4" fill="rgba(var(--primary), 0.08)" stroke="rgb(var(--primary))" stroke-dasharray="2 2" />
    <text x="528" y="28" fill="rgb(var(--primary))" font-size="11.5" font-weight="700" text-anchor="middle">100s of Production Requests Arrive &amp; Queue</text>
    <rect x="668" y="8" width="56" height="32" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.18)" />
    <text x="696" y="28" fill="var(--grey-lighter)" font-size="11.5" font-weight="600" text-anchor="middle">Req 101</text>
    <rect x="724" y="8" width="56" height="32" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.18)" />
    <text x="752" y="28" fill="var(--grey-lighter)" font-size="11.5" font-weight="600" text-anchor="middle">Req 102</text>
  </g>
  <!-- ROW 2: Server State -->
  <g transform="translate(16, 134)">
    <!-- Row Header Card -->
    <rect x="0" y="0" width="156" height="48" rx="6" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" />
    <text x="12" y="20" fill="#ffa726" font-size="12" font-weight="700">2. SERVER STATE</text>
    <text x="12" y="36" fill="var(--grey-light)" font-size="11">10.0s Stall Event</text>
    <!-- Row Track -->
    <rect x="164" y="0" width="628" height="48" rx="6" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.06)" />
    <!-- Req 1 Instant -->
    <rect x="180" y="8" width="52" height="32" rx="4" fill="rgba(52, 211, 153, 0.12)" stroke="rgba(52, 211, 153, 0.35)" />
    <text x="206" y="28" fill="#34d399" font-size="11.5" font-weight="700" text-anchor="middle">1ms</text>
    <!-- 10.0s GC Pause Box (from 0.1s to 10.1s) -->
    <rect x="232" y="8" width="492" height="32" rx="4" fill="rgba(255, 167, 38, 0.12)" stroke="rgba(255, 167, 38, 0.45)" />
    <text x="478" y="28" fill="#ffa726" font-size="12" font-weight="700" text-anchor="middle">10.0-Second Server GC Pause / Table Lock (0.1s → 10.1s)</text>
    <!-- Post Stall Req -->
    <rect x="724" y="8" width="56" height="32" rx="4" fill="rgba(52, 211, 153, 0.12)" stroke="rgba(52, 211, 153, 0.35)" />
    <text x="752" y="28" fill="#34d399" font-size="11.5" font-weight="700" text-anchor="middle">1ms</text>
  </g>
  <!-- ROW 3: Naive Tester Behavior -->
  <g transform="translate(16, 192)">
    <!-- Row Header Card -->
    <rect x="0" y="0" width="156" height="48" rx="6" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" />
    <text x="12" y="20" fill="#ff7043" font-size="12" font-weight="700">3. NAIVE TESTER</text>
    <text x="12" y="36" fill="var(--grey-light)" font-size="11">Closed-loop tool</text>
    <!-- Row Track -->
    <rect x="164" y="0" width="628" height="48" rx="6" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.06)" />
    <!-- Req 1 Recorded -->
    <rect x="180" y="8" width="52" height="32" rx="4" fill="rgba(52, 211, 153, 0.15)" stroke="rgba(52, 211, 153, 0.4)" />
    <text x="206" y="28" fill="#34d399" font-size="11.5" font-weight="700" text-anchor="middle">1ms</text>
    <!-- Stalled Tool Box (Omission) -->
    <rect x="232" y="8" width="492" height="32" rx="4" fill="rgba(255, 112, 67, 0.08)" stroke="rgba(255, 112, 67, 0.4)" stroke-dasharray="2 2" />
    <text x="478" y="28" fill="#ff7043" font-size="12" font-weight="700" text-anchor="middle">Load Tester Blocks on Req 2: 100s of Requests Omitted (Never Sent!)</text>
    <!-- Req 102 Sent Late -->
    <rect x="724" y="8" width="56" height="32" rx="4" fill="rgba(52, 211, 153, 0.15)" stroke="rgba(52, 211, 153, 0.4)" />
    <text x="752" y="28" fill="#34d399" font-size="11.5" font-weight="700" text-anchor="middle">1ms</text>
  </g>
  <!-- Summary Comparison Cards -->
  <!-- Left Summary Card: Naive Tool Distortion -->
  <g transform="translate(16, 254)">
    <rect x="0" y="0" width="395" height="108" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 167, 38, 0.25)" />
    <rect x="12" y="10" width="200" height="20" rx="4" fill="rgba(255, 167, 38, 0.15)" />
    <text x="20" y="24" fill="#ffa726" font-size="11" font-weight="700">⚠️ NAIVE TOOL REPORT (2 SAMPLES)</text>
    <text x="12" y="48" fill="var(--grey-lighter)" font-size="12.5" font-weight="700">Recorded P50: 1 ms <tspan fill="var(--grey-light)" font-weight="500">(1 of 2 requests)</tspan></text>
    <text x="12" y="68" fill="var(--grey-lighter)" font-size="12.5" font-weight="700">Recorded P99: 10,000 ms <tspan fill="var(--grey-light)" font-weight="500">(1 of 2 requests)</tspan></text>
    <text x="12" y="90" fill="#ffa726" font-size="11.5" font-weight="600">Verdict: Falsely dismissed as an isolated 1% outlier</text>
  </g>
  <!-- Right Summary Card: Production Reality -->
  <g transform="translate(429, 254)">
    <rect x="0" y="0" width="395" height="108" rx="8" fill="var(--grey-dark)" stroke="rgba(var(--primary), 0.35)" />
    <rect x="12" y="10" width="205" height="20" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="20" y="24" fill="rgb(var(--primary))" font-size="11" font-weight="700">✓ PRODUCTION REALITY (102 SAMPLES)</text>
    <text x="12" y="48" fill="var(--grey-lighter)" font-size="12.5" font-weight="700">True P50: 5,000 ms <tspan fill="var(--grey-light)" font-weight="500">(Queued in socket buffers)</tspan></text>
    <text x="12" y="68" fill="var(--grey-lighter)" font-size="12.5" font-weight="700">True P99: 9,900 ms <tspan fill="var(--grey-light)" font-weight="500">(Severe multi-second wait)</tspan></text>
    <text x="12" y="90" fill="rgb(var(--primary))" font-size="11.5" font-weight="600">Verdict: 98% of users experienced an unacceptable freeze</text>
  </g>
</svg>

1. At $t = 0.0\text{s}$, the tool sends Request 1. The server responds in $1\text{ ms}$. Recorded latency: **$1\text{ ms}$**.
2. At $t = 0.1\text{s}$, the tool sends Request 2. The server suffers a Garbage Collection pause or database table lock and stalls for **$10.0\text{ seconds}$**.
3. During that 10-second stall, the load tester blocks synchronously, waiting for Request 2's response before sending Request 3.
4. The 100 other requests that *should* have been dispatched during those 10 seconds were never sent.

When the naive tool computes percentiles across recorded requests, it reports $P_{50} = 1\text{ ms}$ and $P_{99} = 10,000\text{ ms}$ (dismissing the stall as a single isolated 1% outlier). 

In reality, 100 production clients arrived during those 10 seconds and waited in socket buffers ($9.9\text{s}$, $9.8\text{s}$, ..., $0.1\text{s}$). **98% of users experienced multi-second delays**, and the true median was $5.0\text{ seconds}$. The naive benchmark coordinated with the server's pause, omitting the backlog of suffering requests.

### Fixing Coordinated Omission: Schedule Delay Correction

To eliminate Coordinated Omission, modern load testing tools use **open-loop, rate-corrected measurement**:

- **Intended Dispatch Timestamp**: Pre-calculate the exact intended schedule time ($t_{\text{scheduled}}$) for every request.
- **Schedule Delay Tracking**: Measure total response time ($L_{\text{true}}$) starting from the intended schedule time rather than the actual socket write time:

$$
\begin{aligned}
L_{\text{true}} &= t_{\text{response}} - t_{\text{scheduled}} \\\\
&= \underbrace{(t_{\text{dispatch}} - t_{\text{scheduled}})}\_{\text{Schedule Delay}} + \underbrace{(t_{\text{response}} - t_{\text{dispatch}})}\_{\text{Server Latency}}
\end{aligned}
$$

- **Accumulated Backlog Accounting**: If the server stalls, every request accumulating in the queue receives its full schedule penalty, faithfully reporting the true production tail percentiles ($P_{99}$, $P_{99.9}$).

### Tool Configuration: Why Defaults Mislead

Load generators do not automatically eliminate Coordinated Omission. Many popular benchmarking tools operate in **closed-loop mode by default**, placing the burden of correct configuration on the benchmark developer:

- **`wrk2`**: In [`wrk2`'s specification](https://github.com/giltene/wrk2/blob/master/README.md), passing the intended throughput rate with `-R <rate>` pre-calculates scheduled dispatch times and tracks schedule delay via HdrHistograms. Note that `wrk2` operates over a fixed pool of `-c` persistent TCP connections: it measures true schedule delay over established channels, but does not open new sockets to test OS-level TCP backlog queues (`somaxconn`).
- **`Locust`**: In [Locust's task execution architecture](https://docs.locust.io/en/stable/writing-a-locustfile.html#tasks), each `HttpUser` executes tasks sequentially in a greenlet loop (`send` $\to$ `wait` $\to$ `sleep`), reducing request velocity whenever the server stalls.
- **`vegeta` & `aiperf` / `inference-perf`**: Built natively around open-loop execution: Vegeta's [pacer engine (`lib/pacer.go`)](https://github.com/tsenart/vegeta/blob/master/lib/pacer.go) dispatches requests using a strict monotonic timer (`-rate=<rps>`). Always configure `--max-workers=0` (unlimited) when characterizing long stalls, ensuring Vegeta does not hit its default 10,000 worker threshold and block dispatch. Similarly, [`inference-perf`](https://github.com/kubernetes-sigs/inference-perf) and [`aiperf`](https://github.com/ai-dynamo/aiperf) generate requests following a stochastic Poisson arrival process to benchmark LLM continuous batching systems.

When developing benchmarks, always verify whether your tool measures raw completion latency ($t_{\text{response}} - t_{\text{dispatch}}$) or true schedule-corrected latency ($t_{\text{response}} - t_{\text{scheduled}}$). Running closed-loop tools with default options masks the severe queuing backlogs you are attempting to characterize.

## Mapping Real Systems to Queuing Models

Every component in a distributed infrastructure maps directly to a specific queuing model with distinct capacity constraints:

<svg viewBox="0 0 840 430" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-queue-map" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.4)" />
    </marker>
    <marker id="arrow-queue-pri" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgb(var(--primary))" />
    </marker>
  </defs>
  <!-- Header -->
  <text x="20" y="24" fill="var(--grey-lighter)" font-size="15" font-weight="700">MAPPING PRODUCTION ARCHITECTURES TO QUEUING MODELS</text>
  <text x="20" y="42" fill="var(--grey-light)" font-size="12">Comparing server concurrency (c), buffer limits (K), and variance dynamics across backend and AI workloads</text>
  <!-- Left Container: Classical Systems -->
  <g transform="translate(16, 56)">
    <rect x="0" y="0" width="395" height="354" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="12" y="10" width="371" height="22" rx="4" fill="rgba(255, 255, 255, 0.08)" />
    <text x="20" y="25" fill="var(--grey-lighter)" font-size="11.5" font-weight="700">CLASSICAL INFRASTRUCTURE</text>
    <!-- Item 1: Event Loop M/M/1 -->
    <g transform="translate(12, 38)">
      <rect x="0" y="0" width="371" height="92" rx="6" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="12" y="20" fill="rgb(var(--primary))" font-size="12.5" font-weight="700">Single-Threaded Event Loop (M/M/1)</text>
      <text x="12" y="36" fill="var(--grey-light)" font-size="11">Redis, Node.js V8 main loop, NGINX worker</text>
      <!-- Diagram Nodes -->
      <rect x="12" y="46" width="70" height="34" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.15)" />
      <text x="47" y="67" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">FIFO Queue</text>
      <line x1="82" y1="63" x2="114" y2="63" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" marker-end="url(#arrow-queue-map)" />
      <rect x="120" y="46" width="80" height="34" rx="4" fill="rgba(var(--primary), 0.12)" stroke="rgb(var(--primary))" stroke-width="1" />
      <text x="160" y="67" fill="rgb(var(--primary))" font-size="11" font-weight="700" text-anchor="middle">1 Thread (c=1)</text>
      <text x="212" y="61" fill="#ffa726" font-size="10.5" font-weight="600">⚠️ HoL Blocking</text>
      <text x="212" y="74" fill="var(--grey-light)" font-size="10">Slow job stalls all traffic</text>
    </g>
    <!-- Item 2: Database Connection Pool M/M/c/K -->
    <g transform="translate(12, 138)">
      <rect x="0" y="0" width="371" height="100" rx="6" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="12" y="20" fill="rgb(var(--primary))" font-size="12.5" font-weight="700">Connection-Pooled Database (M/M/c / K)</text>
      <text x="12" y="36" fill="var(--grey-light)" font-size="11">PostgreSQL + PgBouncer, MySQL + HikariCP</text>
      <!-- Diagram Nodes -->
      <rect x="12" y="46" width="85" height="42" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.15)" />
      <text x="54" y="64" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Client Queue</text>
      <text x="54" y="78" fill="#ffa726" font-size="10" font-weight="600" text-anchor="middle">Capacity K</text>
      <line x1="97" y1="67" x2="124" y2="67" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" marker-end="url(#arrow-queue-map)" />
      <rect x="130" y="46" width="92" height="42" rx="4" fill="rgba(var(--primary), 0.12)" stroke="rgb(var(--primary))" stroke-width="1" />
      <text x="176" y="64" fill="rgb(var(--primary))" font-size="11" font-weight="700" text-anchor="middle">Pool (c=32)</text>
      <text x="176" y="78" fill="var(--grey-light)" font-size="9.5" text-anchor="middle">DB Workers</text>
      <text x="232" y="63" fill="var(--grey-lighter)" font-size="10.5" font-weight="600">Little's Law: N = λ · W</text>
      <text x="232" y="77" fill="var(--grey-light)" font-size="10">Exceeding K causes drops</text>
    </g>
    <!-- Item 3: Multi-Worker Microservices G/G/c -->
    <g transform="translate(12, 246)">
      <rect x="0" y="0" width="371" height="96" rx="6" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="12" y="20" fill="rgb(var(--primary))" font-size="12.5" font-weight="700">Multi-Worker Microservice (G/G/c)</text>
      <text x="12" y="36" fill="var(--grey-light)" font-size="11">Go goroutines, Java Spring Tomcat, Gunicorn</text>
      <!-- Diagram Nodes -->
      <rect x="12" y="46" width="85" height="38" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.15)" />
      <text x="54" y="69" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Shared Queue</text>
      <line x1="97" y1="65" x2="124" y2="65" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" marker-end="url(#arrow-queue-map)" />
      <rect x="130" y="46" width="92" height="38" rx="4" fill="rgba(52, 211, 153, 0.12)" stroke="rgba(52, 211, 153, 0.5)" stroke-width="1" />
      <text x="176" y="65" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">c CPU Cores</text>
      <text x="176" y="77" fill="var(--grey-light)" font-size="9.5" text-anchor="middle">Worker Pool</text>
      <text x="232" y="61" fill="#34d399" font-size="10.5" font-weight="600">✓ Erlang C Pooling</text>
      <text x="232" y="75" fill="var(--grey-light)" font-size="10">Shared queue absorbs bursts</text>
    </g>
  </g>
  <!-- Right Container: Generative AI Inference Systems -->
  <g transform="translate(429, 56)">
    <rect x="0" y="0" width="395" height="354" rx="8" fill="var(--grey-dark)" stroke="rgba(var(--primary), 0.3)" stroke-width="1" />
    <rect x="12" y="10" width="371" height="22" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="20" y="25" fill="rgb(var(--primary))" font-size="11.5" font-weight="700">GENERATIVE AI INFERENCE INFRASTRUCTURE</text>
    <!-- Item 4: Continuous Batching G/G/1 GPU -->
    <g transform="translate(12, 38)">
      <rect x="0" y="0" width="371" height="142" rx="6" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="12" y="20" fill="rgb(var(--primary))" font-size="12.5" font-weight="700">Continuous Batching (G/G/1 GPU / K)</text>
      <text x="12" y="36" fill="var(--grey-light)" font-size="11">vLLM, SGLang, TensorRT-LLM, Hugging Face TGI</text>
      <!-- Diagram Nodes -->
      <rect x="12" y="46" width="75" height="42" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.15)" />
      <text x="49" y="64" fill="var(--grey-lighter)" font-size="10.5" text-anchor="middle">Admission</text>
      <text x="49" y="78" fill="var(--grey-light)" font-size="10" text-anchor="middle">Queue</text>
      <line x1="87" y1="67" x2="108" y2="67" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" marker-end="url(#arrow-queue-map)" />
      <!-- KV-Cache Pool -->
      <rect x="114" y="46" width="112" height="42" rx="4" fill="rgba(255, 167, 38, 0.12)" stroke="rgba(255, 167, 38, 0.5)" />
      <text x="170" y="63" fill="#ffa726" font-size="10.5" font-weight="700" text-anchor="middle">VRAM KV Pool (K)</text>
      <text x="170" y="77" fill="var(--grey-light)" font-size="9.5" text-anchor="middle">PagedAttention Blocks</text>
      <line x1="226" y1="67" x2="246" y2="67" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" marker-end="url(#arrow-queue-map)" />
      <!-- GPU Core -->
      <rect x="252" y="46" width="107" height="42" rx="4" fill="rgba(var(--primary), 0.12)" stroke="rgb(var(--primary))" stroke-width="1" />
      <text x="305" y="63" fill="rgb(var(--primary))" font-size="10.5" font-weight="700" text-anchor="middle">GPU Tensor Core</text>
      <text x="305" y="77" fill="var(--grey-light)" font-size="9.5" text-anchor="middle">Iteration Scheduler</text>
      <!-- Sub-note -->
      <rect x="12" y="96" width="347" height="34" rx="4" fill="rgba(255, 255, 255, 0.03)" />
      <text x="20" y="112" fill="#ffa726" font-size="10.5" font-weight="600">Prefill/Decode Interference: <tspan fill="var(--grey-light)" font-weight="400">Compute GEMM stalls memory GEMV</tspan></text>
      <text x="20" y="124" fill="var(--grey-light)" font-size="10">KV block exhaustion forces requests to queue externally (W<tspan font-size="8" dy="1.5">q</tspan><tspan font-size="10" dy="-1.5">)</tspan></text>
    </g>
    <!-- Item 5: Disaggregated Inference Cluster G/G/c -->
    <g transform="translate(12, 188)">
      <rect x="0" y="0" width="371" height="154" rx="6" fill="var(--grey-darker)" stroke="rgba(255, 255, 255, 0.08)" />
      <text x="12" y="20" fill="rgb(var(--primary))" font-size="12.5" font-weight="700">Disaggregated Inference Cluster (G/G/c)</text>
      <text x="12" y="36" fill="var(--grey-light)" font-size="11">llm-d, vLLM/SGLang PD Disaggregation + Gateway API</text>
      <!-- Disaggregation Flow -->
      <rect x="12" y="46" width="80" height="40" rx="4" fill="rgba(var(--primary), 0.12)" stroke="rgb(var(--primary))" />
      <text x="52" y="63" fill="rgb(var(--primary))" font-size="10" font-weight="700" text-anchor="middle">Prefill Pool</text>
      <text x="52" y="76" fill="var(--grey-light)" font-size="9" text-anchor="middle">(c<tspan font-size="7.5" dy="1.5">prefill</tspan><tspan font-size="9" dy="-1.5"> GPU)</tspan></text>
      <line x1="92" y1="66" x2="148" y2="66" stroke="rgb(var(--primary))" stroke-width="1.3" marker-end="url(#arrow-queue-pri)" />
      <text x="120" y="58" fill="rgb(var(--primary))" font-size="9" font-weight="700" text-anchor="middle">RDMA</text>
      <rect x="154" y="46" width="80" height="40" rx="4" fill="rgba(52, 211, 153, 0.12)" stroke="rgba(52, 211, 153, 0.5)" />
      <text x="194" y="63" fill="#34d399" font-size="10" font-weight="700" text-anchor="middle">Decode Pool</text>
      <text x="194" y="76" fill="var(--grey-light)" font-size="9" text-anchor="middle">(c<tspan font-size="7.5" dy="1.5">decode</tspan><tspan font-size="9" dy="-1.5"> GPU)</tspan></text>
      <line x1="234" y1="66" x2="260" y2="66" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" marker-end="url(#arrow-queue-map)" />
      <rect x="266" y="46" width="93" height="40" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.15)" />
      <text x="312" y="63" fill="var(--grey-lighter)" font-size="10" font-weight="600" text-anchor="middle">Prefix Gateway</text>
      <text x="312" y="76" fill="var(--grey-light)" font-size="9" text-anchor="middle">Cache Routing</text>
      <!-- Sub-note -->
      <rect x="12" y="94" width="347" height="48" rx="4" fill="rgba(255, 255, 255, 0.03)" />
      <text x="20" y="110" fill="#34d399" font-size="10.5" font-weight="600">✓ Decoupled Queues: <tspan fill="var(--grey-light)" font-weight="400">Zero prefill-induced TPOT jitter</tspan></text>
      <text x="20" y="124" fill="var(--grey-light)" font-size="10">Decode workers achieve low variance (Cᵥ ≈ 0)</text>
      <text x="20" y="136" fill="var(--grey-light)" font-size="10">Prefix hashing routes requests to existing KV blocks (S → 0)</text>
    </g>
  </g>
</svg>

### Single-Threaded Event Loops ($M/M/1$)

- **Real-World Examples**: Redis server, Node.js V8 main loop, NGINX single-worker process.
- **Internal Mechanics**: A single OS thread loops continuously, popping commands from an incoming socket FIFO buffer.
- **Capacity Dynamics**: Single-threaded execution has zero lock contention or context-switching overhead. However, a single long-running operation (such as an unindexed Redis `KEYS *` scan or a massive synchronous JSON parse in Node.js) stalls the entire thread. This triggers immediate **Pollaczek–Khinchine Head-of-Line blocking**, forcing all subsequent lightweight requests to queue behind the slow job.

### Connection-Pooled Relational Databases ($M/M/c / K$)

- **Real-World Examples**: PostgreSQL or MySQL fronted by connection poolers like PgBouncer or HikariCP.
- **Internal Mechanics**: The database manages a fixed pool of $c$ backend worker processes (e.g. $c = 32$ connections). When all $c$ connections are busy, incoming application queries wait in a client-side FIFO queue capped at buffer capacity $K$.
- **Capacity Dynamics**: Governed strictly by Little's Law ($N = \lambda \cdot W$). If average query execution time jumps from $5\text{ ms}$ to $50\text{ ms}$ due to database lock contention, sustaining $\lambda = 1,000\text{ queries/s}$ requires increasing active concurrent connections from 5 to 50:

$$
N = \lambda \cdot W = 1,000\text{ req/s} \times 0.050\text{ s} = \mathbf{50\text{ connections}}
$$

  If the pool is capped at $c = 32$, the connection pool exhausts immediately ($K$ reached) and subsequent queries fail with connection timeout errors.

### Multi-Worker HTTP Microservices ($G/G/c$)

- **Real-World Examples**: Go HTTP servers with goroutine pools, Java Spring Tomcat thread pools, Python Gunicorn worker pools.
- **Internal Mechanics**: Inbound HTTP requests exhibit arbitrary payload sizes and variable compute times ($G$) dispatched across $c$ worker threads or CPU cores ($c$).
- **Capacity Dynamics**: Governed by **Erlang C resource pooling**. Pooling $c$ cores behind a shared queue drastically reduces queuing delay compared to isolated single-server pipelines, allowing the service to absorb short traffic bursts without degrading tail latency.

### LLM Continuous Batching Engines ($G/G/1\text{ (GPU)}$ with Iteration Scheduling)

- **Real-World Examples**: vLLM, SGLang, TensorRT-LLM, Hugging Face TGI.
- **Internal Mechanics**: The GPU accelerator acts as a high-throughput server processing continuous iteration batches. Requests enter a two-phase lifecycle: (1) compute-bound prefill evaluated in parallel chunks, and (2) memory-bandwidth-bound decode iterated token-by-token. The engine dynamically multiplexes active requests into continuous batch steps, bounded by the GPU VRAM KV-cache capacity pool ($K$).
- **Capacity Dynamics**: Governed by **KV-cache block limits** and **HBM memory bandwidth**. When active concurrent sequences exhaust available KV blocks ($K$), incoming requests wait in an external admission queue ($W_q$). When a burst of long prompts arrives, compute-heavy prefill operations interleave with ongoing decode loops, causing severe tail spikes in Time Per Output Token (TPOT).

### Distributed Inference Clusters & Disaggregated Queuing ($G/G/c$)

- **Real-World Examples**: [`llm-d`](https://llm-d.ai/) (Kubernetes-native distributed inference orchestration), vLLM / SGLang multi-node clusters with Gateway API Inference routing.
- **Internal Mechanics**: Multi-node inference clusters scale out by disaggregating execution phases and pooling GPU workers:
  1. **Prefill-Decode (PD) Disaggregation**: Decouples the single heterogeneous queue into separate specialized worker pools: compute-dense prefill workers ($M/G/c_{\text{prefill}}$) and memory-bandwidth-dense decode workers ($M/G/c_{\text{decode}}$), passing the generated KV cache over high-speed RDMA interconnects. This drives execution variance on decode workers down ($C_v \approx 0$), eliminating prefill-induced TPOT jitter.
  2. **Prefix-Cache-Aware Routing**: Evaluates incoming prompt hashes to route requests directly to the node hosting matching KV cache blocks, turning $S_{\text{prefill}} = 500\text{ ms}$ into $S_{\text{prefill}} = 5\text{ ms}$ and dramatically shrinking in-flight cluster concurrency ($L = \lambda \cdot W$).
- **Capacity Dynamics**: Governed by **Erlang C multi-server pooling** and **KV cache transfer bandwidth**. Centralized inference-aware gateways prevent request clumping across nodes, ensuring all worker GPUs operate symmetrically near the 75% operational knee without localized queue blowouts.

## Production Capacity Planning Checklist

Apply these five sizing principles to translate empirical benchmark results into production infrastructure sizing:

<svg viewBox="0 0 840 226" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-checklist" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(255, 255, 255, 0.35)" />
    </marker>
  </defs>
  <!-- Card 1: Baseline Floor S -->
  <g transform="translate(12, 14)">
    <rect x="0" y="0" width="146" height="198" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="10" y="12" width="68" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="44" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">STEP 1</text>
    <text x="10" y="62" fill="var(--grey-lighter)" font-size="15" font-weight="700">Baseline Floor</text>
    <text x="10" y="86" fill="rgb(var(--primary))" font-size="13.5" font-weight="700">S = W₀ - t<tspan font-size="10" dy="2.5">RTT</tspan></text>
    <text x="10" y="116" fill="var(--grey-light)" font-size="12.5">Median P50 under</text>
    <text x="10" y="136" fill="var(--grey-light)" font-size="12.5">light load (ρ &lt; 5%)</text>
    <text x="10" y="156" fill="var(--grey-light)" font-size="12.5">Physical floor</text>
  </g>
  <!-- Arrow 1 to 2 -->
  <line x1="162" y1="113" x2="172" y2="113" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.4" marker-end="url(#arrow-checklist)" />
  <!-- Card 2: Knee Throughput -->
  <g transform="translate(176, 14)">
    <rect x="0" y="0" width="146" height="198" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="10" y="12" width="68" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="44" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">STEP 2</text>
    <text x="10" y="62" fill="var(--grey-lighter)" font-size="15" font-weight="700">Knee Rate (λ)</text>
    <text x="10" y="86" fill="rgb(var(--primary))" font-size="13.5" font-weight="700">P₉₉ ≤ 3.0 × S</text>
    <text x="10" y="116" fill="var(--grey-light)" font-size="12.5">Open-loop sweep</text>
    <text x="10" y="136" fill="var(--grey-light)" font-size="12.5">Find knee before</text>
    <text x="10" y="156" fill="var(--grey-light)" font-size="12.5">saturation cliff</text>
  </g>
  <!-- Arrow 2 to 3 -->
  <line x1="326" y1="113" x2="336" y2="113" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.4" marker-end="url(#arrow-checklist)" />
  <!-- Card 3: Node Sizing -->
  <g transform="translate(340, 14)">
    <rect x="0" y="0" width="146" height="198" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="10" y="12" width="68" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="44" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">STEP 3</text>
    <text x="10" y="62" fill="var(--grey-lighter)" font-size="15" font-weight="700">Cluster Sizing</text>
    <text x="10" y="86" fill="rgb(var(--primary))" font-size="13.5" font-weight="700">c = ⌈λ / λₖ⌉</text>
    <text x="10" y="116" fill="var(--grey-light)" font-size="12.5">Scale node count</text>
    <text x="10" y="136" fill="var(--grey-light)" font-size="12.5">Maintains 25%</text>
    <text x="10" y="156" fill="var(--grey-light)" font-size="12.5">burst headroom</text>
  </g>
  <!-- Arrow 3 to 4 -->
  <line x1="490" y1="113" x2="500" y2="113" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.4" marker-end="url(#arrow-checklist)" />
  <!-- Card 4: Little's Law Pools -->
  <g transform="translate(504, 14)">
    <rect x="0" y="0" width="146" height="198" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="10" y="12" width="68" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="44" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">STEP 4</text>
    <text x="10" y="62" fill="var(--grey-lighter)" font-size="15" font-weight="700">Little's Law</text>
    <text x="10" y="86" fill="rgb(var(--primary))" font-size="13.5" font-weight="700">N = λ · W<tspan font-size="10" dy="2.5">P99</tspan></text>
    <text x="10" y="116" fill="var(--grey-light)" font-size="12.5">Size DB pools &amp;</text>
    <text x="10" y="136" fill="var(--grey-light)" font-size="12.5">GPU VRAM KV</text>
    <text x="10" y="156" fill="var(--grey-light)" font-size="12.5">sequence blocks</text>
  </g>
  <!-- Arrow 4 to 5 -->
  <line x1="654" y1="113" x2="664" y2="113" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.4" marker-end="url(#arrow-checklist)" />
  <!-- Card 5: Timeouts -->
  <g transform="translate(668, 14)">
    <rect x="0" y="0" width="160" height="198" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
    <rect x="10" y="12" width="68" height="24" rx="4" fill="rgba(var(--primary), 0.15)" />
    <text x="44" y="28" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">STEP 5</text>
    <text x="10" y="62" fill="var(--grey-lighter)" font-size="15" font-weight="700">Client Timeouts</text>
    <text x="10" y="86" fill="rgb(var(--primary))" font-size="13.5" font-weight="700">t<tspan font-size="10" dy="2.5">timeout</tspan><tspan font-size="13.5" dy="-2.5"> ≤ 3 × P₉₀</tspan></text>
    <text x="10" y="116" fill="var(--grey-light)" font-size="12.5">Sync timeouts</text>
    <text x="10" y="136" fill="var(--grey-light)" font-size="12.5">Cancel server</text>
    <text x="10" y="156" fill="var(--grey-light)" font-size="12.5">context on drop</text>
  </g>
</svg>

1. **Measure Baseline Service Floor ($S = W_0$)**: Measure median response time ($P_{50}$) under light load ($\rho <$ 5%) with network transit latency subtracted ($S = W\_{\text{uncontended}} - t\_{\text{RTT}}$). This physical execution floor establishes the reference baseline for all queuing contention.
2. **Identify Maximum Knee Throughput ($\lambda\_{\text{knee}}$)**: Execute an open-loop stepped rate sweep (`wrk2 -R`) in increments of 10% load. Identify $\lambda\_{\text{knee}}$ where tail response time first departs from linear scaling ($P_{99} \le 3.0 \times S$).
3. **Size Cluster Nodes for Peak Traffic ($c\_{\text{nodes}}$)**: Size node count so that the cluster operates safely at $\rho\_{\text{target}} \le$ 75% during peak traffic demand ($\lambda\_{\text{peak}}$), preserving 25% idle capacity to absorb stochastic Poisson bursts:

$$
\begin{aligned}
c_{\text{nodes}} &= \left\lceil \frac{\lambda_{\text{peak}}}{\lambda_{\text{knee, node}}} \right\rceil \\\\
&= \left\lceil \frac{\lambda_{\text{peak}}}{0.75 \cdot \lambda_{\text{max, node}}} \right\rceil
\end{aligned}
$$

4. **Size Resource Pools with Little's Law Safety Upper-Bounds ($N\_{\text{pool}} = \lambda\_{\text{peak}} \cdot W\_{P\_{99}}$)**: While Little's Law ($L = \lambda W$) mathematically governs expected means, sizing concurrency pools to peak worst-case duration ($W\_{P\_{99}}$) provides an essential engineering safety buffer against resource exhaustion cascades during traffic bursts:
   - **Database Connection Pools**: If an API handles $\lambda = 2,000\text{ req/s}$ with a peak $P_{99}$ query duration of $40\text{ ms}$ ($0.040\text{ s}$), the pool must contain at least $N\_{\text{pool}} = 2,000 \cdot 0.040 = \mathbf{80\text{ active connections}}$ to avoid queue drop errors.
   - **LLM Inference KV-Cache Memory Pools**: If an inference cluster receives $\lambda = 50\text{ req/s}$ with an average request turnaround duration of $W = 4.0\text{ s}$ (prefill + decode), GPU VRAM must allocate enough PagedAttention memory blocks to hold $N\_{\text{sequences}} = 50 \cdot 4.0 = \mathbf{200\text{ concurrent sequences}}$.
5. **Synchronize Defensive Client Timeouts**: Set client-side timeouts based on high quantiles ($3 \times P_{90}$ or $P_{99.9}$). Never allow client timeouts to exceed the server's queue retention window. When a client abandons a request, the server must immediately cancel the in-flight context (e.g. Go `context.WithTimeout` or gRPC deadline propagation) to avoid wasting compute cycles on abandoned work.

## Summary Matrix

| Performance Dimension | Naive Load Testing (Anti-Pattern) | Systems Engineering Practice |
| :--- | :--- | :--- |
| **Problem Definition** | Running a tool without baseline service time floor $S$. | Formal Problem Statement: capacity discovery, SLA gating, or failure mapping. |
| **Workload Model** | Static single-key requests with homogeneous duration ($C_v \approx 0$). | Zipfian key distribution with production read/write ratio and execution variance ($C_v$). |
| **Execution Protocol** | Immediate 0 to max load, measuring during cold startup. | 4-Phase Protocol: Ramp-up, JIT/Pool Warm-up, Steady-State, Stepped Rate Sweeps. |
| **Load Generation Model** | Closed-loop virtual users (self-throttling, which masks saturation). | Open-loop arrival generation ([`wrk2`](https://github.com/giltene/wrk2), [`vegeta`](https://github.com/tsenart/vegeta)). |
| **Omission Correction** | Ignores schedule delay (reports fake $1\text{ms}$ median during stalls). | Calculates true latency $L_{\text{true}} = t_{\text{received}} - t_{\text{scheduled}}$. |
| **Target Sizing Point** | Sizing at 95% utilization to save hosting costs. | Sizing at the operational knee ($\rho \approx$ 70% to 75%) with 25% burst headroom. |
| **Pool Sizing** | Guessing arbitrary thread and connection pool limits. | Little's Law safety sizing: $N_{\text{pool}} = \lambda_{\text{peak}} \cdot W_{P_{99}}$. |
| **Tooling Approach** | Naive closed-loop scripts or uncorrected virtual-user loops. | Open-loop tools: [`wrk2`](https://github.com/giltene/wrk2), [`vegeta`](https://github.com/tsenart/vegeta), and [`aiperf`](https://github.com/ai-dynamo/aiperf) / [`inference-perf`](https://github.com/kubernetes-sigs/inference-perf). |

*This note was co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*
