---
title: "The Pareto Frontier in LLM Inference Serving"
summary: |
  A deep dive into measuring and optimizing LLM inference performance: from traditional web service metrics to LLM-native metrics (TTFT, TPOT, TPS, NTTFT), framing serving as a multi-objective optimization problem, navigating trade-offs along the Pareto frontier, and analyzing automated tuning frameworks like Optuna and Google Vizier.
image: /images/neural-network.jpeg
tags: ["machine learning", "system design", "inference serving", "pareto frontier", "optimization", "optuna", "vizier"]
date: 2026-08-25T23:16:00Z
draft: true
libraries: ["katex"]
mathTerms: ["llm", "systems"]
---

Serving large language models (LLMs) and generative AI workloads introduces unique systems challenges that break traditional assumptions about service performance. Unlike typical stateless REST APIs or database queries, inference execution is stateful, iterative, heterogeneous, and memory-bandwidth bound.

Evaluating and optimizing LLM serving systems requires moving beyond single-variable metrics (like pure requests per second or mean latency) to **multi-objective optimization**, where performance is defined by a **Pareto frontier** of trade-offs.

*(For foundational queuing theory, latency breakdowns, and traditional service metrics, see [Performance Fundamentals](/notes/performance-fundamentals/).)*

## Why Classical Metrics Fail for LLM Inference

The entire foundation of classical performance engineering rests on three core assumptions:

1. **Atomic Request-Response**: A client sends an input, the server computes, and returns the complete output payload in a single response packet.
2. **Homogeneous, Deterministic Execution**: A job's computation time is proportional to input size or indexed database lookups, and execution time per unit of work remains steady.
3. **Stateless Resource Allocation**: Once a worker finishes a request, all CPU/memory resources are immediately released back to the operating system pool.

LLM inference serving fundamentally breaks all three assumptions:

### Assumption 1: Atomic Responses vs. Incremental Token Streaming

In LLM serving, waiting for the entire generated sequence before sending data to the client introduces unacceptable delays (often several seconds). Modern inference servers stream tokens **autoregressively** as they are generated. 

Evaluating a streaming system with end-to-end response time ($L$) fails to measure responsiveness: a user perceives a snappy application if the first token arrives in $200\text{ ms}$, even if generating the remaining $500$ tokens takes $10\text{ seconds}$.

### Assumption 2: Homogeneous Execution vs. Asymmetric Dual Phases

Unlike classical database queries, an LLM request alternates between two vastly different computational regimes:
1. **Prefill Phase (Prompt Evaluation)**: Processes the prompt tokens all at once in parallel. This phase is heavily **compute-bound** (matrix-matrix multiplication, GEMM) and saturates GPU tensor cores.
2. **Decode Phase (Token Generation)**: Emits output tokens one by one autoregressively. Each step loads model weights from high-bandwidth memory (HBM) to compute a single new token. This phase is strictly **memory-bandwidth-bound** (matrix-vector multiplication, GEMV).

Because prefill and decode compete for the same GPU tensor cores and memory bus, running them together causes severe execution interference.

### Assumption 3: Stateless Processing vs. Stateful Dynamic KV-Cache Allocation

During the decode phase, the model must store the Key and Value activations (the **KV cache**) of all previous tokens in GPU VRAM to avoid recomputing past context. 

Because output token lengths cannot be predicted ahead of time, memory allocation is dynamic, stateful, and non-deterministic. If GPU memory runs out of space for KV cache allocations, incoming requests must be paused, swapped to host RAM, or prefilled again from scratch.

## LLM Inference Metrics: The Paradigm Shift

To capture the dual-phase, streaming nature of generative models, LLM serving systems rely on specialized latency and throughput metrics.

<div class="tex2jax_ignore" style="display: flex; justify-content: center; margin: 2rem 0;">
<svg viewBox="0 0 840 280" width="100%" class="tex2jax_ignore" style="max-width: 840px; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 15px; border: 1px solid var(--grey-dark);">
  <!-- Timeline base axis -->
  <line x1="40" y1="120" x2="800" y2="120" stroke="var(--grey)" stroke-width="2" />
  <polygon points="800,115 815,120 800,125" fill="var(--grey)" />
  <text x="815" y="145" fill="var(--grey-light)" font-size="12">Time</text>
  <!-- Step 0: Request Arrival -->
  <circle cx="60" cy="120" r="6" fill="var(--grey-lighter)" />
  <line x1="60" y1="120" x2="60" y2="40" stroke="var(--grey)" stroke-width="1.5" stroke-dasharray="3 3" />
  <text x="60" y="30" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Request Arrival</text>
  <!-- Phase 1: Queueing -->
  <rect x="60" y="105" width="100" height="30" rx="4" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
  <text x="110" y="125" fill="var(--grey-light)" font-size="11" text-anchor="middle">Queue Delay</text>
  <!-- Phase 2: Prefill -->
  <rect x="160" y="100" width="160" height="40" rx="4" fill="rgba(var(--primary), 0.25)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="240" y="120" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Prefill Phase (GEMM)</text>
  <text x="240" y="134" fill="rgb(var(--primary))" font-size="10" font-weight="500" text-anchor="middle">Prompt Evaluation</text>
  <!-- TTFT Marker -->
  <circle cx="320" cy="120" r="6" fill="rgb(var(--primary))" />
  <line x1="320" y1="120" x2="320" y2="40" stroke="rgb(var(--primary))" stroke-width="1.5" stroke-dasharray="3 3" />
  <text x="320" y="30" fill="rgb(var(--primary))" font-size="12" font-weight="600" text-anchor="middle">First Token Emitted</text>
  <!-- TTFT Bracket -->
  <path d="M 60 70 L 60 60 L 190 60 L 190 50 L 190 60 L 320 60 L 320 70" fill="none" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="190" y="78" fill="rgb(var(--primary))" font-size="12" font-weight="600" text-anchor="middle">Time to First Token (TTFT)</text>
  <!-- Phase 3: Decode Loop -->
  <!-- Token 2 -->
  <rect x="330" y="105" width="75" height="30" rx="4" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
  <text x="367" y="124" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Token 2</text>
  <!-- Token 3 -->
  <rect x="415" y="105" width="75" height="30" rx="4" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
  <text x="452" y="124" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Token 3</text>
  <!-- Token 4 -->
  <rect x="500" y="105" width="75" height="30" rx="4" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
  <text x="537" y="124" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Token 4</text>
  <!-- Ellipsis -->
  <text x="600" y="125" fill="var(--grey-light)" font-size="16" font-weight="bold" text-anchor="middle">...</text>
  <!-- Token N -->
  <rect x="630" y="105" width="85" height="30" rx="4" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
  <text x="672" y="124" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Token N (EOS)</text>
  <!-- TPOT / ITL Indicator -->
  <path d="M 330 155 L 330 165 L 367 165 L 367 175 L 367 165 L 405 165 L 405 155" fill="none" stroke="var(--grey)" stroke-width="1.5" />
  <text x="367" y="195" fill="var(--grey-lighter)" font-size="11" font-weight="600" text-anchor="middle">TPOT / ITL</text>
  <!-- E2E Latency Bracket -->
  <path d="M 60 220 L 60 230 L 387 230 L 387 240 L 387 230 L 715 230 L 715 220" fill="none" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="387" y="260" fill="rgb(var(--primary))" font-size="13" font-weight="600" text-anchor="middle">End-to-End Latency (E2E)</text>
</svg>
</div>

### Time to First Token (TTFT)
The elapsed time between request arrival and the generation of the first output token:

$$\text{TTFT} = t_{\text{first\_token}} - t_{\text{arrival}} = t_{\text{queue}} + t_{\text{prefill}}$$

- **Perceptual Impact**: Determines user-perceived responsiveness (e.g., when a chatbot UI starts streaming text).
- **System Driver**: The **prefill phase**, which computes attention over the entire prompt context in parallel. Prefill operations are compute-bound matrix multiplications (GEMM) and scale with prompt length ($I$).

### Time Per Output Token (TPOT) / Inter-Token Latency (ITL)
The time required to generate each subsequent token during the autoregressive phase:

$$\text{TPOT} = \frac{t_{\text{end}} - t_{\text{first\_token}}}{O - 1}$$

where $O$ is the total number of generated output tokens.

- **Perceptual Impact**: Dictates streaming smoothness. Human reading speed is approximately 5 to 10 tokens per second ($100\text{–}200\text{ ms/token}$).
- **System Driver**: The **decode phase**, which generates one token per iteration. Each step must load the entire model weight matrix from high-bandwidth memory (HBM) to compute just one token, making decode heavily memory-bandwidth bound (GEMV).

### Tokens Per Second (TPS) / Generation Throughput
The system-wide aggregate token production rate:

$$
\text{TPS}_{\text{system}} = \frac{\sum_{i=1}^{N} O_i}{\Delta t}
$$

$$
\text{TPS}_{\text{per\_user}} = \frac{1}{\text{TPOT}}
$$

- **System Driver**: Reflects overall GPU utilization and cluster operational cost efficiency (cost per million tokens).

### Normalized Time to First Token (NTTFT)
Because raw TTFT scales with prompt length, long prompts naturally yield higher TTFT. NTTFT normalizes TTFT against prompt token count:

$$\text{NTTFT} = \frac{\text{TTFT}}{\text{Input Token Count}}$$

This isolates scheduling overhead and compute efficiency from variable prompt lengths.

### End-to-End Latency ($E2E$)
The total request lifetime:

$$E2E = \text{TTFT} + (O - 1) \times \text{TPOT}$$

## The 2D Pareto Frontier in Inference Serving

When configuring an inference engine (e.g., vLLM, TensorRT-LLM, SGLang, or TGI), objectives directly conflict. Increasing batch size boosts aggregate throughput (TPS) by amortizing weight loading across multiple streams, but increases iteration delays and queuing times for individual requests (worsening TTFT and TPOT).

### Formalizing Pareto Dominance

Consider an objective vector $F(\mathbf{x}) = [f_1(\mathbf{x}), f_2(\mathbf{x}), \dots, f_k(\mathbf{x})]$ parameterized by serving configuration $\mathbf{x} \in \mathcal{X}$.

A configuration $\mathbf{x}_A$ **dominates** configuration $\mathbf{x}_B$ ($\mathbf{x}_A \succ \mathbf{x}_B$) if and only if:
1. $\mathbf{x}_A$ is no worse than $\mathbf{x}_B$ in all objectives: $\forall i \in \{1,\dots,k\}, f_i(\mathbf{x}_A) \le f_i(\mathbf{x}_B)$ (for minimization).
2. $\mathbf{x}_A$ is strictly better than $\mathbf{x}_B$ in at least one objective: $\exists j \in \{1,\dots,k\}, f_j(\mathbf{x}_A) < f_j(\mathbf{x}_B)$.

The **Pareto Frontier** (or Pareto front) $\mathcal{P}^*$ consists of all non-dominated points:

$$\mathcal{P}^* = \{ \mathbf{x}^* \in \mathcal{X} \mid \nexists \mathbf{x} \in \mathcal{X} \text{ such that } \mathbf{x} \succ \mathbf{x}^* \}$$

### 2D Trade-off: Throughput (TPS) vs. Tail Latency ($P_{99}$ TTFT / TPOT)

In LLM serving, the Pareto frontier forms a curve in the 2D plane comparing **System Throughput (TPS)** against **Tail Latency ($P_{99}$ TTFT / TPOT)**.

- **Point A (Strict SLA / Interactive Voice)**: Minimal batch size and aggressive priority scheduling. TTFT is tiny (<80ms), but GPU compute units idle during autoregressive decode, yielding lower aggregate TPS.
- **Point B (Balanced Copilot / Chat)**: Tuned continuous batching and chunked prefill settings. Provides the optimal trade-off for human reading speed.
- **Point C (Max Throughput / Batch Document ETL)**: Maximum batch size and high KV cache saturation. Throughput approaches hardware memory-bandwidth and compute rooflines, but queue delays increase latency.
- **Point D (Dominated / Sub-optimal)**: Inefficient configurations (e.g. poor tensor-parallel all-reduce splits, memory fragmentation, or unchunked prefill pauses). Point B achieves **both higher throughput and lower latency** than Point D.

<div id="interactive-pareto-playground" style="margin: 2rem 0;"></div>

## Multi-Objective Optimization in Serving Engines

The position of an inference cluster on the Pareto curve is governed by internal engine hyperparameters:

| Serving Hyperparameter | Primary Impact on Metrics | Engineering Trade-off |
| :--- | :--- | :--- |
| **Max Batched Tokens** (`max_num_batched_tokens`) | Higher $\to$ $\uparrow$ System TPS, $\uparrow$ TPOT | Controls iteration computation density vs. decode iteration latency. |
| **Max Running Sequences** (`max_num_seqs`) | Higher $\to$ $\uparrow$ Concurrency, $\uparrow$ KV Cache Pressure | Amortizes weight loading, but risks KV cache preemption and swapping. |
| **Chunked Prefill Size** (`max_num_seqs_per_chunk`) | Larger $\to$ $\downarrow$ TTFT, $\uparrow$ TPOT jitter | Slices large prompt prefills to prevent starvation of active decode streams. |
| **Parallelism Strategy** ($TP$ vs. $PP$ vs. $DP$) | $TP$ $\to$ $\downarrow$ Latency, $\uparrow$ All-Reduce overhead | Tensor parallelism lowers per-request latency, while Data parallelism scales total TPS. |
| **Prefill-Decode Disaggregation** (PD Split) | Shifts the entire Pareto curve outward | Decouples compute-bound prefill from memory-bound decode over RDMA, eliminating TPOT jitter. |
| **Speculative Decoding** (Draft Length $K$) | Larger $K$ $\to$ $\downarrow$ TPOT (if accepted) | Accelerates memory-bound decode, but wastes compute if acceptance rate drops. |

### The Prefill-Decode Interference Problem

In traditional continuous batching systems, prefill and decode iterations share the same GPU resources:

<div class="tex2jax_ignore" style="display: flex; justify-content: center; margin: 2rem 0;">
<svg viewBox="0 0 760 210" width="100%" class="tex2jax_ignore" style="max-width: 760px; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 15px; border: 1px solid var(--grey-dark);">
  <!-- Iteration Step T -->
  <text x="20" y="30" fill="var(--grey-lighter)" font-size="14" font-weight="bold">Iteration Step T (Shared Engine Batch)</text>
  <!-- Container Box -->
  <rect x="20" y="45" width="720" height="135" rx="8" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
  <!-- Prefill Job (Large Box) -->
  <rect x="40" y="60" width="340" height="105" rx="6" fill="rgba(var(--primary), 0.2)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="210" y="95" fill="var(--grey-lighter)" font-size="14" font-weight="bold" text-anchor="middle">Prefill: Request 4 (1024 tokens)</text>
  <text x="210" y="120" fill="var(--grey-light)" font-size="12" text-anchor="middle">Heavy Compute (GEMM Matrix Multiplication)</text>
  <text x="210" y="145" fill="rgb(var(--primary))" font-size="11" font-weight="600" text-anchor="middle">Execution Time: ~80ms</text>
  <!-- Decode Jobs (Small Boxes) -->
  <g transform="translate(400, 60)">
    <rect x="0" y="0" width="95" height="105" rx="6" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
    <text x="47" y="45" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="middle">Decode 1</text>
    <text x="47" y="68" fill="var(--grey-light)" font-size="10" text-anchor="middle">Token 42</text>
    <text x="47" y="92" fill="rgb(var(--primary))" font-size="10" font-weight="bold" text-anchor="middle">Stalled!</text>
  </g>
  <g transform="translate(505, 60)">
    <rect x="0" y="0" width="95" height="105" rx="6" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
    <text x="47" y="45" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="middle">Decode 2</text>
    <text x="47" y="68" fill="var(--grey-light)" font-size="10" text-anchor="middle">Token 88</text>
    <text x="47" y="92" fill="rgb(var(--primary))" font-size="10" font-weight="bold" text-anchor="middle">Stalled!</text>
  </g>
  <g transform="translate(610, 60)">
    <rect x="0" y="0" width="110" height="105" rx="6" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1" />
    <text x="55" y="45" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="middle">Decode 3</text>
    <text x="55" y="68" fill="var(--grey-light)" font-size="10" text-anchor="middle">Token 12</text>
    <text x="55" y="92" fill="rgb(var(--primary))" font-size="10" font-weight="bold" text-anchor="middle">Stalled!</text>
  </g>
</svg>
</div>

When a large prefill is scheduled into an active batch, decode iterations for existing streams stall while waiting for the prefill's heavy GEMM kernels to finish. This manifests as severe **inter-token latency spikes** ($P_{99}$ TPOT).

Engines employ **chunked prefill** (breaking prompt computation into token chunks of size $C$) to control this trade-off:
- Small chunk size $C$: Active streams experience minimal jitter (low TPOT), but prefill takes multiple steps (higher TTFT).
- Large chunk size $C$: TTFT decreases, but active decode streams stall.

<div id="interactive-chunking-demo"></div>

### Shifting the Frontier: Prefill-Decode (PD) Disaggregation

Chunked prefill is a single-GPU mitigation that trades TTFT for TPOT along a static curve. 

To **shift the Pareto frontier outward** (achieving low TTFT and low TPOT simultaneously without throughput loss), distributed orchestration frameworks like [`llm-d`](https://llm-d.ai/) implement **Prefill-Decode (PD) Disaggregation**:

1. **Dedicated Prefill Nodes**: Compute-dense GPU workers evaluate input prompts at maximum tensor core utilization without decode overhead.
2. **Dedicated Decode Nodes**: High-bandwidth memory GPU workers execute autoregressive generation loops with zero prefill interruption ($C_v \approx 0$), eliminating TPOT tail jitter.
3. **Direct KV Transfer**: Once the prefill phase finishes, the engine transfers the KV cache blocks across high-speed RDMA / NIXL networks directly to a decode worker.
4. **Prefix-Cache-Aware Routing**: The Gateway router hashes prompt prefixes to send requests to nodes holding pre-cached KV blocks, skipping prompt evaluation entirely for shared system prompts.

By decoupling the single heterogeneous queue into two specialized homogeneous queues, distributed orchestration expands the reachable Pareto envelope.

### Mathematical Formulation of Serving Multi-Objective Optimization

The engineering optimization problem can be formulated as:

$$
\min_{\mathbf{x} \in \mathcal{X}} \; \begin{bmatrix} f_{\text{TTFT\_P99}}(\mathbf{x}) \\ f_{\text{TPOT\_P99}}(\mathbf{x}) \\ -f_{\text{TPS}}(\mathbf{x}) \\ f_{\text{Cost}}(\mathbf{x}) \end{bmatrix}
$$

$$
\text{subject to } \begin{cases}
f_{\text{TTFT\_P99}}(\mathbf{x}) \le \text{SLA}_{\text{TTFT}} \\
f_{\text{TPOT\_P99}}(\mathbf{x}) \le \text{SLA}_{\text{TPOT}} \\
\text{VRAM}(\mathbf{x}) \le \text{GPU\_Memory}_{\text{available}}
\end{cases}
$$

## Navigating the Frontier: No Single Best Value

Because the Pareto frontier represents a set of non-dominated trade-offs, there is no single universally "optimal" configuration. The appropriate operating point depends on application requirements.

<div class="tex2jax_ignore" style="display: flex; justify-content: center; margin: 2rem 0;">
<svg viewBox="0 0 760 220" width="100%" class="tex2jax_ignore" style="max-width: 760px; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 15px; border: 1px solid var(--grey-dark);">
  <!-- Persona Spectrum Container -->
  <text x="380" y="30" fill="var(--grey-lighter)" font-size="14" font-weight="bold" text-anchor="middle">Pareto Operating Spectrum by Application Persona</text>
  <!-- Slider Bar -->
  <rect x="60" y="60" width="640" height="12" rx="6" fill="var(--grey-dark)" />
  <rect x="60" y="60" width="200" height="12" rx="6" fill="var(--grey)" opacity="0.6" />
  <rect x="260" y="60" width="240" height="12" fill="rgb(var(--primary))" opacity="0.7" />
  <rect x="500" y="60" width="200" height="12" rx="6" fill="var(--grey)" opacity="0.6" />
  <!-- Persona 1: Voice -->
  <circle cx="120" cy="66" r="10" fill="var(--grey)" stroke="var(--grey-lighter)" stroke-width="2" />
  <rect x="40" y="90" width="160" height="95" rx="6" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1.5" />
  <text x="120" y="112" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="middle">Voice / Real-time</text>
  <text x="120" y="132" fill="var(--grey-light)" font-size="11" text-anchor="middle">TTFT &lt; 80ms</text>
  <text x="120" y="150" fill="var(--grey-light)" font-size="11" text-anchor="middle">TPOT &lt; 20ms</text>
  <text x="120" y="170" fill="rgb(var(--primary))" font-size="10" font-weight="600" text-anchor="middle">Sacrifices Peak TPS</text>
  <!-- Persona 2: Copilot / Chat -->
  <circle cx="380" cy="66" r="10" fill="rgb(var(--primary))" stroke="var(--grey-lighter)" stroke-width="2" />
  <rect x="300" y="90" width="160" height="95" rx="6" fill="var(--grey-dark)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="380" y="112" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="middle">Interactive Chat</text>
  <text x="380" y="132" fill="var(--grey-light)" font-size="11" text-anchor="middle">TTFT &lt; 400ms</text>
  <text x="380" y="150" fill="var(--grey-light)" font-size="11" text-anchor="middle">TPOT &lt; 40ms</text>
  <text x="380" y="170" fill="rgb(var(--primary))" font-size="10" font-weight="600" text-anchor="middle">Balanced Trade-off</text>
  <!-- Persona 3: Batch ETL -->
  <circle cx="640" cy="66" r="10" fill="var(--grey)" stroke="var(--grey-lighter)" stroke-width="2" />
  <rect x="560" y="90" width="160" height="95" rx="6" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1.5" />
  <text x="640" y="112" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="middle">Batch / Document ETL</text>
  <text x="640" y="132" fill="var(--grey-light)" font-size="11" text-anchor="middle">TTFT: Irrelevant</text>
  <text x="640" y="150" fill="var(--grey-light)" font-size="11" text-anchor="middle">TPOT: Irrelevant</text>
  <text x="640" y="170" fill="var(--grey-lighter)" font-size="10" font-weight="600" text-anchor="middle">Max Tokens/$</text>
</svg>
</div>

### Marginal Rate of Substitution (MRS)

Moving along the Pareto frontier incurs an explicit trade-off defined by the **Marginal Rate of Substitution**:

$$
\text{MRS}_{\text{TPS}, \text{Latency}} = \frac{\partial f_{\text{TPS}}}{\partial f_{\text{Latency}}}
$$

Analyzing the slope reveals regions of diminishing returns:
- **Steep slope**: Small compromises in latency yield dramatic throughput gains.
- **Flat slope**: Accepting higher latency provides negligible throughput improvements, indicating hardware saturation or memory-bandwidth bottlenecks.

## Automated Frontier Discovery: Optuna & Google Vizier

Manual configuration search across multi-GPU clusters is prohibitive. Automated Black-Box Optimization (BBO) toolkits evaluate configurations systematically to construct the Pareto envelope.

<div class="tex2jax_ignore" style="display: flex; justify-content: center; margin: 2rem 0;">
<svg viewBox="0 0 780 200" width="100%" class="tex2jax_ignore" style="max-width: 780px; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 15px; border: 1px solid var(--grey-dark);">
  <defs>
    <marker id="arrow-themed-bbo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgb(var(--primary))" />
    </marker>
  </defs>
  <!-- Optimizer Box -->
  <rect x="30" y="45" width="200" height="110" rx="8" fill="var(--grey-dark)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="130" y="80" fill="rgb(var(--primary))" font-size="14" font-weight="bold" text-anchor="middle">BBO Optimizer</text>
  <text x="130" y="102" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">Optuna (NSGA-II / MOTPE)</text>
  <text x="130" y="120" fill="var(--grey-light)" font-size="11" text-anchor="middle">Google Vizier (GP Bandits)</text>
  <!-- Suggest Config Line -->
  <path d="M 230 75 L 375 75" fill="none" stroke="rgb(var(--primary))" stroke-width="2" marker-end="url(#arrow-themed-bbo)" />
  <text x="305" y="65" fill="rgb(var(--primary))" font-size="11" font-weight="600" text-anchor="middle">Config x</text>
  <!-- Serving Benchmark Harness Box -->
  <rect x="385" y="45" width="190" height="110" rx="8" fill="rgba(var(--primary), 0.15)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="480" y="80" fill="var(--grey-lighter)" font-size="14" font-weight="bold" text-anchor="middle">Serving Engine</text>
  <text x="480" y="102" fill="rgb(var(--primary))" font-size="11" font-weight="500" text-anchor="middle">vLLM / TensorRT-LLM</text>
  <text x="480" y="122" fill="var(--grey-light)" font-size="11" text-anchor="middle">Synthetic Load Harness</text>
  <!-- Report Feedback Line -->
  <path d="M 385 125 L 240 125" fill="none" stroke="var(--grey)" stroke-width="2" marker-end="url(#arrow-themed-bbo)" />
  <text x="310" y="145" fill="var(--grey-lighter)" font-size="11" font-weight="600" text-anchor="middle">[TPS, TTFT, TPOT]</text>
  <!-- Pareto Front Extraction Box -->
  <rect x="600" y="45" width="150" height="110" rx="8" fill="var(--grey-dark)" stroke="var(--grey)" stroke-width="1.5" />
  <text x="675" y="80" fill="var(--grey-lighter)" font-size="13" font-weight="bold" text-anchor="middle">Pareto Analysis</text>
  <text x="675" y="102" fill="var(--grey-light)" font-size="11" text-anchor="middle">Non-dominated set</text>
  <text x="675" y="122" fill="rgb(var(--primary))" font-size="11" font-weight="500" text-anchor="middle">Hypervolume Metric</text>
  <path d="M 575 100 L 590 100" fill="none" stroke="var(--grey)" stroke-width="2" marker-end="url(#arrow-themed-bbo)" />
</svg>
</div>

### Algorithmic Approaches

1. **NSGA-II (Non-Dominated Sorting Genetic Algorithm II)**:
   - Maintains a population of configurations.
   - Evaluates fast non-dominated sorting to classify candidates into hierarchical Pareto tiers.
   - Applies *crowding distance* to preserve diversity across the entire frontier.
2. **MOTPE (Multi-Objective Tree-structured Parzen Estimator)**:
   - Models configuration distributions using non-parametric kernel density estimators over multi-objective splits.
3. **Bayesian Optimization via qEHVI (Expected Hypervolume Improvement)**:
   - Fits Gaussian Processes to metric distributions.
   - Selects configurations that maximize the expected expansion of the hypervolume bounded by the Pareto envelope.

### Implementation with Optuna

Optuna natively supports multi-objective optimization with directional goals and Pareto front extraction:

```python
import optuna

def objective(trial: optuna.Trial):
    # 1. Define hyperparameter search space for the serving engine
    max_num_batched_tokens = trial.suggest_categorical(
        "max_num_batched_tokens", [512, 1024, 2048, 4096, 8192]
    )
    max_num_seqs = trial.suggest_int("max_num_seqs", 16, 256, step=16)
    gpu_memory_utilization = trial.suggest_float("gpu_memory_utilization", 0.80, 0.95, step=0.05)
    enable_chunked_prefill = trial.suggest_categorical("enable_chunked_prefill", [True, False])

    # 2. Run synthetic benchmark harness against serving instance
    tps, p99_ttft, p99_tpot = run_benchmark(
        max_num_batched_tokens=max_num_batched_tokens,
        max_num_seqs=max_num_seqs,
        gpu_memory_utilization=gpu_memory_utilization,
        enable_chunked_prefill=enable_chunked_prefill,
    )

    # 3. Return multi-objective evaluation tuple:
    # Maximize TPS, Minimize TTFT P99, Minimize TPOT P99
    return tps, p99_ttft, p99_tpot

def run_benchmark(max_num_batched_tokens, max_num_seqs, gpu_memory_utilization, enable_chunked_prefill):
    # Benchmark execution against vLLM server
    return 1250.0, 180.0, 24.5

# Create a multi-objective study with NSGA-II
sampler = optuna.samplers.NSGAIISampler(population_size=50)
study = optuna.create_study(
    directions=["maximize", "minimize", "minimize"],
    sampler=sampler
)

# Run optimization trials
study.optimize(objective, n_trials=100)

# Extract Pareto-optimal trials
pareto_trials = study.best_trials
print(f"Discovered {len(pareto_trials)} Pareto-optimal configurations:")
for trial in pareto_trials:
    print(f"Trial #{trial.number}: Values (TPS, TTFT, TPOT) = {trial.values}")
    print(f"  Params: {trial.params}")
```

Visualizing the Pareto front:

```python
fig = optuna.visualization.plot_pareto_front(
    study,
    target_names=["Throughput (TPS)", "TTFT P99 (ms)", "TPOT P99 (ms)"]
)
fig.write_html("pareto_frontier.html")
```

### Implementation with Google Vizier (PyVizier)

Google Vizier provides a client-server architecture built for distributed multi-objective autotuning:

```python
from vizier import pyvizier as vz
from vizier.service import clients

# 1. Define Problem Statement and Search Space
problem = vz.ProblemStatement()

problem.search_space.root.add_categorical_param(
    name="max_num_batched_tokens", feasible_values=["512", "1024", "2048", "4096", "8192"]
)
problem.search_space.root.add_int_param(name="max_num_seqs", min_value=16, max_value=256)
problem.search_space.root.add_float_param(name="gpu_memory_utilization", min_value=0.80, max_value=0.95)
problem.search_space.root.add_categorical_param(
    name="enable_chunked_prefill", feasible_values=["true", "false"]
)

# 2. Define Multi-Objective Metrics
problem.metric_information.extend([
    vz.MetricInformation(name="tps", goal=vz.GoalType.MAXIMIZE),
    vz.MetricInformation(name="ttft_p99", goal=vz.GoalType.MINIMIZE),
    vz.MetricInformation(name="tpot_p99", goal=vz.GoalType.MINIMIZE),
])

# 3. Instantiate Vizier Study
study_config = vz.StudyConfig.from_problem(problem)
study_config.algorithm = vz.Algorithm.NSGA2

study = clients.Study.from_study_config(study_config, owner="ml_infra", study_id="vllm_tuning_01")

# 4. Optimization Loop
for iteration in range(20):
    suggestions = study.suggest(count=5)
    for suggestion in suggestions:
        params = suggestion.parameters
        
        # Execute benchmark run
        tps, ttft_p99, tpot_p99 = run_serving_benchmark(params)
        
        # Report multi-metric measurement
        final_measurement = vz.Measurement(
            metrics={
                "tps": tps,
                "ttft_p99": ttft_p99,
                "tpot_p99": tpot_p99
            }
        )
        suggestion.complete(final_measurement)

# 5. Extract Optimal Pareto Trials via Hypervolume Analysis
optimal_trials = study.optimal_trials()
for trial in optimal_trials:
    print(f"Optimal Trial {trial.id}: {trial.final_measurement.metrics}")
```

### Tooling Comparison: Optuna vs. Google Vizier

| Dimension | Optuna | Google Vizier |
| :--- | :--- | :--- |
| **Architecture** | Embedded Python library or centralized SQL backend. | Distributed client-server service (gRPC/REST) for large compute clusters. |
| **MOO Algorithms** | NSGA-II, MOTPE, BoTorch integration (`qEHVI`). | NSGA-II, Multi-Objective GP-Bandits, evolutionary algorithms. |
| **Constraint Handling** | Sampler penalty functions and trial pruners. | First-class metric constraints (`MetricInformation.min_value`). |
| **Frontier Extraction** | Pareto dominance ranking (`study.best_trials`). | Exact Hypervolume calculation and Pareto filtering (`optimal_trials()`). |
| **Target Use Case** | Ad-hoc experiments, local/single-node parameter exploration. | Automated infrastructure autotuning, Kubernetes-managed fleets. |

## Summary & Key Takeaways

1. **Inference is inherently multi-objective**: Because generation splits into compute-heavy prefill and memory-heavy decode, no single metric or single configuration satisfies all deployment scenarios.
2. **TTFT vs. TPOT vs. TPS defines the fundamental trade-off**:
   - Maximizing TPS requires saturating compute and memory pipelines with large batches.
   - Minimizing TTFT and TPOT requires small batches, minimal queue times, and fine-grained chunked prefills.
3. **The Pareto Frontier formalizes non-dominated efficiency**: Systems engineers must aim for the frontier envelope rather than arbitrary local optima.
4. **Automate frontier discovery**: Optimization toolkits like **Optuna** and **Google Vizier** systematically trace the Pareto frontier across high-dimensional parameter spaces without costly manual trial and error.

*This note and its interactive Pareto frontier simulator were co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*

<script type="module" src="/js/ai/pareto-frontier.js"></script>
