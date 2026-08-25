---
title: "Queuing Theory for Systems Engineers"
summary: |
  A mathematical and practical guide to queuing theory in distributed systems: from Kendall's notation and M/M/1 hyperbolic latency curves to Pollaczek–Khinchine service variance (M/G/1), multi-server pooling (M/M/c), and interactive curve exploration.
image: /images/performance-fundamentals.png
tags: ["system design", "performance", "queuing theory", "distributed systems", "math", "latency"]
date: 2026-08-24T23:00:00Z
draft: true
libraries: ["katex"]
---

In production systems, latency degradation rarely happens linearly. A service handling 5,000 requests per second with a 15ms response time might run smoothly all day, but an extra 5% traffic surge can suddenly spike tail latency from 15ms to 800ms.

This non-linear cliff is governed by **queuing theory**—the mathematical study of waiting lines. 

*(For foundational metrics, latency breakdowns, and resource utilization, see [Performance Fundamentals](/notes/performance-fundamentals/).)*

## Kendall's Notation ($A/S/c$)

In 1953, David G. Kendall introduced a standard three-part shorthand to describe any queuing system:

$$A / S / c$$

- **$A$ (Arrival Process)**: The distribution of inter-arrival times between requests.
  - $M$ (*Markovian* / Memoryless): Requests arrive randomly according to a Poisson process with arrival rate $\lambda$. The time between arrivals follows an exponential distribution.
  - $D$ (*Deterministic*): Requests arrive at exact, fixed intervals (e.g. a scheduled cron job every 10ms).
  - $G$ (*General*): An arbitrary statistical distribution with arbitrary variance.
- **$S$ (Service Time Distribution)**: The time required by a worker to process a request once execution starts.
  - $M$ (*Exponential*): Service duration follows an exponential distribution with mean service rate $\mu$ (average service time $S = 1/\mu$).
  - $D$ (*Deterministic*): Every request takes the exact same execution time.
  - $G$ (*General*): Arbitrary distribution (e.g. bimodal database queries, log-normal payload processing).
- **$c$ (Number of Parallel Workers)**: The count of independent servers, cores, or worker threads processing jobs from the queue ($c = 1, 2, \dots, \infty$).

### Common Architectures in Kendall Notation

| Model | System Architecture | Real-World Example |
| :--- | :--- | :--- |
| **$M/M/1$** | Single worker core processing random Poisson requests with variable execution time. | Single-threaded in-memory databases (Redis event loop, Node.js main thread). |
| **$M/D/1$** | Poisson traffic arrivals with perfectly constant, deterministic processing time. | Fixed-size packet hashing, ASIC cryptographic hardware verification. |
| **$M/G/1$** | Poisson arrivals with high-variance, arbitrary service times. | Relational database queries (fast primary-key lookups mixed with slow table scans). |
| **$M/M/c$** | Shared FIFO queue dispatched across $c$ identical parallel worker threads. | Multi-threaded thread pool, web server worker processes (Gunicorn, Puma, Go worker pool). |
| **$G/G/c$** | General bursty arrivals across $c$ parallel workers with arbitrary execution times. | General multi-tier microservice architecture under real-world internet traffic. |

## Single-Server Queues: The $M/M/1$ Hyperbolic Curve

The $M/M/1$ queue is the foundational analytical model in computer systems. It assumes:
1. Requests arrive at rate $\lambda$ (Poisson process).
2. A single server handles requests at rate $\mu$ (mean service time $S = 1/\mu$).
3. Utilization is $\rho = \frac{\lambda}{\mu}$.

### Closed-Form Latency Derivation

For the system to remain stable, the arrival rate must be strictly less than the service rate ($\lambda < \mu$, meaning $\rho < 1.0$). 

Under steady-state conditions, total server response time ($W = W_q + S$) expands into a hyperbolic curve:

$$W = \frac{1}{\mu - \lambda} = \frac{1/\mu}{1 - \rho} = \frac{S}{1 - \rho}$$

Queue waiting time ($W_q$) before execution begins is:

$$W_q = W - S = \frac{S}{1 - \rho} - S = \frac{\rho \cdot S}{1 - \rho} = \frac{\rho}{\mu(1 - \rho)}$$

And the average number of items waiting in the queue ($L_q$) and total in the system ($L$) follow directly via Little's Law:

$$L_q = \lambda \cdot W_q = \frac{\rho^2}{1 - \rho}$$

$$L = \lambda \cdot W = \frac{\rho}{1 - \rho}$$

### The Hyperbolic Multiplier

Notice how the term $\frac{1}{1 - \rho}$ acts as an exponential penalty multiplier on latency as utilization approaches 100%:

| Utilization ($\rho$) | Multiplier ($\frac{1}{1 - \rho}$) | Base Service Time ($S = 10\text{ ms}$) | Total Response Time ($W$) | Queue Wait ($W_q$) |
| :--- | :--- | :--- | :--- | :--- |
| **$0\%$** | $1.0\times$ | $10\text{ ms}$ | $10.0\text{ ms}$ | $0.0\text{ ms}$ |
| **$50\%$** | $2.0\times$ | $10\text{ ms}$ | $20.0\text{ ms}$ | $10.0\text{ ms}$ |
| **$75\%$ (Operational Knee)** | $4.0\times$ | $10\text{ ms}$ | $40.0\text{ ms}$ | $30.0\text{ ms}$ |
| **$90\%$** | $10.0\times$ | $10\text{ ms}$ | $100.0\text{ ms}$ | $90.0\text{ ms}$ |
| **$95\%$** | $20.0\times$ | $10\text{ ms}$ | $200.0\text{ ms}$ | $190.0\text{ ms}$ |
| **$99\%$** | $100.0\times$ | $10\text{ ms}$ | $1,000.0\text{ ms } (1\text{ s})$ | $990.0\text{ ms}$ |

At $50\%$ utilization, average response time is only double the service time. But moving from $90\% \to 95\%$ doubles latency again (from $10\times \to 20\times$), and moving from $95\% \to 99\%$ inflates latency by a factor of 5.

## Interactive $M/M/1$ Queuing Curve Explorer

Use the slider below to adjust service rate $\mu$ and hover across the curve to inspect how response latency $W$ diverges asymptotically as arrival rate $\lambda$ approaches capacity:

<div id="interactive-queue-curve" style="margin: 2rem 0;"></div>

## The Impact of Service Variance: The Pollaczek–Khinchine Formula ($M/G/1$)

In real production workloads, execution times are rarely cleanly exponential. Some database queries take 1ms (index cache hit), while others take 200ms (disk I/O and table scan).

The **Pollaczek–Khinchine (P-K) formula** extends queuing theory to systems with arbitrary service time distributions ($M/G/1$):

$$W_q = \frac{\lambda \mathbb{E}[S^2]}{2(1 - \rho)} = \frac{\rho \cdot S}{1 - \rho} \cdot \left(\frac{1 + C_v^2}{2}\right)$$

where:
- $\mathbb{E}[S^2]$ is the second moment of service time ($\text{Var}(S) + (\mathbb{E}[S])^2$).
- $C_v = \frac{\sigma_S}{\mu_S}$ is the **Coefficient of Variation** of service time (standard deviation divided by mean).

### Why Variance Destroys Latency

The term $\left(\frac{1 + C_v^2}{2}\right)$ scales queue waiting time directly:

1. **Deterministic Execution ($M/D/1, C_v = 0$)**:
   $$\frac{1 + 0}{2} = 0.5 \implies W_q = 0.5 \cdot W_{q, M/M/1}$$
   When every request takes the exact same amount of time, queue wait time is **cut in half** compared to exponential service times.
2. **Exponential Execution ($M/M/1, C_v = 1$)**:
   $$\frac{1 + 1}{2} = 1.0 \implies W_q = W_{q, M/M/1}$$
3. **High-Variance / Bimodal Execution ($M/G/1, C_v = 3$)**:
   $$\frac{1 + 3^2}{2} = \frac{1 + 9}{2} = 5.0 \implies W_q = 5.0 \cdot W_{q, M/M/1}$$
   When service times are erratic, average queue wait time is **5 times higher** at the exact same arrival rate and utilization.

### Systems Implication: Head-of-Line Blocking

The Pollaczek–Khinchine formula provides the mathematical proof for why large, slow requests must never share a FIFO queue with fast, interactive requests:

- A single 500ms analytical query occupying a worker forces dozens of subsequent 2ms fast queries to wait in line.
- **Architectural Remedy**: Separate queues by priority, implement work-stealing pools, enforce strict execution timeouts, or use chunking/preemption to bound service variance ($C_v \to 0$).

## Multi-Server Queuing ($M/M/c$) & Resource Pooling

When scaling out a service across $c$ parallel worker cores with a shared queue ($M/M/c$), utilization is $\rho = \frac{\lambda}{c \cdot \mu}$.

The probability that an arriving request finds all $c$ workers busy and must wait in queue is given by the **Erlang C formula**:

$$P(\text{Wait} > 0) = C(c, a) = \frac{\frac{a^c}{c!} \frac{1}{1 - \rho}}{\sum_{k=0}^{c-1} \frac{a^k}{k!} + \frac{a^c}{c!} \frac{1}{1 - \rho}}$$

where $a = \frac{\lambda}{\mu} = c \cdot \rho$ is the traffic intensity in Erlangs.

Average queue wait time across $c$ servers is:

$$W_q = \frac{C(c, a)}{c \cdot \mu - \lambda} = \frac{C(c, a) \cdot S}{c(1 - \rho)}$$

### The Resource Pooling Principle

Compare two different architectural designs handling 400 req/s:

- **Design A (4 Independent Single-Worker Nodes)**: Each node has its own queue and handles 100 req/s on 1 core ($\rho = 80\%$).
- **Design B (1 Pooled 4-Core Cluster)**: A single shared queue dispatches to all 4 cores handling 400 req/s total ($\rho = 80\%$).

In Design A, one node might have 5 requests queued while another node sits completely idle because queues are segregated. In Design B, workers never sit idle while jobs wait in queue.

Mathematically, increasing server count $c$ while holding utilization $\rho$ constant reduces average queue wait time ($W_q$) by a factor roughly proportional to $1/c$. Pooling capacity dramatically improves burst resilience.

## Summary

| Queuing System | Governing Formula | Key Engineering Insight |
| :--- | :--- | :--- |
| **$M/M/1$** | $W = \frac{S}{1 - \rho}$ | Latency explodes hyperbolically beyond the $\rho \approx 75\%$ knee. Never size steady-state clusters for $>80\%$ utilization. |
| **$M/G/1$ (P-K)** | $W_q = \frac{\rho S}{1-\rho} \left(\frac{1 + C_v^2}{2}\right)$ | Service time variance ($C_v$) inflates queue wait times linearly. Segregate slow batch jobs from fast interactive requests. |
| **$M/M/c$ (Erlang C)** | $W_q = \frac{C(c, a) \cdot S}{c(1 - \rho)}$ | Shared multi-server worker pools absorb traffic bursts far better than isolated single-worker queues. |

*This note and its interactive visualizers were co-authored in pair programming with [Antigravity (Agy)](https://antigravity.google).*

<script type="module">
  import { initQueueExplorer } from '/js/performance/queue-explorer.js';
  initQueueExplorer('#interactive-queue-curve');
</script>
