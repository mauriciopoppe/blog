---
title: "Memtable & SSTable (Sorted String Table)"
description: |
  The pattern of batching data up in memory, tracked in a write ahead log, and periodically flushed to disk is ubiquitous today. OSS examples are LevelDB, Cassandra, InfluxDB, or HBase.

  <br />
  In this article I implement a tiny memtable for a timeseries database in golang and briefly
  talk about how it can be compressed into a sorted string table.

  <br />
image: https://docs.datastax.com/eol/en/dse/6.7/dse-arch/universalcommons/graphics/dmlWriteProcess.png
tags: ["memtable", "sorted string table", "data structures", "big data", "linked list"]
date: 2020-02-29T15:04:00Z
references:
  - https://github.com/facebook/rocksdb/wiki/MemTable
  - https://www.igvita.com/2012/02/06/sstable-and-log-structured-storage-leveldb/
  - https://web.archive.org/web/20180519083057/https://fabxc.org/tsdb/
---

*Image taken from https://docs.datastax.com*

### Memtable

In-memory data structure that holds data before it's flushed into an SStable, the implementation may use a RB Tree, a skiplist, a HashLinkList.

Example: let's design the interface for a Timeseries Database with the following requirements:

- For the current time, write a given value for a given list of labels, a label is a pair `labelKey=labelValue` e.g. `[method=http, type=POST, statusCode=200] 1` (value is `1`)
- The labels can be arbitrary strings
- Reads will be for an arbitrary combination of labels and it'll cover a range of time (common)
- Reads will be for an arbitrary combination of labels and it'll cover a point in time (rare)
- Heavy write system
- 99% of the data is never queried after 24h

Let's define an entry to be a data structure that holds a collection of labels, a single value and a time.

Since it's a write heavy system we have to ensure fast writes, after writing an entry to
a write ahead log we can use a linked list to store the entry (at the tail of the list).

To read values for an arbitrary combination of labels we need to find for each label the
values pointed by it which can be done through a dictionary (hashmap) that maps a single
label to all the possible entries that have the label. While we can compute this on read
we can also pay the penalty to build the mapping on write.

With the above we got values for single labels, for multiple labels we combine the results
by doing an intersection.

{{< repl id="@mauriciopoppe/Memtable-for-a-Timeseries-Database" >}}

### SSTable

An **immutable data structure** that stores a large number of `key:value` pairs sorted by `key`

**Advantages over simple hash indexes**

- Merging SSTables is similar to doing a merge sort
- To find if a key exists we don't need an index of all the keys in memory, instead we can keep an index for every few kilobytes and then perform a scan (sparse index)
- range queries can be compressed before writing to disk, the sparse index would only need to find the starting position of the compressed segment

