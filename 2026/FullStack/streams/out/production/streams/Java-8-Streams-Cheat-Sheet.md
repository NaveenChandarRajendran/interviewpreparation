# Java 8 Streams Cheat Sheet (Interview Revision)

> Goal: When you see a problem, immediately identify the Stream operation to use.

---

# Stream Flow

```java
collection.stream()
          .operation1()
          .operation2()
          .terminalOperation();
```

---

# 1. Filtering

| Method | Purpose | Example |
|---------|----------|---------|
| `filter()` | Select elements based on condition | Keep even numbers |
| `distinct()` | Remove duplicates | Unique values |
| `limit(n)` | Take first N elements | Top 5 |
| `skip(n)` | Skip first N elements | Pagination |
| `takeWhile()` *(Java 9)* | Take until condition fails | Ordered streams |
| `dropWhile()` *(Java 9)* | Skip until condition fails | Ordered streams |

### Example

```java
numbers.stream()
       .filter(n -> n % 2 == 0)
       .toList();
```

---

# 2. Mapping (Transformation)

| Method | Purpose |
|---------|----------|
| `map()` | Convert one object into another |
| `flatMap()` | Flatten nested collections |
| `mapToInt()` | Convert to IntStream |
| `mapToLong()` | Convert to LongStream |
| `mapToDouble()` | Convert to DoubleStream |

### Example

```java
employees.stream()
         .map(Employee::getName)
         .toList();
```

---

# 3. Sorting

| Method | Purpose |
|---------|----------|
| `sorted()` | Natural order |
| `sorted(Comparator)` | Custom sorting |
| `reversed()` | Reverse order |
| `thenComparing()` | Multiple field sorting |

### Example

```java
employees.stream()
         .sorted(Comparator.comparing(Employee::getSalary))
         .toList();
```

Descending

```java
employees.stream()
         .sorted(Comparator.comparing(Employee::getSalary).reversed())
         .toList();
```

Multiple fields

```java
employees.stream()
         .sorted(
             Comparator.comparing(Employee::getDepartment)
                       .thenComparing(Employee::getSalary)
         )
         .toList();
```

---

# 4. Matching

Returns boolean.

| Method | Purpose |
|---------|----------|
| `anyMatch()` | At least one matches |
| `allMatch()` | All match |
| `noneMatch()` | None match |

Example

```java
students.stream()
        .allMatch(s -> s.getMarks() > 35);
```

---

# 5. Finding

| Method | Purpose |
|---------|----------|
| `findFirst()` | First element |
| `findAny()` | Any element |
| `max()` | Maximum |
| `min()` | Minimum |

Example

```java
numbers.stream()
       .max(Integer::compareTo);
```

---

# 6. Counting

| Method | Purpose |
|---------|----------|
| `count()` | Count elements |
| `Collectors.counting()` | Count inside grouping |

Example

```java
numbers.stream()
       .count();
```

---

# 7. Reduction

| Method | Purpose |
|---------|----------|
| `reduce()` | Custom accumulation |
| `sum()` | Sum values |
| `average()` | Average |

Example

```java
numbers.stream()
       .reduce(Integer::sum);
```

or

```java
numbers.stream()
       .mapToInt(Integer::intValue)
       .sum();
```

---

# 8. Collectors

## Convert

```java
collect(Collectors.toList())

collect(Collectors.toSet())

collect(Collectors.toMap())
```

---

## Join Strings

```java
collect(Collectors.joining(","))
```

Output

```
A,B,C,D
```

---

## Grouping

```java
collect(Collectors.groupingBy())
```

Example

```java
employees.stream()
.collect(Collectors.groupingBy(Employee::getDepartment));
```

---

## Partitioning

Only two groups (true/false)

```java
collect(Collectors.partitioningBy())
```

Example

```java
numbers.stream()
.collect(Collectors.partitioningBy(n -> n % 2 == 0));
```

---

## Counting inside Group

```java
Collectors.counting()
```

Example

```java
names.stream()
.collect(Collectors.groupingBy(
        Function.identity(),
        Collectors.counting()
));
```

Output

```
Apple=2
Orange=1
Banana=3
```

---

## Mapping inside Group

```java
Collectors.mapping()
```

Example

```java
employees.stream()
.collect(Collectors.groupingBy(
Employee::getDepartment,
Collectors.mapping(Employee::getName,
Collectors.toList())
));
```

---

## Summarizing

```java
Collectors.summarizingInt()
```

Returns

- count
- sum
- min
- max
- average

---

# 9. Terminal Operations

| Method | Purpose |
|---------|----------|
| `collect()` | Collect result |
| `toList()` | Convert to List |
| `forEach()` | Iterate |
| `count()` | Count |
| `reduce()` | Reduce |
| `findFirst()` | First |
| `findAny()` | Any |

---

# Most Used Interview Collectors

```java
Collectors.toList()

Collectors.toSet()

Collectors.toMap()

Collectors.groupingBy()

Collectors.partitioningBy()

Collectors.counting()

Collectors.mapping()

Collectors.joining()

Collectors.summarizingInt()
```

---

# Most Used Comparator Methods

```java
Comparator.comparing()

Comparator.reverseOrder()

Comparator.naturalOrder()

reversed()

thenComparing()
```

---

# Most Used Stream Methods

```java
stream()

filter()

map()

flatMap()

distinct()

sorted()

limit()

skip()

peek()

collect()

count()

reduce()

max()

min()

findFirst()

findAny()

anyMatch()

allMatch()

noneMatch()
```

---

# Problem → Method Mapping (Most Important)

| Interview asks | Think immediately |
|----------------|-------------------|
| Remove elements | `filter()` |
| Remove duplicates | `distinct()` |
| Convert object | `map()` |
| Nested list | `flatMap()` |
| Count | `count()` |
| Frequency | `groupingBy() + counting()` |
| Group objects | `groupingBy()` |
| Split into two groups | `partitioningBy()` |
| Maximum | `max()` |
| Minimum | `min()` |
| Sort | `sorted()` |
| Sum | `mapToInt().sum()` |
| Average | `average()` |
| Boolean check | `anyMatch()` / `allMatch()` / `noneMatch()` |
| First element | `findFirst()` |
| Join strings | `joining()` |
| Custom calculation | `reduce()` |
| Convert to Map | `toMap()` |

---

# Stream Thinking Pattern

Whenever you see a problem, ask yourself these questions:

```
Need to remove something?
→ filter()

Need unique values?
→ distinct()

Need to convert?
→ map()

Need nested list?
→ flatMap()

Need grouping?
→ groupingBy()

Need frequency?
→ groupingBy() + counting()

Need two groups?
→ partitioningBy()

Need sorting?
→ sorted()

Need maximum?
→ max()

Need minimum?
→ min()

Need total?
→ sum()

Need average?
→ average()

Need boolean?
→ anyMatch()
→ allMatch()
→ noneMatch()

Need custom logic?
→ reduce()

Need List?
→ toList()

Need Set?
→ toSet()

Need Map?
→ toMap()
```

---

# Interview Formula (Remember This)

```
Read Problem
      ↓
Identify Operation
      ↓
stream()
      ↓
Intermediate Operations
(filter/map/sorted/distinct...)
      ↓
Terminal Operation
(collect/count/reduce/findFirst...)
```

---

# Final Interview Tip

Don't memorize solutions.

Memorize **which Stream method solves which type of problem**.

Once you identify the correct methods, writing the code becomes much easier.