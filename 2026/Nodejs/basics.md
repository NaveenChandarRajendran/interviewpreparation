# Module 1 - Introduction to Node.js

## What is Node.js?

Node.js is a **JavaScript Runtime Environment** built on Google's **V8 JavaScript Engine**. It allows JavaScript to run outside the browser, enabling developers to build backend applications.

> **Interview Definition:**
> Node.js is a JavaScript runtime environment built on Google's V8 engine that allows JavaScript to run outside the browser and provides backend capabilities such as file system access, networking, HTTP server creation, and process management.

---

# Before Node.js

JavaScript could only run inside web browsers.

Example:

Browser
↓
JavaScript
↓
UI Manipulation

JavaScript could **not**:
- Read files
- Connect to databases
- Create HTTP servers
- Access the operating system

For backend development, languages like Java, C#, PHP, and Python were used.

---

# After Node.js

Node.js enables JavaScript to run on servers.

Example:

React
↓
Node.js
↓
Database

Now JavaScript can be used for both frontend and backend development.

---

# Is Node.js a Programming Language?

**No.**

Node.js is a **Runtime Environment**, not a programming language.

JavaScript = Programming Language

Node.js = Runtime Environment that executes JavaScript

---

# What is a Runtime Environment?

A runtime environment provides everything required to execute a program.

Node.js provides:
- JavaScript execution
- File System access
- HTTP Server
- Networking
- Timers
- Process Management
- Memory Management
- OS Interaction

Example:

```javascript
const fs = require("fs");

fs.readFile("test.txt", (err, data) => {
    console.log(data.toString());
});
```

The `fs` module is provided by Node.js, not by JavaScript itself.

---

# Why Can't Browsers Be Used as Backend?

Browsers are sandboxed for security.

If browsers allowed unrestricted OS access, websites could:
- Read local files
- Delete files
- Access passwords
- Start system processes

To prevent this, browsers restrict access to the operating system.

Node.js is designed to run on trusted servers and therefore provides these capabilities.

---

# What is V8?

V8 is Google's JavaScript Engine used in Chrome.

It converts JavaScript into Machine Code for execution.

Example:

```javascript
let a = 10;
let b = 20;

console.log(a + b);
```

The V8 engine executes this code.

---

# Relationship Between Node.js and V8

Node.js uses the V8 engine to execute JavaScript.

Flow:

JavaScript
↓
Node.js Runtime
↓
V8 Engine
↓
Machine Code
↓
CPU

---

# What Does Node.js Add on Top of V8?

V8 only executes JavaScript.

Node.js adds backend APIs such as:

- HTTP
- File System (fs)
- TCP
- DNS
- Timers
- Process
- Streams
- Crypto

These APIs enable backend development.

---

# Real Project Example

Request Flow:

React UI
↓
GET /products
↓
Node.js
↓
Express
↓
Product Service
↓
MySQL / MongoDB
↓
JSON Response
↓
React

---

# Java vs Node.js

| Java | Node.js |
|------|----------|
| Java Code | JavaScript Code |
| JVM | V8 Engine (inside Node.js) |
| Spring Boot | Express.js |
| Maven | npm |
| JAR | JavaScript Application |
| Tomcat | Built-in HTTP Server / Express |

---

# Interview Answer (30 Seconds)

Node.js is a JavaScript runtime environment built on Google's V8 engine. It allows JavaScript to run outside the browser and provides backend capabilities such as file system access, networking, HTTP server creation, and process management. It is widely used for building scalable, event-driven, and I/O-intensive applications.

---

# Common Interview Questions

1. What is Node.js?
2. Is Node.js a programming language?
3. What is a Runtime Environment?
4. What is the V8 Engine?
5. Why do we need Node.js if browsers can execute JavaScript?
6. What features does Node.js provide?
7. How is Node.js different from Java?