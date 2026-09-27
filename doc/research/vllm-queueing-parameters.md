# vLLM Queueing Parameters

Source checkout: `/Users/mauriciopoppe/go/src/github.com/mauriciopoppe/vllm` at `87985077a`.

## Findings

vLLM does not expose a single parameter for queueing load $\rho$. For a chosen resource boundary and workload, $\rho = \lambda / \mu = \lambda S$ is measured from offered work and effective service capacity. vLLM parameters change admission, batch composition, cache capacity, and scheduling, which can change the measured value and its latency behavior.

| Control | Source | Effect relevant to queueing |
| --- | --- | --- |
| `max_num_batched_tokens` | `vllm/config/scheduler.py:48-53` | Caps tokens processed in one iteration. |
| `max_num_scheduled_tokens` | `vllm/config/scheduler.py:55-60` | Caps tokens issued in one iteration and may be lower than the batch-token cap for speculative decoding. |
| `max_num_seqs` | `vllm/config/scheduler.py:62-67` | Caps sequences processed in one iteration. |
| `enable_chunked_prefill` | `vllm/config/scheduler.py:83-89` | Allows long prefills to be split according to the remaining token budget. |
| `max_num_partial_prefills`, `max_long_partial_prefills`, `long_prefill_token_threshold` | `vllm/config/scheduler.py:69-81` | Control how many partial prefills and long prompts can compete for scheduling time. |
| `policy` | `vllm/config/scheduler.py:108-116` | Selects FCFS or priority scheduling, changing which requests wait first. |
| `gpu_memory_utilization` | `vllm/config/cache.py:40` | Sets the fraction of GPU memory available to the model executor. It changes KV-cache capacity, not compute utilization directly. |
| `kv_cache_memory_bytes` | `vllm/config/cache.py:131-138` | Sets KV-cache capacity explicitly and overrides `gpu_memory_utilization` when provided. |

The scheduler implementation maps `max_num_seqs` to its maximum running-request count and uses `max_num_scheduled_tokens` or `max_num_batched_tokens` as its token budget (`vllm/v1/core/sched/scheduler.py:104-110`). These are useful examples for explaining how an inference server changes the queueing conditions without pretending that its workload is an `M/M/1` queue.

Official reference: [vLLM scheduler configuration](https://docs.vllm.ai/en/latest/api/vllm/config/scheduler/) and [vLLM serve arguments](https://docs.vllm.ai/en/stable/cli/serve/).
