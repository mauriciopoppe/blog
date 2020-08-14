---
title: "Data Structures for Massive Datasets"
tags: ["data structures", "big data", "probability"]
date: 2020-05-09 17:24:19
references:
  - https://florian.github.io/count-min-sketch/
  - https://florian.github.io/bloom-filters/
  - https://florian.github.io/reservoir-sampling/
---


## Bloom filter

Problem: test if an element exists in a set

Approximate solution: same as count min sketch, if the returned value is zero then we're sure that the element
is not in the set otherwise it might be in the set

https://florian.github.io/bloom-filters/

## Count min sketch

Problem: given a stream of data with keys and values, how can we get the sum of all the values for a given key?

Approximate solution: Assume that we have $d$ counter hash maps each one with its own hash function, every time we
see a new key/value we add it to all the $d$ counter hash maps (`update`), to get the sum of values (`estimate`) we
take the hash of the key and return the minimum value of the counters in all the $d$ hash maps, 
because the counter hash maps size is finite we will have collisions and a hash map may report a higher sum than what's
the true value.

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

- **Top k elements**, every time we `update` the count min sketch we also call `estimate` and insert the record
to a min heap, when the heap's capacity is greater than $k$ we remove the topmost item from the heap.
- **Similarity of words**, assume that we have a stream of pairs `(word, context)`, the problem is to find if two words
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
 
## Reservoir sampling

Problem: given a stream of elements, we want to sample k random ones, without replacement and by using uniform probabilities

Solution: store first $k$ elements, for the $i$-th element add it to the reservoir with a probability of $k/i$, this is
done by replacing a randomly selected element in the reservoir

https://florian.github.io/reservoir-sampling/