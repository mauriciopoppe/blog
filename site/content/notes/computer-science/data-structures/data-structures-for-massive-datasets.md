---
title: "Data structures for massive datasets"
description: |
  The algorithms that we use every day to manipulate data assume that we have access to all
  the data we need. What if there's more data that can fit in a single computer or if accessing
  the data itself to do searches is expensive? If so, we can use specialized data structures
  that can help us "estimate" the actual value without actually computing it, in some cases
  an estimate might be good enough. These data structures are: count-min sketch, bloom filters,
  and reservoir-sampling.
image: /images/many-numbers.jpeg
tags: ["data structures", "big data", "probability", "count-min sketch", "bloom filters", "reservoir-sampling"]
date: 2020-05-09 17:24:19
references:
  - https://florian.github.io/count-min-sketch/
  - https://florian.github.io/bloom-filters/
  - https://florian.github.io/reservoir-sampling/
  - https://web.stanford.edu/class/cs168/l/l2.pdf
  - https://livebook.manning.com/book/algorithms-and-data-structures-for-massive-datasets
---

## Count min sketch

Problem: given a stream of data with keys and values, how can we get the sum of all the values for a given key?

Approximate solution: Assume that we have $d$ counter hash maps each one with its own hash function, every time we
see a new key/value we add it to all the $d$ counter hash maps (`update`), to get the sum of values (`estimate`) we
take the hash of the key and return the minimum value of the counters in all the $d$ hash maps,
because the counter hash maps size is finite we will have collisions and a hash map may report a higher sum than what's
the true value.

<i>Images taken from: Algorithms and Data Structures for Massive Datasets</i>
<div class="columns">
    <div class="column">
      {{< figure src="/images/count_min_sketch_update.png" title="Update" class="is-90p" >}}
    </div>
    <div class="column">
      {{< figure src="/images/count_min_sketch_estimate.png" title="Estimate" class="is-90p" >}}
    </div>
</div>

{{< repl id="@mauriciopoppe/Count-Min-Sketch" >}}

https://florian.github.io/count-min-sketch/

### Applications

**Top k elements**, every time we `update` the count min sketch we also call `estimate` and insert the record
to a min heap, when the heap's capacity is greater than $k$ we remove the topmost item from the heap.

**Similarity of words**, assume that we have a stream of pairs `(word, context)`, the problem is to find if two words
A, B are similar in meaning based on the context where they appear, the similarity of two words is computed with:

<div>$$
PMI(A, B) = log \frac{P(A, B)}{P(A) P(B)}
$$</div>

To solve the problem we can create a matrix of size `O(number of words * number of contexts)`.
The intuition behind this formula is that it measures how likely A and B are to occur close to each other (enumerator)
in comparison to how often they would co-occur if they were independent (denominator).

To answer queries we can processes by using a matrix $M$ where the entry $M\_{A,B}$ contains the number of times
the word A appears in the context B, the problem is that the number of word context pairs gets quickly out of hand.

The solution is to transform the matrix such that the word-context pair frequencies are stored in the count-min sketch,
the occurrences of words and contexts are kept in other hash maps.

**Range queries** Use a segment tree where each node is a CMS

<i>Images taken from: Algorithms and Data Structures for Massive Datasets</i>
<div class="columns">
    <div class="column">
      {{< figure src="/images/count_min_sketch_st.png" title="Update" class="is-90p" >}}
    </div>
    <div class="column">
      {{< figure src="/images/count_min_sketch_st_read.png" title="Read" class="is-90p" >}}
    </div>
</div>

**e-approximate heavy hitters** In a stream where the total number of frequencies is $n$ (for example if frequencies are all 1,
then $N$ corresponds to the number of elements encountered thus far in the stream) output all the items that occur
at least $n/k$ times, when $k=2$ this problem is known as the majority element.

If $n$ is known in advance we can process the array elements using a count-min sketch in a single pass,
and remember an element once its estimated frequency (according to the count-min sketch) is at least $n/k$

If $n$ is not known in advance we use a min-heap, in a single pass we maintain the number of elements seen so far $m$
when processing the next element $x$ we call `update(x, 1)` and then `estimate(x)`,
if the estimate is $\geq m/k$ we store $x$ in the heap, Also, whenever $m$ grows to the point that some object $x$ stored
in the heap has a key less than $m/k$ (checkable in O(1) time via Find-Min),
we delete $x$ from the heap (via Extract-Min). After finishing the pass, we output all the objects in the heap

**trending hashtags** Quantify how different the currently observed activity against an estimate of the
expected activity, for each hashtag store how many times it's shared in an X-minute window over the
last Y days $C(h, t)$ (normalized to get $P(h, t)$ i.e. $P(h, t) = \tfrac{C(h, t)}{\sum_{i=0}^{n}C(h, t_i)}$), at a new time $t$ we can compute $C(h, t)$ and $P'(h, t)$ then use
KL divergence to measure the difference between the probabilities

<div>$$
S(h, t) = P(h, t) ln \left ( \frac{P(h, t)}{P'(h, t)} \right )
$$</div>

The top $k$ trending hashtags can be computed with a heap

Based on https://instagram-engineering.com/trending-on-instagram-b749450e6d93

## Bloom filter

Problem: test if an element doesn't exist in a set

Approximate solution: same as count min sketch, if the returned value is zero then we're sure the element
is not in the set, otherwise, it might be in the set, and we need to test for existence with another (more expensive) data structure

https://florian.github.io/bloom-filters/

### Applications

**SSTable reads** In the read path, Cassandra merges data on disk (in SSTables) with data in RAM (in memtables).
To avoid checking every SSTable data file for the partition being requested we can query the SSTable
bloom filter.

## Reservoir sampling

Problem: given a stream of elements, we want to sample k random ones, without replacement and by using uniform probabilities

Solution: store first $k$ elements, for the $i$-th element add it to the reservoir with a probability of $k/i$, this is
done by replacing a randomly selected element in the reservoir

https://florian.github.io/reservoir-sampling/
