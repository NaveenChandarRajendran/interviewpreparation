# Java Spring Boot Full Stack Interview Quick Revision (Detailed Notes)

---

# 1. @Transactional Internals ⭐⭐⭐⭐⭐

## What is @Transactional?

`@Transactional` is a Spring annotation used to manage database transactions automatically.

A transaction means **a group of database operations should either all succeed or all fail**. This helps keep the database in a consistent state.

### Example

Imagine transferring ₹1000 from Account A to Account B.

The application performs two operations:

1. Deduct ₹1000 from Account A.
2. Add ₹1000 to Account B.

If the first operation succeeds but the second fails, the money disappears. This leads to inconsistent data.

Using `@Transactional`, if any operation fails, Spring rolls back all previous operations.

---

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

---

## Internal Working

Spring does not execute the service method directly.

Instead, it creates a **Proxy** around the bean. The proxy is responsible for starting and ending the transaction.

Internally it behaves like this:

```java
beginTransaction();

try {
    serviceMethod();
    commit();
} catch(Exception e) {
    rollback();
}
```

So your business logic only contains application code. Spring automatically manages commit and rollback.

---

## Important Points

- Spring uses **AOP Proxy** to manage transactions.
- Transaction starts before entering the method.
- Commit happens after successful execution.
- Rollback happens when an exception occurs.
- Business logic never calls `commit()` or `rollback()` manually.

---

## Example

```java
@Service
public class EmployeeService {

    @Transactional
    public void saveEmployee(Employee employee) {

        employeeRepository.save(employee);

        addressRepository.save(address);

    }
}
```

If `addressRepository.save()` throws an exception, the employee record is also rolled back.

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

### Why?

Spring transactions work only when the call goes through the Spring Proxy.

When `methodA()` calls `methodB()` directly, the call stays inside the same object and bypasses the proxy.

Therefore, Spring never gets a chance to start the transaction.

---

# 2. Thread Pool

## Why?

Creating a new thread for every request is expensive because the operating system must allocate memory, initialize the thread and later destroy it.

Instead of creating new threads repeatedly, Java creates a fixed number of threads once and reuses them.

This improves application performance.

### Real-world Example

Imagine a restaurant with five waiters.

Customers keep arriving.

Instead of hiring a new waiter for every customer, the restaurant reuses the same waiters.

Similarly, Java reuses threads from the thread pool.

---

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

## Java Example

```java
ExecutorService executor = Executors.newFixedThreadPool(3);

executor.submit(() -> {
    System.out.println("Processing Request");
});

executor.shutdown();
```

The task is assigned to one available thread.

After completing the task, the thread returns to the pool and waits for the next request.

---

## Important Points

- Threads are reused.
- Reduces thread creation overhead.
- Improves performance.
- Used internally by Tomcat.

---

# 3. Tomcat Request Flow

Whenever a client sends an HTTP request, Tomcat receives it.

Tomcat picks one available thread from its thread pool and assigns the request to that thread.

The thread processes the request through Spring Boot.

---

## Flow

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

## Step-by-Step Explanation

### Client

The browser or mobile application sends an HTTP request.

Example:

```text
GET /employees
```

---

### Tomcat

Tomcat receives the request.

It checks its thread pool for an available worker thread.

---

### Worker Thread

One worker thread is assigned to process the request.

That same thread executes the complete request from beginning to end.

---

### DispatcherServlet

DispatcherServlet is the front controller of Spring MVC.

Its responsibility is to identify which controller should handle the request.

---

### Controller

Receives the HTTP request.

Validates the request.

Calls the service layer.

---

### Service

Contains business logic.

Example:

- Calculate salary
- Validate employee
- Transfer money

---

### Repository

Interacts with the database.

Example:

```java
employeeRepository.findAll();
```

---

### Database

Executes SQL queries.

Returns data.

---

### Response

Spring converts the Java object into JSON.

Tomcat sends the JSON back to the client.

---

# 4. CompletableFuture

## Purpose

`CompletableFuture` is used to execute tasks asynchronously.

Instead of waiting for one task to complete before starting another, multiple tasks can run in parallel.

This improves application performance.

---

## Real-world Example

Suppose an Employee Dashboard displays:

- Employee Details
- Salary Details
- Attendance
- Projects

Instead of loading these one after another, all four APIs can execute simultaneously.

This reduces the total response time.

---

## Example

```java
CompletableFuture<String> future =
        CompletableFuture.supplyAsync(() -> {

            return "Employee Loaded";

        });

System.out.println(future.join());
```

The task executes in a separate thread.

`join()` waits until the task completes and returns the result.

---

## Important APIs

### supplyAsync()

Used when the task returns a value.

```java
CompletableFuture.supplyAsync(() -> "Hello");
```

---

### runAsync()

Used when the task does not return anything.

```java
CompletableFuture.runAsync(() -> {

    System.out.println("Running");

});
```

---

### thenApply()

Transforms the previous result.

```java
future.thenApply(String::toUpperCase);
```

---

### thenCompose()

Chains another asynchronous operation.

Used when one async task depends on another async task.

---

### allOf()

Waits until multiple futures complete.

Example:

```java
CompletableFuture.allOf(future1, future2, future3);
```

---

# 5. Circuit Breaker

## Purpose

A Circuit Breaker prevents an application from continuously calling a service that is already failing.

Instead of wasting resources by making repeated failed calls, it temporarily stops calling the service.

---

## Real-world Example

Suppose your application calls the Payment Service.

Normally:

```text
Order Service

↓

Payment Service
```

But the Payment Service is down.

Without Circuit Breaker:

```text
Request

↓

Payment Service

↓

Fail

↓

Request Again

↓

Fail

↓

Request Again

↓

Fail
```

Thousands of unnecessary requests continue hitting the failed service.

This increases server load.

---

With Circuit Breaker:

After a certain number of failures,

the circuit opens.

New requests are rejected immediately without calling the failed service.

After a waiting period,

Spring checks whether the service has recovered.

If yes,

the circuit closes.

---

## States

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

---

### Closed State

Everything works normally.

Requests are sent to the service.

---

### Open State

Too many failures occurred.

Requests are blocked immediately.

---

### Half Open State

After waiting for some time,

Spring allows a few requests.

If they succeed,

the circuit closes.

Otherwise,

it opens again.

---

## Difference from Retry

Retry:

- Tries the same request again.
- Useful for temporary failures.

Circuit Breaker:

- Stops calling the service after repeated failures.
- Gives the failing service time to recover.

Retry attempts to fix temporary issues.

Circuit Breaker protects the application from continuously hitting a failed service.

---

# 6. Retry

## What is Retry?

Retry is a mechanism that automatically tries an operation again when it fails due to a temporary issue.

Instead of immediately giving an error to the user, the application waits for a short time and retries the operation.

Retry is useful only for **temporary failures**. It should not be used for permanent failures like invalid input or authentication errors.

---

## Why do we need Retry?

Sometimes a service fails due to temporary reasons such as:

- Network issue
- Server is busy
- Timeout
- Temporary database connection issue

In these situations, trying the request again after a short delay often succeeds.

---

## Real-world Example

Suppose your application calls a Payment Service.

```
Order Service

↓

Payment Service

↓

Timeout
```

Instead of immediately showing

```
Payment Failed
```

Spring Retry automatically tries again.

```
1st Attempt ❌

↓

Wait 2 Seconds

↓

2nd Attempt ✅
```

The payment succeeds without the user clicking the button again.

---

## Example

```java
@Retryable(
    value = Exception.class,
    maxAttempts = 3
)
public void processPayment() {

    paymentService.call();

}
```

If the first attempt fails,

Spring automatically retries.

Maximum attempts = 3.

---

## Common Use Cases

- External REST APIs
- Payment Gateway
- Kafka Producer
- Database connection timeout
- Email Service

---

## Difference from Circuit Breaker

Retry

- Calls the service again immediately or after a delay.
- Useful for temporary failures.

Circuit Breaker

- Stops calling the service after repeated failures.
- Protects the application from overload.

---

# 7. Spring Singleton

## What is Singleton?

A Singleton Bean means Spring creates **only one object (instance)** of that bean for the entire application.

Every class that injects this bean shares the same object.

---

## Why Singleton?

Creating objects repeatedly consumes memory.

Most service classes do not store user-specific data.

Instead of creating thousands of objects,

Spring creates one object and shares it.

This improves memory usage and application performance.

---

## Example

```java
@Service
public class EmployeeService {

}
```

Spring creates only one EmployeeService object.

Suppose three users send requests.

```
Request 1

↓

EmployeeService

↑

Request 2

↓

EmployeeService

↑

Request 3

↓

EmployeeService
```

All requests use the same object.

---

## Is Singleton Thread Safe?

❌ No.

Many developers think Singleton means Thread Safe.

This is incorrect.

Singleton means:

```
One Object
```

Thread Safe means:

```
Multiple threads can safely use that object.
```

These are completely different concepts.

---

## Example

```java
@Service
public class CounterService {

    private int count = 0;

    public void increment() {
        count++;
    }

}
```

Suppose two users call

```
increment()
```

at the same time.

```
Thread 1

count = 5

↓

count++

↓

6

----------------

Thread 2

count = 5

↓

count++

↓

6
```

Expected

```
7
```

Actual

```
6
```

This is called a **Race Condition**.

---

## When is Singleton Safe?

Singleton is safe if the class is **Stateless**.

Example

```java
@Service
public class EmployeeService {

    public Employee findEmployee(int id){

        return repository.findById(id);

    }

}
```

Since no shared variables exist,

multiple threads can safely execute this method.

---

## Important Points

- Default scope in Spring.
- Only one bean instance.
- Shared by all requests.
- Stateless beans are generally thread-safe.
- Mutable shared variables are not thread-safe.

---

# 8. synchronized

## What is synchronized?

`synchronized` is a Java keyword used to allow only one thread at a time to execute a critical section of code.

It prevents multiple threads from modifying shared data simultaneously.

---

## Why do we need synchronized?

Suppose two threads update the same bank account.

```
Balance = ₹1000
```

Thread 1 withdraws ₹500.

Thread 2 withdraws ₹700.

Without synchronization,

both threads may read the same balance.

The final balance becomes incorrect.

---

## Example

```java
public synchronized void withdraw(int amount){

    balance -= amount;

}
```

Only one thread can execute this method at a time.

Other threads must wait.

---

## Instance synchronized

```java
public synchronized void method(){

}
```

Locks the current object.

If one thread enters,

other threads using the same object must wait.

---

## Static synchronized

```java
public static synchronized void method(){

}
```

Locks the Class object.

Even if multiple objects exist,

only one thread can execute the method.

---

## Example

```
Thread 1

↓

Lock Acquired

↓

Execute

↓

Release Lock

↓

Thread 2 Executes
```

---

## Important Points

- Prevents race conditions.
- Ensures data consistency.
- Only one thread enters the synchronized block.
- Other threads wait until the lock is released.

---

# 9. AtomicInteger

## What is AtomicInteger?

AtomicInteger is a thread-safe integer class provided by Java.

It allows multiple threads to update an integer safely without using synchronized.

---

## Why not use count++ ?

Suppose

```java
count++;
```

Internally it is actually three operations.

```
Read

↓

Increment

↓

Write
```

If two threads execute these steps together,

the value may become incorrect.

---

## Example

Instead of

```java
count++;
```

Use

```java
AtomicInteger count = new AtomicInteger(0);

count.incrementAndGet();
```

---

## How does it work?

AtomicInteger uses a technique called

```
CAS

Compare And Set
```

It checks

```
Current Value

↓

Still Same?

↓

Yes

↓

Update

↓

No

↓

Retry
```

Since it doesn't lock the thread,

it performs better than synchronized in many scenarios.

---

## Example

```java
AtomicInteger counter = new AtomicInteger();

counter.incrementAndGet();

counter.incrementAndGet();

System.out.println(counter.get());
```

Output

```
2
```

---

## Important Points

- Thread-safe.
- Uses CAS.
- No synchronized block required.
- Better performance for simple counters.

---

# 10. HashMap Internals

## What is HashMap?

HashMap stores data as

```
Key → Value
```

Example

```java
Map<Integer, String> map = new HashMap<>();

map.put(1,"John");
```

Key

```
1
```

Value

```
John
```

---

## How does HashMap store data?

Whenever we insert

```java
map.put(key,value);
```

Java performs these steps.

---

### Step 1

Calculate

```
hashCode()
```

Every object has a hashCode.

Example

```
Employee

↓

hashCode()

↓

1827364
```

---

### Step 2

Calculate Hash

Java performs additional bit calculations to distribute keys evenly.

---

### Step 3

Calculate Bucket Index

The hash is converted into a bucket number.

Example

```
Hash

↓

Bucket 4
```

---

### Step 4

Store Entry

If Bucket 4 is empty,

store it directly.

---

### Step 5

Collision Handling

Suppose another key also maps to Bucket 4.

```
Bucket 4

↓

John

↓

David

↓

Peter
```

This is called a **Collision**.

Initially,

HashMap stores them as a Linked List.

---

### Step 6

Tree Conversion

If too many elements are stored in one bucket,

Java converts the Linked List into a Red-Black Tree.

Searching becomes much faster.

---

### Step 7

Resize

When HashMap becomes about **75% full** (load factor = 0.75),

Java creates a larger bucket array and redistributes all entries.

This is called **Rehashing**.

---

## Complexity

Average

```
O(1)
```

Worst Case

```
O(log n)
```

because of the Red-Black Tree.

---

## Example

```java
Map<Integer,String> map = new HashMap<>();

map.put(1,"John");

map.put(2,"David");

map.put(3,"Peter");

System.out.println(map.get(2));
```

Output

```
David
```

---

## Important Points

- Stores data as Key-Value pairs.
- Allows one null key.
- Allows multiple null values.
- Not synchronized.
- Average search complexity is O(1).
- Uses hashing internally.
- Handles collisions using Linked List and Red-Black Tree.

---

# 11. ArrayList vs LinkedList

## ArrayList

### What is ArrayList?

ArrayList is a collection class that stores elements using a **Dynamic Array**.

Unlike a normal array, ArrayList can automatically grow when more elements are added.

---

### Why do we need ArrayList?

Suppose you create an array.

```java
int[] numbers = new int[5];
```

It can store only 5 elements.

If you need to store a 6th element, you must create a new array manually.

ArrayList solves this problem by automatically increasing its size.

---

### Internal Working

Internally, ArrayList uses an array.

```text
Index

0 → John

1 → David

2 → Peter

3 → James

4 → Empty
```

When the array becomes full,

Java creates a larger array,

copies all elements into the new array,

and continues inserting data.

---

### Example

```java
List<String> list = new ArrayList<>();

list.add("John");
list.add("David");
list.add("Peter");

System.out.println(list.get(1));
```

Output

```
David
```

---

### Advantages

- Fast random access using index.
- Easy to iterate.
- Less memory compared to LinkedList.

---

### Disadvantages

Insertion or deletion in the middle is slow because remaining elements must be shifted.

Example

```
John

David

Peter

James
```

Insert

```
Alex
```

at index 1

Remaining elements move one position.

---

## LinkedList

### What is LinkedList?

LinkedList stores elements using nodes.

Each node contains

- Data
- Previous Node Address
- Next Node Address

This is called a **Doubly Linked List**.

---

### Internal Structure

```text
NULL

↓

[John]

↓

[David]

↓

[Peter]

↓

NULL
```

Each node knows the previous and next node.

---

### Example

```java
List<String> list = new LinkedList<>();

list.add("John");

list.add("David");

list.add("Peter");
```

---

### Advantages

- Fast insertion.
- Fast deletion.
- No shifting of elements.

---

### Disadvantages

Random access is slow.

To reach index 100,

LinkedList must traverse node by node.

---

## Comparison

| Feature | ArrayList | LinkedList |
|----------|-----------|------------|
| Data Structure | Dynamic Array | Doubly Linked List |
| Random Access | Fast O(1) | Slow O(n) |
| Insert/Delete Middle | Slow | Fast |
| Memory | Less | More |

---

# 12. Garbage Collection

## What is Garbage Collection?

Garbage Collection (GC) is the process of automatically removing objects from memory that are no longer used.

This helps prevent memory from filling up with unused objects.

Java performs Garbage Collection automatically.

Developers do not need to free memory manually.

---

## Why do we need Garbage Collection?

Suppose your application creates thousands of objects.

```java
Employee emp = new Employee();
```

After using the object,

the reference becomes

```java
emp = null;
```

The object still exists in memory.

If unused objects are never removed,

memory will eventually become full,

leading to **OutOfMemoryError**.

Garbage Collector removes these unused objects.

---

## Heap Structure

```text
Heap

├── Young Generation
│
│     ├── Eden
│
│     ├── Survivor S0
│
│     └── Survivor S1
│
└── Old Generation
```

---

### Eden Space

New objects are created here.

Example

```java
Employee emp = new Employee();
```

Initially,

Employee object is stored inside Eden.

---

### Survivor Spaces

Objects that survive Minor GC move between

```
S0

↓

S1
```

If an object survives multiple garbage collections,

Java considers it a long-living object.

---

### Old Generation

Objects that survive many garbage collections

move into Old Generation.

Example

Singleton Beans

Cache Objects

Large Collections

---

## Minor GC

Minor GC cleans

```
Young Generation
```

It runs frequently.

Usually very fast.

---

## Major GC

Major GC cleans

```
Old Generation
```

It takes more time because Old Generation contains larger objects.

---

## Stop The World

During Garbage Collection,

application threads pause temporarily.

This pause is called

```
Stop The World
```

After GC completes,

all threads continue execution.

---

## GC Root

Garbage Collection starts from special objects called **GC Roots**.

Examples

- Local variables in stack.
- Static variables.
- Active threads.
- JNI references.

Java checks whether an object can be reached from any GC Root.

---

## Reachability

```
GC Root

↓

Employee

↓

Address

↓

City
```

All objects are reachable.

They are **NOT** collected.

---

If

```
Employee = null
```

Then

```
Address

City
```

also become unreachable.

Garbage Collector removes them.

---

# 13. Memory Leaks

## What is Memory Leak?

A memory leak happens when an object is no longer needed,

but it is still referenced somewhere.

Since Java still has a reference,

Garbage Collector cannot remove it.

Memory usage keeps increasing.

---

## Example

```java
static List<Employee> employees = new ArrayList<>();
```

If employee objects are continuously added

but never removed,

the list keeps growing.

Eventually,

memory becomes full.

---

## Common Reasons

### Static Collections

```java
static List<Employee> list = new ArrayList<>();
```

Objects remain alive for the lifetime of the application.

---

### Unclosed Resources

Example

```java
FileInputStream

Database Connection

Socket
```

Always close resources.

---

### ThreadLocal

If values are not removed,

they remain associated with the thread.

---

### Event Listeners

Listeners registered but never removed

keep objects alive.

---

### Cache Growing Forever

If cache size is unlimited,

memory usage keeps increasing.

Always configure cache eviction.

---

# 14. wait(), notify(), notifyAll()

These methods are used for communication between threads.

They belong to the Object class.

---

## wait()

### What does wait() do?

The current thread releases the object's lock

and enters the WAITING state.

It waits until another thread notifies it.

---

### Example

```java
synchronized(lock){

    lock.wait();

}
```

The thread pauses

and releases the monitor lock.

---

## notify()

### What does notify() do?

It wakes one waiting thread.

The awakened thread does not execute immediately.

It must first acquire the object's lock.

---

### Example

```java
synchronized(lock){

    lock.notify();

}
```

---

## notifyAll()

Wakes all waiting threads.

Each thread competes to acquire the lock.

Only one thread gets the lock first.

Others continue waiting.

---

## Example Flow

```text
Thread 1

↓

wait()

↓

WAITING

-----------------

Thread 2

↓

notify()

↓

Thread 1 becomes Runnable

↓

Waits for Lock

↓

Executes
```

---

## Important Points

- wait() releases the lock.
- notify() wakes one thread.
- notifyAll() wakes all waiting threads.
- These methods must be called inside a synchronized block.

---

# 15. Database Index

## What is an Index?

An Index is a special data structure used by the database

to locate rows quickly

without scanning the entire table.

Think of it like the index page of a book.

Instead of reading every page,

you look at the index,

find the page number,

and directly go to that page.

---

## Why do we need an Index?

Suppose Employee table contains

```
10 Million Records
```

Query

```sql
SELECT * FROM Employee
WHERE employee_id = 1001;
```

Without an index,

the database checks every row.

This is called

```
Full Table Scan
```

With an index,

the database directly jumps to the required row.

---

## Internal Working

Most relational databases use a

```
B-Tree
```

to store indexes.

The B-Tree stores sorted values.

Leaf nodes point to the actual table rows.

---

## Important

Creating an index

does **NOT**

rearrange the table.

The database creates a separate B-Tree structure.

```
Employee Table

↓

Separate B-Tree Index

↓

Points to Actual Rows
```

---

## Database Optimizer

When a query is executed,

the Database Optimizer decides

whether using the index is faster

or performing a Full Table Scan is better.

---

## Index Maintenance

Whenever data changes,

the index is also updated.

Operations

- INSERT
- UPDATE
- DELETE

This is why having too many indexes

can slow down write operations.

---

## Advantages

- Faster SELECT queries.
- Avoids Full Table Scan.
- Improves search performance.

---

## Disadvantages

- Extra storage required.
- INSERT becomes slightly slower.
- UPDATE becomes slightly slower.
- DELETE becomes slightly slower.

---

# 16. Transactions

## What is a Transaction?

A transaction is a group of one or more database operations that are treated as **one single unit of work**.

It follows the rule:

- Either all operations succeed.
- Or all operations fail.

This keeps the database consistent.

---

## Real-world Example

Suppose you are creating a new employee.

The application performs three database operations.

```text
Save Employee

↓

Save Address

↓

Save Salary
```

If **Save Salary** fails,

should Employee and Address still be saved?

❌ No.

The entire operation should be rolled back.

---

## Commit

### What is Commit?

Commit means permanently saving all changes made during a transaction.

Once committed,

the data becomes visible to other transactions.

Example

```text
Update Employee Salary

↓

Commit

↓

Salary permanently updated in database
```

---

## Rollback

### What is Rollback?

Rollback means undoing all database changes made within the current transaction.

Example

```text
Insert Employee

↓

Insert Address

↓

Salary Insert Failed

↓

Rollback

↓

Employee Removed

↓

Address Removed
```

The database returns to its previous state.

---

## Auto Commit

By default,

most databases enable **Auto Commit**.

This means every SQL statement is treated as a separate transaction.

Example

```sql
UPDATE Employee
SET salary = 50000
WHERE id = 1;
```

As soon as this query executes,

the database automatically commits it.

Even if another query fails later,

the first update cannot be rolled back.

---

## Spring @Transactional

When Spring executes a method marked with

```java
@Transactional
```

it temporarily disables Auto Commit.

Instead,

Spring groups all SQL statements into a single transaction.

Example

```java
@Transactional
public void saveEmployee() {

    employeeRepository.save(employee);

    addressRepository.save(address);

    salaryRepository.save(salary);

}
```

Now,

all three SQL statements become one transaction.

If any statement fails,

everything is rolled back.

---

## Why disable Auto Commit?

Imagine these three queries.

```sql
INSERT Employee;

INSERT Address;

INSERT Salary;
```

If Auto Commit is enabled,

each query is committed immediately.

```
Employee Saved ✅

Address Saved ✅

Salary Failed ❌
```

Database becomes inconsistent.

With @Transactional,

Spring commits only after every statement succeeds.

---

# 17. Transaction Proxy

## Flow

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

## Explanation

Spring does not directly call the service method.

Instead,

Spring creates a **Proxy** object around the service.

The proxy performs additional work before and after calling the actual method.

Example

```text
Client

↓

Controller

↓

Spring Proxy

↓

EmployeeService

↓

Repository

↓

Database
```

The proxy is responsible for

- Starting the transaction.
- Committing if everything succeeds.
- Rolling back if an exception occurs.

Without the proxy,

`@Transactional` would not work.

---

# 18. Isolation Problems

When multiple transactions execute at the same time,

different types of consistency problems can occur.

These are called **Isolation Problems**.

---

## Dirty Read

### What is Dirty Read?

Reading data that has **not yet been committed** by another transaction.

---

### Example

Transaction A

```text
Salary

50000

↓

70000
```

Transaction A has **NOT committed** yet.

At the same time,

Transaction B reads

```
70000
```

Later,

Transaction A performs

```
Rollback
```

Actual salary becomes

```
50000
```

Transaction B has now read incorrect data.

This is called a **Dirty Read**.

---

## Non-Repeatable Read

### What is Non-Repeatable Read?

The same row is read twice,

but the value changes because another transaction updated it.

---

### Example

Transaction A

```sql
SELECT salary
FROM Employee
WHERE id = 1;
```

Result

```
50000
```

Before Transaction A reads again,

Transaction B executes

```sql
UPDATE Employee
SET salary = 70000;
```

Now Transaction A executes the same query.

Result

```
70000
```

The same row returned different values.

This is called **Non-Repeatable Read**.

---

## Phantom Read

### What is Phantom Read?

The same query returns a different **number of rows**.

---

### Example

Transaction A

```sql
SELECT *
FROM Employee
WHERE department='IT';
```

Result

```
2 Rows
```

Meanwhile,

Transaction B inserts a new employee.

```sql
INSERT INTO Employee
VALUES (...,'IT');
```

Transaction A runs the same query again.

Result

```
3 Rows
```

The extra row is called a **Phantom Row**.

This problem is known as **Phantom Read**.

---

## Summary

| Problem | What Changes? |
|----------|---------------|
| Dirty Read | Reads uncommitted data |
| Non-Repeatable Read | Same row returns different value |
| Phantom Read | Same query returns different number of rows |

---

# 19. Isolation Levels

Isolation Levels define how much one transaction is isolated from another transaction.

Higher isolation provides better consistency,

but usually reduces performance.

---

## Read Uncommitted

The lowest isolation level.

A transaction can read data even if another transaction has not committed it.

### Allows

- Dirty Read ✅
- Non-Repeatable Read ✅
- Phantom Read ✅

---

## Read Committed

A transaction can only read committed data.

It prevents Dirty Reads.

However,

another transaction can still update or insert data before the current transaction finishes.

### Prevents

- Dirty Read ❌

### Allows

- Non-Repeatable Read ✅
- Phantom Read ✅

---

## Repeatable Read *(For Future Learning)*

Guarantees that reading the same row multiple times returns the same value.

### Prevents

- Dirty Read ❌
- Non-Repeatable Read ❌

### Allows

- Phantom Read ✅

---

## Serializable *(For Future Learning)*

The highest isolation level.

Transactions execute one after another.

This provides maximum consistency,

but performance is slower.

### Prevents

- Dirty Read ❌
- Non-Repeatable Read ❌
- Phantom Read ❌

---

# Quick Comparison

| Isolation Level | Dirty Read | Non-Repeatable Read | Phantom Read |
|-----------------|-----------|---------------------|--------------|
| Read Uncommitted | ✅ | ✅ | ✅ |
| Read Committed | ❌ | ✅ | ✅ |
| Repeatable Read | ❌ | ❌ | ✅ |
| Serializable | ❌ | ❌ | ❌ |

---

# Golden Interview Tip

Don't memorize definitions.

Whenever you're explaining a concept in an interview, follow this order:

1. Explain **why the concept exists**.
2. Explain **how it works internally**.
3. Give a **simple real-world example**.
4. Mention **where you've used it in your project**.

Example:

Instead of saying

> "Thread Pool reuses threads."

Say

> "Creating a thread is an expensive operation because the operating system allocates memory and initializes the thread. To avoid creating and destroying threads repeatedly, Java uses a Thread Pool. A fixed number of worker threads are created once and reused for incoming tasks. For example, Tomcat uses a Thread Pool to process HTTP requests in Spring Boot applications."

This approach demonstrates understanding rather than memorization, which is what interviewers generally look for.