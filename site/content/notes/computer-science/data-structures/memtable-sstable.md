---
title: "Memtable & SSTable (Sorted String Table)"
description: |
  The pattern of batching data up in memory, tracked in a write ahead log, and periodically flushed to disk is ubiquitous today. OSS examples are LevelDB, Cassandra, InfluxDB, or HBase.

  <br />
  In this article I implement a tiny memtable for a timeseries database in golang and briefly
  talk about how it can be compressed into a sorted string table.

  <br />
image: https://docs.datastax.com/eol/en/dse/6.7/dse-arch/universalcommons/graphics/dmlWriteProcess.png
image_alt: |
  Write path in Cassandra, source https://docs.datastax.com
tags: ["memtable", "sorted string table", "data structures", "big data", "linked list"]
date: 2020-02-29T15:04:00Z
references:
  - https://github.com/facebook/rocksdb/wiki/MemTable
  - https://www.igvita.com/2012/02/06/sstable-and-log-structured-storage-leveldb/
  - https://web.archive.org/web/20180519083057/https://fabxc.org/tsdb/
---

## Memtable

In-memory data structure that holds data in memory before it's flushed into disk serving reads and writes.

For a write operation we write to memory which is fast compared to persistent storage,
eventually, a memtable will surpass a predefined memory threshold and it'll need to be flushed to disk,
while we can define our own write format we can write the memtable in a sorted way to disk as an SSTable
(see SSTable below). Once data is written disk the data becomes immutable (the SSTable cannot be modified),
therefore, new writes go to a new memtable and operations like update or
[delete](https://en.wikipedia.org/wiki/Tombstone_(data_store)) on existing data in the previous memtable
are instead stored in the new memtable.

For a read operation we first check in the current memtable, if the read can't be fulfilled by the current
memtable (maybe the data exists but it's no longer in memory because it was flushed to disk) then we check recently
created SSTables in decreasing creation order until we find the desired record (or we might find it at all).
Because the SSTable is sorted it enables faster reads because we can use binary search to find it in the file.

A memtable can be implemented with a Red-Blac Tree, a SkipList, a HashSkipList, a HashLinkList.
For tradeoffs on these implementations please check the [RocksDB wiki](https://github.com/facebook/rocksdb/wiki/MemTable).

### Applications

Example: design a Timeseries Database with the following requirements:

- For the current time, write a given value for a given list of labels, a label is a pair `labelKey=labelValue` e.g. `[method=http, type=POST, statusCode=200] 1` (value is `1`)
- The labels can be arbitrary strings
- Reads will be for an arbitrary combination of labels and it'll cover a range of time (common)
- Reads will be for an arbitrary combination of labels and it'll cover a point in time (rare)
- Write heavy system
- 99% of the data is never queried after 24h

A memtable fits this problem because it's a write heavy system (therefore we need fast writes),
the common scenario of reads for a range of time would also fit a linked list (either SkipList or HashLinkList),
after a memtable is written to disk in a SSTable it enables slower reads for old data which is an acceptable
tradeoff because 99% of the data is never queried after 24h.

Let's define an entry to be a data structure that holds a collection of labels, a single value and a time.

```go
type Entry struct {
	// id is the time an entry was created (not threadsafe)
	id time.Time
	// labels are the labels that identify the entry.
	labels map[string]string
	// value is the entry value.
	value any
	// next is an pointer to the next Entry.
	next *Entry
}
```

A memtable is a collection of entries with a pointer to the head and the tail of the linked list,
to find entries by label faster we also add a hash map from a label to an entry.

```go
type Memtable struct {
	// head is the head of the linked list.
	head *Entry
	// tail is the head of the linked list.
	tail *Entry
	// index is a reverse index of a label to an entry.
	index map[string][]*Entry
}
```

On write a new entry is added at the tail of the memtable linked list.

```go
func (m *Memtable) Write(labels map[string]string, value any) {
	e := &Entry{
		id:     time.Now(),
		labels: labels,
		value:  value,
	}

	// process entry
	for k, v := range labels {
		key := m.encode(k, v)  // encode creates a unique key in the HashMap
		m.index[key] = append(m.index[key], e)
	}
	m.tail.next = e
	m.tail = m.tail.next
}
```

To read values for an arbitrary combination of labels we need to find for each label the
values pointed by it which can be done through a dictionary (hashmap) that maps a single
label to all the possible entries that have the label. While we can compute this on read
we can also pay the penalty to build the mapping on write.

With the above we got values for single labels, for multiple labels we combine the results
by doing an intersection.

```go
func (m *Memtable) Read(labels map[string]string) []any {
	// read temporary results for every label
	entriesGroup := make([][]*Entry, 0)
	for k, v := range labels {
		key := m.encode(k, v)
		entriesGroup = append(entriesGroup, m.index[key])
	}

	// intersect
	if len(entriesGroup) == 0 {
		return make([]any, 0)
	}
	intersectedEntries := entriesGroup[0]
	for i := 1; i < len(entriesGroup); i += 1 {
		intersectedEntries = intersect(intersectedEntries, entriesGroup[i])
	}

	out := make([]any, 0)
	for _, entry := range intersectedEntries {
		out = append(out, entry.value)
	}
	return out
}
```

{{< repl id="@mauriciopoppe/Memtable-for-a-Timeseries-Database" >}}

## SSTable

An **immutable data structure** that stores a large number of `key:value` pairs sorted by `key`

**Advantages over simple hash indexes**

- Merging SSTables is similar to doing a merge sort
- To find if a key exists we don't need an index of all the keys in memory, instead we can keep an index for every few kilobytes and then perform a scan (sparse index)
- range queries can be compressed before writing to disk, the sparse index would only need to find the starting position of the compressed segment

