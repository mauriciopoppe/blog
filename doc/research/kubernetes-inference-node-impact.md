# Kubernetes release features that affect inference nodes

Research date: 2026-09-06

## Scope

This review covers the Kubernetes release blogs for v1.31 through v1.37 and the feature posts and KEPs they point to. It focuses on features that can change the service time, resource contention, placement, startup behavior, or variance of an inference server running on a node.

The relevant distinction is between three deployment shapes:

| Deployment shape | Main question |
| --- | --- |
| One inference-server replica on one node | Can the process get predictable CPU, memory, NUMA, and device access? |
| Multiple replicas on one node | How are CPU, memory bandwidth, device capacity, interrupts, and sidecars shared? |
| One serving workload across multiple nodes | Can the scheduler allocate compatible devices and topology together, and can the workload start or recover without partial placement? |

Features that only improve control-plane scalability can still matter operationally, but they should not be described as reducing steady-state request service time on the inference node.

## Release-by-release findings

### Kubernetes v1.31

- [v1.31 release](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/): this release is the starting point for the current cgroup and device-allocation transition.
- [CPU Manager static policy distributed CPU option](https://kubernetes.io/blog/2024/08/22/cpumanager-static-policy-distributed-cpu-across-cores/): the `distribute-cpus-across-cores` option spreads assigned CPU threads across physical cores instead of packing them onto sibling hyperthreads. For CPU-heavy tokenization, scheduling, sampling, or sidecars, this can reduce sibling contention. It is especially relevant when a node hosts multiple replicas.
- [cgroup v1 moving to maintenance mode](https://kubernetes.io/blog/2024/08/14/kubernetes-1-31-moving-cgroup-v1-support-maintenance-mode/): the project makes cgroup v2 the forward path. The unified hierarchy changes how CPU, memory, pressure, and OOM behavior are observed and enforced. A serving benchmark should record the cgroup version and runtime configuration because the same pod limits can produce different host behavior across node images.
- [Dynamic Resource Allocation redesign](https://kubernetes.io/blog/2024/08/13/kubernetes-v1-31-release/): DRA was substantially redesigned before its v1.32 beta. This matters for GPUs, TPUs, FPGAs, network adapters, and other resources that need more expressive allocation than the older device-plugin model.
- [Consistent reads from the cache](https://kubernetes.io/blog/2024/08/15/consistent-read-from-cache-beta/) improves API-server and etcd efficiency. It can shorten reconciliation and recovery loops in large clusters, but it is an indirect control-plane effect, not a direct reduction in request execution time on an inference node.
- [Image volume source](https://kubernetes.io/blog/2024/08/16/kubernetes-1-31-image-volume-source/) can expose OCI artifacts as read-only volumes. This may change model or configuration delivery and cold-start I/O, while steady-state token generation is mostly unaffected.

### Kubernetes v1.32

- [v1.32 release](https://kubernetes.io/blog/2024/12/11/kubernetes-v1-32-release/): DRA structured parameters reached beta, kubelet systemd watchdog support improved node recovery, and sidecar containers moved toward stable behavior.
- [Memory Manager goes GA](https://kubernetes.io/blog/2024/12/13/memory-manager-goes-ga/): the kubelet can use topology hints to allocate exclusive memory for Guaranteed pods. Together with CPU Manager and Topology Manager, this is directly relevant to NUMA-sensitive inference servers. The release also adds metrics for memory pinning requests and failures, which are useful when diagnosing placement regressions.
- [Strict CPU reservation](https://kubernetes.io/blog/2024/12/16/cpumanager-strict-cpu-reservation/): the alpha `strict-cpu-reservation` option prevents workloads from using CPUs reserved for system daemons and interrupts. This matters for inference benchmarks because kubelet, container runtime, network processing, and interrupts otherwise compete with tokenization, request handling, or runtime callbacks.
- [Linux swap improvements](https://kubernetes.io/blog/2025/03/25/swap-linux-improvements/): `NoSwap` remains the default, while `LimitedSwap` allows selected workloads to use swap on cgroup v2 nodes. Swap can protect a node from some memory spikes, but page-in latency and unaccounted swap usage can create severe tail-latency and noisy-neighbor problems for inference. It should be treated as an explicit experiment, not a free capacity increase.
- [QueueingHint](https://kubernetes.io/blog/2024/12/18/kubernetes-v1-32-queueinghint/), where enabled, reduces unnecessary scheduler requeues. This affects how quickly pods obtain resources during scale-out or recovery, not the steady-state execution of a request.

### Kubernetes v1.33

- [v1.33 release](https://kubernetes.io/blog/2025/04/23/kubernetes-v1-33-release/): the release includes the first broadly usable form of the current DRA feature set and makes user namespaces enabled by default. User namespaces primarily affect isolation and privilege rather than token throughput, though they can influence runtime compatibility and startup configuration.
- [In-place Pod Resize beta](https://kubernetes.io/blog/2025/05/16/kubernetes-v1-33-in-place-pod-resize-beta/): CPU and memory requests or limits can change without restarting a pod. This can help an autoscaling controller adjust a serving replica, but changing limits can also change CPU throttling, memory pressure, NUMA placement, and interference with co-located replicas. A benchmark must record resize events rather than treating the pod as a fixed resource boundary.
- [New features in DRA](https://kubernetes.io/blog/2025/05/01/kubernetes-v1-33-dra-updates/): DRA added UX and allocation improvements on the path to v1.34 GA. The direct inference use case is selecting devices with the right capabilities and topology instead of treating all accelerators exposed by a node as interchangeable.
- [Image volumes graduate to beta](https://kubernetes.io/blog/2025/05/08/kubernetes-v1-33-image-volumes-beta/): this is mainly a model and artifact startup feature. It can reduce or simplify image and model packaging decisions, but it does not make a running kernel faster.

### Kubernetes v1.34

- [v1.34 release](https://kubernetes.io/blog/2025/08/27/kubernetes-v1-34-release/): DRA reached GA, Linux node swap reached stable, and several resource-management features became more useful for production clusters.
- [DRA updates for v1.34](https://kubernetes.io/blog/2025/09/01/kubernetes-v1-34-dra-updates/): core DRA is enabled by default and the PodResources API can report allocated DRA resources. This improves device-aware scheduling and node-level observability for accelerators and other specialized resources.
- [Pod-level resources beta](https://kubernetes.io/blog/2025/09/22/kubernetes-v1-34-pod-level-resources/): a pod can express an aggregate CPU, memory, and hugepage budget across its containers. This matches inference pods with sidecars better than independent container requests, but the post notes that CPU, memory, and topology managers did not yet consistently consume pod-level resources. That gap matters when a pod-level budget is assumed to imply NUMA or exclusive CPU placement.
- [DRA consumable capacity](https://kubernetes.io/blog/2025/09/18/kubernetes-v1-34-dra-consumable-capacity/): a device can expose consumable slices such as memory or bandwidth. This can support deliberate sharing of an accelerator or network resource across replicas, but it also makes interference measurement more important because a nominal device allocation no longer implies exclusive capacity.
- [Uncore-cache CPU alignment](https://kubernetes.io/blog/2025/09/02/kubernetes-v1-34-prefer-align-by-uncore-cache-cpumanager-static-policy-optimization/): the `prefer-align-cpus-by-uncorecache` option reaches beta for processors with split uncore caches. CPU placement can therefore affect cache locality and host-side service time even when the requested CPU count is unchanged.
- [Stable Linux swap support](https://kubernetes.io/blog/2025/08/27/kubernetes-v1-34-release/): `NoSwap` remains the default. `LimitedSwap` can improve node survivability under pressure, while still making latency less predictable. For inference, memory headroom and eviction policy are usually easier to reason about than allowing model or KV-cache pages to be paged out.
- [CRI cgroup driver lookup goes GA](https://kubernetes.io/blog/2025/09/12/kubernetes-v1-34-cri-cgroup-driver-lookup-now-ga/): kubelet and the container runtime can agree on the cgroup driver automatically. This reduces a class of resource-enforcement and observability mismatches that can otherwise make CPU and memory measurements misleading.
- [Delayed replacement pods for Jobs](https://kubernetes.io/blog/2025/08/27/kubernetes-v1-34-release/): replacement pods can be delayed until the old pod is gone. This is more directly useful for batch or training workloads, but it can reduce temporary node contention when serving systems use Jobs for warmup, evaluation, or model preparation.

### Kubernetes v1.35

- [v1.35 release](https://kubernetes.io/blog/2025/12/17/kubernetes-v1-35-release/): DRA is always enabled, and device-related scheduling and reuse behavior continues to mature.
- [Workload-aware scheduling](https://kubernetes.io/blog/2025/12/29/kubernetes-v1-35-introducing-workload-aware-scheduling/): the Workload API, gang scheduling foundations, and opportunistic batching target workloads that need several pods or devices to be considered together. This is relevant to multi-node inference, disaggregated prefill/decode, and any deployment where a partially placed workload wastes reserved accelerators.
- Device taints and tolerations let a node or device reject workloads that should not use it. This helps protect specialized accelerators and prevents an incompatible pod from consuming a device that a serving workload needs.
- Extended resource request improvements make it easier for workloads to request or reuse compatible devices. The effect is mainly placement quality and recovery behavior, with indirect effects on cold starts and node fragmentation.

### Kubernetes v1.36

- [Workload-aware scheduling in v1.36](https://kubernetes.io/blog/2026/05/13/kubernetes-v1-36-advancing-workload-aware-scheduling/): Workload and PodGroup APIs separate a workload template from its runtime state. Alpha support adds gang scheduling, topology-aware scheduling, workload-aware preemption, and DRA ResourceClaims for workloads. These features target multi-pod and multi-node AI/ML placement rather than the execution time of one already-running request.
- [DRA updates for v1.36](https://kubernetes.io/blog/2026/05/07/kubernetes-v1-36-dra-136-updates/): prioritized device lists support fallback such as H100 then A100, resource health and binding conditions can delay placement until a device is ready, and DRA begins exposing node-allocatable resources and richer device metadata. These features can reduce failed starts, incompatible assignments, and recovery time for heterogeneous accelerator fleets.
- [Pod-level resource managers alpha](https://kubernetes.io/blog/2026/05/01/kubernetes-v1-36-feature-pod-level-resource-managers-alpha/): CPU Manager and Memory Manager can begin acting on pod-level specifications. This is important for inference pods with proxies, telemetry, and device plugins because the pod's resource boundary can align with CPU and NUMA allocation instead of treating the main container in isolation.
- [User namespaces GA](https://kubernetes.io/blog/2026/04/23/kubernetes-v1-36-userns-ga/): this improves isolation and can change the privileges available to inference infrastructure. It is primarily a security and compatibility feature, with possible startup or runtime overhead depending on the container and device integration.

### Kubernetes v1.37

- [v1.37 release](https://kubernetes.io/blog/2026/08/26/kubernetes-v1-37-release/): the current release continues the shift toward device-aware and workload-aware scheduling.
- [DRA updates for v1.37](https://kubernetes.io/blog/2026/09/03/kubernetes-v1-37-dra-updates/): extended resource requests and device taints reach GA, DRA workload ResourceClaims reach beta, fractional DRA capacity reaches beta, and a standardized `resource.kubernetes.io/numaNode` attribute lets independent drivers agree on NUMA placement. These are directly relevant when multiple inference replicas share a heterogeneous node or when a serving workload spans nodes.
- The same DRA work adds node-allocatable resource requests as alpha, device compatibility groups as alpha, and scheduler prequeueing hints. The first two help express capacity and compatibility. Prequeueing hints target scheduler scalability and can shorten placement delays in large clusters, but they do not reduce steady-state request service time.
- [Pod-level resource managers](https://kubernetes.io/blog/2026/05/01/kubernetes-v1-36-feature-pod-level-resource-managers-alpha/) continue toward beta. The important inference question is whether a pod-level CPU and memory budget is also reflected in CPU, memory, and topology pinning on the exact node image being benchmarked.
- [Metrics API GA](https://kubernetes.io/blog/2026/08/27/kubernetes-v1-37-metrics-api-ga/) improves a standard source for resource measurements. It is useful for autoscaling and diagnostics, but coarse metrics should not replace request traces, runtime counters, or accelerator profiling.

## Impact by serving shape

### One replica on one node

The highest-value controls are CPU Manager, Memory Manager, Topology Manager, cgroup v2, and device allocation. The benchmark should record CPU set, NUMA node, cgroup driver and version, memory pressure, device topology, and whether the pod is Guaranteed QoS. DRA health and binding conditions become useful when an accelerator may be unavailable or still initializing.

### Multiple replicas on one node

The key changes are CPU distribution across physical cores, pod-level resource accounting, DRA consumable capacity, device taints, and NUMA-aware allocation. In-place resize can change the contention pattern while the benchmark is running. Swap should be treated as a possible source of tail latency and noisy-neighbor effects. Sidecars and node daemons must be included in the resource budget because their work competes with tokenization, scheduling, sampling, and data movement.

### Multi-node inference

The important features are workload-aware scheduling, gang or PodGroup semantics, DRA ResourceClaims for workloads, topology-aware scheduling, device compatibility groups, and binding conditions. These features affect whether the complete serving topology is placed together, whether a failed or incompatible device causes a cold-start loop, and whether cross-node communication is introduced by placement. They primarily change startup, recovery, and communication service demand, but those effects can dominate end-to-end latency for distributed inference.

## What belongs in the article

The main article should present this as a release arc rather than enumerate every Kubernetes enhancement:

1. v1.31 and v1.32 make CPU, memory, cgroups, and specialized-device allocation more explicit.
2. v1.33 and v1.34 let pods resize, express aggregate resources, and allocate devices with more structure.
3. v1.35 through v1.37 extend the model from one pod to complete AI/ML workloads, with topology-aware scheduling, workload claims, device health, NUMA attributes, and consumable device capacity.

For the inference model, these features change $S_{\text{host}}$ by changing scheduling, placement, contention, and recovery work. They change $V_{\text{host}}$ when a request encounters extra host callbacks, copies, retries, cross-node hops, or cold replicas. The release blogs and KEPs are implementation context for those variables, not a replacement for measuring them.
