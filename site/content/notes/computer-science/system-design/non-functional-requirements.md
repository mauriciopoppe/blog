---
title: "Non Functional Requirements"
summary: |
  Non-functional requirements refer to quality attributes or system characteristics that describe how well a software system or solution performs or behaves.

  <br />
  This article covers well-known non-functional requirements such as reliability, availability, scalability, performance, and durability.
image: https://s3.amazonaws.com/images.appigo.com/marketing/Appigo.com+Images/pexels-energepiccom-110473-600x450.jpeg
tags: ["system design", "availability", "scalability", "reliability", "performance", "durability"]
date: 2018-01-02T02:14:56Z
references:
- http://venkateshcm.com/2014/06/Web-Application-Cache/
---

## Reliability & Availability

A system should be *resilient* (fault-tolerant) and performant under expected load.

Strategies:

- Design for failure and trigger them deliberately, e.g., kill processes without a warning.
- Consider hardware faults such as blackouts and hard disk crashes, and add redundancy as necessary.
- Consider software faults such as:
  - Processes that slow down or that return corrupted responses.
  - Fault cascading, where a fault triggers faults in other components.
- Measure/monitor the system to identify faults.

## Scalability

A system should be able to handle load increases.

- Queries per second (QPS) to a web server.
- Ratio of reads/writes in a DB.
- Cache hit/miss rate.
- Number of simultaneous users in a real-time system.

Handling load:

- Scaling up (vertical scaling): simple.
- Scaling out (horizontal scaling): complex.
- Manual scale: for predictable systems, simple.
- Elastic scale: add resources as load increases; for unpredictable systems, complex.

## Performance

- Throughput: number of requests processed per second.
- Latency: time to handle the request.
- Response time: latency + network/queue delays.

For the response time, we use percentiles. Given some metrics gathered for a set of requests in a period of time, sort them
from fastest to slowest. The common metrics are p50, p95, p99, p999 (used in SLAs).

When a request involves parallel calls to multiple services, the response time is equal to the service that took the maximum time.

## Durability

Data should not be lost once sent to a system.

## Monitoring & metrics collection

Capture metrics about the data going in and out of the system.
