---
title: "Partitioning"
description: "Partitioning"
tags: ["distributed-systems"]
date: 2018-01-08T22:43:20Z
---

## With replication

- Copies of each partition are stored in multiple nodes

## Partitioning strategies

- unfair partitioning may lead to hotspots e.g. nodes with more data than the others
- assign records randomly, can't read data
- by range e.g. given a dictionary with sorted keys node 1 can have words from A -> B, node 2 B -> C, etc
  - within each partition keys are stored in order
  - range scans are easy
  - may lead to hotspots e.g. if all the keys belong to the range A -> B node 1 will be the hotspot
- by hash key e.g. take the hashkey of the key and assign it to a range (consistent hashing)
  - distributes data evenly
  - no range scans
  - cassandra allows a multi-column primary key, the first part of the key is hashed to determine
    the partition and the other columns are used as a concatenated index to use SSTables
- take a hybrid approach with skewed workloads e.g. where all the writes/reads are for the same key
  - append 2 digits to the key e.g. key00, key01, ..., key99, key00 = tradeoff with read

## Rebalancing partitions

Things that change in a database over time:

- more throughput = more cpu,ram,disk = vertical scaling
- a machine fails and other machines need to take over the machine's reponsabilities

Rebalancing requirements:

- load should be fairly shared
- the DB should accept read/writes while it's being rebalanced
- no more data than necessary should be moved (minimize IO)

Strategies:

- fixed number of partitions (Riak)
  - when # of partitions > # of nodes, assign multiple partitions to each node
  - when a new node is added it *steals* some partitions from every other node
  - when a node is removed it distributes its partitions to every other node
  - the # of partitions is fixed when the DB is set up and not changed afterward
  - choosing the # of partitions is difficult if the size of the dataset varies
- dynamic partitioning (MongoDB)
  - a partition is split once it reaches a limit or merged if it has very little data
  - # of partitions adapt to the size of the dataset
  - an empty DB starts with a single partition and all the writes are written to the same node
    i.e. the other nodes are idle
- partitioning proportionally to nodes (Cassandra)
  - fixed number of partitions per node, partitions grow without affecting the nodes
  - when a node is added the partitions become smaller and the data is redistributed

## Request routing

Problem: how does a client know which node to connect to?

- Allow clients to connect to any node via a round-robin load balancer
  - Cassandra and Riak use a gossip protocol to inform of changes in the cluster
  - A request can be sent to any node which forwards it to the appropiate node
  - Puts more complexity on the DB to avoid a dependency
- Send requests to a routing tier acting as a partition aware load-balancer
  - ZooKeeper is a coordination service that keeps track of the cluster metadata mapping partitions to nodes,
    whenever a partition is created/updated/removed ZooKeeper notifies the routing tier
- Client is aware of the partition and doesn't need an intermediary

