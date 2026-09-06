# vLLM runtime architecture and Kimi K3

Research date: 2026-09-06

## Sources

- [Inside vLLM: Anatomy of a High-Throughput LLM Inference System](https://vllm.ai/blog/2025-09-05-anatomy-of-vllm)
- [Kimi K3 Is Here: Efficient Day-0 Support on vLLM](https://vllm-project.github.io/2026/07/27/k3.html)
- [Kimi Linear: An Expressive, Efficient Attention Architecture](https://arxiv.org/abs/2510.26692)
- [Attention Residuals](https://arxiv.org/abs/2603.15031)
- [DSpark documentation](https://docs.vllm.ai/projects/speculators/en/latest/user_guide/algorithms/dspark/)
- [vLLM documentation](https://docs.vllm.ai/en/v0.20.1/)
- [Efficient Memory Management for Large Language Model Serving with PagedAttention](https://arxiv.org/abs/2309.06180)
- [Makora DSPARK case study](https://www.makora.com/blog/dspark-for-glm52)

## Runtime concepts

The vLLM anatomy series gives a single useful entry point for continuous batching, chunked prefill, prefix caching, speculative decoding, and prefill/decode disaggregation. PagedAttention is the focused reference for managing KV memory in reusable blocks. These mechanisms all change the work presented to the accelerator, so they belong in the runtime layer rather than being treated as independent kernel tricks.

`N_batch` should mean the number of active request sequences in one serving iteration. It is different from total request arrivals and from average in-flight concurrency across a measurement window. Increasing it can improve aggregate throughput, but it consumes more KV-cache capacity and can increase per-request latency. Continuous batching changes it as sequences arrive, finish, or are paused.

## Kimi K3 as a runtime case study

Kimi K3 is a 2.8-trillion-parameter MoE model with 16 of 896 experts active per token, hybrid Kimi Delta Attention and full-attention layers, Attention Residuals, a one-million-token context window, and native vision. The architecture changes the runtime’s responsibilities in several ways:

- The cache manager must hold paged KV blocks for full attention and fixed-size recurrent state for KDA layers.
- Prefix caching cannot simply snapshot every token because recurrent state is updated in place and each checkpoint is larger than a normal token-level KV entry. vLLM adds interval-based and selective retention policies.
- Attention Residuals require fused kernels and persistent state handling across depth.
- Expert parallelism, sequence parallelism, and prefill/decode disaggregation change communication and cache-transfer paths.
- DSpark speculative decoding adds a model-specific proposal path. vLLM reports 118 tok/s without speculation and 370 tok/s with DSpark on 16 NVIDIA GB300 GPUs in its single-user benchmark.

The important point is not the headline speedup. It is that model architecture changes can require coordinated changes to scheduling, cache allocation, model execution, kernel dispatch, distributed communication, and speculative decoding. A serving engine such as vLLM or SGLang is therefore an adaptation layer between model architecture and hardware, not only an HTTP wrapper around a model.

## Measurement implications

For runtime experiments, record at least:

- `N_batch` over time
- accepted speculative tokens per target-model step
- prefill and decode work separately
- KV-cache capacity, allocation, reuse, and eviction
- prefix-cache hit rate
- kernel and metadata preparation time
- communication volume and topology for tensor or expert parallelism

This makes it possible to distinguish a reduction in per-visit service time ($S_{\text{runtime}}$) from a reduction in target-model visits ($V_{\text{runtime}}$).
