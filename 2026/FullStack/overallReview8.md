# Java & Spring Boot Interview Notes

---

# 1. Error Handling

## What?

Error Handling is the process of handling unexpected situations (exceptions) gracefully instead of letting the application crash.

Common exceptions:
- Invalid input
- User not found
- Database connection failure
- NullPointerException
- File not found

Spring Boot provides several ways to handle errors:
- try-catch
- throw
- Custom Exceptions
- @ExceptionHandler
- @RestControllerAdvice (Global Exception Handler)

---

## Why?

Without error handling:

User
 ↓
Controller
 ↓
Service
 ↓
Database
 ↓
Exception ❌
 ↓
Application crashes

With proper error handling:

User
 ↓
Controller
 ↓
Service
 ↓
Exception
 ↓
Global Exception Handler
 ↓
Returns proper HTTP response (404, 400, 500)

Benefits:
- Prevents application crashes
- Returns meaningful error messages
- Easier debugging
- Keeps controller code clean

---

## Code Sample

### Custom Exception

```java
public class UserNotFoundException extends RuntimeException {

    public UserNotFoundException(String message) {
        super(message);
    }

}
```

### Service

```java
@Service
public class UserService {

    public User getUser(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException("User not found"));

    }

}
```

### Global Exception Handler

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handle(UserNotFoundException ex) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(ex.getMessage());

    }

}
```

---

## Interview Answer

> Error handling is the process of handling exceptions gracefully without crashing the application. In Spring Boot, we usually create custom exceptions and handle them globally using `@RestControllerAdvice` and `@ExceptionHandler`. This helps return proper HTTP status codes like 400, 404, and 500 while keeping controller code clean.

---

# 2. Cache

## What?

Cache is a temporary high-speed memory that stores frequently used data.

Instead of accessing the database every time,

Client
↓
Application
↓
Cache
↓
Database

If data exists in cache,

Client
↓
Application
↓
Cache ✅
↓
Return Data

Database is skipped.

---

## Why?

Database access is slow.

Memory access is much faster.

Benefits:
- Faster response time
- Reduced database load
- Improved application performance
- Better scalability

---

## Code Sample

### Enable Cache

```java
@EnableCaching
@SpringBootApplication
public class Application {

}
```

### Cache Data

```java
@Service
public class UserService {

    @Cacheable("users")
    public User getUser(Long id) {

        return repository.findById(id).get();

    }

}
```

First Request

```
Database Called
```

Second Request

```
Returned from Cache
```

---

## Interview Answer

> Cache stores frequently used data in memory to avoid repeated database calls. Spring Boot provides `@Cacheable` to cache responses, which improves application performance and reduces database load.

---

# 3. Cache Evict

## What?

Cache Evict removes stale or outdated data from cache.

Example:

User updates profile.

Database gets updated.

But cache still contains old data.

So we remove the cached value.

---

## Why?

Without Cache Evict

Database
↓

Updated Name = Naveen

Cache
↓

Old Name = Kumar ❌

User still receives old data.

---

## Code Sample

```java
@CacheEvict(value = "users", key = "#id")
public void updateUser(Long id, User user) {

    repository.save(user);

}
```

Next Request

```
Cache Miss
↓

Database
↓

Cache Updated
```

---

## Interview Answer

> Cache Evict removes outdated data from cache after an update or delete operation. In Spring Boot, we use `@CacheEvict` so the next request fetches fresh data from the database and updates the cache.

---

# 4. Idempotent

## What?

An operation is idempotent if executing it multiple times produces the same final result.

Example:

Delete User

```
DELETE /users/1
DELETE /users/1
DELETE /users/1
```

Final State

```
User Deleted
```

Same result every time.

---

## Why?

Network failures happen.

Client may retry the same request.

Without Idempotency

```
Transfer ₹1000

↓

Retry

↓

₹2000 transferred ❌
```

With Idempotency

```
Transfer ₹1000

↓

Retry

↓

Already Processed

↓

Ignore Duplicate ✅
```

---

## HTTP Methods

| Method | Idempotent |
|---------|------------|
| GET | ✅ |
| PUT | ✅ |
| DELETE | ✅ |
| POST | ❌ |

---

## Code Sample

```java
@PutMapping("/users/{id}")
public User updateUser(@PathVariable Long id,
                       @RequestBody User user){

    return repository.save(user);

}
```

Calling this API 100 times keeps the same data.

---

## Interview Answer

> Idempotency means performing the same operation multiple times produces the same final result. GET, PUT, and DELETE are idempotent, while POST is generally not because it creates new resources. Idempotency helps prevent duplicate processing during retries caused by network failures.

---

# 5. Private Class

## What?

Java **does not allow** a top-level class to be private.

❌ Invalid

```java
private class User {

}
```

Compilation Error.

However, Java allows **private nested classes**.

```java
public class Employee {

    private class Address {

    }

}
```

Only the Employee class can access Address.

---

## Why?

To hide implementation details.

Benefits:
- Better encapsulation
- Cleaner API
- Internal helper classes remain hidden

---

## Code Sample

```java
public class Bank {

    private class Account {

    }

}
```

Outside access

```java
Bank.Account account = new Bank.Account();
```

Compilation Error.

---

## Interview Answer

> Java doesn't allow private top-level classes because they would be inaccessible from outside the file. However, nested classes can be private, which helps hide implementation details and improve encapsulation.

---

# 6. Abstract Class vs Interface

## What?

### Abstract Class

Used when related classes share common implementation.

```java
abstract class Animal {

    abstract void sound();

    void sleep() {
        System.out.println("Sleeping");
    }

}
```

---

### Interface

Defines a contract.

```java
interface Payment {

    void pay();

}
```

Implementation

```java
class GooglePay implements Payment {

    @Override
    public void pay() {
        System.out.println("Payment Successful");
    }

}
```

---

## Why?

### Abstract Class

Use when classes share common code.

Example:

```
Animal

↓

Dog

Cat

Lion
```

Common methods go into Animal.

---

### Interface

Use when unrelated classes should follow the same contract.

```
Payment

↓

GooglePay

PhonePe

CreditCard
```

Each class implements its own payment logic.

---

## Comparison

| Abstract Class | Interface |
|----------------|-----------|
| extends | implements |
| Can have constructors | No constructors |
| Can have instance variables | Usually constants only |
| Partial implementation | Pure contract |
| Single inheritance | Multiple interfaces |

---

## Interview Answer

> An abstract class is used when related classes share common behavior and implementation. An interface defines a contract that different classes must follow. A class can extend only one abstract class but can implement multiple interfaces.

---

# 7. N + 1 Query Problem

## What?

The N + 1 Query Problem occurs when Hibernate executes:

```
1 Query

+

N Additional Queries
```

instead of fetching everything with a single optimized query.

Example:

There are 100 Users.

Each User has Orders.

Hibernate executes:

```
SELECT * FROM users;
```

Then

```
SELECT * FROM orders WHERE user_id = 1;

SELECT * FROM orders WHERE user_id = 2;

SELECT * FROM orders WHERE user_id = 3;

...

SELECT * FROM orders WHERE user_id = 100;
```

Total Queries

```
101 Queries
```

---

## Why?

Because of Lazy Loading.

```java
@OneToMany(fetch = FetchType.LAZY)
private List<Order> orders;
```

Orders are loaded only when accessed.

---

## Code Sample

```java
List<User> users = repository.findAll();

for(User user : users){

    System.out.println(user.getOrders());

}
```

This generates:

```
1 Query for Users

+

N Queries for Orders
```

---

## Solution 1 - JOIN FETCH

```java
@Query("""
SELECT u
FROM User u
JOIN FETCH u.orders
""")
List<User> findAllUsers();
```

---

## Solution 2 - EntityGraph

```java
@EntityGraph(attributePaths = "orders")
List<User> findAll();
```

---

## Interview Answer

> The N + 1 Query Problem occurs when Hibernate fetches parent entities using one query and then executes one additional query for each child entity due to lazy loading. This results in many unnecessary database calls and poor performance. It can be solved using `JOIN FETCH`, `@EntityGraph`, or optimized fetching strategies.