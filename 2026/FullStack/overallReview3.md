# Java Spring Boot Full Stack Interview Quick Revision (5 Years Experience)

---

# 1. @Transactional Internals ⭐⭐⭐⭐⭐

## Flow

```text
Controller
     │
     ▼
Spring Proxy
     │
Begin Transaction
     │
     ▼
Service Method
     │
     ▼
Repository
     │
     ▼
Database
     │
Commit / Rollback
```

## Internal Working

Spring creates a proxy around the bean.

Proxy does:

```java
beginTransaction();

try {
    serviceMethod();
    commit();
} catch(Exception e) {
    rollback();
}
```

## Important Points

- Spring uses AOP Proxy.
- Transaction starts before entering the method.
- Commit happens after successful execution.
- Rollback happens when an exception causes transaction rollback.
- Business logic never calls commit() manually.

---

## Self Invocation (Very Important)

```java
@Service
public class EmployeeService {

    public void methodA() {
        methodB();
    }

    @Transactional
    public void methodB() {

    }
}
```

### Will Transaction Start?

❌ No.

Reason:

Internal method calls bypass the Spring Proxy.

---

# 2. Thread Pool

## Why?

Creating threads is expensive.

Instead:

- Create fixed threads.
- Reuse them.
- Better performance.

## Flow

```text
Incoming Requests

↓

Thread Pool

↓

Available Thread

↓

Execute Request

↓

Return Thread to Pool
```

---

# 3. Tomcat Request Flow

```text
Client

↓

Tomcat

↓

Worker Thread

↓

DispatcherServlet

↓

Controller

↓

Service

↓

Repository

↓

Database

↓

Response
```

---

# 4. CompletableFuture

Purpose:

Run tasks asynchronously.

Important APIs:

- supplyAsync()
- runAsync()
- thenApply()
- thenCompose()
- allOf()

---

# 5. Circuit Breaker

Purpose:

Prevent continuously calling a failing service.

States:

```text
Closed

↓

Failures

↓

Open

↓

Wait Time

↓

Half Open

↓

Success → Closed

Failure → Open
```

Difference from Retry:

Retry tries again.

Circuit Breaker stops calling temporarily.

---

# 6. Retry

Retries failed operations automatically.

Useful for:

- Temporary network failure
- Timeout
- Service unavailable

---

# 7. Spring Singleton

Singleton means:

Only one bean instance.

NOT thread-safe.

Thread safety depends on:

- Mutable shared state
- Stateless beans are generally safe.

---

# 8. synchronized

Instance synchronized

Locks current object.

Static synchronized

Locks Class object.

Purpose:

Prevent multiple threads entering critical section.

---

# 9. AtomicInteger

Instead of

```java
count++;
```

Use

```java
AtomicInteger.incrementAndGet();
```

Reason:

Uses CAS (Compare And Set).

Thread-safe without synchronized.

---

# 10. HashMap Internals

Steps:

1. hashCode()
2. Hash calculation
3. Bucket index
4. Collision handling
5. Linked List
6. Tree after threshold
7. Resize when load factor exceeds 0.75

Average Complexity

O(1)

Worst

O(log n) (Tree)

---

# 11. ArrayList vs LinkedList

ArrayList

- Dynamic Array
- Fast random access O(1)
- Slow insertion in middle

LinkedList

- Doubly Linked List
- Sequential access O(n)
- Fast insertion after node found

---

# 12. Garbage Collection

Heap

```text
Heap

├── Young Generation
│     ├── Eden
│     ├── Survivor S0
│     └── Survivor S1
│
└── Old Generation
```

Minor GC

Young Generation.

Major GC

Old Generation.

Stop The World

Application threads pause during GC.

---

## GC Root

GC starts from:

- Static variables
- Local variables in stack
- Active threads
- JNI references

If object reachable

↓

Not collected

If unreachable

↓

Garbage Collected

---

# 13. Memory Leaks

Common Reasons

- Static collections
- Unclosed resources
- ThreadLocal
- Event listeners
- Cache growing forever

---

# 14. wait(), notify(), notifyAll()

wait()

- Releases monitor lock
- Thread enters WAITING

notify()

- Wakes one waiting thread
- Doesn't immediately acquire lock

notifyAll()

- Wakes all waiting threads

Thread still waits until monitor becomes free.

---

# 15. Database Index

Purpose

Avoid Full Table Scan.

Uses

B-Tree.

Important

Table is NOT rearranged.

Separate B-Tree structure maintained.

Leaf nodes point to actual rows.

Database Optimizer decides whether index should be used.

Index maintenance happens on:

- INSERT
- UPDATE
- DELETE

---

# 16. Transactions

Commit

Makes changes permanent.

Rollback

Undo all uncommitted changes.

Auto Commit

Each SQL statement automatically commits.

Spring @Transactional

Turns Auto Commit OFF.

Reason

Multiple SQL statements become one transaction.

---

# 17. Transaction Proxy

```text
Controller

↓

Spring Proxy

↓

Begin Transaction

↓

Service

↓

Repository

↓

Commit / Rollback
```

---

# 18. Isolation Problems

## Dirty Read

Read uncommitted data.

Example

Transaction A updates.

No commit.

Transaction B reads updated value.

Transaction A rolls back.

Problem:

Transaction B saw invalid data.

---

## Non-Repeatable Read

Same row.

Different value.

Example

Read Salary = 50000

↓

Another transaction updates

↓

Read Again = 70000

---

## Phantom Read

Same query.

Different number of rows.

Example

SELECT * FROM Employee WHERE Department='IT'

Initially

2 rows

Another transaction inserts new IT employee.

Run again

3 rows

---

# 19. Isolation Levels

Read Uncommitted

- Allows Dirty Read
- Allows Non Repeatable Read
- Allows Phantom Read

Read Committed

- Prevents Dirty Read
- Allows Non Repeatable Read
- Allows Phantom Read

(Repeatable Read and Serializable pending.)

---

# Interview One-Liners

## Why Thread Pool?

Creating threads is expensive. Thread pools reuse threads, reducing overhead and improving performance.

---

## Why Singleton isn't Thread Safe?

Singleton means one instance. Multiple threads can access it simultaneously, so mutable shared state can cause race conditions.

---

## Why doesn't @Transactional work in self invocation?

Internal method calls bypass Spring Proxy.

---

## Why disable Auto Commit?

To execute multiple SQL statements as one transaction and allow rollback if any statement fails.

---

## What is Commit?

Makes all changes permanent.

---

## What is Rollback?

Undo all changes made in the current transaction.

---

## Difference

Dirty Read

Read uncommitted data.

Non Repeatable Read

Same row changes.

Phantom Read

Result set changes.

---

## HashMap Complexity

Average

O(1)

Worst

O(log n)

---

## ArrayList Random Access

Uses array.

Direct index calculation.

O(1)

---

## GC Root

Objects reachable from GC Roots are alive.

Unreachable objects become eligible for Garbage Collection.

---

## Common Interview Questions

- Explain @Transactional internally.
- Why self invocation doesn't work?
- Explain Thread Pool.
- Explain Tomcat request flow.
- Explain CompletableFuture.
- Difference between Retry and Circuit Breaker.
- Explain Singleton Bean thread safety.
- Explain synchronized.
- Explain AtomicInteger.
- Explain HashMap internals.
- Explain ArrayList vs LinkedList.
- Explain Garbage Collection.
- Explain Memory Leaks.
- Explain wait(), notify(), notifyAll().
- Explain Database Index.
- Explain Transactions.
- Explain Auto Commit.
- Explain Dirty Read.
- Explain Non Repeatable Read.
- Explain Phantom Read.
- Explain Read Committed.

---

# Golden Interview Tip

Don't memorize definitions.

Always explain in this order:

1. Why the concept exists.
2. How it works internally.
3. Real-world example.
4. Advantages.
5. Limitations.
6. Where you've used it in your project.

Interviewers remember candidates who explain **how** things work, not those who only define terms.