# Resources for “Optimizing the LLM Inference Stack”

Research date: 2026-09-05

The draft already has the right structure for these resources. Use them as evidence at the point where each resource explains a layer or an optimization loop. Avoid collecting them in a generic “further reading” section.

## Recommended placements

### The Layered Inference Hierarchy

Add a short paragraph after the opening paragraph:

> Two useful maps of this territory are [BrrrViz](https://brrrviz.com/), which explains GPU execution and optimization with interactive visualizations, and [Wafer’s AI Performance Engineering list](https://github.com/wafer-ai/gpu-perf-engineering-resources), which organizes the field from one request and one GPU through kernels, inference engines, and distributed systems. The point of the hierarchy is diagnostic: each resource becomes useful at a different layer.

This gives readers a route into the topic before the article starts naming individual mechanisms. BrrrViz currently covers the GPU machine, execution model, roofline, memory coalescing, warp divergence, synchronization, bank conflicts, streams, atomics, reductions, tiling, precision, fusion, and profiling. Its ML systems material is listed as forthcoming, so describe it as a GPU fundamentals resource rather than as a complete inference course.

Source: [BrrrViz curriculum](https://brrrviz.com/) and [Wafer resource map](https://github.com/wafer-ai/gpu-perf-engineering-resources).

### Silicon Architecture: Overcoming the Memory Wall

Link “roofline” to the [BrrrViz Roofline lesson](https://brrrviz.com/) and link the TPU paragraph to the [TPU autoresearch wiki index](https://github.com/vlasenkoalexey/tpu_performance_autoresearch_wiki/blob/main/wiki/index.md). The TPU index is useful here because it names the hardware concepts that become performance constraints: HBM, VMEM, MXU, VPU, ICI, DCN, arithmetic intensity, and per-generation roofline limits.

Suggested addition:

> The same roofline reasoning appears across accelerators, but the relevant ceilings differ. The TPU performance wiki catalogs HBM, on-chip VMEM, tiled MXU execution, and inter-chip links as separate constraints, which makes it a useful comparison point when the serving target is not a CUDA GPU.

Do not present the wiki as an authoritative production guide. Its own README describes it as a research project and asks readers to verify reported numbers against their own profiles.

### Kernel Specialization: Tailoring Compute to Sequence Geometry

This is the best place for both [BrrrViz](https://brrrviz.com/) and [Wafer’s kernel section](https://github.com/wafer-ai/gpu-perf-engineering-resources). BrrrViz supplies the visual intuition for occupancy, coalescing, tiling, divergence, fusion, and profiling. Wafer supplies a curated path into CUDA, Triton, CUTLASS, tensor cores, attention, benchmarking, and correctness.

Use one concrete Makora example here as a bridge from general principles to production work. In its Gemma 4 case study, Makora says it changed the verification kernel for speculative decoding from a two-dimensional launch grid to a three-dimensional split-KV path. The reported microbenchmark speedup is roughly 6.2x to 6.6x, while the selective end-to-end gain is up to 7.5% on top of an already tuned setup. The important lesson is the gap between kernel speedup and end-to-end speedup.

Source: [Makora’s Gemma 4 case study](https://www.makora.com/blog/reading-the-future-with-gemma-4).

### Inference Runtime Architecture: Batching and Memory Pools

Add the Wafer links for [continuous batching](https://github.com/wafer-ai/gpu-perf-engineering-resources), [KV cache systems](https://github.com/wafer-ai/gpu-perf-engineering-resources), [quantization](https://github.com/wafer-ai/gpu-perf-engineering-resources), and [speculative decoding](https://github.com/wafer-ai/gpu-perf-engineering-resources) to the first sentence. The repository is organized as one README, so link the main page and name the relevant subsections in the prose rather than creating four separate bibliography links.

Makora’s [DSPARK post](https://www.makora.com/blog/dspark-for-glm52) is a good example of an algorithmic optimization that sits above a kernel. It treats accepted length as the key quantity, trains a draft head against the target model’s behavior, and reports how a change in accepted length affects decoding work. This fits the article’s distinction between service time inside a kernel and the number of target-model passes requested by the serving algorithm.

### Cluster Orchestration: Prefix-Aware Routing and Endpoint Picking

Keep the Wafer resource link here only as a pointer to its distributed inference sections, especially parallelism, collectives, topology, prefill/decode disaggregation, production systems, and serving benchmarks. Do not imply that the repository documents `llm-d` specifically. The useful connection is that router policy is one part of a larger distributed-serving problem.

### The Systems Playbook

Use the TPU repository as the worked example for a repeatable optimization loop. Its README describes a cycle of hypothesis, minimal code diff, real-hardware benchmark, profiling, verdict, and writeup. It also keeps failed experiments and their rationale. That makes it a concrete implementation of the article’s proposed loop, not merely a list of TPU facts.

Suggested addition:

> A practical version of this loop is the [TPU Model Performance Auto-optimization wiki](https://github.com/vlasenkoalexey/tpu_performance_autoresearch_wiki). It combines a local Markdown knowledge base, profiler-backed hypotheses, real hardware experiments, code branches, and a record of wins and failures. The useful pattern generalizes beyond TPUs: keep the evidence, the code diff, and the benchmark result attached to the same experiment.

Link the associated article when discussing the methodology: [TPU Model Performance Auto-optimization](https://vlasenkoalexey.github.io/2026/05/tpu-model-performance-auto-optimization/). The page was unavailable to the text crawler during this research pass, so verify the URL and any article-specific claims in a browser before publishing.

## Full-stack provider analysis

Makora is a strong, constructive case study for the article because its public positioning treats inference optimization as a full-stack activity. Its [homepage](https://www.makora.com/) describes agents for orchestration, algorithmic optimization, serving engines, GPU kernels, and heterogeneous hardware. It specifically names routing and load balancing, speculative decoding and batching, vLLM/SGLang/TensorRT-LLM tuning, and generated CUDA/HIP/Triton kernels. Studying these examples creates a collaborative way to learn where Makora finds optimization opportunities and relate them to the article's full-stack model.

The case study should be framed as a public description of Makora’s approach, not as an independently audited performance claim. The homepage reports “up to 5x” throughput uplift and “up to 70%” lower time to first token. Treat these as company-reported upper bounds unless the benchmark setup and workload are visible. For corroboration, use public sources that expose the model, hardware, quantization, prompt and output lengths, concurrency, baseline, metric, and measurement method. [Artificial Analysis’s GLM-5.2 provider benchmark](https://artificialanalysis.ai/models/glm-5-2/providers) is one outside comparison that currently lists Makora and publishes its test context. It can provide an independent reference point, but it does not prove Makora’s homepage maximums. Makora’s own [TrainSpotting](https://www.makora.com/blog/trainium2-opt), [Gemma 4](https://www.makora.com/blog/reading-the-future-with-gemma-4), and [DSPARK](https://www.makora.com/blog/dspark-for-glm52) posts are public primary sources for the narrower experiments they describe. Any number from those posts should stay attributed to Makora and tied to its stated workload.

### The most useful technical evidence

1. [TrainSpotting: Trainium2](https://www.makora.com/blog/trainium2-opt) shows the full stack on a non-GPU accelerator. The post combines [vLLM-Neuron](https://awsdocs-neuron.readthedocs-hosted.com/en/latest/vllm-neuron/docs/getting-started/setup-guide.html), framework changes, custom kernels, on-device sampling, speculative decoding, and Trainium-specific DMA and tiling decisions. It reports 1.4x to 6.8x speedups across three models relative to the default vLLM-Neuron path.

2. The same post gives a precise example of hardware-shaped optimization. For Qwen3.5-4B, Makora packs recurrent and convolutional state to reduce DMA waste, pads a projection to match 128-wide tiles so the compiler can pipeline it cleanly, and fuses a dependent decode path to keep intermediates in SBUF. These are silicon, compiler, kernel, and runtime decisions that interact. They support the draft’s claim that the dominant layer can move when an inner layer changes. They also illustrate a broad optimization opportunity: moving from generic defaults to a measured baseline that matches the model and the hardware serving it.

3. [Reading the Future with Gemma 4](https://www.makora.com/blog/reading-the-future-with-gemma-4) shows the GPU path. Makora identifies low occupancy in the speculative-decoding verification kernel, changes the launch geometry with split-KV, and trains a DSpark draft head. This ties kernel specialization to serving-algorithm design.

4. [DSPARK for GLM-5.2](https://www.makora.com/blog/dspark-for-glm52) shows the model-specific side of the same approach. The team changes residual taps, projection initialization, learned queries, and recurrent structure in the draft head, then measures accepted length. This is a reminder that inference performance can depend on trained auxiliary components, not only on systems code.

The Makora case study belongs in two places with different purposes. The inference-stack article uses Makora's public technical posts to show that optimization opportunities can span hardware, kernels, runtimes, and orchestration. The [Autonomous Workload Optimization: The Agentic Case](/notes/autonomous-workload-optimization/) article uses Makora's workflow as an example of the profile, hypothesis, implementation, benchmark, and verification loop.

Baseten is a strong second case study. It appears in the [Artificial Analysis GLM-5.2 provider comparison](https://artificialanalysis.ai/models/glm-5-2/providers), and [its GLM-5.2 engineering post](https://www.baseten.co/blog/how-we-built-the-worlds-fastest-api-for-glm-52/) describes a result built from several layers: a customized runtime for shared DSA weights, NVFP4 quantization on Blackwell, KV-aware routing with NVIDIA Dynamo, prefill/decode disaggregation, and Multi-Token Prediction. This complements Makora's heterogeneous-hardware and agentic optimization examples with a production case centered on coordinated changes for one model and workload.

## Editorial cautions

- Keep each company’s numerical claims attributed to the original source and include workload, hardware, concurrency, and baseline whenever available.
- Use BrrrViz for intuition and visual explanation. Use Wafer’s list for navigation to primary papers, specifications, and implementation repositories.
- Use the TPU wiki to illustrate a workflow and a heterogeneous accelerator path. Avoid presenting it as proof that the same optimization transfers unchanged to GPUs.
- The article currently names Cerebras and TPUs in the silicon section but focuses most of its later examples on GPUs. The Makora Trainium2 case study is a good way to make the heterogeneous-hardware claim concrete.
- The current draft says the bottleneck device law “mathematically proves” a throughput bound. Consider changing that to “gives the standard bottleneck bound” unless the queueing assumptions are stated explicitly.
