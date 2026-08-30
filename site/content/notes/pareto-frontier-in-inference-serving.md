---
title: "The Pareto Frontier in LLM Inference Serving"
summary: |
  Why a single performance number lies about LLM serving, and why you should keep the whole Pareto frontier instead. Covers why scalarization structurally cannot recover the full trade-off, how Optuna and Google Vizier actually store trial values (the frontier is derived, not persisted), and how production tools like Prism, InferenceBench, and NVIDIA Dynamo present the frontier as the reportable artifact.
image: /images/neural-network.jpeg
tags: ["machine learning", "system design", "inference serving", "pareto frontier", "multi-objective optimization", "optuna", "vizier"]
date: 2026-08-30T12:00:00Z
draft: true
series: "performance-series"
perf_stage: "optimization"
libraries: ["katex"]
mathTerms: ["llm", "systems"]
---

There is no best configuration for an inference server. Anyone who hands you a single number, a single "best" config, a single winner in a benchmark, is leaving out the part that matters. What you need is a set of points, each one good in a different way, and that set is called the Pareto frontier.

This note tells the story of that set. Why a single scalar cannot represent serving performance, why the frontier is the artifact you should measure and keep, how tuning tools actually store the values that let you recover it, and how production systems present it to you.

*(For foundational queuing theory, latency breakdowns, and classical service metrics, see [Performance Fundamentals](/notes/performance-fundamentals/). For how to design and run the benchmarks themselves, see [Benchmarking & Capacity Planning](/notes/benchmarking-and-capacity-planning/).)*

## A Single Number Is a Lie

Serving an LLM is a multi-objective problem. The moment you collapse it to one scalar, you choose which objective wins and you hide every other trade-off behind that choice.

The relevant objectives conflict with one another. To maximize throughput you saturate the GPU with large batches, which drives up queueing delay. To minimize time to first token you keep batches small and idle compute during decode. To minimize inter-token latency you protect active decode streams, which steals cycles from prompt evaluation. Every one of these moves another number in the wrong direction.

Consider what a single benchmark number cannot tell you:

- A **throughput number** (tokens per second) says nothing about whether any individual request met its latency target. Peak throughput is achievable while every tail latency breaks your service level.
- A **latency number** (P99 time to first token, P99 time per output token) says nothing about how many requests the system can carry while meeting it.
- A **"best config"** is only best for the objective the tuner was told to minimize, and that choice was made before the tuning started.

The deeper problem is that a single number is gameable. If a benchmark is reported as one scalar, then anyone being benchmarked will tune toward that scalar, at the expense of every other objective. This is exactly the pattern seen in MLPerf and LMSYS leaderboards, and it is the reason some benchmarkers refuse to report a single headline number at all. InferenceBench puts it plainly: a single-number benchmark is a benchmark waiting to be reward-hacked, because moving up on one axis costs you another.

The single number is a projection. It throws away the shape of the trade-off, which is the part you need to make a decision.

<div id="scalar-tuner"></div>

## Why Scalarization Cannot Recover the Frontier

The instinct when facing multiple objectives is to fold them into one. This is called scalarization, and the most common form is the weighted sum. Given objectives $f_1, f_2, \dots, f_k$, you minimize a weighted aggregate:

$$
g(\mathbf{x}) = \sum_{i=1}^{k} w_i f_i(\mathbf{x}), \quad \sum_{i=1}^{k} w_i = 1
$$

Pick weights, solve the single-objective problem, get one point. Change the weights, solve again, get another point. In theory, sweeping the weights traces out the trade-off surface.

In practice it does not. The weighted sum can only reach points on the **convex** part of the frontier. If the frontier curves the other way, if it is concave in objective space, then no weight vector will ever find points in that region. Those points are called unsupported or non-dominated but non-supported, and the weighted sum misses them by construction. The literature on multi-objective evolutionary algorithms is explicit about this failure mode: the weighted sum scalarization cannot approximate the entire concave Pareto front, so it loses whole regions of the trade-off regardless of how finely you sweep the weights.

<div class="tex2jax_ignore" style="display: flex; justify-content: center; margin: 2rem 0;">
<svg viewBox="0 0 840 330" width="100%" class="tex2jax_ignore" style="max-width: 780px; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 15px; border: 1px solid var(--grey-dark);">
  <!-- Axes -->
  <line x1="80" y1="270" x2="800" y2="270" stroke="var(--grey)" stroke-width="1.5" />
  <polygon points="800,265 814,270 800,275" fill="var(--grey)" />
  <text x="790" y="292" fill="var(--grey-light)" font-size="11" text-anchor="middle">Objective 1 (e.g. latency) &#8594; worse</text>
  <line x1="80" y1="270" x2="80" y2="45" stroke="var(--grey)" stroke-width="1.5" />
  <polygon points="75,45 80,31 85,45" fill="var(--grey)" />
  <text x="38" y="160" fill="var(--grey-light)" font-size="11" transform="rotate(-90 38 160)" text-anchor="middle">Objective 2 (e.g. throughput) &#8594; worse</text>
  <text x="90" y="286" fill="var(--grey-lighter)" font-size="11" font-weight="600" text-anchor="start">better</text>
  <!-- Feasible region (worse side, above-right of the frontier) -->
  <path d="M 200 245 L 200 55 L 790 55 L 790 160 L 650 160 C 580 165 505 176 430 185 C 360 194 300 210 200 245 Z" fill="rgba(var(--primary), 0.06)" stroke="none" />
  <!-- Chord (convex hull) between supported extremes -->
  <line x1="200" y1="245" x2="650" y2="160" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.2" stroke-dasharray="5 4" />
  <text x="430" y="250" fill="var(--grey-light)" font-size="11" text-anchor="middle">convex hull (weighted sum reaches only the extremes)</text>
  <!-- Concave Pareto frontier -->
  <path d="M 200 245 C 300 210 360 194 430 185 C 505 176 580 165 650 160" fill="none" stroke="rgb(var(--primary))" stroke-width="2.5" />
  <!-- Supported point B -->
  <circle cx="200" cy="245" r="6" fill="var(--grey-lighter)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="190" y="228" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="end">B (supported)</text>
  <!-- Supported point A -->
  <circle cx="650" cy="160" r="6" fill="var(--grey-lighter)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="662" y="176" fill="var(--grey-lighter)" font-size="12" font-weight="bold" text-anchor="start">A (supported)</text>
  <!-- Unsupported concave region point C -->
  <circle cx="430" cy="185" r="6" fill="var(--grey-darker)" stroke="rgb(var(--primary))" stroke-width="2" />
  <text x="442" y="176" fill="rgb(var(--primary))" font-size="12" font-weight="bold" text-anchor="start">C (missed)</text>
  <!-- Annotation on the missed region -->
  <text x="442" y="120" fill="var(--grey-light)" font-size="11" text-anchor="start">Concave region. No weighted sum can reach C, even though it is a better trade-off than the extremes.</text>
</svg>
</div>

This is the structural reason a single scalar cannot describe serving performance. The scalar is a lossy projection. Two very different operating points can produce the same weighted value for one set of weights, and the concave regions that hold the interesting balanced solutions are unreachable through weighted aggregation.

Other scalarizations exist, such as Tchebycheff or $\varepsilon$-constraint methods, and they can reach points the weighted sum cannot. But they share the same fundamental limitation: each solve produces a single point. To get the full picture you must solve repeatedly, and you have no way to know whether the point you landed on is the right one without seeing the rest of the set.

The frontier is the minimal object that contains the information needed to make a serving decision. A scalar discards it.

## The Frontier Is the Artifact

Formally, a configuration $\mathbf{x}$ maps to an objective vector $F(\mathbf{x}) = [f_1(\mathbf{x}), f_2(\mathbf{x}), \dots, f_k(\mathbf{x})]$ over the configuration space $\mathcal{X}$.

A configuration $\mathbf{x}_A$ **dominates** $\mathbf{x}_B$ ($\mathbf{x}_A \succ \mathbf{x}_B$) if it is no worse in every objective and strictly better in at least one:

$$
\mathbf{x}_A \succ \mathbf{x}_B \iff \forall i, f_i(\mathbf{x}_A) \le f_i(\mathbf{x}_B) \;\text{and}\; \exists j, f_j(\mathbf{x}_A) < f_j(\mathbf{x}_B)
$$

The **Pareto frontier** $\mathcal{P}^*$ is the set of all configurations that no other configuration dominates:

$$
\mathcal{P}^* = \{ \mathbf{x} \in \mathcal{X} \mid \nexists \mathbf{x}' \in \mathcal{X} : \mathbf{x}' \succ \mathbf{x} \}
$$

Every point on the frontier is a legitimate answer. The frontier is the reportable artifact, and no point on it outranks another. The point you pick depends on the workload, which is exactly why the set, not the point, is what you keep.

### The 2D Trade-off: Throughput vs. Tail Latency

In the plane that matters most for serving, system throughput (TPS) is traded against tail latency (P99 TTFT / TPOT):

- **Point A (Strict SLA / Voice)**: Minimal batch and aggressive priority scheduling. TTFT stays tiny, but compute idles during decode and aggregate throughput drops.
- **Point B (Balanced Chat / Copilot)**: Tuned continuous batching and chunked prefill. The practical trade-off for human reading speed.
- **Point C (Max Throughput / Batch ETL)**: Maximum batch and KV-cache saturation. Throughput approaches the hardware roofline, queueing delay rises.
- **Point D (Dominated)**: Inefficient configuration. Some other point is better in every objective, so it is off the frontier entirely.

The interactive playground below lets you move a configuration around this plane and watch which points survive as non-dominated.

<div id="interactive-pareto-playground" style="margin: 2rem 0;"></div>

### Why You Keep the Whole Set

Keeping the frontier means keeping a collection of trials or configurations, each with its full vector of objective values. It means resisting the pressure to pick one and discard the rest. The reason is practical: the right operating point changes with the workload, and you do not know the workload in advance. A batch ETL job and a real-time voice agent face the same hardware but want opposite corners of this plane. The frontier preserves both choices.

InferenceBench makes the same point as a design rule: every result is a tuple of throughput, latency, cost, energy, and quality, and comparison is done on the frontier across those axes. The frontier itself is the reportable artifact. A vendor showing you one point off the frontier is showing you the wrong thing, and a vendor showing you one point on it is still hiding the shape of the trade-off.

## Tools Find the Frontier, but They Only Store Trials

Now the practical question: if the frontier is what matters, how do automated tuning tools represent it? The answer is more subtle than the marketing suggests. Neither Optuna nor Google Vizier stores a frontier object. They store every trial with its full vector of objective values, and the frontier is **derived on demand** by a dominance filter every time you ask for it.

### What Optuna Actually Stores

In Optuna, a multi-objective study is created with a list of directions, one per objective:

```python
import optuna

def objective(trial: optuna.Trial):
    max_num_batched_tokens = trial.suggest_categorical(
        "max_num_batched_tokens", [512, 1024, 2048, 4096, 8192]
    )
    max_num_seqs = trial.suggest_int("max_num_seqs", 16, 256, step=16)
    gpu_memory_utilization = trial.suggest_float("gpu_memory_utilization", 0.80, 0.95, step=0.05)
    enable_chunked_prefill = trial.suggest_categorical("enable_chunked_prefill", [True, False])

    tps, p99_ttft, p99_tpot = run_benchmark(
        max_num_batched_tokens=max_num_batched_tokens,
        max_num_seqs=max_num_seqs,
        gpu_memory_utilization=gpu_memory_utilization,
        enable_chunked_prefill=enable_chunked_prefill,
    )

    # Maximize TPS, minimize TTFT P99, minimize TPOT P99
    return tps, p99_ttft, p99_tpot

sampler = optuna.samplers.NSGAIISampler(population_size=50)
study = optuna.create_study(
    directions=["maximize", "minimize", "minimize"],
    sampler=sampler
)
study.optimize(objective, n_trials=100)
```

Each finished trial carries a full `values` tuple (here, the three metrics) alongside its `params`. That tuple is what gets persisted. There is no stored frontier. The moment you access `study.best_trials`, Optuna recomputes the non-dominated subset by comparing every trial's value vector against every other:

```python
pareto_trials = study.best_trials  # recomputed, not read from storage
print(f"Discovered {len(pareto_trials)} Pareto-optimal configurations:")
for trial in pareto_trials:
    print(f"Trial #{trial.number}: Values (TPS, TTFT, TPOT) = {trial.values}")
    print(f"  Params: {trial.params}")
```

`plot_pareto_front` does the same thing under the hood, filtering the full trial history for non-dominated points before rendering. The frontier is a query over the population, never a persisted object. The design decision is to keep every evaluation and treat the frontier as an ephemeral filter on top of it.

### What Google Vizier Actually Stores

Google Vizier is the same story on the server side. A study declares a search space and a list of metrics, each with a goal:

```python
from vizier import pyvizier as vz
from vizier.service import clients

problem = vz.ProblemStatement()
problem.search_space.root.add_categorical_param(
    name="max_num_batched_tokens", feasible_values=["512", "1024", "2048", "4096", "8192"]
)
problem.search_space.root.add_int_param(name="max_num_seqs", min_value=16, max_value=256)
problem.search_space.root.add_float_param(name="gpu_memory_utilization", min_value=0.80, max_value=0.95)
problem.search_space.root.add_categorical_param(
    name="enable_chunked_prefill", feasible_values=["true", "false"]
)

problem.metric_information.extend([
    vz.MetricInformation(name="tps", goal=vz.GoalType.MAXIMIZE),
    vz.MetricInformation(name="ttft_p99", goal=vz.GoalType.MINIMIZE),
    vz.MetricInformation(name="tpot_p99", goal=vz.GoalType.MINIMIZE),
])

study_config = vz.StudyConfig.from_problem(problem)
study_config.algorithm = vz.Algorithm.NSGA2

study = clients.Study.from_study_config(study_config, owner="ml_infra", study_id="vllm_tuning_01")

for iteration in range(20):
    suggestions = study.suggest(count=5)
    for suggestion in suggestions:
        params = suggestion.parameters
        tps, ttft_p99, tpot_p99 = run_serving_benchmark(params)
        final_measurement = vz.Measurement(
            metrics={"tps": tps, "ttft_p99": ttft_p99, "tpot_p99": tpot_p99}
        )
        suggestion.complete(final_measurement)
```

A Vizier trial stores its parameters plus a sequence of measurements, and the completed trial keeps its final measurement as a full metric dict. The service does not persist a frontier either. When you call `study.optimal_trials()`, the service computes the Pareto-optimal set at query time (the `listOptimalTrials` RPC does the dominance filtering server-side). The frontier emerges from the stored evaluations, it is never stored itself.

### The Implementation Takeaway

Both tools assume you want the whole set. They persist every trial's full objective vector and recompute the frontier as a filter on demand. The cost of keeping the set is essentially zero, and the benefit is that any decision made later, for any workload, can query the frontier without a re-run. The tools never force the single-scalar habit. You create it by discarding the extra values.

## Production Systems Force You to Face the Frontier

The same shift shows up in how production serving tools present benchmark data. They stopped showing a single winner and started showing a scatter of runs where the user picks which axes matter.

### Prism

[Prism](https://prism.llm-d.ai/) is the benchmarking dashboard for distributed inference from [llm-d](https://llm-d.ai/). It aggregates benchmark runs from disparate sources (cloud APIs, public repositories, local `llm-d-benchmark` reports) into a single scatter plot. The control that matters is the axis picker:

- **X-axis** selects among NTPOT, TPOT, TTFT, ITL, and E2E latency.
- **Y-axis** selects among output tokens, input tokens, total tokens, and QPS.

There is no default "best point." The user chooses the trade-off plane, and every benchmark run lands as a point in it. The frontier is whatever survives as non-dominated on the axes you care about, and the tool's whole design is a rejection of the single scalar. Prism also lets you upload your own `benchmark_report_v0.2` YAML files and drop them into the same scatter, so your tuning runs become points in the same space as vendor-published numbers.

### InferenceBench

[InferenceBench](https://inferencebench.io/) is more explicit about the philosophy. It does not report single headline numbers. Every result is a tuple of throughput, latency, cost, energy, and quality, and comparison happens on the Pareto frontier across those axes. Its comparison output marks points that are on the frontier and annotates dominated points explicitly, so a point that loses on every axis is called out rather than hidden.

### NVIDIA Dynamo (DynoSim)

The same frontier-first logic appears in capacity planning before you even touch a cluster. NVIDIA Dynamo's DynoSim is a workload-driven discrete-event simulation that maps the throughput-latency Pareto frontier of a candidate serving stack before real-cluster validation. You sweep broadly, map the frontier, shortlist the promising candidates, and verify only those on real hardware. The frontier is the planning artifact, the single point is the afterthought.

## How to Actually Keep and Use the Frontier

Practical guidance falls out of all of this.

**Store the tuple, not the scalar.** Persist every benchmark trial with its full vector of metrics (TTFT, TPOT, TPS, and cost where it matters). This is what Optuna and Vizier already do, so it costs you nothing. It is the only way a later decision can query a frontier without a re-run.

**Prefer goodput at SLO over peak throughput.** Peak throughput is irrelevant if the tail latency that produces it blows past your service level. The throughput at which your SLO is still satisfied is the number that matters for production planning. This is the metric that respects the frontier rather than pretending one scalar settles it.

**Ask for the frontier, always.** When comparing serving engines or vendors, ask to see the non-dominated set, not one highlighted point. Annotate dominated points instead of deleting them, so the comparison records what lost and why.

### The Operating Spectrum by Persona

Because the frontier is a set, choosing an operating point means choosing a persona:

- **Voice / real-time**: TTFT under 80ms and TPOT under 20ms. Sacrifices peak throughput.
- **Interactive chat / copilot**: TTFT under 400ms and TPOT under 40ms. The balanced trade-off for reading speed.
- **Batch / document ETL**: latency is irrelevant, so the frontier point here maximizes tokens per dollar.

### Marginal Rate of Substitution

Moving along the frontier incurs an explicit cost captured by the marginal rate of substitution between the objectives:

$$
\text{MRS}_{\text{TPS}, \text{Latency}} = \frac{\partial f_{\text{TPS}}}{\partial f_{\text{Latency}}}
$$

The slope reveals diminishing returns. A steep region means small latency compromises buy large throughput gains. A flat region means accepting more latency buys almost nothing, which is the signature of hardware saturation or a memory-bandwidth bottleneck.

## Summary

1. **A single number lies about serving.** Serving is multi-objective, the objectives conflict, and a scalar is a lossy projection that hides the trade-off and invites reward hacking.
2. **Scalarization cannot recover the frontier.** Weighted-sum aggregation structurally misses concave regions of the trade-off, and every scalarization produces one point instead of the set you need.
3. **The frontier is the reportable artifact.** It is the set of non-dominated operating points, and the right point depends on the workload, so you keep the set, not the winner.
4. **Tuning tools already store the set.** Optuna and Google Vizier persist every trial's full value vector and derive the frontier by a dominance filter on demand. The set costs nothing to keep.
5. **Production systems present the frontier.** Prism, InferenceBench, and NVIDIA Dynamo all report the non-dominated set and let you choose the axes, because the single scalar is gone.

*This note and its interactive Pareto frontier simulator were co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*

<script type="module" src="/js/performance/pareto-frontier.js"></script>
<script type="module" src="/js/performance/scalar-tuner.js"></script>
