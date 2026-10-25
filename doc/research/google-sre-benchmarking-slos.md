# Google SRE research for benchmarking and capacity planning

Research date: 2026-10-25

Scope: primary sources for rewriting the benchmark article around Google SRE practice. The sources below are Google SRE books and workbooks, or first-party documentation and source repositories for the load-generation tools discussed. The existing article was read for context, but it was not modified.

## Executive synthesis

Google SRE frames benchmarking as a way to establish whether a service can meet user-relevant service level objectives under a defined workload and capacity plan. The useful output is therefore not a single maximum requests-per-second number. It is a measured relationship among workload, resource consumption, latency and quality, with explicit behavior when the service is overloaded. Google’s production guidance says to validate forecasts against reality, use load testing to establish the resource-to-capacity ratio, account for launch spikes separately from steady state, and test graceful degradation beyond rated capacity. [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/)

The strongest rewrite should separate four things:

1. The user-facing SLI and its SLO.
2. The load model used to produce demand.
3. The resource and dependency limits that determine capacity.
4. The overload behavior that preserves as much user value as possible.

That structure is more faithful to Google SRE than presenting fixed latency multipliers as generally valid operating thresholds.

## SLI, SLO and SLA terminology

Google defines an SLI as a carefully defined quantitative measure of service level, an SLO as a target or range for an SLI, and an SLA as a separate agreement with users. Request latency, error rate and throughput are common SLIs, but Google cautions that the most directly user-relevant measure may be client-side latency while server-side latency is only a proxy. [Google SRE, “Service Level Objectives”](https://sre.google/sre-book/service-level-objectives/)

For an internal benchmark article, targets such as “99% of requests complete below 250 ms” should be called candidate SLOs unless they are contractual commitments. Calling them SLAs implies a business agreement and can blur the distinction Google SRE makes between measurement, target and response policy. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

Google SRE recommends expressing an SLI as a ratio of good events to total events. Examples include successful HTTP requests divided by total requests, or gRPC calls that complete below a latency threshold divided by all gRPC calls. This form makes the error budget and the unit of user impact explicit. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

For request-driven services, Google’s latency SLI is the proportion of requests faster than a defined threshold. Its worked API example treats 5xx responses as failures and defines latency as requests faster than configured thresholds. This is a useful SLO representation for a benchmark because it directly yields the number of slow or failed requests that consume budget. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

An SLO should specify the measurement conditions: aggregation window, population of requests, aggregation scope, measurement location and what counts as the response boundary. Google’s examples make these dimensions explicit, including a one-minute window, all backend servers and completion time. [Google SRE, “Service Level Objectives”](https://sre.google/sre-book/service-level-objectives/)

## User-impact-based SLOs

Google’s definition of an appropriate SLO is user-centered: above the threshold, almost all users should be happy with the service, and below it users are likely to complain or stop using it. Google also says that SLOs should ultimately be written in terms of user-centric actions and critical user journeys, such as searching, adding an item to a cart or completing a purchase. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

The user-facing measurement may need to move outward in the stack. Google’s production best-practices chapter gives a Gmail example where measuring availability and latency at the client, rather than only at the server, changed the assessed availability and led to client and server improvements. [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/)

Not all requests have the same user value or responsiveness expectation. Google recommends bucketing requests and applying different objectives when appropriate, such as separate objectives for premium and free customers or separate latency objectives for interactive page-blocking requests and CSV downloads. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

For the rewrite, workload classes should therefore be tied to user consequences. Examples include interactive reads, batch work, streaming first-token latency and token-generation latency, or degraded versus full-quality responses. The benchmark should report each class separately when their users care about different outcomes. This is an application of Google’s workload-bucketing guidance to the article’s web/database and inference examples.

## Latency SLIs and percentiles

Google SRE prefers percentiles to the arithmetic mean when latency distributions are skewed. The median emphasizes the typical case, while a high percentile such as p99 or p99.9 exposes a plausible worst-case region. Google notes that higher variance and queuing at high load make long-tail behavior more important to users. [Google SRE, “Service Level Objectives”](https://sre.google/sre-book/service-level-objectives/)

Percentiles should not be presented as a substitute for an SLO definition. Google’s SLO examples express latency as a proportion of requests below a threshold, for example “99% of requests complete in less than 100 ms.” The same source recommends multiple thresholds when the shape of the distribution matters, such as 90% below 1 ms, 99% below 10 ms and 99.9% below 100 ms. [Google SRE, “Service Level Objectives”](https://sre.google/sre-book/service-level-objectives/)

Google’s monitoring guidance explains the operational meaning of percentiles: p50, p95 and p99 reveal how much of the request population is too slow, whereas the mean only says that the average changed. [Google SRE, “Monitoring”](https://sre.google/workbook/monitoring/)

Google’s starter-SLO process is empirical. It calculates current availability and latency from production metrics, then rounds the observed values down to manageable targets. Its example turns observed p90 and p99 values into “90% below 450 ms” and “99% below 900 ms.” This supports using baseline measurements to propose an initial SLO, but it does not support universal multipliers such as “p99 must be four times service time.” [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

The rewrite should distinguish these concepts:

- A percentile is a summary of a latency distribution.
- A latency SLO is a target fraction of requests below one or more thresholds.
- An error budget is the allowed fraction of requests that miss the target.
- A benchmark result is only relevant if its request population, arrival process, measurement point and threshold match the intended SLO.

## Error budgets

Google defines an error budget as 1 minus the SLO. A 99.9% success SLO therefore permits 0.1% bad events in the chosen window. The workbook shows how to translate that fraction into an absolute number of allowed failures and how one incident consumes a corresponding share of the budget. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

The budget is a decision mechanism, not just a dashboard number. Google’s production guidance says that releases can continue while the service has budget remaining and that changes should be frozen, apart from urgent fixes, after the budget is spent. [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/)

Google recommends rolling windows when they better match user experience. A user does not forget a large outage merely because a calendar month changed, so the workbook recommends a rolling period with a stable number of weekends when that model fits the service. [Google SRE, “Implementing SLOs”](https://sre.google/workbook/implementing-slos/)

For benchmarking, the practical consequence is to report how many requests miss each latency or availability objective, not only the measured p99. A benchmark can then answer both “what was the tail?” and “how much of the SLO budget would this workload consume?”

## Capacity planning and overload

Google’s capacity-planning checklist has four directly relevant recommendations:

- Plan for a simultaneous planned and unplanned outage. Google describes this as N+2 capacity, with peak traffic handled by N instances, possibly in degraded mode, while the two largest instances are unavailable.
- Validate demand forecasts against reality until they consistently match.
- Use load testing rather than historical tradition to establish the resource-to-capacity ratio.
- Separate launch-day load from steady-state load because launches can attract abnormal traffic.

[Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/)

Google’s launch checklist adds the test dimensions that a benchmark plan should make visible: traffic and bandwidth estimates, launch spikes, traffic mix, end-to-end load tests, capacity per datacenter at maximum latency, impact on other services, storage capacity, failure of machines or clusters, and timeout, retry, rate-limit and error-handling behavior. [Google SRE, “Launch Coordination Checklist”](https://sre.google/sre-book/launch-checklist/)

Google warns against treating QPS as a complete capacity model. Requests can have very different resource costs, and the ratio between QPS and resource use can change after a software release or as traffic mix changes. Google recommends measuring capacity in available resources, such as CPU and memory, or in a normalized request cost based on resource consumption. [Google SRE, “Handling Overload”](https://sre.google/sre-book/handling-overload/)

The benchmark should therefore report at least offered load, achieved load, request mix, resource consumption, latency SLO compliance and overload behavior. For the inference example, token counts and phase mix are workload dimensions. For web/database systems, payload size, cache state, read/write mix and dependency calls are analogous dimensions. The source-backed principle is that demand must be connected to the resources it consumes, not represented by QPS alone.

Google treats graceful degradation and load shedding as part of reliability. Services should return reasonable but suboptimal results when possible, then shed load or return errors when degraded work is still too expensive. Google also warns that retries can amplify a small error rate into a cascading failure and recommends dropping some traffic upstream after total load exceeds capacity. [Google SRE, “A Collection of Best Practices for Production Services”](https://sre.google/sre-book/service-best-practices/) [Google SRE, “Handling Overload”](https://sre.google/sre-book/handling-overload/)

Google’s Auxon case study extends capacity planning beyond a static machine count. It describes collecting demand forecasts, allocating resources subject to location and dependency constraints, and encoding service intent so a new plan can be generated when demand, supply or requirements change. Performance metrics connect demand to lower-level resource use and can be derived from load testing and resource monitoring. [Google SRE, “Software Engineering in SRE”](https://sre.google/sre-book/software-engineering-in-sre/)

## Coordinated omission

Gil Tene’s `wrk2` README describes the failure mode precisely. The ordinary `wrk` model sends the next request on a connection only after the previous response arrives. When the server becomes slow, the load generator waits with it, so the measurement process avoids sampling the period in which the server is slow. `wrk2` calls this coordinated omission. [Gil Tene, `wrk2` README](https://github.com/giltene/wrk2)

The `wrk2` correction has two parts. It generates a constant-throughput schedule, and it records latency from the time a request was supposed to be transmitted according to that schedule, rather than only from the time transmission actually began. If a response arrives after later requests should have been sent, the resulting delay is reflected in the recorded distribution. [Gil Tene, `wrk2` README](https://github.com/giltene/wrk2)

The README also gives an important boundary condition: a fully asynchronous sender can avoid coordination by issuing requests without waiting, but this is not generally viable for blocking protocols or workloads with multiple serial request/response interactions per connection. `wrk2` instead retains the connection-oriented protocol model and uses the intended schedule in its latency accounting. [Gil Tene, `wrk2` README](https://github.com/giltene/wrk2)

HdrHistogram exposes both post-recording and at-recording correction. Its API documentation says that when a recorded value exceeds the expected interval between samples, it can add an auto-generated series of smaller values down to that interval. The documentation warns that the post-recording and at-recording methods are alternatives and should not both be applied to the same data. [HdrHistogram `AbstractHistogram` API](https://hdrhistogram.github.io/HdrHistogram/JavaDoc/org/HdrHistogram/AbstractHistogram.html)

For the article’s benchmark protocol, the source-backed rule is: if the test is intended to represent a fixed offered arrival rate, schedule arrivals independently of response completion and preserve the intended dispatch time in latency accounting. If the test is instead intended to model a fixed number of users waiting for each response, a closed loop is a valid model, but its throughput is allowed to fall as latency rises and its result must not be described as a constant-rate capacity test.

## Open-loop load generation

Grafana k6’s official documentation distinguishes the models directly. In a closed model, the next iteration starts only after the previous one finishes, so target response time controls the arrival rate. The documentation identifies this coupling as the coordinated-omission problem. In an open model, arrivals are independent of iteration completion. [Grafana k6, “Open and closed models”](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)

k6’s `constant-arrival-rate` executor schedules a fixed number of iterations per time unit independently of system response and is explicitly intended to represent a more accurate target RPS. It needs enough preallocated virtual users to sustain the rate. If resources are insufficient, iterations can be dropped, so dropped iterations and load-generator CPU and memory must be reported as test validity signals. [Grafana k6, “Constant arrival rate”](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/) [Grafana k6, “Arrival-rate VU allocation”](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/arrival-rate-vu-allocation/)

Envoy’s first-party Nighthawk documentation exposes a comparable `--open-loop` mode. Its stated behavior is that the benchmark client does not provide backpressure when resource limits are hit. That is useful evidence that “open loop” is a load-scheduling choice with an explicit risk: the generator can continue offering load while the target or the generator is unable to keep up. [Envoy Nighthawk README](https://github.com/envoyproxy/nighthawk)

The rewrite should use “open-loop” narrowly. It means that the arrival schedule is independent of response completion. It does not mean that the test is automatically realistic, that the generator has infinite capacity, or that every request will be transmitted successfully. The test must record scheduled arrivals, attempted sends, dropped or delayed starts, completed requests, failures and generator saturation.

## Rewrite recommendations for the existing article

1. Replace internal uses of “SLA” with “SLO” unless the text is describing a contractual commitment.
2. Recast fixed P50/P95/P99 service-time multipliers as article-specific heuristics or queueing-model hypotheses. Google SRE does not present those multipliers as universal SLO targets.
3. Define latency SLOs as good-event ratios, such as “99% of interactive requests complete below T,” and use p50, p95 and p99 as distribution summaries or multiple threshold objectives.
4. Derive initial thresholds from observed production or representative test data, then validate them against user behavior and critical user journeys.
5. Split SLOs by user-facing workload class when interactive, batch, streaming or degraded responses have different consequences.
6. Make the measurement point explicit. Prefer client or load-balancer measurements when server timing would omit material network or queueing delay.
7. Treat coordinated omission as a test-model error. Use an open-loop schedule for fixed offered-rate questions, or state clearly that a closed-loop result models a bounded-concurrency user population.
8. Tie capacity to resource consumption and dependency constraints, not only QPS. Include launch spikes, N+2 or equivalent failure tolerance, load-generator limits, overload behavior, retries and load shedding.
9. Report error-budget impact alongside percentile output. A p99 value alone does not say how many requests missed the objective or whether the result would consume the available budget.

## Primary sources

- [Google SRE, Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)
- [Google SRE Workbook, Implementing SLOs](https://sre.google/workbook/implementing-slos/)
- [Google SRE Workbook, Monitoring](https://sre.google/workbook/monitoring/)
- [Google SRE, A Collection of Best Practices for Production Services](https://sre.google/sre-book/service-best-practices/)
- [Google SRE, Handling Overload](https://sre.google/sre-book/handling-overload/)
- [Google SRE, Launch Coordination Checklist](https://sre.google/sre-book/launch-checklist/)
- [Google SRE, Software Engineering in SRE](https://sre.google/sre-book/software-engineering-in-sre/)
- [Gil Tene, `wrk2` README](https://github.com/giltene/wrk2)
- [HdrHistogram `AbstractHistogram` API](https://hdrhistogram.github.io/HdrHistogram/JavaDoc/org/HdrHistogram/AbstractHistogram.html)
- [Grafana k6, Open and closed models](https://grafana.com/docs/k6/latest/using-k6/scenarios/concepts/open-vs-closed/)
- [Grafana k6, Constant arrival rate](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/constant-arrival-rate/)
- [Envoy Nighthawk README](https://github.com/envoyproxy/nighthawk)
