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

Problem: count the number of times elements appear in a stream of data

Approximate solution: keep counts in a fixed size matrix with multiple hash functions, the problem is that
there are collisions and multiple keys may have the same hash value, if we have $k$ arrays each with its own hashing 
function we reduce the number of collisions, the returned value is the min value across all of the arrays

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

## Reservoir sampling

Problem: given a stream of elements, we want to sample k random ones, without replacement and by using uniform probabilities

Solution: store first $k$ elements, for the $i$-th element add it to the reservoir with a probability of $k/i$, this is
done by replacing a randomly selected element in the reservoir

https://florian.github.io/reservoir-sampling/