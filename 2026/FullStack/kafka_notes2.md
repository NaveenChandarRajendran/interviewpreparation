# Kafka Fundamentals - Revision Notes

## 1. What is Kafka?

Kafka is a **Distributed Event Streaming Platform**.

Its main purpose is to transfer events (messages) between different applications asynchronously.

### Example

Order Service creates an order.

```
Order Service
      |
      |  Order Created Event
      V
    Kafka
      |
      +------------------+
      |                  |
Inventory Service   Email Service
```

Kafka acts as a **middleman** between Producer and Consumer.

---

# 2. Producer and Consumer

## Producer

The application that sends messages to Kafka.

Example:

```java
producer.send("Order Created");
```

## Consumer

The application that reads messages from Kafka.

```java
@KafkaListener(...)
public void consume(String message){
    System.out.println(message);
}
```

---

# 3. Topic

A Topic is a logical category where messages are stored.

Example:

```
orders
payments
notifications
```

Think of it like a WhatsApp group.

All order-related events go into the `orders` topic.

---

# 4. Partition

A Topic is divided into multiple partitions.

Example:

```
Orders Topic

P0
P1
P2
```

Purpose:

- Parallel processing
- Higher throughput
- Scalability

Ordering is guaranteed **only inside a partition**.

---

# 5. Consumer Group

Multiple consumers can belong to the same Consumer Group.

```
Consumer Group

C1
C2
C3
```

Kafka distributes partitions among consumers.

---

# 6. Partition Assignment

## Case 1

Partitions = 3

Consumers = 4

```
P0 -> C1
P1 -> C2
P2 -> C3

C4 -> Idle
```

Reason:

One partition can be assigned to only one consumer within the same consumer group.

---

## Case 2

Partitions = 4

Consumers = 2

```
P0 -> C1
P1 -> C2
P2 -> C1
P3 -> C2
```

One consumer can read multiple partitions.

---

# 7. Does Ordering Break?

No.

Ordering is maintained only within a partition.

Example:

```
Partition 0

Order1
Order2
Order3
```

Consumer always processes:

```
Order1
Order2
Order3
```

Kafka does not guarantee ordering across different partitions.

---

# 8. Offsets

Every message inside a partition gets a unique offset.

Example:

```
Partition 0

Offset0 -> Order100
Offset1 -> Order101
Offset2 -> Order102
```

Offsets are used to remember which messages have already been processed.

---

# 9. Consumer Crash Scenario

Suppose:

```
Offset0 ✔
Offset1 ✔
Offset2 (Processing)

CRASH
```

If Offset2 was not committed,

After restart,

Kafka resumes from Offset2.

No message is lost.

---

# 10. At-Least-Once Delivery

Scenario:

```
Process Offset2

Update Database ✔

Crash

Offset NOT committed
```

Kafka delivers Offset2 again after restart.

So the same message may be processed twice.

Solution:

Make consumers **Idempotent**.

---

# 11. Idempotent Consumer

Store processed Event IDs.

Example:

```
EventID = E101
```

Before processing:

```
Already Processed?

YES -> Ignore

NO -> Process
```

This prevents duplicate business operations.

---

# 12. Where Does Kafka Store Messages?

Kafka stores messages on **disk**.

Not in MySQL.

Not in MongoDB.

Not in memory.

Messages are stored as append-only log files.

Example:

```
orders-0/

000000.log
```

Contents:

```
Offset0 -> Order Created

Offset1 -> Order Updated

Offset2 -> Order Delivered
```

---

# 13. Kafka on Docker

On your laptop:

```
Laptop

Docker Engine

├── Kafka Container
├── MySQL Container
└── Redis Container
```

Kafka is simply another application running inside Docker.

It uses:

- Laptop CPU
- Laptop RAM
- Laptop SSD

---

# 14. Docker Volume

Without Docker Volume:

```
Delete Container

↓

All Kafka Messages Lost
```

With Docker Volume:

```
Laptop SSD

Docker Volume

↓

Kafka Container
```

Delete container:

```
Volume still exists

Messages remain
```

---

# 15. Broker

A Broker is simply one Kafka Server.

On your laptop:

```
Kafka Process

=

1 Broker
```

Nothing more.

---

# 16. Kafka Cluster

Production has multiple brokers.

Example:

```
Broker1

Broker2

Broker3
```

Multiple brokers together form a Kafka Cluster.

---

# 17. Replication

Suppose Replication Factor = 3.

```
Broker1

Partition0 (Leader)

------------

Broker2

Partition0 (Follower)

------------

Broker3

Partition0 (Follower)
```

All brokers contain the same data.

---

# 18. Broker Failure

Suppose:

```
Broker1

CRASH
```

Kafka automatically promotes another broker.

```
Broker2

New Leader
```

Consumers continue without data loss.

---

# 19. Why Doesn't Kafka Use MySQL?

Kafka is optimized for:

- Sequential writes
- High throughput
- Streaming

MySQL is optimized for:

- Queries
- Joins
- Updates
- Transactions

Kafka itself is the storage engine.

---

# 20. Dual Write Problem

Suppose code:

```java
saveOrder();

sendKafkaEvent();
```

Scenario:

```
Save Order ✔

CRASH

Kafka Event ❌
```

Database contains order.

Kafka has no event.

System becomes inconsistent.

---

Reverse Order

```java
sendKafkaEvent();

saveOrder();
```

Scenario:

```
Kafka Event ✔

CRASH

Database ❌
```

Consumers think order exists.

Database has no order.

Again inconsistent.

---

# 21. Transactional Outbox Pattern

Instead of writing directly to Kafka:

```
BEGIN TRANSACTION

Save Order

Save Outbox Event

COMMIT
```

Database:

```
Orders

Outbox
```

A separate Outbox Publisher reads the Outbox table and publishes events to Kafka.

Benefits:

- No dual write problem
- Reliable event publishing
- Used in most production microservices

---

# 22. Kafka vs MySQL vs Redis

## MySQL

Purpose:

Permanent business data.

Example:

- Orders
- Customers
- Payments

---

## Kafka

Purpose:

Event Streaming.

Example:

- Order Created
- Payment Completed
- Shipment Delivered

---

## Redis

Purpose:

Ultra-fast in-memory storage.

Common Uses:

- Cache
- User Sessions
- OTP
- Shopping Cart
- Rate Limiting

---

# 23. Easy Analogy

Restaurant Example

## MySQL

Official Register

```
Orders

Payments

Customers
```

Permanent.

---

## Kafka

Waiter announcing events.

```
Kitchen!

Billing!

Delivery!
```

Communication.

---

## Redis

Sticky Notes.

```
VIP Customer

Extra Cheese

Table 5
```

Temporary but extremely fast.

---

# Important Interview Answers

## Q1. What happens if consumers are more than partitions?

Extra consumers remain idle.

---

## Q2. What happens if partitions are more than consumers?

Kafka assigns multiple partitions to one consumer.

---

## Q3. Where are Kafka messages stored?

Kafka stores messages on the broker's local disk as append-only log files.

---

## Q4. What happens if a consumer crashes?

Kafka resumes from the last committed offset.

---

## Q5. What is the Dual Write Problem?

Writing separately to the database and Kafka can leave them inconsistent if the application crashes between the two operations.

---

## Q6. What is the solution for the Dual Write Problem?

Transactional Outbox Pattern.

---

# Key Takeaways

- Kafka is an event streaming platform.
- Topics contain partitions.
- Partitions guarantee ordering.
- Offsets track message consumption.
- Consumers commit offsets after successful processing.
- Kafka stores messages as log files on disk.
- A Broker is one Kafka server.
- Multiple brokers form a cluster.
- Replication prevents data loss.
- Docker volumes preserve Kafka data across container recreation.
- Redis is for fast temporary data.
- MySQL stores permanent business data.
- Kafka streams events between services.
- Transactional Outbox solves the dual write problem.