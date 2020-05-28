---
title: "Memtable & SSTable (Sorted String Table)"
tags: []
date: 2020-02-29T15:04:00Z
references:
  - https://github.com/facebook/rocksdb/wiki/MemTable
  - https://www.igvita.com/2012/02/06/sstable-and-log-structured-storage-leveldb/
---

### Memtable

In-memory data structure that holds data before it's flushed into an SStable, the implementation may use a RB Tree, a skiplist, a HashLinkList

### SSTable

An **immutable data structure** that stores a large number of `key:value` pairs sorted by `key`

**Advantages over simple hash indexes**

- Merging SSTables is similar to doing a merge sort
- To find if a key exists we don't need an index of all the keys in memory, instead we can keep an index for every few kilobytes and then perform a scan (sparse index)
- range queries can be compressed before writing to disk, the sparse index would only need to find the starting position of the compressed segment

