# Performance problem statements and benchmark design

Research date: 2026-10-25

Scope: primary sources for turning a performance concern into a benchmarkable problem statement, with emphasis on Brendan Gregg's methods and first-party performance-engineering guidance. The existing benchmark article was read for context, but it was not modified.

## Executive synthesis

A performance problem statement should connect five things: evidence of a problem, the user or system consequence, the workload that produces it, the environment in which it occurs, and the decision the measurement must support. This is a synthesis of Gregg's Problem Statement Method, Workload Characterization Method, and Performance Evaluation Steps. Gregg's checklist asks what indicates a problem, whether the system worked well before, what changed, how the degradation appears in latency or runtime, who is affected, and what software, hardware, versions, and configuration are involved. His evaluation sequence then adds system boundaries, services and outcomes, metrics, workload parameters, experimental factors, workload selection, experiment design, analysis, and presentation. [Brendan Gregg, “Performance Analysis Methodology”](https://www.brendangregg.com/methodology.html)

The benchmark is therefore an experiment in service of a decision, not a command invocation. Google SRE connects capacity to user-facing objectives, realistic traffic mix, load testing, resource consumption, and behavior beyond rated capacity. Microsoft Azure's first-party guidance makes the same structure explicit through measurable targets, performance and error budgets, acceptance criteria, production-like tests, baselines, and hypothesis-driven experiments. [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/) [Google SRE, “Launch Coordination Checklist”](https://sre.google/sre-book/launch-checklist/) [Microsoft Azure Well-Architected Framework, “Architecture strategies for performance testing”](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/performance-test)

## Fields for the problem statement

The following compact schema turns those methods into a usable pre-benchmark brief. The field names are a synthesis. The questions and relationships are grounded in the sources linked below.

| Field | What to record | Why it matters for the experiment |
| :--- | :--- | :--- |
| **Decision** | Capacity, regression, launch readiness, tuning, or overload behavior | Determines which scenarios, comparisons, and stopping rules are relevant. |
| **Evidence** | Observation, alert, complaint, trace, baseline, or forecast that indicates a problem | Prevents an arbitrary tool run from becoming the definition of the problem. |
| **User or system impact** | Affected user journey, request class, error/correctness effect, latency, or runtime symptom | Converts “slow” into a measurable service outcome. Google SRE recommends defining performance in terms that matter to the end user. |
| **History and change** | Whether the system previously met the expectation and what changed in software, hardware, configuration, topology, or load | Defines the comparison and candidate causal factors. |
| **Boundary** | Client, load balancer, server, dependency, or component being measured, plus the time window | Prevents server-only timing from being mistaken for end-to-end user experience. |
| **Workload** | Actors, request classes, code paths, payload or data distributions, state, arrival process, concurrency, bursts, retries, and background work | Defines what the system is actually being asked to do. |
| **Environment** | Version, hardware, topology, dependencies, resource limits, cache state, neighbors, and load-generator capacity | Makes the result reproducible and exposes conditions that can move the bottleneck. |
| **Hypothesis and factors** | Expected limiter, variables to vary, levels to test, and controlled variables | Turns the benchmark into an experiment rather than a collection of numbers. |
| **Success criteria** | SLI, threshold, good-event fraction, error budget, correctness rule, and overload behavior | Defines pass/fail and the capacity boundary before the result is known. |

Two additions are especially useful for capacity work. First, record **offered load and achieved load separately**. A saturated generator or a closed-loop client can reduce the load reaching the system and make a degraded target look healthy. Second, record the **expected limiting resource and its evidence**. Gregg's USE Method says to check utilization, saturation, and errors for every relevant resource, including software resources and imposed limits. [Brendan Gregg, “The USE Method”](https://www.brendangregg.com/usemethod.html)

## How the statement determines workload design

The fields should constrain the workload in a visible chain:

1. **Impact and decision define the scenarios.** If interactive reads, batch jobs, streaming responses, and degraded responses have different user consequences, model them as separate request classes or state the chosen mix. A single average request can hide the class that violates the objective.
2. **Evidence and history define the comparison.** A regression question needs the same workload and measurement boundary across versions. A capacity question needs a load sweep. An overload question needs points beyond the normal operating envelope.
3. **The workload field defines demand, not just rate.** Gregg's Workload Characterization Method asks who causes the load, why it is called, what the load is, and how it changes over time. The practical inputs are therefore actor or tenant mix, code path, request shape, payload or data distribution, cache state, arrival process, bursts, retries, and concurrency. [Brendan Gregg, “Performance Analysis Methodology”](https://www.brendangregg.com/methodology.html)
4. **The environment field defines experimental controls.** Google’s launch checklist calls out request types, traffic and bandwidth estimates, launch spikes, traffic mix, end-to-end load tests, capacity at maximum latency, dependencies, and timeout, retry, rate-limit, and error-handling behavior. Those are workload and system conditions, not incidental footnotes. [Google SRE, “Launch Coordination Checklist”](https://sre.google/sre-book/launch-checklist/)
5. **The hypothesis defines observability.** If CPU, memory, I/O, a queue, a dependency, or a software limit is suspected, collect the corresponding USE signals while the benchmark runs. Gregg's Active Benchmarking method recommends a long, steady run with other tools observing all involved components so the true limiter of the benchmark can be identified. [Brendan Gregg, “Active Benchmarking”](https://www.brendangregg.com/activebenchmarking.html)
6. **Success criteria define the result curve.** Report latency or runtime distributions, throughput, errors, resource signals, and correctness against the predeclared threshold. Microsoft recommends measurable goals, acceptance criteria, performance and error budgets, production-like conditions, and baseline comparisons. [Microsoft Azure Well-Architected Framework, “Architecture strategies for performance testing”](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/performance-test)

This gives a useful test of completeness: every important problem-statement field should change either the generated workload, the measurement, the controlled environment, the analysis signals, or the decision rule. If a field changes none of those, it is probably context rather than an experimental requirement.

## What a benchmark article can contribute

A practical benchmark article can make a contribution even when it introduces no new benchmark tool or algorithm. Its contribution can be a reusable mapping from a real performance question to:

- a problem statement with explicit boundaries and success criteria,
- a workload model that exposes request mix, cost, state, and arrival behavior,
- a reproducible protocol with versions, topology, warm-up, steady-state duration, and generator limits,
- active evidence that the benchmark measured the claimed target and identifies the limiting resource,
- a result format that reports offered load, achieved load, latency distribution, errors, resource saturation, and overload behavior, and
- a decision rule that says what the result permits someone to do next.

This is the practical distinction between a benchmark report and a bar chart. Gregg warns that passive benchmarking can produce statistically tidy numbers for the wrong target. Active benchmarking uses concurrent analysis to validate the target and explain why the result stopped where it did. Google SRE adds the operational decision context: use load testing to establish the resource-to-capacity ratio, account for traffic mix and launch spikes, and test graceful degradation or load shedding beyond rated capacity. [Brendan Gregg, “Active Benchmarking”](https://www.brendangregg.com/activebenchmarking.html) [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/)

The article’s durable value is therefore the protocol and interpretation layer. A reader should be able to substitute a different version, machine, request distribution, or arrival pattern and understand which conclusions still hold, which must be rerun, and which measurements would falsify the explanation.

## Primary sources

- [Brendan Gregg, “Performance Analysis Methodology”](https://www.brendangregg.com/methodology.html)
- [Brendan Gregg, “Active Benchmarking”](https://www.brendangregg.com/activebenchmarking.html)
- [Brendan Gregg, “The USE Method”](https://www.brendangregg.com/usemethod.html)
- [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/)
- [Google SRE, “Launch Coordination Checklist”](https://sre.google/sre-book/launch-checklist/)
- [Microsoft Azure Well-Architected Framework, “Architecture strategies for performance testing”](https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/performance-test)
