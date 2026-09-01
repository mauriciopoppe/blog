---
title: "The Pareto Frontier in LLM Inference Serving"
summary: |
  Why a single performance number tells only part of the story in LLM serving, and when you need the whole Pareto frontier instead. Covers the limits of scalarization on concave trade-offs, how Optuna and Google Vizier actually store trial values (the frontier is derived, not persisted), and how production tools like Prism, InferenceBench, and NVIDIA Dynamo present the frontier as the reportable artifact.
image: /images/neural-network.jpeg
tags: ["machine learning", "system design", "inference serving", "pareto frontier", "multi-objective optimization", "optuna", "vizier"]
date: 2026-08-30T12:00:00Z
draft: true
series: "performance-series"
perf_stage: "optimization"
libraries: ["katex"]
mathTerms: ["llm", "systems"]
---

There is no best configuration for an inference server in general. A single number, a single "best" config, a single winner in a benchmark, is convenient and sometimes exactly what you want when the workload is fixed and known. The trouble starts when one scalar is asked to stand in for every workload at once. It leaves out the trade-off: for a given pair of objectives, there is usually a set of points, each good in a different way, and that set is called the Pareto frontier.

This note tells the story of that set. When a single scalar is enough and when it is not, why the frontier is often the artifact you should measure and keep, how tuning tools actually store the values that let you recover it, and how production systems present it to you.

*(For foundational queuing theory, latency breakdowns, and classical service metrics, see [Performance Fundamentals](/notes/performance-fundamentals/). For how to design and run the benchmarks themselves, see [Benchmarking & Capacity Planning](/notes/benchmarking-and-capacity-planning/).)*

## The Limits of a Single Number

Serving an LLM is a multi-objective problem. A single scalar is a lossy projection: collapsing the objectives to one number chooses, implicitly, which objective dominates the score, and the other trade-offs are hidden behind that choice. That is not a bug by itself. A scalar is the right tool when the workload is fixed and the objective is known, for example a batch pipeline that only cares about tokens per dollar. The limitations show up when one number is expected to represent configurations that serve very different workloads.

The relevant objectives conflict with one another. To maximize throughput you saturate the GPU with large batches, which drives up queueing delay. To minimize time to first token you keep batches small and idle compute during decode. To minimize inter-token latency you protect active decode streams, which steals cycles from prompt evaluation. Every one of these moves another number in the wrong direction.

Consider what a single benchmark number cannot tell you by itself:

- A **throughput number** (tokens per second) says nothing about whether any individual request met its latency target. Peak throughput is achievable while every tail latency breaks your service level.
- A **latency number** (P99 time to first token, P99 time per output token) says nothing about how many requests the system can carry while meeting it.
- A **"best config"** is only best for the objective the tuner was told to minimize, and that choice was made before the tuning started.

There is also an incentive problem worth naming: a benchmark reported as one scalar invites tuning toward that scalar, at the expense of every other objective. This is a known failure mode in leaderboard-style comparisons, and it is part of why some benchmarkers refuse to report a single headline number. The concern is real, and how strongly it applies depends on the benchmark. Many leaderboards are careful about it. The point is that the pressure exists whenever the score is a single number.

The scalar keeps the ranking you optimized for and drops the shape of the trade-off. When the next workload has different constraints, that dropped shape is exactly the part you need.

<div id="scalar-tuner"></div>

## Why Scalarization Cannot Recover the Frontier

The instinct when facing multiple objectives is to fold them into one. This is called scalarization, and the most common form is the weighted sum. Given objectives $f_1, f_2, \dots, f_k$, you minimize a weighted aggregate:

$$
g(\mathbf{x}) = \sum_{i=1}^{k} w_i f_i(\mathbf{x}), \quad \sum_{i=1}^{k} w_i = 1
$$

Pick weights, solve the single-objective problem, get one point. Change the weights, solve again, get another point. In theory, sweeping the weights traces out the trade-off surface.

In practice it does not always. The weighted sum can only reach points on the **convex** part of the frontier. If the frontier curves the other way, if it is concave in objective space, then no weight vector reaches points in that region. Those points are called unsupported or non-dominated but non-supported, and a weighted sum misses them by construction. This is a well-documented limitation of weighted-sum scalarization: for a concave front it cannot approximate the whole trade-off, no matter how finely you sweep the weights.

<div id="weighted-sum-demo"></div>

This is a structural reason why a single scalar gives an incomplete picture of serving performance. Two very different operating points can produce the same weighted value for one set of weights, and some balanced solutions can be unreachable through weighted aggregation. Note the boundaries of the claim: it applies to the weighted sum, and the practical impact depends on how concave the real frontier is. If the frontier is mostly convex, or if one objective clearly dominates your decision, a weighted sum can be a fine approximation.

Other scalarizations exist, such as [Tchebycheff (Chebyshev) scalarization](https://en.wikipedia.org/wiki/Multi-objective_optimization#Chebyshev_scalarization) and [$\varepsilon$-constraint methods](https://en.wikipedia.org/wiki/Multi-objective_optimization#%CE%B5-constraint_method), which can reach non-convex regions that the weighted sum cannot. But they share a common trait: each solve produces a single point, so the full picture requires solving repeatedly, and each solve bakes in the weights or constraints you chose.

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

Keeping the frontier means keeping a collection of trials or configurations, each with its full vector of objective values. It means resisting the pressure to pick one and discard the rest. The reason is practical: the right operating point changes with the workload, and you do not know the workload in advance. A batch ETL job and a real-time voice agent face the same hardware but want opposite corners of this plane. The frontier preserves both choices.

## The Frontier Is Derived, Not Stored

Now the practical question: if the frontier is what matters, how do automated tuning tools represent it? The answer is more subtle than the marketing suggests. Neither [Optuna](https://github.com/optuna/optuna) nor [Google Vizier](https://github.com/google/vizier) stores a frontier object. They store every trial with its full vector of objective values, and the frontier is **derived on demand** by a dominance filter every time you ask for it.

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

Each finished trial carries a full `values` tuple (here, the three metrics) alongside its `params`. That tuple is what gets persisted. There is no stored frontier. The moment you access [`study.best_trials`](https://github.com/optuna/optuna/blob/027f3b1fde2ecce4ae7f06993dc6e902addd71fa/optuna/study/study.py#L170), Optuna recomputes the non-dominated subset by comparing every trial's value vector against every other:

```python
pareto_trials = study.best_trials  # recomputed, not read from storage
print(f"Discovered {len(pareto_trials)} Pareto-optimal configurations:")
for trial in pareto_trials:
    print(f"Trial #{trial.number}: Values (TPS, TTFT, TPOT) = {trial.values}")
    print(f"  Params: {trial.params}")
```

[`plot_pareto_front`](https://github.com/optuna/optuna/blob/027f3b1fde2ecce4ae7f06993dc6e902addd71fa/optuna/visualization/_pareto_front.py#L40) does the same thing under the hood, filtering the full trial history for non-dominated points before rendering. The frontier is a query over the population, never a persisted object. The design decision is to keep every evaluation and treat the frontier as an ephemeral filter on top of it.

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

## Benchmarks Are Noisy: Building a Noise-Aware Evaluator

The tools above treat every trial measurement as ground truth. In practice, infrastructure benchmarks are not deterministic, and applying raw Pareto dominance to noisy numbers produces a polluted frontier.

### Practical Frontier Filtering: Noise Bands and Minimum Improvement Thresholds

Standard multi-objective optimization algorithms (such as NSGA-II) operate on clean, deterministic mathematical numbers. In production infrastructure, benchmarks are noisy. Network jitter, noisy neighbors on shared host hardware, variable prompt lengths, and GPU thermal throttling mean that two identical benchmark trials rarely report identical metrics.

As discussed in [Benchmarking & Capacity Planning for Systems Engineers](/notes/benchmarking-and-capacity-planning/), the first line of defense is running multiple trials per configuration and taking medians to dampen measurement variance.

When evaluating production candidates at scale, raw Pareto dominance tests need practical bounds. Consider a configuration where throughput is effectively unchanged, but TTFT improves by 0.5%:
- If 0.5% is within normal run-to-run jitter, treating it as a new Pareto point pollutes the frontier with measurement noise.
- Conversely, if TTFT improves by 6% while throughput fluctuates by a negligible 0.3%, the configuration represents a genuine engineering improvement and belongs on the frontier.

To separate true frontier advances from environmental noise, real-world evaluation pipelines layer two complementary parameters on top of the dominance query:

1. **A Noise Band ($\sigma\_{\text{noise}}$)**: Defines the equivalence threshold for environmental jitter. If two configurations differ on an objective by less than $\sigma\_{\text{noise}}$ (for example, $\pm 1\%$), they are treated as statistically tied on that metric rather than one strictly beating the other.
2. **A Minimum Percentage Improvement ($\delta\_{\text{min}}$)**: Defines the bar for a meaningful win. A candidate only claims a new spot on the frontier if it outperforms existing points by at least $\delta\_{\text{min}}$ (for example, $\ge 3\%$) on at least one objective while remaining within the noise band or better across all other objectives.

Formally, a candidate $\mathbf{x}\_A$ dominates $\mathbf{x}\_B$ under practical $(\sigma, \delta)$-filtering when:

$$
\forall i, \quad f_i(\mathbf{x}\_A) \le f_i(\mathbf{x}\_B) \cdot (1 + \sigma\_{\text{noise}}) \quad \text{and} \quad \exists j, \quad f_j(\mathbf{x}\_A) \le f_j(\mathbf{x}\_B) \cdot (1 - \delta\_{\text{min}})
$$

(for minimization objectives).

Wrapping standard HPO trial stores with a deterministic evaluator that enforces noise equivalence and minimum improvement thresholds keeps the resulting Pareto frontier sparse, robust, and actionable for engineering decisions.

The underlying ideas map to established work in noisy multi-objective optimization. The noise band corresponds to **$\varepsilon$-dominance** (Laumanns et al., 2002, cited above), which relaxes strict dominance with a fixed tolerance to prevent noise-driven false advances. The minimum improvement threshold is a practical variant of **$\alpha$-degree dominance** (surveyed in Batista et al., [*A comparison of dominance criteria in many-objective optimization problems*](https://doi.org/10.1109/CEC.2011.5949909), IEEE CEC 2011), where a candidate must exceed a margin to qualify as dominant. The academic formulations typically assume a known noise distribution and derive thresholds statistically. This is achievable in practice. As described in [Benchmarking & Capacity Planning for Systems Engineers](/notes/benchmarking-and-capacity-planning/), running $N \ge 3$ independent trials per configuration and computing the coefficient of variation ($C_v = \sigma / \mu$) per metric gives a data-driven noise band ($\sigma\_{\text{noise}} \approx C\_v$) and a principled lower bound for $\delta\_{\text{min}}$: any claimed improvement must exceed the measured $C\_v$ to be distinguishable from run-to-run variance. When that characterization is not available, a fixed operational percentage derived from knowledge of the environment is a reasonable starting point.

**Implementing this on top of Optuna or Vizier.** Neither [`study.best_trials`](https://github.com/optuna/optuna/blob/027f3b1fde2ecce4ae7f06993dc6e902addd71fa/optuna/study/study.py#L170) nor Vizier's `listOptimalTrials` RPC applies a noise band or minimum improvement threshold. Both use strict mathematical dominance, so a 0.1% improvement is enough to admit a new frontier member. To get noise-aware filtering, skip the built-in frontier query and apply your own dominance function over the raw completed trial list:

```python
import optuna

def noise_aware_dominates(a_values, b_values, baseline_values, sigma_noise, delta_min):
    """Return True if a dominates b under (sigma, delta)-filtering (minimization)."""
    # a must not be worse than b beyond the noise band on every objective
    no_worse = all(
        a <= b * (1 + sigma_noise)
        for a, b in zip(a_values, b_values)
    )
    # a must beat the baseline by at least delta_min on at least one objective
    meaningful_win = any(
        a <= base * (1 - delta_min)
        for a, base in zip(a_values, baseline_values)
    )
    return no_worse and meaningful_win

def noise_aware_pareto(trials, baseline_values, sigma_noise, delta_min):
    dominated = set()
    for i, t_a in enumerate(trials):
        for j, t_b in enumerate(trials):
            if i != j and noise_aware_dominates(
                t_a.values, t_b.values, baseline_values, sigma_noise, delta_min
            ):
                dominated.add(j)
    return [t for i, t in enumerate(trials) if i not in dominated]

# Query all completed trials and apply custom filter
all_trials = [t for t in study.trials if t.state == optuna.trial.TrialState.COMPLETE]
baseline_values = (baseline_tps, baseline_ttft_p99, baseline_tpot_p99)
frontier = noise_aware_pareto(all_trials, baseline_values, sigma_noise=0.01, delta_min=0.03)
```

The tools keep doing their job (suggesting configurations via NSGA-II, persisting every trial's full metric vector). The only replacement is the frontier-query step: `study.trials` instead of `study.best_trials`, then your own dominance filter on top.

**When this is worth the complexity.** Not every benchmarking workflow needs the full apparatus. A practical priority order:

1. **Multi-run medians first.** Running $N \ge 3$ independent trials per configuration and taking medians handles most of the noise problem before any dominance logic is involved. This is non-optional regardless of what comes next.
2. **Baseline grounding second.** Anchoring deltas to a fixed production baseline prevents cumulative drift and makes frontier results reportable as concrete percentages. This is worth doing even when noise bands are not.
3. **Noise band and minimum improvement threshold last.** These matter most when configurations are close (improvements in the 2–5% range), when the frontier is used for automated promotion decisions, or when the study runs for a long time with many trials. If a human reviews the frontier and discards obvious marginal points by eye, the custom filter is over-engineering.

**The agentic case changes the calculus.** A human reviewing a frontier once a week will naturally ignore 0.5% improvements as noise. An autonomous agent running a performance optimization loop **does not have that intuition**. Agentic systems that generate hypotheses (try a different batching strategy, adjust memory utilization, enable chunked prefill) and evaluate metrics programmatically can run **dozens of trials per hour**. The evaluation step is **deterministic** (given a configuration and a workload, the benchmarking harness produces a metric vector), but **the measurements themselves are noisy**. Without a noise-aware dominance check, the agent will **promote marginal improvements as genuine frontier advances**, waste exploration budget chasing false positives, and produce a cluttered frontier that is hard to act on. The noise-aware evaluator described above is the right interface between the agent's hypothesis loop and the Pareto frontier: it gives the agent a **clean, sparse set of genuinely better configurations** to report and branch from, rather than a noisy accumulation of marginal wins.

### Grounding Improvements Against a Fixed Baseline

A subtle failure mode in relative comparison rules is **accumulated drift** (caused by the intransitivity of noisy equivalence).

Consider what happens if candidate evaluation only compares points pairwise and sequentially against the latest admitted candidate:
1. Candidate $A$ is admitted as the best initial point.
2. Candidate $B$ is measured. It is within the noise tolerance of $A$ ($B \approx A - \varepsilon$), so it is also admitted.
3. Candidate $C$ is measured. It is within the noise tolerance of $B$ ($C \approx B - \varepsilon$), so it is admitted.

Chaining sequential relative comparisons creates a random walk. Over dozens of iterations, the frontier can drift toward configurations that are noticeably worse than $A$, because each step passed a small, relative tolerance check ($A \approx B$ and $B \approx C$, but $A \not\approx C$).

To prevent drift, percentage improvements must be **grounded against a fixed, reproducible baseline configuration $\mathbf{x}\_0$** (such as the default production configuration with all tuning levers disabled):

$$
\Delta_i(\mathbf{x}) = \frac{f_i(\mathbf{x}) - f_i(\mathbf{x}\_0)}{f_i(\mathbf{x}\_0)}
$$

Grounding deltas to an unmoving anchor $\mathbf{x}\_0$ provides three practical guarantees:
1. **No cumulative drift**: The improvement threshold is anchored to a static reference, preventing the scale from degrading across sequential trials.
2. **Stable scale across iterations**: A 5% TTFT reduction in trial 50 represents the exact same physical latency improvement as a 5% reduction in trial 1.
3. **Clear production reporting**: Every point on the final Pareto frontier can state its exact delta relative to the baseline (e.g. `+35% TPS, -15% TTFT, +2GB VRAM vs default`).

The intransitivity failure described above is not unique to benchmarking. Laumanns et al. (2002) identified the same problem in evolutionary multi-objective optimization and formalized $\varepsilon$-dominance as a grid-anchored relaxation of strict Pareto dominance, where the grid itself (not the current best candidate) acts as the fixed reference. See [Combining Convergence and Diversity in Evolutionary Multiobjective Optimization](https://doi.org/10.1162/106365602760234108), *Evolutionary Computation*, Vol. 10, No. 3, pp. 263–282.

## The Frontier in Production Tools

Production benchmarking tools do not report a single winner by default. They report a scatter of runs across multiple objectives and let the operator choose the axes that match the workload.

### Prism

[Prism](https://prism.llm-d.ai/) is the benchmarking dashboard for distributed inference from [llm-d](https://llm-d.ai/). It aggregates benchmark runs from disparate sources (cloud APIs, public repositories, local `llm-d-benchmark` reports) into a single scatter plot. The control that matters is the axis picker:

- **X-axis** selects among NTPOT, TPOT, TTFT, ITL, and E2E latency.
- **Y-axis** selects among output tokens, input tokens, total tokens, and QPS.

There is no default "best point." The user chooses the trade-off plane, and every benchmark run lands as a point in it. The frontier is whatever survives as non-dominated on the axes you care about. The design permits a single scalar, but it keeps the full tuple by default, leaving the choice of axis and point to the user. Prism also lets you upload your own `benchmark_report_v0.2` YAML files and drop them into the same scatter, so your tuning runs become points in the same space as vendor-published numbers.

### InferenceBench

[InferenceBench](https://inferencebench.io/) is more explicit about the philosophy. It does not report single headline numbers. Every result is a tuple of throughput, latency, cost, energy, and quality, and comparison happens on the Pareto frontier across those axes. Its comparison output marks points that are on the frontier and annotates dominated points explicitly, so a point that loses on every axis is called out rather than hidden.

### NVIDIA Dynamo (DynoSim)

The same frontier-first logic appears in capacity planning before you even touch a cluster. NVIDIA Dynamo's DynoSim is a workload-driven discrete-event simulation that maps the throughput-latency Pareto frontier of a candidate serving stack before real-cluster validation. You sweep broadly, map the frontier, shortlist the promising candidates, and verify only those on real hardware. The frontier is the planning artifact, and the final operating point is chosen from it once the workload is known.

## How to Actually Keep and Use the Frontier

Practical guidance falls out of all of this.

**Store the tuple, and choose the scalar when you need it.** Persist every benchmark trial with its full vector of metrics (TTFT, TPOT, TPS, and cost where it matters). This is what Optuna and Vizier already do, so it costs you nothing, and it leaves the scalar decision for later: you can always collapse the stored tuple into a single number when the workload is fixed, and you can still recover the frontier if it is not. Storing only the scalar forecloses that second option.

**Prefer goodput at SLO over peak throughput.** Peak throughput is irrelevant if the tail latency that produces it blows past your service level. The throughput at which your SLO is still satisfied is the number that matters for production planning. This is the metric that respects the frontier rather than pretending one scalar settles it.

**Ask for the frontier when the workload is uncertain.** When comparing serving engines or vendors across workloads you cannot fully predict, ask to see the non-dominated set, not one highlighted point. Annotate dominated points instead of deleting them, so the comparison records what lost and why.

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

1. **A single number tells part of the story.** It is the right tool when the workload and objective are fixed, but it is a lossy projection that hides the trade-off and creates an incentive to tune toward the scalar itself.
2. **Scalarization has blind spots.** Weighted-sum aggregation can miss concave regions of the trade-off, and any scalarization produces one point per solve, so recovering the set takes repeated solves.
3. **The frontier is the reportable artifact.** It is the set of non-dominated operating points, and the right point depends on the workload, so you keep the set, not the winner.
4. **The frontier is derived, not stored.** Optuna and Google Vizier persist every trial's full value vector and derive the frontier by a dominance filter on demand. The set costs nothing to keep.
5. **Infrastructure benchmarks are noisy; raw dominance is not enough.** A noise band defines measurement equivalence, a minimum improvement threshold defines a meaningful win, and both must be grounded against a fixed baseline to prevent cumulative drift across trials.
6. **Production tools report the frontier.** Prism, InferenceBench, and NVIDIA Dynamo all report the non-dominated set and let you choose the axes, because the single scalar is gone.

*This note and its interactive Pareto frontier simulator were co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*

<script type="module" src="/js/performance/scalar-tuner.js"></script>
<script type="module" src="/js/performance/weighted-sum-demo.js"></script>
