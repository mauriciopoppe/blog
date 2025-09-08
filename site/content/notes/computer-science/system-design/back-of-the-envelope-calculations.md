---
title: "Back of the envelope calculations"
summary: |
  When designing a system, it's important to consider the limitations of the technologies
  chosen. Making some approximate calculations when the system is designed helps
  us decide on the tradeoffs of the different approaches. These approximations include:

  <br />
  This article has a table with latency comparison numbers, common numbers used
  in system design calculations, and some challenges to put all of this info into practice.
image: /images/back-of-the-envelope.jpeg
tags: ["system design", "architecture", "scalability", "back of the envelope"]
libraries: ["math"]
date: "2020-08-08 15:45:36"
references:
  - https://github.com/donnemartin/system-design-primer#latency-numbers-every-programmer-should-know
  - https://sirupsen.com/napkin/
  - http://venkateshcm.com/2014/06/Web-Application-Cache/
  - https://colin-scott.github.io/personal_website/research/interactive_latency.html
  - "'Systems Performance: Enterprise and the Cloud' by Brendan Gregg"
---

Calculate with exponents. A lot of back-of-the-envelope calculations are done with just coefficients and exponents, e.g., $c * 10^e$.
Your goal is to get within an order of magnitude, which is just $e$. $c$ matters a lot less.
Only worrying about single-digit coefficients and exponents makes it much easier on a napkin (not to speak of all the zeros you avoid writing).

```
Latency Comparison Numbers
--------------------------
Source: https://gist.github.com/BlackHC/2d0a3a21542b524a7cf2f8eac977481e
Benchmarks for read: https://ssd.userbenchmark.com/, https://hdd.userbenchmark.com/

L1 cache reference                           0.5 ns
Branch mispredict                            5   ns
L2 cache reference                           7   ns                      14x L1 cache
Mutex lock/unlock                           25   ns
Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
Compress 1K bytes with Snappy            3,000   ns        3 µs
Read 1 MB sequentially from memory      20,000   ns       20 µs  .02 ms  ~50GB/s DDR5
Read 1 MB sequentially from NVMe       100,000   ns      100 µs   .1 ms  ~10GB/sec NVMe, 5x memory
Read 1 MB sequentially from SSD        300,000   ns      300 µs   .3 ms  ~3GB/sec SSD, 15x memory, 3x NVMe
Round trip within same datacenter      500,000   ns      500 µs   .5 ms
Read 1 MB sequentially from HDD      6,000,000   ns    6,000 µs    6 ms  ~150MB/sec, 300x memory, 60x NVMe, 20x SSD
Send 1 MB over 1 Gbps network       10,000,000   ns   10,000 µs   10 ms
Disk seek                           10,000,000   ns   10,000 µs   10 ms  20x datacenter roundtrip
Send packet CA->Netherlands->CA    150,000,000   ns  150,000 µs  150 ms

Notes
-----
1 ns = 10^-9 seconds
1 µs = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 µs = 1,000,000 ns

Cost Numbers
------------
Approximate numbers that should be consistent between Cloud providers.

What    Amount  $/Month
CPU          1      $10
Memory    1 GB       $1
SSD       1 GB     $0.1
HDD       1 GB    $0.01
S3, GCS   1 GB    $0.01
Network   1 GB    $0.01
```

<iframe src="https://instacalc.com/53733/embed" width="100%" height="210" frameborder="0"></iframe>

- 1 request per second = 100k requests/day (exactly 1 req/s = 86.4k req/day).
- 1 request per second = 2.5M requests/month.
- 10 requests per second = 1M requests/day (exactly 11.6 req/s = 1M req/day).
- 40 requests per second = 100 million requests/month.
- 400 requests per second = 1 billion requests/month.
- 6-7 world-wide round trips per second.
- 2,000 round trips per second within a data center.
- 100k commands per second in an in-memory single-threaded data store.
- It's typically the case that we can ignore any memory latency as soon as I/O is involved in a 1Gbps network.
  In cloud datacenters, bandwidth is capped depending on the instance type. From the
  [Google Cloud](https://cloud.google.com/compute/docs/network-bandwidth) docs, there are different
  limits for ingress and egress. For simplicity, let's assume 10Gbps for both.
  - C4 and C4A lowest egress is 10Gbps.
  - C4 and C4A highest egress is 100Gbps.
- Writes are 40 times more expensive than reads; therefore, architect for scaling writes!

## Exercises

We get better at using this table by practicing. https://sirupsen.com/napkin/ has lots of exercises with
different difficulty levels. The following exercises are a warmup for the ones in other places.

Let's assume a data store with the following types:

- In-memory data store: State stored in RAM (volatile).
- Persistent data store: State stored on disk (non-volatile).

The data store can be located:

- In-process: In the same computer.
- Out-of-process: In a different computer (so there's a need for packet transmission over the network).

> Read 1MB from an out-of-process data store. Consider both in-memory and persistent caches (SSD). Assume a 1Gbps and a 10Gbps network.

- 1Gbps
  - (in memory)  `0.02 ms/MB (read from memory) + 10^1 ms (transmission) = 10.02 ms`
  - (persistent) `0.3 ms/MB (read from SSD) + 10^1 ms (transmission) = 10.3 ms`
- 10Gbps
  - (in memory)  `0.02 ms/MB (read from memory) + 10^0 ms (transmission) = 1.02 ms`
  - (persistent) `0.3 ms/MB (read from SSD) + 10^0 ms (transmission) = 1.3 ms`

> Read 5GB from HDD, SSD, and RAM, then write 5GB to the same medium. Assume no network I/O is needed.

Read 5GB:
  - (memory) `5*10^3 MB * 0.02 ms/MB (memory read) = 100ms = 0.1s`
  - (SSD) `5*10^3 MB * 0.3 ms/MB (SSD read) = 1500 ms = 1.5s`
  - (HDD) `5*10^3 MB * 6 ms/MB (HDD read) = 30000 ms = 30s`

Write 5GB, let's assume that a write is 40x slower than a read:
  - (memory) `40 (write penalty) * 0.1s (read) = 4s`
  - (SSD) `40 (write penalty) * 1.5s = 60s`
  - (HDD) `40 (write penalty) * 30s = 1200s`

> Store information about 2B users, including basic info and a profile picture.

- Basic info: name (20 chars), dob (10 chars), email (20 chars) = 50 bytes, $2 * 10^9 * 50 B = 100 GB$
- Profile picture: 100 KB, $2 * 10^9 * 100 * 10^3 B = 200 TB$

> Your SSD-backed database has a usage pattern that rewards you with an 80% page-cache hit rate
 (i.e., 80% of disk reads are served directly out of memory instead of going to the SSD).
 The median number of pages (e.g., InnoDB pages in MySQL) read to serve a query is 50.
 What is the expected average query time from your database?

[The default size of a page in InnoDB is 16KB](https://www.percona.com/blog/2006/06/04/innodb-page-size/).
For each query, we read 50 pages; 50 * 0.8 = 40 are read from memory, and 10 are from SSD.

- 40 pages read from memory: `40 * 16KB * 0.02 ms/MB = 640KB * 10^-3 MB/KB * 0.02 ms/MB = 0.0128 ms`
- 10 pages read from SSD: `10 * 16KB * 0.3 ms/MB = 160KB * 10^-3 MB/KB * 0.3 ms/MB = 0.048ms`

In real life, we just round the numbers: 1ms tops for the sum. It’s typically the case that we can ignore any memory latency as soon as I/O is involved for low Gbps (1GB).

- 1Gbps
  - 50 pages (50 * 16KB = 800KB) transmitted in about 10ms, `1ms (read pages) + 10ms (transmission) = 11ms`
- 10Gbps
  - `1ms (read pages) + 1ms (transmission) = 2ms`

> How many commands-per-second can a simple, in-memory, single-threaded data store do?
> Assume that the commands don't do any server-side processing, e.g., reading data is just
> reading data from memory/disk and isn't applying any algorithms to it.

I/O controls the number of ops/s. Assuming that we transmit 1KB, $\frac{1s}{10 \mu s} = 10^5$ = 100k ops/s.

> What is the amount of computing power needed to process 1PB every day? Assume that the time required for the computation of 1MB is 0.1s.

- `10^9 MB * 10^-1 s/MB = 10^8 s`
- The above has to be computed every day, or in `10^5 s`.
  - `10^8 s * 10^-5 day/s = 10^3 days`

We would need $10^3$ machines to get the work done. Assuming that the servers should be running at
50% capacity and with possible spikes, we can provision $4 * 10^3$ processes.

> We have three storage devices: a 128GB DRAM as a 1st-level cache, a 600GB flash memory as a 2nd-level cache,
> and a rotational disk for storage. With a random read workload, the rotational disk delivers 2,000 reads/s
> with an 8 KB I/O size. How much time would it take to warm both caches in the ideal scenario?

- Throughput in terms of data transmitted over time: `2,000 reads/s * 8 KB = 16 MB/s`.
- 1st-level cache:
  - Time to fill out the cache: `128 GB / 16 MB/s = 8,000 s = ~2.3h`
- 2nd-level cache:
  - Time to fill out the cache: `600 GB / 16 MB/s = 38,400 s = ~10.67h`

