---
title: "Cassandra"
description: "The cassandra DB"
tags: ["distributed-systems"]
date: 2020-02-28T20:47:00Z
---

<style>
img {
  max-width: 50%;
}

@media screen and (max-width: 960px) {
  img {
    max-width: 100%;
  }
}
</style>

## Engine

### Features

- Consitent hashing
- Replication factor, replicas of the data across the cluster
- [Consistency level controlled for each query](https://docs.datastax.com/en/archived/cassandra/3.0/cassandra/dml/dmlConfigConsistency.html)
- Up to 2 billion key-value pairs in a row

<hr />

{{< figure src="/images/cassandra-replication.jpeg" title="Cassandra replication" >}}

- Replication factor = 3
- Consistency level = QUORUM
- Clients talks to any node, the node hashes the partition key and finds the location of the data
- Data is read from all the replicas waiting for responses until we reach a quorum

<hr />

{{< figure src="/images/cassandra-write.jpeg" title="Cassandra write" >}}

- Acknowledged when we write to both the commit log (append only) and the memtable
- When the memtable becomes full it's flushed into an SSTable
- Periodically SSTables are merged

<hr />

{{< figure src="/images/cassandra-read.jpeg" title="Cassandra read" >}}

- Check if the key is in the in-memory row cache
- Query the bloomfilters of the existing SSTables to find the record, if it doesn't exist then skip the SSTable
- If the bloomfilter says that there may be data check the in-memory key cache
- On miss get the data from the SSTable and merge it with the data in the memtable, write the key to the in-memory key-cache and merged result to the in-memory row cache

## Data modeling

### Goals

- spread data evenly around the cluster
- minimize the number of partitions read
- keep paritions manageable

### Process

- Identify initial entities and relationships
- Key attributes (map to PK colums)
- Equality search attributes (map to the beggining of the PK)
- Inequality search attributes (map to clustering columns)
- Other attributes
  - Static attributes are shared within a given partition

```text
primary key = partition key + clustering columns
```

### Validation

- Is data evenly spread?
- 1 partition per read?
- Are writes (overwrites) possible?
- How large are the partitions? $n_{cells} = n_{rows} * (n_{cols} - n_{PK} - n_{static}) + n_{static} < 1M$
- How much data duplication?

## Examples

**Store books by ISBN**

<div class="columns">
  <div class="column is-size-6 is-bordered">
  {{% markdown %}}
  | Attribute | Special |
  | ---       | ---     |
  | isbn      | K       |
  | title     | |
  | author    | |
  | genre     | |
  | publisher | |
  {{% /markdown %}}
  </div>
  <div class="column is-three-quarters">
{{% markdown %}}
- Is data evenly spread? Yes
- 1 partition per read? Yes
- Are writes (overwrites) possible? Yes
- How large are the partitions? $1 * (5 - 1 - 0) + 0 &lt; 1M$
- How much data duplication? 0
{{% /markdown %}}
  </div>
</div>

<hr />

**Register a user uniquely identified by an email/password, we also want their fullname. They will be accessed by email and password or by UUID**

<div class="columns">
  <div class="column is-size-6 is-bordered">
  {{% markdown %}}
  | Attribute | Special |
  | --- | --- |
  | email | K |
  | password | C |
  | fullname | |
  | uuid | |
  {{% /markdown %}}
  </div>
  <div class="column is-three-quarters">
{{% markdown %}}

Q1: find users by login info

Q3: find users by email (to guarantee uniqueness)

- Is data evenly spread? Yes
- 1 partition per read? Yes
- Are writes (overwrites) possible? Yes
- How large are the partitions? $1 * (4 - 1 - 0) + 0 &lt; 1M$
- How much data duplication? 0
{{% /markdown %}}
  </div>
</div>

<div class="columns">
  <div class="column is-size-6 is-bordered">
  {{% markdown %}}
  | Attribute | Special |
  | --- | --- |
  | uuid | K |
  | fullname | |
  {{% /markdown %}}
  </div>
  <div class="column is-three-quarters">
{{% markdown %}}
Q2: get users by UUID

- Is data evenly spread? Yes
- 1 partition per read? Yes
- Are writes (overwrites) possible? Yes
- How large are the partitions? $1 * (2 - 1 - 0) + 0 &lt; 1M$
- How much data duplication? 0
{{% /markdown %}}
  </div>
</div>

<hr />

**Find books a logged in user has read sorted by title and author**

<div class="columns">
  <div class="column is-size-6 is-bordered">
  {{% markdown %}}
  | Attribute | Special |
  | ---       | ---     |
  | uuid      | K       |
  | title     | C |
  | author    | C |
  | fullname  | S |
  | ISBN | |
  | genre | |
  | publisher | |
  {{% /markdown %}}
  </div>
  <div class="column is-three-quarters">
{{% markdown %}}
- Is data evenly spread? Yes
- 1 partition per read? Yes
- Are writes (overwrites) possible? Yes
- How large are the partitions? (up to 200k book reads per user)

<div>$$
\begin{align*}
n_{books} * (7 - 1 - 1) + 1 & &lt; 1M \\\\
n_{books} & &lt; \frac{1M}{5} - 1 \\\\
n_{books} & &lt; 200k
\end{align*}
$$</div>

- How much data duplication? 0
{{% /markdown %}}
  </div>
</div>

<hr />

**Interaction of every user in the website**

<div class="columns">
  <div class="column is-size-6 is-bordered">
{{% markdown %}}
| Attribute | Special |
| ---       | ---     |
| uuid      | K       |
| time     | C (desc) |
| element | |
| type | |
{{% /markdown %}}
  </div>
  <div class="column is-three-quarters">
{{% markdown %}}
- Is data evenly spread? Yes
- 1 partition per read? Yes
- Are writes (overwrites) possible? Yes
- How large are the partitions? (up to 333k book reads per user, 333k actions may be low number of actions to store therefore *we should store actions by bucket*)

<div>$$
\begin{align*}
n_{actions} * (4 - 1 - 0) + 0 & &lt; 1M \\\\
n_{actions} & &lt; 333K
\end{align*}
$$</div>

- How much data duplication? 0
{{% /markdown %}}
  </div>
  </div> <!-- I don't know why this is needed because the markup looked fine without this -->
<div>

<div class="columns">
  <div class="column is-size-6 is-bordered">
  {{% markdown %}}
  | Attribute | Special |
  | ---       | ---     |
  | uuid      | K       |
  | month | K |
  | time     | C (desc) |
  | element | |
  | type | |
  {{% /markdown %}}
  </div>
  <div class="column is-three-quarters">
{{% markdown %}}
- Is data evenly spread? Yes
- 1 partition per read? Yes
- Are writes (overwrites) possible? Yes
- How large are the partitions? (up to 333k book reads per user)

```text
1 year  = 333k / 365 / 24 = 38 actions / h
1 month = 333k / 30 / 24  = 462 actions / h (most realistic case)
1 week  = 333k / 7 / 24   = 1984 actions / h
```

<div>$$
\begin{align*}
n_{actions} * (5 - 2 - 0) + 0 & &lt; 1M \\\\
n_{actions} & &lt; 333K
\end{align*}
$$</div>

- How much data duplication? 0
{{% /markdown %}}
  </div>
</div>

## Resources

- https://www.slideshare.net/DataStax/scalable-data-modeling-by-example-carlos-alonso-job-and-talent-cassandra-summit-2016
- https://blog.emumba.com/apache-cassandra-part-5-data-modelling-in-cassandra-9e81a58f4ada
- https://www.datastax.com/blog/2015/02/basic-rules-cassandra-data-modeling
- https://tech.ebayinc.com/engineering/cassandra-data-modeling-best-practices-part-1/
