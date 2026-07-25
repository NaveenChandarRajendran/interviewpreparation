# Module 2 - Node.js Architecture (V8 + libuv + Event Loop)

## Node.js Internal Architecture

```
                Client Requests
                      │
                      ▼
          +----------------------+
          |      Node.js         |
          |----------------------|
          |   V8 Engine          |
          |   Main Thread        |
          |   Event Loop         |
          |   libuv              |
          +----------------------+
               │           │
               ▼           ▼
        Thread Pool      OS Kernel
        (FS, Crypto,     (Network I/O)
         Some DNS)
```

Every incoming request is processed through this architecture.

---

# Components of Node.js

## 1. V8 Engine

V8 is Google's JavaScript Engine.

Responsibilities:
- Executes JavaScript code
- Compiles JavaScript into Machine Code
- Performs memory management and garbage collection

Example:

```javascript
let a = 10;
let b = 20;

console.log(a + b);
```

V8 executes this code.

> **Note:** V8 only executes JavaScript. It cannot read files, connect to databases, or create HTTP servers.

---

## 2. Main Thread

Node.js has **one JavaScript Main Thread**.

Responsibilities:
- Executes JavaScript code
- Handles callback execution
- Processes incoming JavaScript tasks

The Main Thread should **never wait** for long-running operations.

Example:

```javascript
console.log("Start");

fs.readFile("test.txt", () => {
    console.log("File Read");
});

console.log("End");
```

Output:

```
Start
End
File Read
```

Reason:
- Main Thread delegates file reading to libuv.
- It immediately continues executing the next JavaScript statement.

---

## 3. libuv

libuv is a C library used internally by Node.js.

Responsibilities:
- Asynchronous I/O handling
- Event Loop implementation
- Thread Pool management
- Timers
- File System operations
- Some DNS operations
- Process management

Whenever JavaScript requests a long-running operation, Node.js delegates it to libuv.

Example:

```
JavaScript

↓

Need File?

↓

libuv

↓

OS / Thread Pool
```

---

## 4. Event Loop

The Event Loop coordinates asynchronous execution.

Responsibilities:
- Checks whether asynchronous operations have completed
- Moves completed callbacks to be executed on the Main Thread

The Event Loop **does not execute JavaScript**.

The V8 Engine executes JavaScript.

Flow:

```
Task Completed

↓

Event Loop

↓

Callback Queue

↓

Main Thread

↓

Execute Callback
```

---

# Thread Pool

libuv maintains a Thread Pool.

Default Size:
- 4 Threads (configurable)

Used for:
- File System operations
- Cryptography
- Compression
- Some DNS operations

Example:

```
Read File

Hash Password

Compress Image

DNS Lookup
```

These tasks can execute in parallel while the Main Thread remains free.

> **Important:** Most network I/O (HTTP requests, sockets) is handled asynchronously by the operating system, not by the thread pool.

---

# Complete Request Flow

```
JavaScript

↓

V8 Engine

↓

Async Operation?

↓

Yes

↓

libuv

↓

OS / Thread Pool

↓

Operation Completed

↓

Event Loop

↓

Callback Queue

↓

Main Thread

↓

Execute Callback
```

---

# Why is Node.js Single-Threaded?

Node.js executes JavaScript on a **single Main Thread**.

Only one JavaScript statement executes at a time.

However, long-running operations are delegated outside the Main Thread.

Therefore:
- JavaScript Execution → Single Thread
- Async Operations → OS / Thread Pool

---

# Synchronous vs Asynchronous

## Synchronous

Each statement waits until the previous one completes.

Example:

```javascript
console.log("A");
console.log("B");
console.log("C");
```

Output:

```
A
B
C
```

---

## Asynchronous

Long-running operations are delegated.

Example:

```javascript
console.log("A");

fs.readFile("test.txt", () => {
    console.log("B");
});

console.log("C");
```

Output:

```
A
C
B
```

---

# Blocking vs Non-Blocking

## Blocking

The Main Thread waits until the operation completes.

Example:

```javascript
const data = fs.readFileSync("test.txt");

console.log(data);
```

The Main Thread is blocked while reading the file.

---

## Non-Blocking

The Main Thread delegates the operation and continues executing.

Example:

```javascript
fs.readFile("test.txt", (err, data) => {
    console.log(data.toString());
});

console.log("Done");
```

Output:

```
Done
(File Read Later)
```

---

# Important Difference

| Synchronous | Asynchronous |
|-------------|--------------|
| Code execution waits | Operation is delegated |

| Blocking | Non-Blocking |
|----------|--------------|
| Thread waits | Thread continues executing |

> Synchronous ≠ Blocking
>
> Asynchronous ≠ Non-Blocking
>
> Although in Node.js, asynchronous APIs are generally designed to be non-blocking.

---

# Java vs Node.js

## Traditional Java (Spring Boot + Tomcat)

```
Request 1 → Thread 1

Request 2 → Thread 2

Request 3 → Thread 3
```

Typically, one request is handled by one thread.

---

## Node.js

```
Request 1

↓

Main Thread

↓

Delegate Async Work

↓

Main Thread Free

↓

Request 2

↓

Delegate Async Work
```

Node.js uses one JavaScript Main Thread to manage many concurrent requests.

---

# Restaurant Analogy

Customer → Client Request

Waiter → Main Thread

Kitchen → libuv / Database / Operating System

Cook → Thread Pool / OS

Food Ready → Callback

The waiter never cooks.

He simply assigns work and continues serving other customers.

---

# Real Project Example

Product API

```
React UI

↓

GET /products

↓

Node.js

↓

Query Database (Async)

↓

Database Responds

↓

Event Loop

↓

Main Thread Executes Callback

↓

JSON Response
```

---

# Interview Answers

## How does Node.js handle multiple requests?

Node.js executes JavaScript on a single Main Thread. Long-running operations such as database queries, file access, and network I/O are delegated to libuv, which uses the operating system or its Thread Pool. Once the operation completes, the Event Loop schedules its callback to execute on the Main Thread.

---

## Is Node.js Single Threaded?

Yes.

JavaScript execution happens on a single Main Thread.

However, asynchronous operations execute outside the Main Thread using libuv, the operating system, and the Thread Pool where appropriate.

---

## Is the Main Thread Asynchronous?

No.

The Main Thread executes JavaScript synchronously.

Node.js provides asynchronous, non-blocking APIs by delegating long-running work outside the Main Thread.

---

## Blocking vs Non-Blocking

Blocking:
The Main Thread waits until the operation completes.

Non-Blocking:
The Main Thread delegates the operation and continues executing other JavaScript.

---

# Common Interview Questions

1. What is Node.js Architecture?
2. What is V8 Engine?
3. What is libuv?
4. What is the Event Loop?
5. Why is Node.js Single Threaded?
6. How does Node.js handle multiple requests?
7. What is the Thread Pool?
8. Difference between Blocking and Non-Blocking?
9. Difference between Synchronous and Asynchronous?
10. Does every request get its own thread in Node.js?