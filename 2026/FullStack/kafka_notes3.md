# Kafka Idempotency Notes (Interview + Real World)

---

# 1. What is Idempotency?

## Definition

Idempotency means that **performing the same operation multiple times produces the same final result as performing it once**.

In Kafka, idempotency ensures that **even if the producer retries sending the same message, Kafka stores it only once.**

---

# Why is Idempotency Needed?

Many people ask:

> Kafka already has Offsets. Why do we still need Idempotency?

The answer is:

**Offsets are for Consumers.**

**Idempotency is for Producers.**

Offsets only tell consumers **where to continue reading**.

They do **NOT** prevent duplicate messages from being written.

---

# 2. Understanding ACK (Acknowledgement)

ACK = **Acknowledgement**

It is a confirmation sent from **Kafka Broker → Producer**.

It tells the producer:

> "I have successfully stored your message."

---

## Message Flow

```text
Producer
    |
    | Order101
    |
    V
Kafka Broker
    |
    | Stores Message
    |
    | ACK
    |
    V
Producer
```

After receiving ACK, the producer considers the send successful.

---

# 3. How kafkaTemplate.send() Works

```java
kafkaTemplate.send("orders", order);
```

Internally:

```text
Application
     |
     | kafkaTemplate.send()
     |
     V
Producer Client
     |
     | Send Message
     |
     V
Kafka Broker
     |
     | Store Message
     |
     | ACK
     |
     V
Producer
```

---

## Is send() synchronous?

No.

`kafkaTemplate.send()` is **asynchronous**.

It immediately returns a `CompletableFuture`.

```java
CompletableFuture<SendResult<String, Order>> future =
        kafkaTemplate.send("orders", order);
```

When ACK arrives, the Future completes successfully.

---

## Waiting for ACK

```java
SendResult<String, Order> result =
        kafkaTemplate.send("orders", order).get();
```

`.get()` blocks until

- ACK arrives
- Failure occurs
- Timeout occurs

---

# 4. Why Duplicate Messages Happen

Imagine

```text
Producer
     |
Order101
     |
     V
Kafka
```

Kafka stores the message.

```text
Orders Topic

Offset 0 -> Order101
```

Now Kafka sends ACK.

```text
Kafka ------ACK-------> Producer
```

But...

Network fails.

```text
Producer ----Order101-----> Kafka

Kafka stores it.

ACK lost ❌
```

Producer waits.

No ACK received.

Producer thinks:

> Kafka never received my message.

So it retries.

```text
Order101
```

Kafka receives it again.

Topic becomes

```text
Offset 0 -> Order101

Offset 1 -> Order101
```

Duplicate.

---

# Important Point

Kafka did NOT create duplicate messages.

The Producer retried because it never received ACK.

---

# 5. Why Offsets Cannot Prevent Duplicates

Many people think:

> Kafka has offsets.

> Why can't Kafka compare offsets?

Because offsets are assigned **AFTER** storing a message.

Example

First message

```text
Order101
```

Kafka stores it

```text
Offset = 0
```

Producer retries

```text
Order101
```

Kafka sees another incoming message.

It stores it.

```text
Offset = 1
```

Offsets only represent the message position inside a partition.

They are **not** used to detect duplicate messages.

---

# 6. How Idempotent Producer Works

Enable idempotence

```properties
enable.idempotence=true
```

Now producer sends

Instead of

```text
Order101
```

Producer internally sends

```text
ProducerId = 10

Sequence = 1

Order101
```

Kafka stores

```text
Producer 10

Sequence 1

Order101
```

---

ACK gets lost.

Producer retries.

Again it sends

```text
ProducerId = 10

Sequence = 1

Order101
```

Kafka checks

```text
Already received Sequence 1.
```

Duplicate discarded.

Topic remains

```text
Offset 0 -> Order101
```

---

# What Kafka Tracks

Kafka remembers

```text
Producer ID

Last Sequence Number
```

Example

```text
Producer = 20

Last Sequence = 150
```

If Producer sends

```text
Sequence = 150
```

again

Kafka ignores it.

---

# 7. Real Life Example

Swiggy Example

You click

```text
Place Order
```

Restaurant receives it.

Confirmation never reaches your phone.

You think

> Order failed.

You click again.

Restaurant receives

```text
Order101

Order101
```

Two meals are prepared.

Idempotency avoids this situation.

---

# 8. Producer Idempotency Limitations

## 1. Small Performance Overhead

Kafka tracks

- Producer ID
- Sequence Number

Small CPU and memory overhead.

Usually negligible.

---

## 2. Only Prevents Producer Retry Duplicates

Works

```text
Producer A

Order101

Retry

Order101
```

Duplicate removed.

Does NOT work

```text
Producer A -> Order101

Producer B -> Order101
```

Kafka sees two different producers.

Both messages are stored.

---

## 3. Does Not Prevent Consumer Duplicate Processing

Consumer may process

```text
Order101
```

Crash before committing offset.

Kafka sends

```text
Order101
```

again.

Business logic executes twice.

Producer idempotency cannot solve this.

---

## 4. Not Exactly Once

Idempotency alone is NOT Exactly Once Semantics.

Exactly Once requires

- Idempotent Producer
- Kafka Transactions
- Atomic Offset Commit

---

# 9. Consumer Idempotency

Consumer idempotency means

> Process the same business event only once.

---

## Problem

Consumer receives

```text
Offset 10

Order101
```

Business logic executes.

```java
debitAccount();

saveOrder();
```

Before committing offset

Consumer crashes.

Kafka sends

```text
Order101
```

again.

Money deducted twice.

---

# Solution 1 (Most Common)

Use Business ID

Every message contains

```text
OrderId

TransactionId

PaymentId
```

Before processing

Check database

```sql
SELECT *

FROM processed_orders

WHERE order_id = 101;
```

If exists

Skip.

Otherwise

Process.

Store

```text
processed_orders

101
```

---

## Spring Boot Example

```java
@KafkaListener(topics = "orders")
public void consume(Order order) {

    if(processedRepository.existsById(order.getOrderId())) {
        return;
    }

    orderService.process(order);

    processedRepository.save(
            new ProcessedOrder(order.getOrderId()));
}
```

---

# Why @Transactional?

Imagine

```java
orderService.process(order);
```

Money deducted.

Now

```java
processedRepository.save(...)
```

fails.

Consumer crashes.

Kafka retries.

Money deducted again.

To avoid this

```java
@Transactional
public void process(Order order) {

    if(processedRepository.existsById(order.getOrderId())) {
        return;
    }

    accountRepository.debit(order);

    processedRepository.save(
            new ProcessedOrder(order.getOrderId()));
}
```

Now

Either

Everything succeeds

OR

Everything rolls back.

---

# 10. Producer vs Consumer Idempotency

| Producer Idempotency | Consumer Idempotency |
|-----------------------|----------------------|
| Prevents duplicate writes | Prevents duplicate processing |
| Uses Producer ID + Sequence Number | Uses Business ID (OrderId / TransactionId) |
| Implemented by Kafka | Implemented by Application |
| Solves Producer Retry Problem | Solves Consumer Retry Problem |

---

# 11. Offset vs Sequence Number

| Offset | Sequence Number |
|---------|-----------------|
| Assigned by Kafka | Assigned by Producer |
| Used by Consumer | Used by Kafka |
| Indicates message position | Detects duplicate producer retries |
| Does NOT prevent duplicates | Prevents duplicate writes |

---

# 12. Interview Answer (30 Seconds)

## What is Idempotency?

> Idempotency ensures that even if the producer retries sending the same message due to lost acknowledgements, timeouts, or crashes, Kafka stores the message only once. Kafka achieves this by assigning each producer a Producer ID and attaching a sequence number to every message. If the broker receives the same sequence number again from the same producer, it recognizes it as a retry and discards the duplicate.

---

## Why Offsets Cannot Prevent Duplicates?

> Offsets are assigned only after Kafka stores a message. They help consumers know where to resume reading, but they cannot identify duplicate producer retries.

---

## Consumer Idempotency

> Consumer idempotency is implemented by the application using a unique business identifier such as OrderId or TransactionId. Before processing, the consumer checks whether the event has already been processed. If yes, it skips processing; otherwise, it executes the business logic and records the identifier. This check and update should be performed within a database transaction.

---

# Quick Revision

### ACK

- Confirmation from Kafka to Producer
- Means message stored successfully

### Offset

- Maintained by Kafka
- Used by Consumers
- Indicates reading position

### Producer Idempotency

- Prevents duplicate writes
- Uses Producer ID + Sequence Number

### Consumer Idempotency

- Prevents duplicate processing
- Uses OrderId / TransactionId

### Exactly Once Semantics (EOS)

- Idempotent Producer
- Kafka Transactions
- Atomic Offset Commit

---

# Easy Way to Remember

## Producer Side

```text
Producer
   |
Send Message
   |
ACK Lost
   |
Retry
   |
Kafka checks Sequence Number
   |
Duplicate? Ignore
```

---

## Consumer Side

```text
Consumer
     |
Receive Order101
     |
Check Database
     |
Already Processed?
     |
Yes -> Skip

No -> Process + Save OrderId
```