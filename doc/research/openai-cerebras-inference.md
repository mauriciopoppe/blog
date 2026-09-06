# OpenAI and Cerebras Inference Research

Research date: 2026-09-06

## Findings

OpenAI's February 2026 launch post reports that GPT-5.3-Codex-Spark generated more than 1,000 tokens per second on Cerebras Wafer Scale Engine 3. The post presents the model as a smaller model optimized for fast inference and positions wafer-scale compute as a low-latency serving tier for interactive coding.

Source: [Introducing GPT-5.3-Codex-Spark](https://openai.com/index/introducing-gpt-5-3-codex-spark/)

The public Codex-Spark material does not disclose the model's parameter count, batch size, prompt and output lengths, concurrency, or exact mapping across Cerebras systems. The 1,000-plus figure is therefore an output-speed claim for a latency-first tier, not a complete cluster-throughput specification. Cerebras also describes Codex-Spark elsewhere as running at roughly 1,200 tokens per second, but does not publish the missing workload details there either.

Source: [Stop Shipping AI Slop: How Codex Spark Changes The Way You Code](https://www.cerebras.ai/blog/codex-spark-best-practices)

Cerebras's August 2026 serving post provides the clearest public mechanism for a related OpenAI deployment, GPT-5.6 Sol Ultrafast. It says WSE-3 distributes 44 GB of SRAM across roughly 900,000 cores with 21 petabytes per second of aggregate bandwidth. GPT-5.6 Sol is too large for one accelerator, so Cerebras partitions the model at layer boundaries across multiple CS-3 systems. Each wafer keeps its assigned layers in local SRAM and passes activations to the next wafer. This reduces repeated weight movement and fine-grained cross-device synchronization compared with conventional GPU sharding.

The same post says GPT-5.6 Sol on Cerebras uses the same architecture, weights, precision, context configuration, and reasoning settings as the standard OpenAI endpoint. That explains the 750 output-tokens-per-second claim for Sol, but it does not prove that Codex-Spark uses the same physical mapping. The exact Spark deployment remains undisclosed.

Source: [How Cerebras serves GPT-5.6 Sol at up to 750 tokens per second](https://www.cerebras.ai/blog/how-cerebras-serves-gpt-5-6-sol-at-up-to-750-tokens-per-second)

OpenAI's April 2026 engineering post explains that the hardware speed exposed a new bottleneck. The Responses API had been processing each follow-up request independently, repeating work over the full conversation history. OpenAI first improved single-request latency by caching rendered tokens and model configuration, removing unnecessary network hops, and making some safety classifiers faster. Those changes improved time to first token by close to 45%, but API overhead was still too large relative to model inference.

The larger change was a persistent WebSocket connection with connection-scoped cached response state. The cache reused prior response objects, input and output items, tool definitions, rendered tokens, and model-routing decisions. This allowed the API to process only new input, overlap non-blocking work such as billing, and avoid rebuilding conversation state between tool calls.

Source: [Speeding up agentic workflows with WebSockets in the Responses API](https://openai.com/index/speeding-up-agentic-workflows-with-websockets/)

OpenAI reports that this stack-wide work enabled the Responses API to keep up with GPT-5.3-Codex-Spark, reaching the 1,000 tokens-per-second target and bursts up to 4,000 tokens per second. Agentic rollouts became 40% faster end to end. This is evidence for a bottleneck-migration pattern: reducing accelerator service time can make host, API, transport, or orchestration demand dominate next.

Source: [Speeding up agentic workflows with WebSockets in the Responses API](https://openai.com/index/speeding-up-agentic-workflows-with-websockets/)

OpenAI's August 2026 Ultrafast preview reports up to 750 output tokens per second for GPT-5.6 Sol on Cerebras. The application examples focus on workflows where lower latency changes the interaction loop, including incident response, voice, financial research, and live experimentation. The post does not disclose the detailed serving implementation, so its throughput claim should be treated as a product-level result rather than evidence that the wafer alone produced the number.

Source: [Previewing Ultrafast mode: GPT-5.6 Sol at up to 14X the speed](https://openai.com/index/previewing-ultrafast/)

OpenAI's January 2026 partnership announcement describes the strategic role of Cerebras as a dedicated low-latency solution in a portfolio of compute systems matched to workloads. Cerebras is presented as complementary to general GPU capacity, not as a universal replacement.

Source: [OpenAI partners with Cerebras](https://openai.com/index/cerebras-partnership/)

## Interpretation for the inference-stack article

The strongest example is not simply “Cerebras is fast.” It is:

1. Wafer-scale compute lowers model-generation service time for a latency-sensitive workload.
2. The faster model makes repeated API, serialization, state reconstruction, and network work visible.
3. OpenAI reduces those non-accelerator visits and their service time with caching and persistent transport.
4. The complete serving path reaches the target only after the surrounding layers catch up.

In the article's notation, the hardware primarily reduces $S_k$ for the accelerator and inference path. The WebSocket design reduces both $S_k$ for API processing and $V_k$ for repeated conversation-state work. This makes the case useful for the central argument that optimization should follow end-to-end demand rather than the most visible piece of hardware.

## TPU comparison sources

Google's April 2026 eighth-generation TPU announcement presents TPU 8i as an inference-focused system for post-training, reasoning, and serving. Google positions it separately from TPU 8t, which is optimized for large-scale training.

Source: [Our eighth generation TPUs: two chips for the agentic era](https://blog.google/innovation-and-ai/infrastructure-and-cloud/google-cloud/eighth-generation-tpu-agentic-era/)

Google Cloud's April 2026 TPU 8i technical deep dive describes three inference-specific changes: three times more on-chip SRAM for larger KV caches, a Collectives Acceleration Engine that reduces synchronization latency, and Boardfly topology that reduces the maximum path in a 1,024-chip configuration from 16 hops to 7. Google reports up to 80% better performance per dollar than Ironwood, but TPU 8i is a new product announcement, so this should be treated as a vendor-reported target.

Source: [TPU 8t and TPU 8i technical deep dive](https://cloud.google.com/blog/products/compute/tpu-8t-and-tpu-8i-technical-deep-dive)

Google Cloud's May 2025 AI Hypercomputer update reports more than 3,500 tokens per second per Trillium node for long-sequence 70B inference using vLLM and JetStream in scaled production deployment. It also describes Pathways multi-host inference and disaggregated serving. The reported results include 1,703 tokens per second for Llama 3.1 405B on Trillium, seven times better prefill performance, and nearly three times better token-generation performance for disaggregated versus interleaved serving in the cited configurations.

Source: [From LLMs to image generation: Accelerate inference workloads with AI Hypercomputer](https://cloud.google.com/blog/products/compute/ai-hypercomputer-inference-updates-for-google-cloud-tpu-and-gpu)

These TPU sources reinforce the same conclusion as the Cerebras case. Hardware sets the available service-time floor, but compiler lowering, model partitioning, interconnect topology, runtime scheduling, prefill/decode separation, and routing determine how much of that floor reaches end-to-end serving.
