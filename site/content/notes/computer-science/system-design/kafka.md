---
title: "Kafka"
summary: |
  Kafka is a distributed event streaming platform designed for building high-throughput, fault-tolerant, and scalable data streaming applications.

  <br />
  This article covers key designs in Kafka, such as how messages for a topic are shared into partitions assigned to brokers. Then, we see some
  guarantees about producers, consumers, and consumer groups.
tags: ["distributed systems", "producer consumer", "message broker", "data streams", "partitioning"]
image: https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Apache_kafka_wordtype.svg/1200px-Apache_kafka_wordtype.svg.png
date: 2020-02-29T15:36:00Z
references:
- https://www.cloudamqp.com/blog/2019-12-12-when-to-use-rabbitmq-or-apache-kafka.html
---

## Kafka

[https://www.slideshare.net/mumrah/kafka-talk-tri-hug](https://www.slideshare.net/mumrah/kafka-talk-tri-hug)

### Key Choices

- pub/sub messaging pattern
- Messages are persistent (stored on disk).
- Consumers keep their own state (stored in Zookeeper).

### Technology Summary

| Concept | Notes |
| --- | --- |
| Brokers | Receive messages from producers (sequential write, push) and deliver messages to consumers (sequential read, pull).<br />Messages are flushed to append-only log files. |
| Topics | A logical collection of partitions mapped across many brokers. |
| Partition | Physical append-only log files. A broker contains some of the partitions for a topic. |
| Replication | Partitions are replicated. One broker is the leader, and all writes/reads must go through it (replication is for fault tolerance only). Replication can be tuned to write to N replicas. |
| Producer | Responsible for load balancing messages among brokers. They can discover all brokers from a single one.<br />High-level API: `Producer#send(String topic, K key, V value)`.<br />Determines the partition based on the key (default hash mod), e.g., `send("A", "foo", message)` in the example below: `"foo" mod 2`.<br />No total ordering across partitions.<br />Guaranteed ordering inside the partition. This is useful if the key is a PK; if so, all the messages related to that key will be ordered. |
| Consumer | Requests a range of messages from a broker. Responsible for its own state, i.e., its own iterator.<br />High-level API: `Map<String, List<KafkaStream>> Consumer.connector(Collections.singletonMap("topic", nPartitions))`.<br />Blocking/non-blocking behavior. |
| Consumer Group | Multiple consumers can be part of a consumer group coordinated with Zookeeper. **In a group, each partition will be consumed by exactly one consumer.**<br />Consequence: broadcast/pub-sub (if all the consumer instances have different consumer groups) and load balance/queue (if all the consumer instances have the same consumer group). |

<div class="tw-flex tw-gap-4 tw-flex-col md:tw-flex-row">
    <div class="">
        {{< figure src="/images/kafka-broker-topic-partition.png" title="Broker - Partition - Topic" >}}
    </div>
    <div class="">
        {{< figure src="/images/kafka-consumer-groups.png" title="Consumer Groups" >}}
    </div>
</div>

### Useful numbers

- 50MB/s (producer throughput), 100 MB/s (consumer throughput)
- [https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines](https://engineering.linkedin.com/kafka/benchmarking-apache-kafka-2-million-writes-second-three-cheap-machines)

### Applications

- Notification: A updates a record and sends a "record updated" message. B consumes the message and asks A for the updated record to sync its copy.
- Stream Processing: Data is produced and written into Kafka. Consumer groups process these messages and write them back to Kafka.
