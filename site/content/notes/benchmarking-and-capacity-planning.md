---
title: "Benchmarking & Capacity Planning in Production Systems"
summary: |
  A systems engineering guide to benchmarking, capacity planning, and load testing: mapping real architectures to queuing models, identifying the operational knee, eliminating Coordinated Omission, and choosing between open and closed loop load generation.
image: /images/performance-fundamentals.png
tags: ["system design", "benchmarking", "load testing", "capacity planning", "distributed systems", "performance"]
date: 2026-08-24T23:30:00Z
draft: true
libraries: ["katex"]
---

Benchmarking production infrastructure is deceptively difficult. It is remarkably easy to run a load test tool, receive a clean report claiming a "p99 latency of 12ms at 10,000 RPS", and deploy to production only to suffer catastrophic outages under a fraction of that traffic.

Accurate capacity planning requires grounding load tests in queuing theory, understanding how system architectures map to queuing models, and eliminating critical measurement flaws like **Coordinated Omission**.

*(For mathematical derivations and queuing fundamentals, see [Performance Fundamentals](/notes/performance-fundamentals/) and [Queuing Theory for Systems Engineers](/notes/queuing-theory-for-systems-engineers/).)*

## Mapping Real Systems to Queuing Models

Every software component in a modern architecture behaves as a specific queuing system:

### 1. Single-Threaded Event Loops ($M/M/1$)

- **Examples**: Redis server process, Node.js V8 main loop, NGINX single-process core.
- **Behavior**: A single OS thread loops continuously, popping commands from an incoming socket buffer FIFO queue.
- **Capacity Dynamics**: Single-threaded execution has zero lock contention or thread context-switching overhead. However, a single slow operation ($O(N)$ Redis `KEYS *` or a heavy JSON parse in Node.js) blocks the entire server thread, triggering immediate Pollaczek–Khinchine Head-of-Line blocking for all subsequent requests.

### 2. Connection-Pooled Relational Databases ($M/M/c / K$)

- **Examples**: PostgreSQL / MySQL fronted by PgBouncer or HikariCP.
- **Behavior**: The database manages a fixed pool of $c$ execution worker backends (e.g. $c = 32$ connections). When all $c$ connections are busy, incoming queries wait in an application-side queue capped at capacity $K$.
- **Capacity Dynamics**: Governed by Little's Law ($N = \lambda \cdot W$). If average query latency increases from 5ms to 50ms due to database lock contention, sustaining 1,000 queries per second requires increasing active connections from 5 to 50. If the pool is capped at 32, the queue fills instantly ($K$ reached) and requests fail with connection timeout errors.

### 3. Multi-Worker HTTP Microservices ($G/G/c$)

- **Examples**: Go `net/http` goroutine pools, Java Spring Tomcat thread pools, Python Gunicorn workers.
- **Behavior**: Inbound requests exhibit arbitrary payload sizes and variable compute times ($G$) dispatched across $c$ worker threads or CPU cores ($c$).
- **Capacity Dynamics**: Subject to multi-server Erlang C queuing. Scaling worker instances out horizontally pools capacity, drastically shrinking queue wait times during transient traffic bursts.

## Finding the "Operational Knee" in Load Testing

When sweeping traffic load $\lambda$ during a benchmark, systems transition across three distinct operational zones:

1. **The Linear Zone ($\rho < 50\%$)**:
   - Latency remains flat at the baseline service time floor ($W \approx S$).
   - Throughput scales 1:1 with client request concurrency.
   - Hardware is under-utilized; queue depth is near zero.
2. **The Operational Knee ($\rho \approx 70\% - 80\%$)**:
   - The optimal operating target for production sizing.
   - Hardware achieves high utilization and cost efficiency while preserving sufficient headroom ($1 - \rho \approx 20\% - 30\%$) to absorb stochastic traffic spikes without queue backlog.
3. **The Saturation Cliff ($\rho \to 100\%$)**:
   - Worker duty cycle reaches 100%.
   - Latency diverges asymptotically along the hyperbolic curve ($W = \frac{S}{1 - \rho}$).
   - Client connection timeouts trigger retries, creating an amplification storm that drives the system into complete collapse.

## Coordinated Omission: The Silent Benchmark Killer

The most widespread flaw in production load testing is **Coordinated Omission**, a term coined by Gil Tene.

### How Naive Load Testers Hide Outliers

Consider a load testing tool configured to test a server with 1 virtual user sending requests:

1. At $t = 0.0\text{s}$, the tool sends Request 1. The server responds in $1\text{ms}$. Recorded latency: **$1\text{ms}$**.
2. At $t = 0.1\text{s}$, the tool sends Request 2. The server suffers a Garbage Collection pause or database lock and stalls for **$10.0\text{ seconds}$**. Recorded latency: **$10,000\text{ms}$**.
3. During that 10-second stall, the load tester sat blocked, waiting for Request 2's response before dispatching the next request.
4. The 100 other requests that *should* have been sent during those 10 seconds were never sent.

When the tool calculates percentiles across all recorded requests, it reports:
- Requests sent: 2
- $P_{50}$: $1\text{ms}$
- $P_{99}$: $10,000\text{ms}$ (1 outlier)

In reality, in production, 100 real clients were waiting during that stall, and all 100 experienced severe multi-second latency degradation. The benchmark coordinated with the server's stall, omitting the true backlog of suffering requests and reporting artificially optimistic percentiles.

### Fixing Coordinated Omission

To prevent Coordinated Omission:
- Use **open-loop, rate-corrected load testing tools** such as `wrk2`, `k6` (with `scenarios` and `constant-arrival-rate`), or `vegeta`.
- These tools schedule request dispatches according to independent target arrival timestamps ($t_{\text{target}}$) and compute total latency as:
  $$L_{\text{true}} = t_{\text{response\_received}} - t_{\text{target\_dispatch}}$$
  This explicitly includes the schedule delay incurred when the system was stalled.

## Open-Loop vs. Closed-Loop Load Models

When designing a benchmark, choosing between open-loop and closed-loop generation determines whether test results match production reality:

### Closed-Loop Model

```
[Virtual User] ──► Dispatches Request ──► Waits for Response ──► Sleep (Think Time) ──► Repeat
```

- **Characteristics**: The rate of new requests dispatched is throttled by the server's response time. If the server slows down, the client dispatches fewer requests per second.
- **When to Use**: Modeling internal single-user desktop workflows, batch workers pulling jobs from a single bounded worker queue.
- **Pitfall**: When used to benchmark web APIs, closed-loop tests mask queuing cliffs because a slow server automatically reduces incoming traffic load.

### Open-Loop Model

```
[Independent Internet Users] ──► Poisson Arrivals (λ req/s) ──► [Server System]
```

- **Characteristics**: Requests arrive at rate $\lambda(t)$ independent of how fast or slow the server is currently responding.
- **When to Use**: Modeling public web APIs, mobile applications, and multi-tenant distributed microservices.
- **Result**: If the server stalls, incoming requests continue to pile up in the queue, faithfully triggering the exact queue buildup and latency explosions seen in production incidents.

## Production Capacity Planning Checklist

1. **Determine Service Time Floor ($S = 1/\mu$)**: Measure uncontended $P_{50}$ latency under light load ($\rho < 10\%$) with network transit subtracted ($W_0$).
2. **Identify the Operational Knee**: Run an open-loop rate sweep (`wrk2` or `k6 constant-arrival-rate`) to pinpoint the throughput $\lambda_{\text{knee}}$ where latency first departs from the baseline floor.
3. **Size Target Peak Capacity**: Size steady-state peak infrastructure for $\rho_{\text{target}} \approx 70\% - 75\%$:
   $$c_{\text{required}} = \frac{\lambda_{\text{peak}}}{0.75 \cdot \mu}$$
4. **Size Connection and Thread Pools via Little's Law**:
   $$N_{\text{pool}} = \lambda_{\text{peak}} \cdot W_{P_{99}}$$
   Ensure connection pool limits match tail latency requirements to prevent connection exhaustion cascades.
5. **Set Defensive Client Timeouts**: Set client timeouts to $P_{99} + 3\sigma$ (or $3\times P_{90}$). Never let client timeouts exceed the server's queue retention limit, which wastes compute processing requests that clients have already abandoned.

## Summary

| Dimension | Closed-Loop Testing | Open-Loop Testing |
| :--- | :--- | :--- |
| **Arrival Process** | Dependent on server response time ($N_{\text{VUs}}$ fixed). | Independent Poisson arrival process ($\lambda$ fixed). |
| **Behavior Under Saturation** | Throughput artificially drops; queues remain bounded. | Queues explode asymptotically; reveals true production breaking point. |
| **Recommended Tooling** | Traditional `ab`, basic `wrk`. | `wrk2`, `k6` (`constant-arrival-rate`), `vegeta`. |

*This note was co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*
