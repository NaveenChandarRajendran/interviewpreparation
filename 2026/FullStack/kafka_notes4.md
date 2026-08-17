# Kafka & Microservices Interview Notes

## 1. At-Most-Once, At-Least-Once, Exactly-Once

### At-Most-Once

- **What is it?**
  - A message is processed **zero or one time**.
  - The message may be lost, but duplicate processing is avoided.

- **Where is it used?**
  - When losing a message is acceptable but duplicate processing is not.

- **Simple example**

```text
Producer
   ↓
Kafka
   ↓
Consumer receives message
   ↓
Consumer crashes before processing
   ↓
Message may be lost
```

- **Key point**
  - `0 or 1` processing.
  - No duplicates, but message loss is possible.

### At-Least-Once

- **What is it?**
  - A message is guaranteed to be processed **at least once**, but it may be processed multiple times.

- **Where is it used?**
  - Very common in Kafka-based microservices.
  - Useful when message loss is worse than duplicate processing.

- **Simple example**

```text
Kafka
  ↓
Consumer receives message
  ↓
Process message
  ↓
Consumer crashes before committing offset
  ↓
Consumer restarts
  ↓
Kafka sends the message again
  ↓
Message is processed again
```

- **Important**
  - Duplicate processing is possible.
  - Consumers should often be **idempotent**.

```java
if (!alreadyProcessed(eventId)) {
    processEvent();
    markAsProcessed(eventId);
}
```

### Exactly-Once

- **What is it?**
  - The processing effect happens **exactly once**.

- **Where is it used?**
  - Useful when duplicate side effects are unacceptable.
  - Kafka supports exactly-once semantics for certain Kafka-to-Kafka processing using transactions.
  - For external databases, additional patterns such as idempotency, outbox, or inbox/deduplication may be required.

- **Simple idea**

```text
Message
   ↓
Process
   ↓
Effect happens once
```

### Interview Answer

> At-most-once means a message is processed zero or one time, so messages can be lost. At-least-once means the message is guaranteed to be processed but can be processed multiple times, so duplicates are possible. Exactly-once means the processing effect happens only once, usually using transactional or idempotent mechanisms. In microservices, at-least-once with idempotent consumers is very common.

---

## 2. Kafka Consumer Rebalancing

### What is Consumer Rebalancing?

- **Consumer rebalancing** is the process of redistributing partitions among consumers in the **same consumer group**.
- Kafka performs rebalancing when the membership or partition assignment changes.

### When does rebalancing happen?

- A new consumer joins the group.
- A consumer leaves the group.
- A consumer crashes.
- Partitions are added or assignment changes.

### Simple Example

Suppose:

```text
Topic: orders
Partitions: P0, P1, P2

Consumers:
C1
C2
```

Kafka can assign:

```text
C1 → P0, P1
C2 → P2
```

If C2 crashes:

```text
C1 → P0, P1, P2
```

C1 takes over P2 after rebalancing.

### Why is rebalancing important?

- Provides fault tolerance for consumers.
- Redistributes work when consumers join or leave.
- Can temporarily pause normal processing.
- Too many rebalances can cause processing delays.

### Interview Answer

> Consumer rebalancing in Kafka is the process of redistributing partitions among consumers in the same consumer group when consumers join, leave, crash, or partition assignments change. If one consumer fails, Kafka reassigns its partitions to healthy consumers.

---

## 3. One Partition and One Consumer

### Important Rule

The correct rule is:

> **One partition can be assigned to only one consumer at a time within the same consumer group.**

But:

> **One consumer can consume multiple partitions.**

### Valid

```text
P0 → C1
P1 → C1
P2 → C2
```

C1 consumes both P0 and P1.

### Invalid within the same consumer group

```text
P0 → C1
P0 → C2
```

The same partition cannot simultaneously be actively assigned to two consumers in the same consumer group.

### Example: 4 Partitions, 2 Consumers

```text
C1 → P0, P1
C2 → P2, P3
```

### Example: 2 Partitions, 4 Consumers

```text
C1 → P0
C2 → P1
C3 → idle
C4 → idle
```

### Interview Important Point

> One consumer can handle multiple partitions, but one partition cannot be actively assigned to multiple consumers in the same consumer group.

---

## 4. Kafka Ordering

### What is Kafka Ordering?

- Kafka guarantees ordering **within a partition**.
- Kafka does **not** guarantee global ordering across multiple partitions.

### Example

Suppose:

```text
P0:
O1 → O2 → O3 → O4

P1:
O5 → O6 → O7 → O8 → O9
```

Kafka guarantees:

```text
P0: O1 < O2 < O3 < O4
P1: O5 < O6 < O7 < O8 < O9
```

But it does not guarantee:

```text
O1 → O2 → O3 → O4 → O5 → O6...
```

across P0 and P1.

### What if one consumer consumes P0 and P1?

```text
P0 ──┐
     ├──→ C1
P1 ──┘
```

C1 can consume both partitions, but Kafka does not create a global order between P0 and P1.

### How do we maintain order for an Order Service?

Use the entity ID as the **partition key**.

For example:

```text
key = orderId
```

All events for the same order are routed to the same partition.

```text
Order 101
   ↓
Partition P0

OrderCreated
PaymentCompleted
OrderShipped
OrderDelivered
```

The events for Order 101 remain ordered within P0.

### Important Example

```text
Order 101 → P0
Order 102 → P1
Order 103 → P0
Order 104 → P1
```

Kafka maintains ordering inside P0 and inside P1.

It does not guarantee whether an event for Order 101 happens before or after an event for Order 102.

### Interview Answer

> Kafka provides ordering per partition, not per topic. If we need ordering for a particular entity such as an order, we use the entity ID as the partition key so all events for that entity go to the same partition.

---

## 5. Kafka Retention Policy

### What is Retention?

- Kafka retention determines **how long or how much data Kafka keeps** in a topic.
- Kafka normally does not delete a message immediately after a consumer reads it.

### Time-Based Retention

Common configuration:

```text
retention.ms
```

Example:

```text
retention.ms = 7 days
```

Kafka keeps records for the configured retention period, after which old log segments become eligible for deletion.

### Size-Based Retention

Common configuration:

```text
retention.bytes
```

Example:

```text
retention.bytes = 1 GB
```

Kafka removes old log segments as necessary to maintain the configured retention size.

### Both Can Be Configured

Example:

```text
retention.ms = 7 days
retention.bytes = 1 GB
```

Retention is based on Kafka's log segments, so deletion is not necessarily performed at the exact millisecond a record reaches its retention age.

### Consumer Offset vs Retention

These are different concepts.

**Consumer offset:**

> Where the consumer has progressed in the partition.

**Retention:**

> How long/how much Kafka keeps the records.

A consumer being behind does not automatically make Kafka keep records forever.

### Consumer Down Example

```text
Retention = 7 days

Day 1 → Consumer crashes
Day 4 → Consumer comes back
```

Older records may still be available.

But if the consumer stays down beyond the retention period, old records may already have been deleted.

### Cleanup Policy

Kafka commonly supports:

```text
cleanup.policy=delete
```

and

```text
cleanup.policy=compact
```

#### Delete

Old records are deleted according to retention rules.

#### Compact

Kafka keeps the latest record for a key, subject to compaction behavior.

Example:

```text
user-101 → name=Naveen
user-101 → name=John
user-101 → name=David
```

After compaction, Kafka can retain:

```text
user-101 → name=David
```

Useful for:

- Current state
- Configuration
- Account state
- State reconstruction

### Interview Answer

> Kafka retention policy determines how long or how much data Kafka keeps in a topic. Messages are not deleted immediately after consumption. Kafka can retain data based on time using retention.ms or size using retention.bytes. Retention is independent of consumer offsets. Kafka also supports cleanup policies such as delete and log compaction.

---

## 6. Kafka vs RabbitMQ

### Kafka

- Distributed event-streaming platform.
- Uses topics and partitions.
- Stores messages in a durable log.
- Consumers track offsets.
- Supports replaying events while the data is retained.
- Very high throughput.
- Consumer groups allow multiple independent applications to consume the same events.

### RabbitMQ

- Traditional message broker.
- Uses exchanges, queues, bindings, and consumers.
- Strong message routing.
- Uses acknowledgments to confirm processing.
- Very useful for work queues and task distribution.
- Good for command-based messaging and complex routing.

### Basic Kafka Architecture

```text
Producer
   ↓
Topic
 ┌────┬────┬────┐
 │ P0 │ P1 │ P2 │
 └────┴────┴────┘
   ↓    ↓    ↓
Consumers
```

### Basic RabbitMQ Architecture

```text
Producer
   ↓
Exchange
   ↓
Queue
   ↓
Consumer
```

### Microservices Example

Kafka:

```text
Order Service
     ↓
OrderCreated event
     ↓
Kafka
     ↓
 ┌───────────┬────────────┬──────────────┐
 ↓           ↓            ↓
Payment   Inventory   Notification
```

Multiple consumer groups can independently consume the event.

RabbitMQ:

```text
API
 ↓
RabbitMQ
 ↓
Image Queue
 ↓
 ┌───────┬───────┬───────┐
 ↓       ↓       ↓
Worker1 Worker2 Worker3
```

This is a typical work-queue scenario.

### Kafka vs RabbitMQ Table

| Feature | Kafka | RabbitMQ |
|---|---|---|
| Main idea | Event streaming | Message broker |
| Storage model | Distributed log | Queues |
| Replay | Strong | Different/more limited model |
| Ordering | Per partition | Queue ordering |
| Throughput | Very high | High |
| Routing | Basic compared with RabbitMQ | Excellent |
| Task queues | Possible | Excellent |
| Event streaming | Excellent | Possible |
| Consumer offset | Yes | Acknowledgment model |
| Multiple independent consumers | Consumer groups | Queues/bindings |
| Retention | Built-in | Different queue/TTL model |

### Important Interview Trap

Do not say:

> Kafka is asynchronous and RabbitMQ is synchronous.

Both can be used for asynchronous communication.

### Interview Answer

> Kafka and RabbitMQ are both messaging systems, but Kafka is primarily a distributed event-streaming platform based on durable logs, partitions, offsets, and consumer groups. It is suitable for high-throughput event streaming and replaying events. RabbitMQ is a message broker based around exchanges and queues, with strong routing and acknowledgment capabilities, making it suitable for task queues and command-based messaging.

---

## 7. Kafka Replication Factor

### What is Replication Factor?

> Replication factor is the number of copies of each partition that Kafka keeps across different brokers.

### Example

Suppose:

```text
Topic: orders
Partitions: 3
Replication Factor: 3
```

A partition can look like:

```text
P0
├── Broker 1 → Leader
├── Broker 2 → Follower
└── Broker 3 → Follower
```

Each partition has three replicas.

### Why Replication?

For fault tolerance.

If the leader broker fails:

```text
Broker 1 💥
```

Kafka can elect an eligible in-sync follower as the new leader:

```text
Broker 2 → New Leader
```

The application can continue working.

### Replication Factor vs Partitions

**Partitions:**

- Provide parallelism.
- Determine the unit of ordering.

**Replication factor:**

- Provides copies of partitions.
- Improves fault tolerance and availability.

### Important

Replication factor does NOT mean three consumers process the same message.

Example:

```text
P0
├── B1 → Leader
├── B2 → Replica
└── B3 → Replica
```

The leader normally handles client reads/writes for the partition, while followers replicate the data.

### Interview Answer

> Replication factor in Kafka defines the number of replicas maintained for each partition across different brokers. One replica acts as the leader and the others are followers. If the leader fails, Kafka can elect an in-sync follower as the new leader, providing fault tolerance.

---

## 8. Kafka ISR

### What is ISR?

**ISR = In-Sync Replicas**

ISR is the set of partition replicas that are sufficiently caught up with the leader and are eligible to be considered for leadership according to Kafka's rules.

### Example

Replication factor = 3:

```text
P0
├── B1 → Leader
├── B2 → Follower
└── B3 → Follower
```

If all replicas are caught up:

```text
ISR = {B1, B2, B3}
```

### Follower Falls Behind

Suppose:

```text
B1 → M1 M2 M3 M4 M5
B2 → M1 M2 M3 M4 M5
B3 → M1 M2
```

B3 is behind and may be removed from the ISR.

```text
ISR = {B1, B2}
```

When B3 catches up, it can be added back to the ISR.

### Leader Failure

```text
B1 → Leader 💥
B2 → In-sync
B3 → Out-of-sync
```

Kafka can elect B2 as the new leader because it is in sync.

### Replication Factor vs ISR

```text
Replication Factor = how many replicas exist

ISR = which replicas are currently in sync
```

Example:

```text
Replication Factor = 3

Replicas:
B1, B2, B3

Current ISR:
B1, B2
```

### Interview Answer

> ISR stands for In-Sync Replicas. It is the set of partition replicas that are sufficiently caught up with the leader. If the leader fails, Kafka can elect an in-sync follower as the new leader. ISR is therefore important for Kafka's durability and fault tolerance.

---

## 9. How Kafka Handles Failures

Kafka handles failures mainly through:

- Replication
- ISR
- Leader election
- Consumer-group rebalancing
- Producer acknowledgments and retries

### Broker / Leader Failure

Normal state:

```text
B1 → Leader
B2 → Follower
B3 → Follower

ISR = {B1, B2, B3}
```

If B1 fails:

```text
B1 💥
```

Kafka can elect an in-sync follower:

```text
B2 → New Leader
B3 → Follower
```

This is called **leader election**.

### Follower Failure

If B3 fails:

```text
B1 → Leader ✅
B2 → Follower ✅
B3 → Follower ❌
```

Kafka can remove B3 from the ISR:

```text
ISR = {B1, B2}
```

When B3 returns and catches up:

```text
ISR = {B1, B2, B3}
```

### Consumer Failure

Suppose:

```text
P0 → C1
P1 → C2
```

C2 crashes:

```text
C2 💥
```

Kafka detects the consumer-group membership change and rebalances:

```text
P0 → C1
P1 → C1
```

This is different from broker failure.

```text
Broker failure → Replication + Leader Election

Consumer failure → Consumer Group Rebalancing
```

### Producer Failure

Suppose:

```text
Producer
   ↓
Kafka
```

If Kafka successfully receives and acknowledges the message, the message is stored according to Kafka's durability configuration.

If the producer does not receive an acknowledgment, it may retry depending on producer configuration.

Important producer settings include:

```text
acks
retries
```

For stronger durability, production systems commonly use appropriate replication and acknowledgment settings, often including:

```text
acks=all
```

### Multiple Broker Failures

Replication factor determines how many copies exist.

Example:

```text
Replication Factor = 3

P0:
B1 → Leader
B2 → Replica
B3 → Replica
```

If B1 fails:

```text
B2 or B3 can potentially become leader
```

If enough replicas become unavailable, the partition may become unavailable depending on the cluster state and configuration.

Replication does not mean Kafka can survive an unlimited number of broker failures.

### Complete Failure Summary

```text
Broker/Leader fails
        ↓
ISR / Replica
        ↓
Leader Election
        ↓
New Leader

Consumer fails
        ↓
Consumer Group detects failure
        ↓
Rebalance
        ↓
Partitions reassigned

Follower falls behind
        ↓
Removed from ISR
        ↓
Catches up
        ↓
Added back to ISR

Producer does not receive ACK
        ↓
Retry depending on configuration
```

### Interview Answer

> Kafka handles failures primarily through partition replication and ISR. Each partition can have multiple replicas, with one leader and multiple followers. If the leader fails, Kafka can elect an in-sync follower as the new leader. If a follower falls behind, it can be removed from the ISR and added back after catching up. Consumer failures are handled separately through consumer-group rebalancing, where partitions are reassigned to healthy consumers. Producer reliability is handled through acknowledgments and retries.
