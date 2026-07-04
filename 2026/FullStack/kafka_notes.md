# Kafka Basics Notes

---

# 1. Topic

## What is a Topic?

A **Topic** is a logical channel where **producers publish messages** and **consumers read messages**.

Think of it as a **folder that stores related messages**.

### Example

**Topic:** `trade-created`

```text
Trade 100 Created
Trade 101 Created
Trade 102 Created
```

### Spring Boot Example

```java
kafkaTemplate.send("trade-created", tradeEvent);
```

The message is sent to the `trade-created` topic.

---

# 2. Partition

## What is a Partition?

A **Partition** is a physical division of a Topic.

Kafka splits a topic into multiple partitions to support:

- Parallel processing
- High throughput
- Scalability

### Example

```text
Topic: trade-created

├── Partition 0
├── Partition 1
└── Partition 2
```

Messages may be stored like this:

```text
Partition 0
-------------
Trade100
Trade103

Partition 1
-------------
Trade101
Trade104

Partition 2
-------------
Trade102
Trade105
```

## Why Partitions?

- Faster processing
- Multiple consumers can work simultaneously
- Better scalability
- Maintains ordering within a partition

---

# 3. Consumer Group

## What is a Consumer Group?

A **Consumer Group** is a collection of consumers working together to read messages from a topic.

Kafka distributes partitions among the consumers so that **each message is processed only once within that consumer group**.

### Example

```text
Topic: trade-created

Partition 0
Partition 1
Partition 2

Consumer Group: notification-group

Instance 1
Instance 2
Instance 3
```

Kafka assigns:

```text
Partition 0 → Instance 1
Partition 1 → Instance 2
Partition 2 → Instance 3
```

Each instance processes different messages.

---

# 4. Offset

## What is an Offset?

An **Offset** is the position (index) of a message inside a partition.

Every message in a partition receives a unique offset.

### Example

```text
Partition 0

Offset 0 → Trade100
Offset 1 → Trade101
Offset 2 → Trade102
```

Kafka uses offsets to determine:

- Which messages have already been consumed
- Which message should be read next

> **Important**
>
> Offsets are unique **only within a partition**, not across the entire topic.

---

# Relationship Between Topic, Partition, Offset & Consumer Group

```text
Producer
    │
    ▼
Topic (trade-created)
    │
    ├── Partition 0
    │      Offset 0
    │      Offset 1
    │
    ├── Partition 1
    │      Offset 0
    │      Offset 1
    │
    └── Partition 2
           Offset 0
           Offset 1

Consumer Group

notification-group

Instance 1 ← Partition 0
Instance 2 ← Partition 1
Instance 3 ← Partition 2
```

---

# Real Flow

```text
Trade Service
      │
      ▼
Publish Event
      │
      ▼
Topic : trade-created
      │
      ▼
Kafka decides Partition
      │
      ▼
Message stored with Offset
      │
      ▼
Consumer Group
      │
      ▼
Kafka assigns Partition
      │
      ▼
Notification Service processes message
```

---

# Interview One-Liners

## Topic

> A Topic is a logical channel where producers publish messages and consumers read them.

---

## Partition

> A Partition is a physical division of a Topic that enables parallel processing, scalability, and ordered message storage within that partition.

---

## Consumer Group

> A Consumer Group is a set of consumers working together. Kafka distributes partitions among them so each message is processed only once per consumer group.

---

## Offset

> An Offset is the unique position of a message within a partition. Kafka uses it to track which messages have already been consumed.

---

# Easy Memory Trick

| Kafka Term | Think of it as |
|------------|----------------|
| Topic | Folder containing related messages |
| Partition | Drawers inside the folder |
| Offset | Serial number of a file inside a drawer |
| Consumer Group | Team of employees sharing the work |
| Consumer | One employee in that team |

---

# Final Interview Summary

```text
Producer
    │
    ▼
Topic
    │
    ▼
Partitions
    │
    ▼
Messages stored with Offsets
    │
    ▼
Consumer Group
    │
    ▼
Consumers process assigned Partitions
```