# Module 3 - Event Loop Deep Dive

## Overview

The Event Loop is the core mechanism that allows Node.js to perform asynchronous, non-blocking operations while executing JavaScript on a single thread.

To understand the Event Loop, we must first understand:

1. Call Stack
2. libuv
3. Callback Queue
4. Microtask Queue
5. Event Loop

---

# Call Stack

The Call Stack is a data structure used by JavaScript to keep track of function execution.

It follows **LIFO (Last In, First Out)**.

Whenever a function is called:
- It is pushed onto the Call Stack.
- When the function completes, it is popped from the Call Stack.

Example:

```javascript
function one() {
    console.log("One");
}

function two() {
    one();
    console.log("Two");
}

two();
```

Execution:

```
Call Stack

↓

two()

↓

one()

↓

one() completed

↓

two() completed

↓

Empty
```

Output:

```
One
Two
```

> JavaScript always executes the function at the **top of the Call Stack**.

---

# Example with setTimeout()

```javascript
console.log("Start");

setTimeout(() => {
    console.log("Timeout");
}, 1000);

console.log("End");
```

Output:

```
Start
End
Timeout
```

---

# Internal Flow

### Step 1

Execute:

```javascript
console.log("Start");
```

Output:

```
Start
```

---

### Step 2

Execute:

```javascript
setTimeout(callback, 1000);
```

The Main Thread **does not wait**.

Instead:

- Timer is registered with **libuv**
- `setTimeout()` immediately completes
- Call Stack becomes free

---

### Step 3

Execute:

```javascript
console.log("End");
```

Output:

```
End
```

---

### Step 4

After 1000 ms:

- libuv marks the timer as completed.
- Callback is moved to the **Callback Queue**.

```
Callback Queue

↓

Timeout Callback
```

---

### Step 5

The Event Loop checks:

- Is the Call Stack empty?

If Yes:

- Move callback from Callback Queue to Call Stack.
- Execute callback.

Output:

```
Timeout
```

---

# Complete Flow

```
JavaScript

↓

Call Stack

↓

setTimeout()

↓

libuv Timer

↓

Continue JavaScript

↓

Timer Completed

↓

Callback Queue

↓

Event Loop

↓

Call Stack

↓

Execute Callback
```

---

# Important Rule

The Event Loop **never interrupts running JavaScript**.

It only moves callbacks to the Call Stack **when the Call Stack becomes empty**.

---

# Callback Queue (Macrotask Queue)

Stores callbacks of completed asynchronous operations such as:

- setTimeout()
- setInterval()
- I/O callbacks

Example:

```javascript
setTimeout(() => {
    console.log("Hello");
}, 1000);
```

After the timer completes:

```
Callback Queue

↓

Hello Callback
```

---

# Promise (Microtask Queue)

Promises use the **Microtask Queue**.

Example:

```javascript
console.log("A");

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("B");
```

Output:

```
A
B
Promise
```

Reason:

Promise callbacks are stored in the **Microtask Queue**.

---

# Microtask Queue vs Callback Queue

There are two important queues:

## 1. Microtask Queue

Higher Priority

Examples:

- Promise.then()
- Promise.catch()
- Promise.finally()

---

## 2. Callback Queue (Macrotask Queue)

Lower Priority

Examples:

- setTimeout()
- setInterval()
- Completed I/O callbacks

---

# Queue Priority

Execution Order:

```
Call Stack

↓

process.nextTick()

↓

Microtask Queue (Promises)

↓

Callback Queue (Timers / I/O)
```

> `process.nextTick()` has higher priority than Promises.

---

# Example

```javascript
console.log("A");

setTimeout(() => {
    console.log("Timeout");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("B");
```

Execution:

1. Print A
2. Register Timer
3. Promise → Microtask Queue
4. Print B
5. Call Stack becomes empty
6. Execute Promise
7. Execute Timer

Output:

```
A
B
Promise
Timeout
```

---

# Another Example

```javascript
console.log("1");

setTimeout(() => {
    console.log("2");
}, 0);

Promise.resolve().then(() => {
    console.log("3");
});

console.log("4");
```

Output:

```
1
4
3
2
```

Reason:

- Promise callbacks execute before Timer callbacks.

---

# Important Note about setTimeout()

Many developers think:

> setTimeout(callback, 1000) executes exactly after 1000 ms.

This is **incorrect**.

Correct statement:

> The callback executes **after at least 1000 ms**, provided the Call Stack is empty.

Example:

```javascript
setTimeout(() => {
    console.log("Done");
}, 1000);

while (true) {}
```

The callback never executes because the Main Thread is blocked.

---

# Responsibilities

## V8

- Executes JavaScript
- Maintains the Call Stack

---

## Call Stack

- Executes JavaScript functions
- Only one function executes at a time

---

## libuv

- Handles asynchronous operations
- Manages timers
- Manages Thread Pool
- Performs File System operations
- Handles asynchronous I/O

---

## Event Loop

- Continuously checks whether the Call Stack is empty
- Moves completed callbacks to the Call Stack

---

## Callback Queue

Stores:

- Timer callbacks
- I/O callbacks

---

## Microtask Queue

Stores:

- Promise callbacks

---

# Real Project Example

Customer clicks **Pay Now**.

```
Client

↓

Node.js

↓

Payment API

↓

Promise resolves

↓

Update Order

↓

Send Response
```

Promise callback executes before any pending timer callback.

---

# Interview Answers

## What is the Call Stack?

The Call Stack is a LIFO data structure that keeps track of function execution. Functions are pushed onto the stack when called and popped when they complete.

---

## What is the Event Loop?

The Event Loop continuously checks whether the Call Stack is empty. When asynchronous operations complete, it moves their callbacks from the appropriate queue to the Call Stack for execution.

---

## What is the Callback Queue?

The Callback Queue stores completed timer and I/O callbacks waiting to be executed.

---

## What is the Microtask Queue?

The Microtask Queue stores Promise callbacks. It has higher priority than the Callback Queue.

---

## Why does Promise execute before setTimeout()?

Because the Event Loop always processes the Microtask Queue before the Callback Queue.

---

## Common Interview Questions

1. What is the Call Stack?
2. What is the Event Loop?
3. What is the Callback Queue?
4. What is the Microtask Queue?
5. Difference between Callback Queue and Microtask Queue?
6. Why does Promise execute before setTimeout()?
7. Does setTimeout() execute exactly after the specified time?
8. Who executes JavaScript—V8 or the Event Loop?
9. What is the execution order of:
   - Call Stack
   - process.nextTick()
   - Promise
   - setTimeout()
10. Explain the complete flow of an asynchronous operation in Node.js.

---

# Quick Revision

```
JavaScript

↓

Call Stack

↓

Async Operation?

↓

libuv

↓

Operation Completed

↓

Microtask Queue (Promise)
OR
Callback Queue (Timer/I/O)

↓

Event Loop

↓

Call Stack

↓

Execute Callback
```

## Execution Priority

```
1. Call Stack
2. process.nextTick()
3. Microtask Queue (Promises)
4. Callback Queue (Timers / I/O)
```