---
title: "Partitioning"
summary: |
  Data partitioning refers to the process of dividing a system's data into smaller, more manageable subsets,
  which are distributed across multiple storage locations or nodes.

  <br />
  This article covers several strategies for partitioning, including random partitioning, by hash key, by range,
  and a hybrid approach for skewed workloads. It also discusses strategies to rebalance partitions, whether there's
  a static or dynamic number of partitions.
image: https://cdn-images-1.medium.com/max/640/1*zDfepdN0iQeqwhBTYeKS2w.png
imageAlt: |
  Image source: https://www.enjoyalgorithms.com/blog/data-partitioning-system-design-concept
tags: ["distributed-systems", "data modeling", "system design", "partitioning"]
date: 2018-01-08T22:43:20Z
---

## With replication

- Copies of each partition are stored in multiple nodes

## Partitioning strategies

- Unfair partitioning may lead to hotspots (e.g., nodes with more data than others).
- Assigning records randomly makes data unreadable.
- By range (e.g., given a dictionary with sorted keys, Node 1 can have words from A to B, Node 2 from B to C, etc.).
  - Within each partition, keys are stored in order.
  - Range scans are easy.
  - This may lead to hotspots (e.g., if all keys belong to the range A to B, Node 1 will become the hotspot).
- By hash key (e.g., take the hash key of the key and assign it to a range, using consistent hashing).
  - It distributes data evenly.
  - No range scans are possible.
  - Cassandra allows a multi-column primary key; the first part of the key is hashed to determine
    the partition, and the other columns are used as a concatenated index for SSTables.
- A hybrid approach can be taken with skewed workloads (e.g., where all writes/reads are for the same key).
  - Append two digits to the key (e.g., key00, key01, ..., key99). This introduces a tradeoff with read performance.

## Rebalancing partitions

Things that change in a database over time:

- More throughput requires more CPU, RAM, and disk, leading to vertical scaling.
- A machine fails, and other machines need to take over its responsibilities.

Rebalancing requirements:

- Load should be fairly shared.
- The database should accept reads/writes while it's being rebalanced.
- No more data than necessary should be moved (to minimize I/O).

Strategies:

- Fixed number of partitions (Riak):
  - When the number of partitions is greater than the number of nodes, multiple partitions are assigned to each node.
  - When a new node is added, it *steals* some partitions from every other node.
  - When a node is removed, it distributes its partitions to every other node.
  - The number of partitions is fixed when the database is set up and is not changed afterward.
  - Choosing the number of partitions is difficult if the size of the dataset varies.
- Dynamic partitioning (MongoDB):
  - A partition is split once it reaches a limit or merged if it has very little data.
  - The number of partitions adapts to the dataset's size.
  - An empty database starts with a single partition, and all writes are directed to the same node;
    consequently, the other nodes remain idle.
- Partitioning proportionally to nodes (Cassandra):
  - There is a fixed number of partitions per node; partitions grow without affecting the nodes.
  - When a node is added, the partitions become smaller, and the data is redistributed.

## Request routing

Problem: How does a client know which node to connect to?

- Clients can connect to any node via a round-robin load balancer.
  - Cassandra and Riak use a gossip protocol to inform about changes in the cluster.
  - A request can be sent to any node, which forwards it to the appropriate node.
  - This puts more complexity on the database to avoid a dependency.
- Requests are sent to a routing tier acting as a partition-aware load balancer.
  - ZooKeeper is a coordination service that keeps track of the cluster metadata, mapping partitions to nodes.
    Whenever a partition is created, updated, or removed, ZooKeeper notifies the routing tier.
- The client is aware of the partition and doesn't need an intermediary.
