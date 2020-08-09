---
title: "Back of the envelope calculations"
description: "Back of the envelope calculations"
tags: ["system design", "architecture", "scalability"]
date: 2020-08-08 15:45:36
references:
- https://github.com/donnemartin/system-design-primer#latency-numbers-every-programmer-should-know
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
Disk seek                           10,000,000   ns   10,000 us   10 ms  20x datacenter roundtrip
Read 1 MB sequentially from 1 Gbps  10,000,000   ns   10,000 us   10 ms  40x memory, 10X SSD
Read 1 MB sequentially from disk    30,000,000   ns   30,000 us   30 ms 120x memory, 30X SSD
Send packet CA->Netherlands->CA    150,000,000   ns  150,000 us  150 ms

Notes
-----
1 ns = 10^-9 seconds
1 us = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 us = 1,000,000 ns
```

<iframe src="https://instacalc.com/53733/embed" width="100%" height="210" frameborder="0"></iframe>

- Read sequentially from disk at 30 MB/s
- Read sequentially from 1 Gbps Ethernet at 100 MB/s
- Read sequentially from SSD at 1 GB/s
- Read sequentially from main memory at 4 GB/s
- 2.5 million seconds per month
- 1 request per second = 86.4k queries per day = 2.5M queries per month
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

**Read 1MB of data from an in-memory and in-process cache**

<div>$$
1MB * \frac{250 us}{1MB} = 250 us 
$$</div>

**Read 1MB of data from an in-memory and out-of-process cache**

<div>$$
1MB * \frac{250 us}{1MB} + \underbrace{500 us}_\text{round trip within same datacenter} = 750 us
$$</div>

**Read 1MB of data from an persistent and out-of-process cache**

<div>$$
1MB * \underbrace{\frac{1 ms}{1MB}}_\text{read 1MB from SSD} + \underbrace{500 us}_\text{round trip within same datacenter} = 1.5 ms
$$</div>