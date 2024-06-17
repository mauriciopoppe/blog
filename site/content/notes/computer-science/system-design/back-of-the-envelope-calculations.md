---
title: "Back of the envelope calculations"
summary: |
  When designing a system it's important to consider the limitations of the technologies
  chosen, making some approximate calculations when the system is designed help
  us decide on the tradeoffs of the different approaches, these approximations include

  <br />
  This article has a table with latency comparison numbers, common numbers used
  in system design calculations and some challenges to put all of these info into practice.
image: /images/back-of-the-envelope.jpeg
tags: ["system design", "architecture", "scalability", "back of the envelope"]
libraries: ["math"]
date: 2020-08-08 15:45:36
references:
  - https://github.com/donnemartin/system-design-primer#latency-numbers-every-programmer-should-know
  - https://sirupsen.com/napkin/
  - http://venkateshcm.com/2014/06/Web-Application-Cache/
  - https://colin-scott.github.io/personal_website/research/interactive_latency.html
---

Calculate with exponents. A lot of back-of-the-envelope calculations are done with just coefficients and exponents, e.g. $c * 10^e$.
Your goal is to get within an order of magnitude right that's just $e$. $c$ matters a lot less.
Only worrying about single-digit coefficients and exponents makes it much easier on a napkin (not to speak of all the zeros you avoid writing).

```markdown
Latency Comparison Numbers
--------------------------
(From 2017 in https://colin-scott.github.io/personal_website/research/interactive_latency.html)
The numbers of 2017 are easy to remember because of the exponents they use, look at "Read 1MB from X"

L1 cache reference                           0.5 ns
Branch mispredict                            5   ns
L2 cache reference                           7   ns                      14x L1 cache
Mutex lock/unlock                           25   ns
Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
Compress 1KB with Zippy                  2,000   ns
Read 1 MB sequentially from memory       6,000   ns        6 us .006 ms  10^-2 ms
SSD Random read                         16,000   ns       16 us .016 ms
Read 1 MB sequentially from SSD*       100,000   ns      100 us   .1 ms  10^-1 ms
HDD Random read                      3,000,000   ns    3,000 us    3 ms
Read 1 MB sequentially from HDD      1,000,000   ns    1,000 us    1 ms  10^0  ms
Send 1 KB bytes over 1 Gbps network     10,000   ns       10 us  .01 ms
Read 1 MB sequentially from 1 Gbps  10,000,000   ns   10,000 us   10 ms  10^+1 ms
Read 1 MB sequentially from 10 Gbps  1,000,000   ns    1,000 us    1 ms  10^0 ms
Round trip within same datacenter      500,000   ns      500 us   .5 ms
Send packet CA->Netherlands->CA    150,000,000   ns  150,000 us  150 ms

Notes
-----
1 ns = 10^-9 seconds
1 us = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 us = 1,000,000 ns

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

- For reads: 1 SSD read = 10 memory reads, 1 HDD read = 10 SSD reads
- 1 request per second = 100k requests / day (exact 1 req/s = 86.4k req/day)
- 1 request per second = 2.5M requests / month
- 10 requests per second = 1M requests per day (exact 11.6 req/s = 1M req/day)
- 40 requests per second = 100 million requests per month
- 400 requests per second = 1 billion requests per month
- 6-7 world-wide round trips per second
- 2000 round trips per second within a data center
- 100k commands per second in an in-memory single-threaded data store
- It's typically the case that we can ignore any memory latency as soon as I/O is involved in a 1Gbps network,
  in cloud datacenters bandwidth is capped depending on the instance type, from the
  [Google Cloud](https://cloud.google.com/compute/docs/network-bandwidth) docs there are different
  limits for ingress and egress, for simplicity let's assume 10Gbps for both.
- Writes are 40 times more expensive than reads, therefore architect for scaling writes!

## Exercises

We get better at using this table by practicing, https://sirupsen.com/napkin/ has lots of exercises with
different difficulty levels. The following exercises are a warmup to the ones in other places.

Cache types:

- In-memory cache: cached values in RAM memory (volatile).
- Persistent cache: caching in disk (non volatile).

Locality:

- in-process: in the same computer.
- out-of-process: in a different computer.

Exponent warmup (read 1MB in ms)
- HDD = 10^0 ms, SSD = 10^-1 ms, memory = 10^-2 ms

> Read 1MB from an out-of-process cache, consider both in-memory and persistent caches, assume a 1Gbps network.

- (in memory)  1MB * 10^-2 ms/MB (read from memory) + 10^1 ms (transmission) = 10.01 ms
- (persistent) 1MB * 10^-1 ms/MB (read from SSD) + 10^1 ms (transmission) = 10.1 ms

> Read 1MB from an out-of-process cache, consider both in-memory and persistent caches, assume a 10Gbps network

- (in memory)  1MB * 10^-2 ms/MB (read from memory) + 10^0 ms (transmission) = 1.01 ms
- (persistent) 1MB * 10^-1 ms/MB (read from SSD) + 10^0 ms (transmission) = 1.1 ms

> Write 5GB to an attached HDD, SSD and RAM. Assume no network IO needed

Write 5GB
  - Write is 40 times slower than reads
  - (HDD) 40 (write penalty) * 5*10^3 MB * 10^0 (HDD read) = 20 * 10^3 ms = 20s
  - (SSD) 20 * 10^2 ms (previous result / 10) = 2s
  - (memory) 20 * 10 ms (previous result / 10) = 200ms

> Store information about 2B users including basic info and a profile picture

- Basic info: name (20 chars), dob (10 chars), email (20 chars) = 50 bytes, $2 * 10^9 * 50 B = 100 GB$
- Profile picture: 100 KB, $2 * 10^9 * 100 * 10^3 B = 200 TB$

> Your SSD-backed database has a usage-pattern that rewards you with a 80% page-cache hit-rate
 (i.e. 80% of disk reads are served directly out of memory instead of going to the SSD).
 The median number of pages (e.g. InnoDB pages in MySQL) read to serve a query is 50 .
 What is the expected average query time from your database?

[The default size of a page in InnoDB is 16KB](https://www.percona.com/blog/2006/06/04/innodb-page-size/),
for each query we read 50 pages, 50 * 0.8 = 40 are read from memory and 10 from SSD

- 40 pages read from memory: 40 * 16KB * 10^-2 ms/MB = 640KB * 10^-3 MB/KB * 10^-2 ms/MB = 0.0064 ms
- 10 pages read from SSD: 10 * 16KB * 10^-1 ms/MB = 160KB * 10^-3 MB/KB * 10^-1 ms/MB = 0.016ms

In real life we just round the numbers, 1ms tops for the sum. **It’s typically the case that we can ignore any memory latency as soon as I/O is involved.**,

- (1Gbps) 50 pages (50 * 16KB = 800KB) transmitted in about 10ms, 1ms (read pages) + 10ms (transmission) = 11ms
- (10Gbps) 1ms (read pages) + 1ms (transmission) = 1ms

> How many commands-per-second can a simple, in-memory, single-threaded data store do?
> Assume that the commands don't do any server side processing. e.g. Reading data is just
> reading data from the memory/disk and isn't applying any algorithms on it.

I/O controls the number of ops/s, assuming that we transmit 1KB $\frac{1s}{10 us} = 10^5$ = 100k ops/s

> Amount of computing power to process 1PB everyday, assume that the time required for the computation of 1MB is 0.1s

- 10^9 MB * 10^01 s/MB = 10^8 MB
- The above has to be computed everyday or in 10^5 s
  - 10^8 s * 10^-5 day/s = 10^3 days

We would need $10^3$ machines to get the work done, assuming that the servers should be running at
50% capacity and with possible spikes we can provision $4 * 10^3$ processes.

