---
title: "Back of the envelope calculations"
description: "Back of the envelope calculations"
tags: ["system design", "architecture", "scalability", "back of the envelope"]
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

L1 cache reference                           0.5 ns
Branch mispredict                            5   ns
L2 cache reference                           7   ns                      14x L1 cache
Mutex lock/unlock                           25   ns
Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
Compress 1KB with Zippy                  2,000   ns
Read 1 MB sequentially from memory      10,000   ns       10 us  .01 ms  10^-2 ms
SSD Random read                         10,000   ns       10 us  .01 ms
Read 1 MB sequentially from SSD*       100,000   ns      100 us   .1 ms  10^-1 ms
HDD Random read                      3,000,000   ns    3,000 us    3 ms
Read 1 MB sequentially from HDD      1,000,000   ns    1,000 us    1 ms  10^0  ms
Send 1 KB bytes over 1 Gbps network     10,000   ns       10 us  .01 ms
Read 1 MB sequentially from 1 Gbps  10,000,000   ns   10,000 us   10 ms
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

What	Amount	  $/Month
CPU          1	      $10
Memory	  1 GB	       $1
SSD	      1 GB	     $0.1
HDD  	  1 GB	    $0.01
S3, GCS   1 GB	    $0.01
Network	  1 GB	    $0.01
```

<iframe src="https://instacalc.com/53733/embed" width="100%" height="210" frameborder="0"></iframe>

- For reads: 1 SSD = 10 memory, 1 HDD = 10 SSD
- 1 query per second = 86.4k queries / day, 9 * 10^4 queries / second (10^5 seconds every day)
- 1 query per second = 2.5M queries / month, 
- 40 requests per second = 100 million requests per month
- 400 requests per second = 1 billion requests per month
- 1M requests per day = 10 requests per second (exact = 11.6)
- 6-7 world-wide round trips per second
- 2000 round trips per second within a data center
- 100k commands per second in an in-memory single-threaded data store
- It's typically the case that we can ignore any memory latency as soon as I/O is involved
- Writes are 40 times more expensive than reads, therefore architect for scaling writes!

## Exercises

- In-memory cache: cached values are stored in RAM memory.
  - (a) in-process: caching with-in application process
  - (b) out-of-process: caching in another process
- Persistent cache : caching in persistent systems like files or database.

> Read 1MB of data from an in-memory and out-of-process cache

<div>$$
1MB * \underbrace{\frac{10^{-2} ms}{1MB}}_\text{read 1MB from memory} + \underbrace{10 ms}_\text{1MB over 1 Gbps network} = 10.01 ms
$$</div>

> Read 1MB of data from a persistent and out-of-process cache

<div>$$
1MB * \underbrace{\frac{10^{-1} ms}{1MB}}_\text{read 1MB from SSD} + \underbrace{10 ms}_\text{1MB over 1 Gbps network} = 10.1 ms
$$</div>

> Your SSD-backed database has a usage-pattern that rewards you with a 80% page-cache hit-rate
 (i.e. 80% of disk reads are served directly out of memory instead of going to the SSD).
 The median is 50 distinct disk pages for a query to gather its query results (e.g. InnoDB pages in MySQL).
  What is the expected average query time from your database?

[The default size of a page in InnoDB is 16KB](https://www.percona.com/blog/2006/06/04/innodb-page-size/),
for each query we read 50 pages, 50 * 0.8 = 40 are read from memory and 10 from SSD

- 40 pages read from memory: $(40 * 16KB) * \frac{0.01 ms}{1MB} = 640KB * \frac{1MB}{1 * 10^3 KB} * \frac{0.01 ms}{1MB} = 0.0064 ms$
- 10 pages read from SSD: $(10 * 16KB) * \frac{0.1 ms}{1MB} = 160KB * \frac{1MB}{1 * 10^3 KB} * \frac{0.1 ms}{1MB} = 0.016 ms$

In real life we just round the numbers, 1ms tops for the sum. **It’s typically the case that we can ignore any memory latency as soon as I/O is involved.**,
IO: 50 pages (50 * 16KB = 800KB) transmitted in about 10ms, overall result 10ms + 1ms = 11ms

> How many commands-per-second can a simple, in-memory, single-threaded data-store do?

I/O controls the number of ops/s, assuming that we transmit 1KB $\frac{1s}{10 us} = 10^5$ = 100k ops/s

> Amount of computing power to process 1PB everyday, assume that the time required for the computation of 1MB is 0.1s

<div>$$
10^9 MB * \frac{10^{-1} s}{1 MB} = 10^8 s
$$</div>

The above has to be computed everyday or in $10^5 s$

<div>$$
10^8 s * \frac{1 day}{10^5 s}= 10^3 days
$$</div>

We would need $10^3$ machines to get the work done, assuming that the servers should be running at 50% capacity and 
with possible spikes we can provision $4 * 10^3$ processes.

> Store information about 2 billion users including basic info and a profile picture

- Basic info: name (20 chars), dob (10 chars), email (20 chars) = 50 B, $2 * 10^9 * 50 B = 100 GB$
- Profile picture: 100 KB, $2 * 10^9 * 100 * 10^3 B = 200 TB$