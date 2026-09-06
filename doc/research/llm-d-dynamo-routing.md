# llm-d and NVIDIA Dynamo routing

Research date: 2026-09-06

## Sources

- [llm-d Router](https://llm-d.ai/docs/architecture/core/router)
- [llm-d Endpoint Picker](https://llm-d.ai/docs/dev/architecture/core/router/epp)
- [llm-d prefix-cache aware routing](https://llm-d.ai/docs/architecture/advanced/kv-management/prefix-cache-aware-routing)
- [KV-Cache Wins You Can See](https://llm-d.ai/blog/kvcache-wins-you-can-see)
- [Sticky Until Saturated: Token-Aware Routing in llm-d](https://llm-d.ai/blog/sticky-until-saturated-token-aware-routing)
- [NVIDIA Dynamo routing concepts](https://docs.nvidia.com/dynamo/dev/knowledge-base/modular-components/router/routing-concepts)
- [NVIDIA Dynamo configuration and tuning](https://docs.nvidia.com/dynamo/dev/knowledge-base/modular-components/router/configuration-and-tuning)
- [NVIDIA Dynamo router operations](https://docs.nvidia.com/dynamo/dev/knowledge-base/modular-components/router/router-operations)

## llm-d

The current terminology is important. The llm-d Router is the complete request entry point. It combines a production proxy with an Endpoint Picker, which contains the routing intelligence. The Endpoint Picker filters and scores model-server candidates using state such as KV-cache utilization, prefix-cache locality, queue depth, active requests, and priority.

The prefix-cache aware routing documentation explains the direct performance mechanism: route a request to a replica that already holds the relevant prefix so the server can skip redundant prefill computation. The case study reports that precise prefix-cache aware scheduling can materially improve response time and throughput on its benchmark, but the numbers are workload-specific.

The newer token-aware routing post adds the important failure mode. Cache affinity can concentrate requests on warm replicas past the point where a colder but less-loaded replica would be faster. The router therefore combines an affinity filter with a load signal matched to the bottleneck. Prefill-bound workloads use uncached prefill tokens in flight. Decode-bound workloads use active streams. This makes the cache-versus-load tradeoff explicit instead of hiding it in a weighted score.

## NVIDIA Dynamo

Dynamo's router also uses a cost model to select workers. Its routing concepts documentation describes KV-cache routing as directing requests toward workers with relevant cached data. Its configuration documentation exposes weights for device-local, host, and disk cache hits, as well as prompt-side and decode-side load. Its operations documentation separates prefix-cache state from active-block state, which lets the router reason about reusable memory and current work independently.

Dynamo therefore supports the same claim as llm-d: the routing system is not generic round-robin load balancing. It adapts placement to inference state. The difference is implementation and terminology. llm-d exposes a proxy plus Endpoint Picker model with filters, scorers, and pickers. Dynamo exposes a router cost model and KV indexer with configurable cache and load credits.

## What the article should say

Use llm-d and Dynamo as parallel examples of the orchestration layer. The [Wafer GPU performance engineering resource list](https://github.com/wafer-ai/gpu-perf-engineering-resources) remains a broader distributed-inference map. Its production-systems section points to both projects, but the project documentation is still needed to explain their routing and cache-state internals.

The key runtime consequence is a change in both demand terms. A cache-aware route can lower the number of expensive prefill visits by reusing KV state. A route that follows cache affinity too aggressively can raise queueing and service time on the warm replica. The router must therefore optimize cache reuse and load together, then be evaluated with request-level TTFT, decode latency, throughput, cache-hit rate, and per-replica queue or token load.
