# vLLM pooling and P-K modeling

Source checkout: `/Users/mauriciopoppe/go/src/github.com/mauriciopoppe/vllm`.

## Findings

### Queue boundary inside one engine

The vLLM V1 scheduler maintains `waiting`, `skipped_waiting`, and `running` collections in `vllm/v1/core/sched/scheduler.py:165-169`. The waiting collections use the FCFS or priority implementations in `vllm/v1/core/sched/request_queue.py`. Each scheduling step first consumes a token budget and then admits waiting requests until the maximum running-request count or token budget is reached (`scheduler.py:338-360`, `553-565`, `784-803`). This is the concrete admission boundary behind a one-coupled-engine `G/G/1` approximation.

The scheduler comment explicitly says that it does not have separate prefill and decode phases. It advances requests according to computed-token state, which covers chunked prefill, prefix caching, speculative decoding, and future scheduling strategies (`scheduler.py:339-348`). That makes request-level service time state-dependent.

### Pooling-like routing across engines

`DPLBAsyncMPClient` load-balances among data-parallel engine processes. In `vllm/v1/engine/core_client.py:1370-1387`, it reads each engine's waiting and running counts, scores an engine as `waiting * 4 + running`, chooses the lowest score, and increments the local waiting estimate. This spreads requests across several engine-local queues. It is therefore closer to a routing approximation of `G/G/c` than to one literal shared FIFO queue.

Tensor-parallel workers inside one engine group are coupled participants in one model execution, not independent workers that can pull arbitrary requests. The article should model that group as one service center unless the workload is explicitly decomposed into independent execution groups.

### Where P-K can help

P-K assumes Poisson arrivals and a single server with an independent general service-time distribution. It can be a useful local approximation for a controlled prefill class (for example, a fixed prompt-length bucket) or a controlled decode-iteration class (for example, a fixed batch-shape bucket). Measurements should provide the arrival rate, mean service time, and service-time variance for that selected center.

P-K should not be applied directly to the whole vLLM request path. Continuous batching, prompt and output length variation, prefix-cache state, token budgets, repeated decode visits, preemption, and scheduling policy couple the centers and make both arrival and service processes general. End-to-end traces or a trace-driven simulation are needed to validate a local P-K estimate.

## Primary sources

- [vLLM scheduler source](https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/scheduler.py)
- [vLLM request queue source](https://github.com/vllm-project/vllm/blob/main/vllm/v1/core/sched/request_queue.py)
- [vLLM data-parallel load-balancing client](https://github.com/vllm-project/vllm/blob/main/vllm/v1/engine/core_client.py)
