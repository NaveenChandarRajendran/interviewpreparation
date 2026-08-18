# Java & Spring Boot Interview Notes

## 1. OOP Principles with Real-Time Examples

### What is OOP?

- OOP (Object-Oriented Programming) is a programming approach where we organize code using **objects and classes**.
- The four main OOP principles are:
  - Encapsulation
  - Inheritance
  - Polymorphism
  - Abstraction

### 1. Encapsulation

- **Meaning:** Keep data and the methods that operate on that data together, and control direct access to the data.
- Usually achieved using `private` fields and public methods.

### Simple Example

```java
class BankAccount {
    private double balance;

    public void deposit(double amount) {
        balance += amount;
    }

    public double getBalance() {
        return balance;
    }
}
```

- `balance` cannot be directly changed from outside.
- We control access through methods.

**Real-time example:** A bank account hides its balance and allows changes through deposit/withdraw operations.

### 2. Inheritance

- **Meaning:** One class can reuse properties and methods of another class.
- Achieved using `extends`.

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle started");
    }
}

class Car extends Vehicle {
    void drive() {
        System.out.println("Car is driving");
    }
}
```

**Real-time example:** A `Car` is a type of `Vehicle`, so it can reuse common vehicle behavior.

### 3. Polymorphism

- **Meaning:** One interface/reference can represent different implementations.
- Two common types:
  - Method overloading — compile-time polymorphism
  - Method overriding — runtime polymorphism

```java
class Animal {
    void sound() {
        System.out.println("Animal sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Bark");
    }
}

Animal animal = new Dog();
animal.sound(); // Bark
```

**Real-time example:** A payment service can have different implementations such as CreditCardPayment, UpiPayment, and PaypalPayment.

### 4. Abstraction

- **Meaning:** Hide implementation details and expose only what is necessary.
- Achieved using interfaces or abstract classes.

```java
interface Payment {
    void pay();
}

class UpiPayment implements Payment {
    public void pay() {
        System.out.println("Payment using UPI");
    }
}
```

- The caller knows `pay()` is available.
- The caller does not need to know the internal payment processing.

**Real-time example:** We use an ATM without knowing its internal banking logic.

### Short Interview Answer

> OOP is a programming approach based on objects. Its four main principles are encapsulation, inheritance, polymorphism, and abstraction. Encapsulation protects data, inheritance promotes code reuse, polymorphism allows different implementations through a common interface, and abstraction hides implementation details.

---

## 2. HashMap vs ConcurrentHashMap vs Hashtable

### HashMap

- Not thread-safe.
- Allows one `null` key and multiple `null` values.
- Good for single-threaded applications.
- Usually provides better performance than synchronized alternatives.

```java
Map<String, Integer> map = new HashMap<>();
map.put("A", 10);
```

### ConcurrentHashMap

- Thread-safe.
- Designed for concurrent access by multiple threads.
- Does **not** allow `null` keys or `null` values.
- Better choice than Hashtable for modern multithreaded applications.

```java
Map<String, Integer> map = new ConcurrentHashMap<>();
map.put("A", 10);
```

### Hashtable

- Thread-safe.
- Synchronizes its methods.
- Does not allow `null` keys or values.
- Legacy class; generally prefer `ConcurrentHashMap` for new code.

### Simple Comparison

| Feature | HashMap | ConcurrentHashMap | Hashtable |
|---|---|---|---|
| Thread-safe | No | Yes | Yes |
| Null key | Yes, one | No | No |
| Null values | Yes | No | No |
| Performance in concurrency | Not safe | Better | Usually lower |
| Modern choice | Yes, when no concurrency | Yes | Generally avoid |

### Short Interview Answer

> HashMap is not thread-safe and allows nulls. ConcurrentHashMap is thread-safe and designed for high-concurrency applications without locking the entire map for normal operations. Hashtable is also thread-safe but is a legacy synchronized class, so ConcurrentHashMap is generally preferred.

---

## 4. `==` vs `equals()`

### `==`

- For primitives, compares values.
- For objects, compares whether two references point to the **same object**.

```java
String a = new String("Java");
String b = new String("Java");

System.out.println(a == b); // false
```

### `equals()`

- Used to compare object contents/logical equality.
- `String` overrides `equals()` to compare text.

```java
System.out.println(a.equals(b)); // true
```

### Simple Example

```java
int x = 10;
int y = 10;

System.out.println(x == y); // true
```

For objects:

```java
String s1 = new String("Hello");
String s2 = new String("Hello");

s1 == s2;       // false
s1.equals(s2);  // true
```

### Short Interview Answer

> `==` compares primitive values or object references, while `equals()` is used for logical/content equality when the class overrides it. For example, two different String objects containing "Java" are false with `==` but true with `equals()`.

---

## 5. String vs StringBuilder vs StringBuffer

### String

- Immutable.
- Once created, its value cannot be changed.
- Every modification creates a new String object.

```java
String s = "Java";
s = s + " Spring";
```

A new String object is created for the changed value.

### StringBuilder

- Mutable.
- Used when we need frequent String modifications.
- Not thread-safe.
- Usually faster than StringBuffer.

```java
StringBuilder sb = new StringBuilder("Java");
sb.append(" Spring");

System.out.println(sb); // Java Spring
```

### StringBuffer

- Mutable.
- Thread-safe because its methods are synchronized.
- Usually slower than StringBuilder.

```java
StringBuffer sb = new StringBuffer("Java");
sb.append(" Spring");
```

### Simple Comparison

| Feature | String | StringBuilder | StringBuffer |
|---|---|---|---|
| Mutable | No | Yes | Yes |
| Thread-safe | Immutable | No | Yes |
| Performance for modifications | Lower | High | Lower than StringBuilder |
| Common use | Fixed text | Single-threaded modifications | Shared mutable string in legacy/concurrent code |

### Short Interview Answer

> String is immutable. StringBuilder is mutable and faster for frequent String modifications but is not thread-safe. StringBuffer is also mutable but synchronized and therefore thread-safe, with more synchronization overhead.

---

## 6. Java 8 Stream API

### What is Stream API?

- Stream API was introduced in Java 8.
- It is used to process collections in a declarative way.
- Common operations:
  - `filter()`
  - `map()`
  - `sorted()`
  - `distinct()`
  - `collect()`
  - `forEach()`

### Simple Example

```java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);

List<Integer> result = numbers.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> n * 10)
        .toList();

System.out.println(result); // [20, 40, 60]
```

### How it works

```text
Collection
   |
 stream()
   |
filter()
   |
map()
   |
toList()
   |
Result
```

- `filter()` selects elements.
- `map()` transforms elements.
- `toList()` collects the result.

### Important Point

- A Stream is **not a data structure**.
- It does not store data.
- It processes data from a source such as a Collection.
- Intermediate operations are generally lazy.
- A terminal operation triggers processing.

### Short Interview Answer

> Java Stream API provides a declarative way to process collections. We can perform operations such as filter, map, sort, and collect without writing traditional loops. Streams support a pipeline of intermediate and terminal operations.

---

## 7. `map()` vs `flatMap()`

### `map()`

- Used when each input produces **one output**.
- It transforms elements.

```java
List<String> names = List.of("Alice", "Bob");

List<Integer> lengths = names.stream()
        .map(String::length)
        .toList();

System.out.println(lengths); // [5, 3]
```

### `flatMap()`

- Used when each input can produce **multiple values**.
- It transforms and flattens nested structures into one Stream.

```java
List<List<Integer>> numbers = List.of(
        List.of(1, 2),
        List.of(3, 4)
);

List<Integer> result = numbers.stream()
        .flatMap(List::stream)
        .toList();

System.out.println(result); // [1, 2, 3, 4]
```

### Easy Way to Remember

```text
map:
[["A"], ["B"]] -> [Stream, Stream]

flatMap:
[["A"], ["B"]] -> ["A", "B"]
```

### Short Interview Answer

> `map()` transforms each element into another element, while `flatMap()` transforms each element into a stream and then flattens those streams into a single stream. `flatMap()` is commonly used for nested collections.

---

## 8. Functional Interface and Lambda Expressions

### Functional Interface

- An interface containing exactly **one abstract method**.
- It can have multiple default or static methods.
- `@FunctionalInterface` is used to explicitly indicate this intention.

```java
@FunctionalInterface
interface Calculator {
    int add(int a, int b);
}
```

### Lambda Expression

- Lambda provides a short implementation of a functional interface.

```java
Calculator calculator = (a, b) -> a + b;

System.out.println(calculator.add(10, 20)); // 30
```

### Common Functional Interfaces

- `Predicate<T>` → returns boolean
- `Function<T, R>` → takes input and returns output
- `Consumer<T>` → takes input and returns nothing
- `Supplier<T>` → returns a value without input

### Short Interview Answer

> A functional interface has exactly one abstract method. A lambda expression provides a concise implementation of that interface. For example, a `Predicate<Integer>` can be implemented as `n -> n > 10`.

---

## 9. Optional

### What is Optional?

- `Optional` was introduced in Java 8.
- It is a container that may or may not contain a value.
- It helps make absence of a value explicit and can reduce accidental NullPointerExceptions.

### Without Optional

```java
String name = getName();

if (name != null) {
    System.out.println(name);
}
```

### With Optional

```java
Optional<String> name = Optional.ofNullable(getName());

name.ifPresent(System.out::println);
```

### Common Methods

- `of()` → value must not be null
- `ofNullable()` → value can be null
- `isPresent()` → checks whether value exists
- `ifPresent()` → executes code if value exists
- `orElse()` → default value
- `orElseGet()` → lazily creates default value
- `orElseThrow()` → throws exception if empty

### Example

```java
String name = Optional.ofNullable(getName())
        .orElse("Unknown");
```

### Important Point

- Optional is mainly useful for representing an absent return value.
- Avoid blindly using `Optional.get()` because it can throw `NoSuchElementException`.

### Short Interview Answer

> Optional is a Java 8 container used to represent a value that may or may not be present. It makes absence explicit and provides methods such as `ofNullable`, `orElse`, `ifPresent`, and `orElseThrow`.

---

## 10. Checked vs Unchecked Exceptions

### Checked Exception

- Checked by the compiler.
- Must be handled using `try-catch` or declared using `throws`.
- Usually represents conditions the application may reasonably recover from.

Examples:
- `IOException`
- `SQLException`

```java
void readFile() throws IOException {
    // file operation
}
```

### Unchecked Exception

- Occurs at runtime.
- Extends `RuntimeException`.
- Compiler does not force handling.

Examples:
- `NullPointerException`
- `IllegalArgumentException`
- `ArithmeticException`

```java
int result = 10 / 0; // ArithmeticException
```

### Simple Comparison

| Feature | Checked | Unchecked |
|---|---|---|
| Checked by compiler | Yes | No |
| Parent | Exception | RuntimeException |
| Must handle/declare | Yes | No |
| Example | IOException | NullPointerException |

### Short Interview Answer

> Checked exceptions are verified by the compiler and must be handled or declared, such as IOException. Unchecked exceptions extend RuntimeException and are not forced by the compiler, such as NullPointerException and IllegalArgumentException.

---

## 12. Multithreading and ExecutorService

### What is Multithreading?

- Multithreading means executing multiple tasks concurrently using multiple threads.
- It helps improve responsiveness and resource utilization.

### Simple Example

```java
class Task extends Thread {
    public void run() {
        System.out.println("Task running");
    }
}

new Task().start();
```

### Why ExecutorService?

Creating threads manually for every task is difficult to manage.

`ExecutorService` provides a thread pool that manages worker threads.

```java
ExecutorService executor = Executors.newFixedThreadPool(3);

executor.submit(() -> {
    System.out.println("Task running");
});

executor.shutdown();
```

### Simple Flow

```text
Tasks
  |
  v
ExecutorService
  |
  v
Thread Pool
  |
  +--> Thread 1
  +--> Thread 2
  +--> Thread 3
```

### Common Executor Types

```java
Executors.newFixedThreadPool(3);
Executors.newSingleThreadExecutor();
Executors.newCachedThreadPool();
```

### Important Point

- Do not create unlimited threads.
- Thread pools control the number of active threads.
- Always properly shut down an ExecutorService when it is no longer needed.

### Short Interview Answer

> Multithreading allows multiple tasks to execute concurrently. ExecutorService simplifies thread management by maintaining a pool of worker threads and assigning submitted tasks to them. It is preferred over manually creating a new thread for every task.

---

## 14. SOLID Principles

SOLID is a set of five principles used to create maintainable and flexible object-oriented code.

### S — Single Responsibility Principle

- A class should have one responsibility or one reason to change.

Bad:

```java
class Invoice {
    void calculateTotal() {}
    void saveToDatabase() {}
    void printInvoice() {}
}
```

Better:

```text
Invoice
InvoiceRepository
InvoicePrinter
```

**Interview point:** Separate responsibilities.

---

### O — Open/Closed Principle

- Classes should be open for extension but closed for modification.

Example:

```java
interface Payment {
    void pay();
}

class UpiPayment implements Payment {
    public void pay() {}
}

class CardPayment implements Payment {
    public void pay() {}
}
```

To add another payment type, create another implementation instead of changing existing payment logic.

**Interview point:** Add new behavior through extension rather than modifying stable code.

---

### L — Liskov Substitution Principle

- A child class should be usable wherever the parent class is expected without breaking behavior.

Example:

```java
class Bird {
    void eat() {}
}

class Sparrow extends Bird {
    void fly() {}
}
```

If every `Bird` is expected to fly, the design is wrong because some birds cannot fly.

**Interview point:** Subclasses should correctly follow the contract of the parent.

---

### I — Interface Segregation Principle

- Do not force a class to implement methods it does not need.

Bad:

```java
interface Worker {
    void work();
    void eat();
}
```

Better:

```java
interface Workable {
    void work();
}

interface Eatable {
    void eat();
}
```

**Interview point:** Prefer small, focused interfaces.

---

### D — Dependency Inversion Principle

- High-level modules should depend on abstractions rather than concrete implementations.

```java
interface NotificationService {
    void send();
}

class EmailNotification implements NotificationService {
    public void send() {}
}

class OrderService {
    private final NotificationService notificationService;

    OrderService(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
}
```

`OrderService` depends on the interface, not directly on `EmailNotification`.

**Interview point:** Depend on abstractions, not concrete classes.

### Short Interview Answer

> SOLID consists of five principles: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. They help us write code that is easier to maintain, test, extend, and change.

---

## 15. Spring Boot Architecture

### Basic Architecture

A typical Spring Boot application can be organized as:

```text
Client
  |
  v
Controller
  |
  v
Service
  |
  v
Repository
  |
  v
Database
```

### 1. Controller

- Handles HTTP requests and responses.
- Example: `GET /users`

```java
@RestController
class UserController {

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }
}
```

### 2. Service

- Contains business logic.

```java
@Service
class UserService {

    public List<User> getUsers() {
        return userRepository.findAll();
    }
}
```

### 3. Repository

- Handles database access.
- Usually implemented using Spring Data JPA.

```java
@Repository
interface UserRepository extends JpaRepository<User, Long> {
}
```

### 4. Entity

- Represents database data.

```java
@Entity
class User {
    @Id
    private Long id;
    private String name;
}
```

### 5. Database

- Stores persistent application data.

### Request Flow

```text
HTTP Request
     |
     v
Controller
     |
     v
Service
     |
     v
Repository
     |
     v
Database
     |
     v
Response
```

### Spring Boot Important Internal Components

- **Spring Container / IoC Container:** Creates and manages beans.
- **Dependency Injection:** Provides required dependencies.
- **DispatcherServlet:** Front controller for Spring MVC requests.
- **Embedded Server:** Spring Boot commonly runs with an embedded server such as Tomcat.
- **Auto Configuration:** Spring Boot automatically configures many components based on dependencies and configuration.

### Short Interview Answer

> A typical Spring Boot application follows a layered architecture: Controller handles HTTP requests, Service contains business logic, Repository handles database operations, and Entity represents database data. Spring's IoC container manages these objects and their dependencies, while Spring MVC and the embedded server handle web requests.

---

## 17. `@Autowired` vs Constructor Injection

### `@Autowired` Field Injection

```java
@Service
class UserService {

    @Autowired
    private UserRepository userRepository;
}
```

Spring injects the dependency directly into the field.

### Constructor Injection

```java
@Service
class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

If there is only one constructor, Spring can automatically use it without `@Autowired`.

### Why Constructor Injection is Preferred

- Dependency is explicit.
- Supports `final` fields.
- Easier to unit test.
- Object cannot be created without required dependencies.
- Encourages immutable dependencies.

### Unit Test Example

Constructor injection makes testing easy:

```java
UserRepository mockRepository = mock(UserRepository.class);

UserService service = new UserService(mockRepository);
```

### Simple Comparison

| Feature | Field `@Autowired` | Constructor Injection |
|---|---|---|
| Dependency visible | Less explicit | Explicit |
| `final` dependency | Not normally | Yes |
| Unit testing | Harder | Easier |
| Recommended | Generally avoid for required dependencies | Preferred |

### Short Interview Answer

> `@Autowired` field injection injects the dependency directly into a field, while constructor injection provides dependencies through the constructor. Constructor injection is preferred because dependencies are explicit, can be final, and make unit testing easier. With a single constructor, Spring does not require `@Autowired`.

---

# Quick Revision

## OOP

- Encapsulation → Protect data
- Inheritance → Reuse code
- Polymorphism → One interface, different behavior
- Abstraction → Hide implementation details

## Collections

- HashMap → Not thread-safe
- ConcurrentHashMap → Thread-safe and designed for concurrency
- Hashtable → Thread-safe legacy class

## Object Comparison

- `==` → Primitive value/reference comparison
- `equals()` → Logical/content equality

## Strings

- String → Immutable
- StringBuilder → Mutable, not thread-safe
- StringBuffer → Mutable, thread-safe

## Streams

- `filter()` → Select
- `map()` → Transform
- `flatMap()` → Transform + flatten
- Terminal operation → Starts stream processing

## Functional Programming

- Functional Interface → One abstract method
- Lambda → Short implementation of functional interface

## Optional

- Represents value that may be absent.
- Common methods: `ofNullable`, `orElse`, `ifPresent`, `orElseThrow`

## Exceptions

- Checked → Compiler checks it
- Unchecked → RuntimeException hierarchy

## Multithreading

- Multiple tasks execute concurrently.
- ExecutorService manages thread pools.

## SOLID

- S → Single Responsibility
- O → Open/Closed
- L → Liskov Substitution
- I → Interface Segregation
- D → Dependency Inversion

## Spring Boot

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

## Dependency Injection

- Field `@Autowired` → Simple but less testable/explicit
- Constructor Injection → Preferred for required dependencies
