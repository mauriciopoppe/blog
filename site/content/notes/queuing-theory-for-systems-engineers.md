---
title: "Queuing Theory for Systems Engineers"
summary: |
  A practical, example-first guide to queuing theory in systems engineering: single-server M/M/1 response time and the 50% load paradox, the hockey stick latency curve, Pollaczek-Khinchine service variance, multi-server resource pooling (M/M/c), and capacity planning rules of thumb with interactive visualizers.
image: /images/hockey-stick-queue-theory.png
tags: ["system design", "performance", "queuing theory", "distributed systems", "math", "latency"]
date: 2026-08-24T23:00:00Z
favorite: true
series: "performance-series"
perf_stage: "queuing"
libraries: ["katex", "math-terms"]
mathTerms: ["queuing", "systems"]
interactive: true
---

In production systems, latency degradation rarely happens linearly. A service handling 5,000 requests per second with a 15ms response time might run smoothly all day, but an extra 5% traffic surge can suddenly spike tail latency from 15ms to 800ms.

This non-linear cliff is governed by **queuing theory** (the mathematical study of waiting lines).

*(For foundational metrics, latency breakdowns, and resource utilization, see [Performance Fundamentals](/notes/performance-fundamentals/).)*

The equations below begin with mean response time and mean queue wait. The later sections show how service-time variability and pooled workers affect those means, and why variance is also a warning sign for tail latency.

## Queueing Notation: Kendall's $A/S/c$

Before analyzing queue behavior, we need a compact way to describe the arrival process, service-time distribution, and number of parallel servers.

To classify different queuing architectures, queuing theory uses [**Kendall's Notation**](https://en.wikipedia.org/wiki/Kendall%27s_notation), introduced by David G. Kendall in 1953. This article uses the common three-field shorthand $A/S/c$ from the full $A/S/c/K/N/D$ notation. Unless a section says otherwise, we assume unlimited system capacity ($K = \infty$), an unlimited calling population ($N = \infty$), and FIFO queue discipline ($D = \text{FIFO}$):

$$A / S / c$$

- **$A$ (Arrival Process)**:
  - $M$ (*Markovian* / Memoryless): Random Poisson arrivals ($\lambda$).
  - $D$ (*Deterministic*): Fixed, clockwork intervals (e.g. cron schedule).
  - $G$ (*General*): Arbitrary arrival distribution.
- **$S$ (Service Time Distribution)**:
  - $M$ (*Exponential* / Memoryless): Randomly distributed task execution times.
  - $D$ (*Deterministic*): Fixed, constant execution time for every job (e.g. exactly 10ms).
  - $G$ (*General*): Arbitrary or high-variance execution times (e.g. fast cache hits mixed with slow database scans).
- **$c$ (Number of Parallel Servers)**: Count of independent worker threads or CPU cores.

We start with the single-worker $M/M/1$ model, then change one assumption at a time to show the effects of service-time variance and pooled workers.

## The M/M/1 Baseline: The Anatomy of Waiting

The baseline has one server, Poisson arrivals, exponential service times, and a FIFO queue. To make it concrete, the derivation below uses a single worker thread where each task takes an average service execution time of **$S = 10\text{ ms}$**, giving a maximum capacity of $\mu = \frac{1}{S} = 100\text{ req/s}$. A Poisson client workload of **$\lambda = 50\text{ req/s}$** gives **50% utilization** ($\rho = \frac{\lambda}{\mu} = 0.5$). The examples use these values, while the equations remain parameterized by $\lambda$, $S$, and $\rho$.

### Clockwork vs. Random Bursts

In a perfectly synchronized system where requests arrive on a rigid, clockwork cadence (say, exactly one request every $20\text{ ms}$), the worker finishes each $10\text{ ms}$ task, rests for $10\text{ ms}$, and is always idle when the next request lands. Average queue wait is zero ($W_q = 0\text{ ms}$).

In real systems, requests arrive **stochastically in random bursts** (a Poisson arrival process). Because thousands of independent client browsers click buttons without coordinating with each other, arrivals naturally clump together in time. Even when average traffic is low (say, 50 req/s on average), 4 requests can randomly land within the exact same 5ms window, forcing 3 of them to wait in line.

### What Happens When You Arrive: The Coin-Flip Model

When an incoming request arrives at a server with utilization $\rho = \frac{\lambda}{\mu}$, how many existing requests ($k$) will it find ahead of it?

Think of arriving at the server as a sequential coin-flip game where each flip lands on *"Yes, a request is present"* with probability $\rho$, and *"No, the line stops here"* with probability $1 - \rho$:

- **$k = 0$ jobs (Server Idle)**: With probability $1 - \rho$, the worker is free. The request begins execution immediately with $0\text{ ms}$ queue wait.
- **$k = 1$ job (Worker Busy)**: With probability $(1 - \rho)\rho$, exactly 1 job is executing. Due to the memoryless property of exponential service times, it still has an average of $S$ remaining. The incoming request waits $S$.
- **$k = 2$ jobs (Worker Busy + 1 Queued)**: With probability $(1 - \rho)\rho^2$, 1 job is executing and 1 is queued. The incoming request waits $2 \times S$.
- **$k = 3$ jobs (Worker Busy + 2 Queued)**: With probability $(1 - \rho)\rho^3$, 1 job is executing and 2 are queued. The incoming request waits $3 \times S$.

In general, for any count $k \ge 0$, the probability of finding exactly $k$ requests ahead in line is:

$$
P(N = k) = (1 - \rho)\rho^k
$$

Summing the expected number of requests in the system gives the average number in the system ($L$):

$$
L = \sum_{k=0}^\infty k \cdot P(N = k) = (1 - \rho) \sum_{k=0}^\infty k \rho^k
$$

To evaluate $\sum_{k=0}^\infty k \rho^k$, differentiate the standard geometric series with respect to $\rho$:

$$
\begin{aligned}
\sum_{k=0}^\infty \rho^k &= \frac{1}{1 - \rho} \\\\
\frac{d}{d\rho} \left( \sum_{k=0}^\infty \rho^k \right) &= \frac{d}{d\rho} \left( \frac{1}{1 - \rho} \right) \\\\
\sum_{k=1}^\infty k \rho^{k-1} &= \frac{1}{(1 - \rho)^2} \\\\
\sum_{k=0}^\infty k \rho^k &= \frac{\rho}{(1 - \rho)^2}
\end{aligned}
$$

Substituting this series back into $L$:

$$
L = (1 - \rho) \cdot \frac{\rho}{(1 - \rho)^2} = \frac{\rho}{1 - \rho}
$$

This includes the request in service. The average number waiting in the queue is $L_q = L - \rho = \frac{\rho^2}{1 - \rho}$.

An arriving request waits for the remaining work from the $k$ requests it finds in the system. With exponential service, the expected remaining work for each request is $S$, so:

$$
W_q = \sum_{k=0}^{\infty} (k \cdot S) \cdot P(N = k) = \frac{\rho \cdot S}{1 - \rho}
$$

Total server response time ($W$) is the queue wait plus execution time ($S$):

$$
W = W_q + S = \frac{\rho \cdot S}{1 - \rho} + S = \frac{S}{1 - \rho}
$$

### Worked Application ($\lambda = 50\text{ req/s}$, $S = 10\text{ ms}$)

Applying the formulas to our baseline worker handling $\lambda = 50\text{ req/s}$ with service time $S = 10\text{ ms}$ (service capacity $\mu = 100\text{ req/s}$, utilization $\rho = \frac{\lambda}{\mu} = 0.50$):

| Jobs ($k$) | Wait ($k \cdot S$) | Probability ($P_k$) | Contribution |
| :--- | :--- | :--- | :--- |
| $k = 0$ (Idle) | $0\text{ ms}$ | $(1 - 0.5) \cdot 0.5^0 = 0.50$ (50%) | $0\text{ ms} \times 0.50 = \mathbf{0\text{ ms}}$ |
| $k = 1$ | $10\text{ ms}$ | $(1 - 0.5) \cdot 0.5^1 = 0.25$ (25%) | $10\text{ ms} \times 0.25 = \mathbf{2.5\text{ ms}}$ |
| $k = 2$ | $20\text{ ms}$ | $(1 - 0.5) \cdot 0.5^2 = 0.125$ (12.5%) | $20\text{ ms} \times 0.125 = \mathbf{2.5\text{ ms}}$ |
| $k = 3$ | $30\text{ ms}$ | $(1 - 0.5) \cdot 0.5^3 = 0.0625$ (6.25%) | $30\text{ ms} \times 0.0625 = \mathbf{1.875\text{ ms}}$ |
| $k = 4$ | $40\text{ ms}$ | $(1 - 0.5) \cdot 0.5^4 = 0.03125$ (3.125%) | $40\text{ ms} \times 0.03125 = \mathbf{1.25\text{ ms}}$ |
| $k \ge 5$ (tail) | $\ge 50\text{ ms}$ | $\sum_{k=5}^{\infty} P_k = 0.03125$ (3.125%) | $\sum_{k=5}^{\infty} kS P_k = \mathbf{1.875\text{ ms}}$ |
| **Total Average** | - | **$\sum P = 1.0$ (100%)** | **$W_q = \mathbf{10\text{ ms}}$** |

Evaluating the closed-form results:
- **Expected Number in System**: $L = \frac{0.50}{1 - 0.50} = \mathbf{1.0\text{ request}}$
- **Expected Queue Length**: $L_q = \frac{0.50^2}{1 - 0.50} = \mathbf{0.5\text{ request}}$
- **Expected Queue Wait**: $W_q = 1.0 \times 10\text{ ms} = \mathbf{10\text{ ms}}$
- **Total Latency**: $W = \frac{10\text{ ms}}{1 - 0.50} = \mathbf{20\text{ ms}}$
- **Little's Law Check**: $L = \lambda \cdot W = 50\text{ req/s} \times 0.020\text{ s} = \mathbf{1.0\text{ request}}$

### The 50% Load Paradox: Why Does Latency Double?

At 50% utilization ($\rho = 0.50$), the M/M/1 equation gives **$W = 2S$**. Half of arriving requests find the worker idle, while the other half arrive during busy periods and wait for the burst to clear. The average queue wait is therefore one service time ($W_q = S$), equal to the time spent executing the request itself.

<div id="coin-flip-simulator"></div>

### The Non-Linear Latency Penalty: The Hockey Stick Curve

Because $W = \frac{S}{1 - \rho}$, response time scales with the hyperbolic multiplier $\frac{1}{1 - \rho}$. This causes latency to remain relatively flat across light and moderate loads before shooting upward asymptotically near capacity:

<div id="hockey-stick-explorer"></div>

Applying Little's Law strictly to the waiting queue buffer ($L_q = \lambda \cdot W_q$) with arrival rate $\lambda = \frac{\rho}{S}$ and queue wait $W_q = \frac{\rho \cdot S}{1 - \rho}$:

$$
L_q = \lambda \cdot W_q = \left(\frac{\rho}{S}\right) \cdot \left(\frac{\rho \cdot S}{1 - \rho}\right) = \frac{\rho^2}{1 - \rho}
$$

For this single-server baseline, target utilization ($\rho$) translates directly into queue wait measured in task durations:

| Utilization ($\rho$) | Multiplier ($\frac{\rho}{1-\rho}$) | Wait ($W_q$) | Total ($W$) | Operating State |
| :--- | :--- | :--- | :--- | :--- |
| **0%** | $0.0\times$ | **$0 \times S$** ($0\text{ ms}$) | **$1.0\times$** ($10\text{ ms}$) | **Idle**: Zero contention, requests execute immediately. |
| **50%** | $1.0\times$ | **$1 \times S$** ($10\text{ ms}$) | **$2.0\times$** ($20\text{ ms}$) | **Safe Zone**: Wait time equals one task duration ($W_q = S$). |
| **75%** | $3.0\times$ | **$3 \times S$** ($30\text{ ms}$) | **$4.0\times$** ($40\text{ ms}$) | **The Operational Knee**: Maximum safe steady-state target. |
| **90%** | $9.0\times$ | **$9 \times S$** ($90\text{ ms}$) | **$10.0\times$** ($100\text{ ms}$) | **The Saturation Cliff**: Queue wait accounts for 90% of total latency. |
| **99%** | $99.0\times$ | **$99 \times S$** ($990\text{ ms}$) | **$100.0\times$** ($1,000\text{ ms}$) | **Catastrophic Meltdown**: Buffers overflow and tail latency collapses. |

M/M/1 is useful as a first approximation when one worker or resource is the dominant bottleneck and average arrival and service behavior are enough to establish a capacity target. Many production queues need a richer model because arrivals are bursty, service times vary, workers are pooled, requests have different classes, or scheduling and admission policies affect who waits.

## Extending the M/M/1 Baseline

The next sections change one assumption at a time. Service-time variance leads to M/G/1, while pooled workers lead to M/M/c. The table places these models in the same vocabulary before we study their effects:

| Model | System Architecture | Real-World Production Example |
| :--- | :--- | :--- |
| **$M/M/1$** | Single worker processing Poisson arrivals with memoryless execution time. | Single-threaded in-memory databases (Redis event loop, Node.js main thread). |
| **$M/D/1$** | Poisson arrivals with constant, deterministic processing time. | Fixed-size packet hashing, ASIC cryptographic hardware verification. |
| **$M/G/1$** | Poisson arrivals with high-variance, arbitrary service times. | Relational database queries (fast primary-key lookups mixed with unindexed table scans). |
| **$G/G/1$** | General arrivals and arbitrary service times at one worker or resource pool. | A workload with bursty arrivals and variable request sizes and service times. |
| **$M/M/c$** | Shared FIFO queue dispatched across $c$ identical parallel worker threads. | Multi-threaded thread pool, web server worker processes (Gunicorn, Puma, Go worker pool). |
| **$G/G/c$** | Bursty general arrivals across $c$ parallel workers with arbitrary execution times. | General multi-tier microservice architecture under real-world internet traffic. |

$G/G/1$ is the general single-center model. The first $G$ allows request arrivals to have any measured pattern, the second $G$ allows service times to have any measured distribution, and $1$ means that one worker or coupled resource group handles the work. This model matches real systems more closely than $M/M/1$, but it does not come with the same simple closed-form wait-time equation. It is useful for measurement and simulation, while $M/M/1$ and $M/G/1$ remain useful approximations when their assumptions are reasonable.

### The Variance Penalty: Why Average Service Time Lies ($M/G/1$)

In the real world, execution times are rarely identical. Consider two different API services running on identical 100 req/s single-core workers at 80% utilization ($\lambda = 80\text{ req/s}, \mu = 100\text{ req/s}, S = 10\text{ ms}, \rho = 0.80$).

On a standard $M/M/1$ worker, the average queue wait time at 80% load is **$40\text{ ms}$**:

$$W_{q, M/M/1} = \frac{\rho \cdot S}{1 - \rho} = \frac{0.80 \cdot 10\text{ ms}}{1 - 0.80} = \mathbf{40\text{ ms}}$$

Now compare what happens when service execution times change:

- **Service A (Deterministic)**: Every request is a fixed-size cryptographic token validation that takes exactly $10\text{ ms}$.
- **Service B (High Variance)**: 90% of requests are fast $1\text{ ms}$ cache lookups, but 10% are heavy $91\text{ ms}$ unindexed database queries. **Average service time is still exactly $10\text{ ms}$** ($(0.90 \times 1\text{ ms}) + (0.10 \times 91\text{ ms}) = 10\text{ ms}$).

In a single-worker queue, waiting in line is caused by two separate sources of randomness: **when requests arrive** (arrival jitter) and **how long requests take to execute** (service jitter). A service with variable execution times can make the second source much larger even when its average service time stays the same.

**Head-of-line blocking** occurs because requests share a single FIFO queue. When a 91ms heavy query enters execution, it holds the worker while several fast 1ms requests that arrive behind it wait in line.

#### The Pollaczek–Khinchine (P-K) Formula

To quantify execution time spread, we use the **Coefficient of Variation ($C_v$)**, defined as the standard deviation of service time ($\sigma$) divided by the mean service time ($S$):

$$C_v = \frac{\sigma}{S}$$

- **$C_v = 0$ (Deterministic)**: Every task takes the exact same duration ($\sigma = 0$).
- **$C_v = 1$ (Exponential / $M/M/1$)**: Standard random variance where $\sigma = S$.
- **$C_v > 1$ (High Variance / Bimodal)**: Fast tasks mixed with heavy tail outliers ($\sigma > S$).

The mathematical relationship between service time variance and queue wait time is governed by the **Pollaczek–Khinchine (P-K) formula** ($M/G/1$):

$$
W_q = \underbrace{\left(\frac{\rho \cdot S}{1 - \rho}\right)}\_{\text{Baseline } M/M/1 \text{ Wait}} \times \underbrace{\left(\frac{1 + C_v^2}{2}\right)}\_{\text{Variance Multiplier}}
$$

Applying the variance multiplier to our baseline and the two services makes the comparison concrete:

1. **Service A (Deterministic Execution, $C_v = 0$)**:
   $$\frac{1 + 0}{2} = 0.5 \implies W_q = 0.5 \times 40\text{ ms} = \mathbf{20\text{ ms}} \quad (\text{Service A})$$
   When every task takes the exact same time, queue wait time is **cut in half**.
2. **Baseline (Exponential Execution, $C_v = 1$)**:
   $$\frac{1 + 1^2}{2} = 1.0 \implies W_q = 1.0 \times 40\text{ ms} = \mathbf{40\text{ ms}} \quad (\text{Baseline } M/M/1)$$
3. **Service B (High-Variance Execution, $C_v = 2.7$)**:
   For Service B, the weighted variance is $0.90(1 - 10)^2 + 0.10(91 - 10)^2 = 729\text{ ms}^2$, so $\sigma = \sqrt{729} = 27\text{ ms}$ and $C_v = \frac{27}{10} = 2.7$.
   $$\frac{1 + 2.7^2}{2} = 4.145 \implies W_q = 4.145 \times 40\text{ ms} \approx \mathbf{166\text{ ms}} \quad (\text{Service B})$$
   This distribution inflates queue wait time by about **$4.15\times$ over baseline** and **$8.3\times$ over deterministic execution**.

The calculation gives Service A an expected queue wait of **$20\text{ ms}$** and Service B an expected queue wait of **about $166\text{ ms}$**. The difference comes from the spread of service times, not from their shared $10\text{ ms}$ average.

This animation makes that distinction visible. Both services receive the same stochastic arrivals, while Service A uses fixed 10ms jobs and Service B samples the high-variance 1ms/91ms mixture. The moving line scans one precomputed 1-second window. `Run 100s` advances the engine through 100 seconds, pauses at the new window, and updates the cumulative mean wait so we can compare the observed waits for the two services after a longer run.

<div id="variance-queue-simulator"></div>

#### Systems Engineering Takeaway: Isolate Variance

The P-K formula shows why fast, interactive workloads can suffer when they share an unpartitioned FIFO queue with slow, unpredictable batch operations:

- **Separate Queues by Workload**: Route fast queries to read replicas and heavy analytical scans to a dedicated offline worker pool.
- **Enforce Strict Execution Timeouts**: Reject or preempt queries that exceed $3\sigma$ of expected service time.
- **Chunk Heavy Jobs**: Break large $100\text{ms}$ jobs into ten $10\text{ms}$ sub-tasks to bound $C_v \to 0$.

### The Power of Resource Pooling: 1 Queue vs. Many Queues ($M/M/c$)

Now consider scaling up from 1 worker to $c$ parallel workers handling an aggregate arrival rate $\lambda$.

Compare two designs handling 320 req/s across 4 workers:

- **Design A (4 Isolated Single-Worker Queues, $4 \times M/M/1$)**: Incoming traffic is split (e.g. by round-robin DNS or static hashing). Each worker has its own private queue and receives 80 req/s on 1 core ($\rho = 0.80$, 80% load).
- **Design B (1 Pooled Shared Queue, $1 \times M/M/4$)**: All 320 req/s enter a single shared FIFO queue. Whichever worker finishes its job first immediately pulls the next request from the queue.

Design A can leave capacity unused when a burst is routed to one queue. Design B lets any available worker take the next request from the shared queue. The diagram shows the same burst at one moment: Design A has a private backlog on one worker while another worker is idle, whereas Design B dispatches the waiting work to the first available core.

<div style="display: flex; justify-content: center; margin: 2rem 0;">
<svg viewBox="0 0 880 460" width="100%" style="max-width: 880px; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid rgba(255, 255, 255, 0.08);">
  <defs>
    <marker id="pool-arrow-gray" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--grey-light)" />
    </marker>
    <marker id="pool-arrow-orange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ffa726" />
    </marker>
    <marker id="pool-arrow-green" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#81c784" />
    </marker>
    <marker id="pool-arrow-primary" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgb(var(--primary))" />
    </marker>
  </defs>
  <!-- TOP PANEL: Design A (4 Isolated Queues) -->
  <text x="25" y="30" fill="var(--grey-lighter)" font-size="14" font-weight="700">Design A: 4 Isolated Single-Worker Queues (4 × M/M/1)</text>
  <!-- Ingress Box (Design A) -->
  <rect x="25" y="52" width="130" height="142" rx="6" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="90" y="85" fill="rgb(var(--primary))" font-size="13" font-weight="700" text-anchor="middle">Traffic Ingress</text>
  <text x="90" y="105" fill="var(--grey-lighter)" font-size="12" text-anchor="middle">320 req/s</text>
  <text x="90" y="145" fill="var(--grey-light)" font-size="11" text-anchor="middle">Static Hash / DNS</text>
  <text x="90" y="162" fill="var(--grey-light)" font-size="11" text-anchor="middle">(80 req/s each)</text>
  <!-- Ingress Arrows (Design A) -->
  <path d="M 155 80 L 195 62" stroke="var(--grey)" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-gray)" />
  <path d="M 155 102 L 195 97" stroke="var(--grey)" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-gray)" />
  <path d="M 155 125 L 195 132" stroke="var(--grey)" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-gray)" />
  <path d="M 155 147 L 195 167" stroke="var(--grey)" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-gray)" />
  <!-- Worker 1: Congested -->
  <rect x="200" y="48" width="150" height="28" rx="4" fill="rgba(255, 167, 38, 0.15)" stroke="#ffa726" stroke-width="1" />
  <text x="275" y="67" fill="#ffa726" font-size="12" font-weight="600" text-anchor="middle">Queue: 4 Waiting (Blocked!)</text>
  <line x1="350" y1="62" x2="375" y2="62" stroke="#ffa726" stroke-width="1.5" marker-end="url(#pool-arrow-orange)" />
  <rect x="380" y="48" width="125" height="28" rx="4" fill="rgba(var(--primary), 0.2)" stroke="rgba(var(--primary), 0.5)" stroke-width="1" />
  <text x="442" y="67" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Worker 1: Busy</text>
  <!-- Worker 2: Normal -->
  <rect x="200" y="83" width="150" height="28" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="275" y="102" fill="var(--grey-light)" font-size="12" text-anchor="middle">Queue: 1 Waiting</text>
  <line x1="350" y1="97" x2="375" y2="97" stroke="var(--grey)" stroke-width="1.5" marker-end="url(#pool-arrow-gray)" />
  <rect x="380" y="83" width="125" height="28" rx="4" fill="rgba(var(--primary), 0.2)" stroke="rgba(var(--primary), 0.5)" stroke-width="1" />
  <text x="442" y="102" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Worker 2: Busy</text>
  <!-- Worker 3: IDLE WASTE -->
  <rect x="200" y="118" width="150" height="28" rx="4" fill="rgba(129, 199, 132, 0.08)" stroke="rgba(129, 199, 132, 0.4)" stroke-width="1" stroke-dasharray="3 2" />
  <text x="275" y="137" fill="#81c784" font-size="12" font-weight="600" text-anchor="middle">Queue: Empty (Wasted!)</text>
  <line x1="350" y1="132" x2="375" y2="132" stroke="#81c784" stroke-width="1.5" marker-end="url(#pool-arrow-green)" />
  <rect x="380" y="118" width="125" height="28" rx="4" fill="rgba(129, 199, 132, 0.15)" stroke="#81c784" stroke-width="1" />
  <text x="442" y="137" fill="#81c784" font-size="12" font-weight="700" text-anchor="middle">Worker 3: IDLE</text>
  <!-- Worker 4: Normal -->
  <rect x="200" y="153" width="150" height="28" rx="4" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="275" y="172" fill="var(--grey-light)" font-size="12" text-anchor="middle">Queue: 0 Waiting</text>
  <line x1="350" y1="167" x2="375" y2="167" stroke="var(--grey)" stroke-width="1.5" marker-end="url(#pool-arrow-gray)" />
  <rect x="380" y="153" width="125" height="28" rx="4" fill="rgba(var(--primary), 0.2)" stroke="rgba(var(--primary), 0.5)" stroke-width="1" />
  <text x="442" y="172" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Worker 4: Busy</text>
  <!-- Design A Summary Badge -->
  <rect x="535" y="52" width="320" height="129" rx="6" fill="var(--grey-dark)" stroke="#ffa726" stroke-width="1" stroke-dasharray="3 2" />
  <text x="695" y="80" fill="#ffa726" font-size="13" font-weight="700" text-anchor="middle">Unbalanced Queues</text>
  <text x="695" y="104" fill="var(--grey-lighter)" font-size="12" text-anchor="middle">Worker 3 sits idle while Worker 1 stalls.</text>
  <text x="695" y="124" fill="var(--grey-light)" font-size="11.5" text-anchor="middle">Random client bursts cause isolated backlogs.</text>
  <text x="695" y="158" fill="#ffa726" font-size="14" font-weight="700" text-anchor="middle">Average Queue Wait: 40ms</text>
  <!-- Divider Line -->
  <line x1="25" y1="210" x2="855" y2="210" stroke="rgba(255, 255, 255, 0.1)" stroke-width="1" stroke-dasharray="4 3" />
  <!-- BOTTOM PANEL: Design B (1 Pooled Shared Queue) -->
  <text x="25" y="238" fill="#81c784" font-size="14" font-weight="700">Design B: 1 Pooled Shared Queue (1 × M/M/4)</text>
  <!-- Ingress Box (Design B) -->
  <rect x="25" y="258" width="130" height="142" rx="6" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="90" y="315" fill="rgb(var(--primary))" font-size="13" font-weight="700" text-anchor="middle">Traffic Ingress</text>
  <text x="90" y="335" fill="var(--grey-lighter)" font-size="12" text-anchor="middle">320 req/s</text>
  <text x="90" y="365" fill="var(--grey-light)" font-size="11" text-anchor="middle">All requests enter</text>
  <text x="90" y="380" fill="var(--grey-light)" font-size="11" text-anchor="middle">single buffer</text>
  <!-- Ingress Arrow to Shared Queue -->
  <line x1="155" y1="329" x2="195" y2="329" stroke="rgb(var(--primary))" stroke-width="2" marker-end="url(#pool-arrow-primary)" />
  <!-- Central Shared Queue -->
  <rect x="200" y="258" width="160" height="142" rx="6" fill="var(--grey-dark)" stroke="rgba(var(--primary), 0.5)" stroke-width="1.5" stroke-dasharray="3 2" />
  <text x="280" y="282" fill="rgb(var(--primary))" font-size="13" font-weight="700" text-anchor="middle">Shared FIFO Queue</text>
  <rect x="215" y="296" width="30" height="28" rx="4" fill="rgba(var(--primary), 0.35)" stroke="rgba(var(--primary), 0.6)" stroke-width="1" />
  <text x="230" y="315" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">J3</text>
  <rect x="250" y="296" width="30" height="28" rx="4" fill="rgba(var(--primary), 0.35)" stroke="rgba(var(--primary), 0.6)" stroke-width="1" />
  <text x="265" y="315" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">J2</text>
  <rect x="285" y="296" width="30" height="28" rx="4" fill="rgba(var(--primary), 0.35)" stroke="rgba(var(--primary), 0.6)" stroke-width="1" />
  <text x="300" y="315" fill="var(--grey-lighter)" font-size="11" text-anchor="middle">J1</text>
  <text x="280" y="358" fill="var(--grey-light)" font-size="11" text-anchor="middle">Instant dispatch to</text>
  <text x="280" y="375" fill="var(--grey-light)" font-size="11" text-anchor="middle">first available core</text>
  <!-- Dispatch Arrows (Design B) -->
  <path d="M 360 300 L 395 268" stroke="#81c784" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-green)" />
  <path d="M 360 318 L 395 303" stroke="#81c784" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-green)" />
  <path d="M 360 338 L 395 338" stroke="#81c784" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-green)" />
  <path d="M 360 358 L 395 373" stroke="#81c784" stroke-width="1.5" fill="none" marker-end="url(#pool-arrow-green)" />
  <!-- 4 Pooled Cores (Design B) -->
  <rect x="400" y="254" width="115" height="28" rx="4" fill="rgba(var(--primary), 0.2)" stroke="rgba(var(--primary), 0.5)" stroke-width="1" />
  <text x="457" y="273" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Core 1: Active</text>
  <rect x="400" y="289" width="115" height="28" rx="4" fill="rgba(var(--primary), 0.2)" stroke="rgba(var(--primary), 0.5)" stroke-width="1" />
  <text x="457" y="308" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Core 2: Active</text>
  <rect x="400" y="324" width="115" height="28" rx="4" fill="rgba(129, 199, 132, 0.2)" stroke="#81c784" stroke-width="1.2" />
  <text x="457" y="343" fill="#81c784" font-size="12" font-weight="700" text-anchor="middle">Core 3: Took J1!</text>
  <rect x="400" y="359" width="115" height="28" rx="4" fill="rgba(var(--primary), 0.2)" stroke="rgba(var(--primary), 0.5)" stroke-width="1" />
  <text x="457" y="378" fill="var(--grey-lighter)" font-size="12" font-weight="600" text-anchor="middle">Core 4: Active</text>
  <!-- Design B Summary Badge -->
  <rect x="535" y="258" width="320" height="129" rx="6" fill="var(--grey-dark)" stroke="#81c784" stroke-width="1.2" />
  <text x="695" y="286" fill="#81c784" font-size="13" font-weight="700" text-anchor="middle">Zero Idle Waste</text>
  <text x="695" y="310" fill="var(--grey-lighter)" font-size="12" text-anchor="middle">No worker is ever idle while requests wait.</text>
  <text x="695" y="330" fill="var(--grey-light)" font-size="11.5" text-anchor="middle">Shared pool naturally absorbs traffic jitter.</text>
  <text x="695" y="364" fill="#81c784" font-size="14" font-weight="700" text-anchor="middle">Average Queue Wait: 7.5ms (5.3× faster!)</text>
  <!-- Footer Insight -->
  <text x="25" y="432" fill="var(--grey-light)" font-size="12.5">Both architectures use identical hardware at 80% total utilization, but pooling eliminates artificial idle capacity loss.</text>
</svg>
</div>

The picture shows one moment. The equations below calculate the average queueing consequence across many arrivals.

#### Why Pooling Wins: The Erlang C Formula

In Design A, a sudden cluster of 4 requests hitting Worker 1 creates a severe queue backlog on that single node, even while Worker 3 sits completely idle. Isolated queues lead to simultaneous queue delays and idle waste. In Design B, a worker is never idle when there is work waiting to be done.

Mathematically, the probability that an incoming request finds all $c$ workers busy and must wait in line is given by the **Erlang C formula** (see [Erlang C derivation](https://en.wikipedia.org/wiki/Erlang_(unit)#Erlang_C_formula) for the complete birth-death Markov chain proof):

$$P(\text{Wait} > 0) = C(c, a) = \frac{\frac{a^c}{c!} \frac{1}{1 - \rho}}{\sum_{k=0}^{c-1} \frac{a^k}{k!} + \frac{a^c}{c!} \frac{1}{1 - \rho}}$$

where $a = \frac{\lambda}{\mu} = c \cdot \rho$ is traffic intensity in Erlangs.

The average queue wait time across $c$ pooled workers is:

$$W_q = \frac{C(c, a) \cdot S}{c(1 - \rho)}$$

Notice the factor of $c$ in the denominator: **pooling $c$ workers cuts average queue wait time by roughly a factor of $c$ at the exact same overall utilization $\rho$.**

#### Worked Comparison: 4 Isolated Queues vs. 1 Shared Queue

Evaluating our 4-worker cluster handling $320\text{ req/s}$ at 80% utilization ($\lambda = 320\text{ req/s}, S = 10\text{ ms}, c = 4, \rho = 0.80$):

- **Design A ($4 \times M/M/1$)**:
  $$W_{q, A} = \frac{0.80 \cdot 10\text{ ms}}{1 - 0.80} = \mathbf{40\text{ ms}}$$
- **Design B ($1 \times M/M/4$)**:
  With traffic intensity $a = 4 \times 0.80 = 3.2$ Erlangs, the Erlang C probability is $C(4, 3.2) \approx 0.596$ (59.6% chance of finding all cores busy):
  $$W_{q, B} = \frac{0.596 \cdot 10\text{ ms}}{4 \cdot (1 - 0.80)} = \frac{5.96\text{ ms}}{0.80} = \mathbf{7.5\text{ ms}}$$

Simply pooling the 4 cores to pull from a single shared queue reduces average queue wait from **40 ms** to **7.5 ms** (over **5× faster**) with identical total throughput, identical hardware, and identical 80% CPU load.

#### Systems Engineering Takeaway: Pool Shared Capacity

Pooling workers removes idle capacity created by isolated queues, but it requires workers to be interchangeable and a dispatcher that can observe which worker is available. Design B is a strong default for homogeneous workers serving the same request class.

- **Prefer a Shared Queue**: Let any available worker take the next request when workers have similar service times and share the same resources.
- **Keep Queues Separate When Needed**: Use isolated pools when requests need different hardware, have incompatible SLOs, or can interfere with one another through service-time variance.
- **Measure the Whole Pool**: Compare queue wait, tail latency, throughput, and goodput at the same offered load. Pooling can reduce waiting without changing the total service capacity.

## Summary & Systems Engineering Rules of Thumb

| Queuing System | Governing Formula | Systems Engineering Rule of Thumb |
| :--- | :--- | :--- |
| **Single-Server ($M/M/1$)** | $W = \frac{S}{1 - \rho}$ | **Target $\le$ 70% to 75% Steady-State Load**: Latency explodes hyperbolically beyond the knee. At 50% load, queue wait equals one task duration ($W_q = S$), doubling baseline response time ($W = 2S$). Headroom is the mathematical prerequisite for absorbing bursts. |
| **Service Variance ($M/G/1$)** | $W_q = \frac{\rho S}{1-\rho} \left(\frac{1 + C_v^2}{2}\right)$ | **Isolate Variance ($C_v \to 0$)**: Service variance inflates queue wait times linearly via Head-of-Line blocking. Segregate slow batch or analytical queries from fast interactive requests, and set strict execution timeouts. |
| **Multi-Server Pooling ($M/M/c$)** | $W_q = \frac{C(c, a) \cdot S}{c(1 - \rho)}$ | **Pool Queues Across Workers**: Prefer 1 shared queue across $c$ worker threads ($M/M/c$) over $c$ isolated queues ($c \times M/M/1$) to eliminate idle worker waste and cut average queue delay by roughly a factor of $c$. |

*This note and its interactive queuing simulation engines were co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*

<script type="module" src="/js/performance/coin-flip-simulator.js"></script>
<script type="module" src="/js/performance/hockey-stick-explorer.js"></script>
<script type="module" src="/js/performance/variance-queue-simulator.js"></script>
