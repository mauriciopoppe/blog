---
title: "Back of the envelope calculations"
description: "Back of the envelope calculations"
tags: ["system design", "architecture", "scalability", "back of the envelope"]
date: 2020-08-08 15:45:36
references:
  - https://github.com/donnemartin/system-design-primer#latency-numbers-every-programmer-should-know
  - https://sirupsen.com/napkin/
  - http://venkateshcm.com/2014/06/Web-Application-Cache/
---

Calculate with exponents. A lot of back-of-the-envelope calculations are done with just coefficients and exponents, e.g. $c * 10^e$.
Your goal is to get within an order of magnitude right that's just $e$. $c$ matters a lot less. 
Only worrying about single-digit coefficients and exponents makes it much easier on a napkin (not to speak of all the zeros you avoid writing).

```markdown
Latency Comparison Numbers
--------------------------
L1 cache reference                           0.5 ns
Branch mispredict                            5   ns
L2 cache reference                           7   ns                      14x L1 cache
Mutex lock/unlock                           25   ns
Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
Compress 1K bytes with Zippy            10,000   ns       10 us
Send 1 KB bytes over 1 Gbps network     10,000   ns       10 us
Read 4 KB randomly from SSD*           150,000   ns      150 us          ~1GB/sec SSD
Read 1 MB sequentially from memory     250,000   ns      250 us
Round trip within same datacenter      500,000   ns      500 us
Read 1 MB sequentially from SSD*     1,000,000   ns    1,000 us    1 ms  ~1GB/sec SSD, 4X memory
HDD seek                            10,000,000   ns   10,000 us   10 ms  20x datacenter roundtrip
Read 1 MB sequentially from 1 Gbps  10,000,000   ns   10,000 us   10 ms  40x memory, 10X SSD
Read 1 MB sequentially from HDD     30,000,000   ns   30,000 us   30 ms 120x memory, 30X SSD
Send packet CA->Netherlands->CA    150,000,000   ns  150,000 us  150 ms

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

Notes
-----
1 ns = 10^-9 seconds
1 us = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 us = 1,000,000 ns
```

<iframe src="https://instacalc.com/53733/embed" width="100%" height="210" frameborder="0"></iframe>

- Read sequentially from main memory, 1MB at 0.25ms, 4 GB/s
- Read sequentially from SSD, 1MB at 1ms, 1 GB/s
- Read sequentially from 1 Gbps Ethernet, 1MB at 10ms, 100 MB/s
- Read sequentially from HDD, 1MB at 30ms, 30 MB/s
- 2.5 million seconds per month
- 86.4k queries per day, ~ 9 * 10^4 queries / second
- 2.5M queries per month, ~ 2.5 * 10^6 queries / second
- 40 requests per second = 100 million requests per month
- 400 requests per second = 1 billion requests per month
- 1M requests per day = 10 requests per second (exact = 11.6)
- 6-7 world-wide round trips per second
- 2000 round trips per second within a data center

## Exercises

- In-memory cache: cached values are stored in RAM memory.
  - (a) in-process: caching with-in application process
  - (b) out-of-process: caching in another process
- Persistent cache : caching in persistent systems like files or database.

> Read 1MB of data from an in-memory and in-process cache

<div>$$
1MB * \frac{0.25 ms}{1MB} = 0.25 ms 
$$</div>

> Read 1MB of data from an in-memory and out-of-process cache

<div>$$
1MB * \frac{0.25 ms}{1MB} + \underbrace{0.5 ms}_\text{round trip within same datacenter} = 0.75 ms
$$</div>

> Read 1MB of data from a persistent and out-of-process cache

<div>$$
1MB * \underbrace{\frac{1 ms}{1MB}}_\text{read 1MB from SSD} + \underbrace{0.5 ms}_\text{round trip within same datacenter} = 1.5 ms
$$</div>

> Your SSD-backed database has a usage-pattern that rewards you with a 80% page-cache hit-rate
 (i.e. 80% of disk reads are served directly out of memory instead of going to the SSD). 
 The median is 50 distinct disk pages for a query to gather its query results (e.g. InnoDB pages in MySQL).
  What is the expected average query time from your database?
  
[The default size of a page in InnoDB is 16KB](https://www.percona.com/blog/2006/06/04/innodb-page-size/), 
for each query we read 50 pages, 50 * 0.8 = 40 are read from memory and 10 from SSD

- 40 pages read from memory: $(40 * 16KB) * \frac{0.25 ms}{1MB} = 640KB * \frac{1MB}{1 * 10^3 KB} * \frac{0.25 us}{1MB} = 0.16 ms$
- 10 pages read from SSD: $(10 * 16KB) * \frac{1 ms}{1MB} = 160KB * \frac{1MB}{1 * 10^3 KB} * \frac{1 ms}{1MB} = 0.16 ms$

Total time: 0.32ms, the results are the same because we're reading 4x from memory more than SSD and SSD is 4x times slower than memory.

In real life we just round the numbers, 1ms tops for the sum. **It’s typically the case that we can ignore any memory latency as soon as I/O is involved.**, 
IO: 50 pages (50 * 16KB = 800KB) transmitted in 10ms, overall result 10ms + 1ms = 11ms 

