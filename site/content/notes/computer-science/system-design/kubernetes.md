---
title: "Kubernetes"
summary: |
  Kubernetes is an open-source container orchestration platform that automates the deployment,
  scaling, and management of containerized applications.

  <br />

tags: ["distributed systems", "container orchestration", "scaling", "user namespace"]
image: https://kubernetes.io/images/kubernetes-horizontal-color.png
imageAlt: |
  Kubernetes, source: [kubernetes.io](https://kubernetes.io)
date: 2023-04-30T18:27:00Z
---

## Presentations

### CSI Windows

<iframe width="560" height="315" src="https://www.youtube.com/embed/_XXn3-yDZA0?start=1013" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### PV/PVC controller

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQSLT0r0lLliTC_q-E7XNpRexuWr7WEeaiWCyIZjS6m8aRaNKbI6blOyP2D0SEDBrz_IYX_Xkk386oz/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

### Debugging K8s e2e tests with delve

<iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQibAetKc5T_7bjJ-GJXFvbMa6Rj5C8rTK_qLAb1tp_rQKvNcsZ_3tFauqSrOWDuKg0pkQMYD1Q3ojK/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>

## Playground

As I started to contribute to kubernetes I created a few environments for easier development.

<div style="text-align: center">
<a href="https://github.com/mauriciopoppe/kubernetes-playground"><img src="https://gh-card.dev/repos/mauriciopoppe/kubernetes-playground.svg"></a>
</div>

Please check it out for examples about:

- Running a [client-go application through skaffold](https://github.com/mauriciopoppe/kubernetes-playground/blob/master/docs/sandbox-with-debugger.md)
- [Running the kube controller manager in debug mode](https://github.com/mauriciopoppe/kubernetes-playground/blob/master/docs/kube-controller-manager.md)
- [Running the kubelet in debug mode](https://github.com/mauriciopoppe/kubernetes-playground/blob/master/docs/kubelet.md)
