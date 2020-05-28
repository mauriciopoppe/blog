---
title: "Probabilistic Data Structures"
tags: []
date: 2020-05-09 17:24:19
references:
  - https://florian.github.io/count-min-sketch/
  - https://florian.github.io/bloom-filters/
  - https://florian.github.io/reservoir-sampling/
---

## Count min sketch

Problem: count the number of times elements appear in a stream of data

Approximate solution: keep counts in a fixed size array with a hash function, the problem is that
there are collisions and multiple keys may have the same hash value, if we have $k$ arrays each with its own hashing 
function we reduce the number of collisions, the returned value is the min value across all of the arrays

https://florian.github.io/count-min-sketch/

## Bloom filter

Problem: test if an element exists in a set

Approximate solution: same as count min sketch, if the returned value is zero then we're sure that the element
is not in the set otherwise it might be in the set

https://florian.github.io/bloom-filters/

## Reservoir sampling

Problem: given a stream of elements, we want to sample k random ones, without replacement and by using uniform probabilities

Solution: store first $k$ elements, for the $i$-th element add it to the reservoir with a probability of $k/i$, this is
done by replacing a randomly selected element in the reservoir

https://florian.github.io/reservoir-sampling/