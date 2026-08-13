# Java 8 Streams - Interview Practice (Part 1)

## 1. Filter Even Numbers

### Question
```java
List<Integer> numbers = List.of(2, 5, 8, 11, 14, 17, 20);
```

Return only even numbers.

### Answer

```java
List<Integer> evenNumbers = numbers.stream()
        .filter(n -> n % 2 == 0)
        .toList();

System.out.println(evenNumbers);
```

---

# 2. Remove Duplicate Numbers

### Question

```java
List<Integer> numbers = List.of(1,2,3,2,4,5,1,6,4);
```

Remove duplicate numbers.

### Answer

```java
List<Integer> result = numbers.stream()
        .distinct()
        .toList();

System.out.println(result);
```

---

# 3. Convert Names to Uppercase

### Question

```java
List<String> names = List.of("Ram","John","Raj","Steve");
```

Convert every name to uppercase.

### Answer

```java
List<String> result = names.stream()
        .map(String::toUpperCase)
        .toList();

System.out.println(result);
```

---

# 4. Square Every Number

### Question

```java
List<Integer> numbers = List.of(2,3,4,5);
```

Return square of every number.

### Answer

```java
List<Integer> result = numbers.stream()
        .map(n -> n * n)
        .toList();

System.out.println(result);
```

---

# 5. Filter Even Numbers and Return Squares

### Question

```java
List<Integer> numbers = List.of(1,2,3,4,5,6,7,8);
```

Return squares of only even numbers.

### Answer

```java
List<Integer> result = numbers.stream()
        .filter(n -> n % 2 == 0)
        .map(n -> n * n)
        .toList();

System.out.println(result);
```

---

# 6. Sort Numbers

### Question

```java
List<Integer> numbers = List.of(8,2,5,1,9,3);
```

Sort ascending.

### Answer

```java
List<Integer> result = numbers.stream()
        .sorted()
        .toList();

System.out.println(result);
```

---

# 7. Find Maximum Number

### Question

```java
List<Integer> numbers = List.of(8,2,15,1,9,3);
```

Find highest number.

### Answer (Recommended)

```java
Integer max = numbers.stream()
        .max(Integer::compareTo)
        .orElse(-1);

System.out.println(max);
```

### Alternative

```java
Integer max = numbers.stream()
        .mapToInt(Integer::intValue)
        .max()
        .orElse(-1);
```

---

# 8. Find Second Smallest Number

### Question

```java
List<Integer> numbers = List.of(8,2,15,1,9,3);
```

Return second smallest number.

### Answer

```java
Integer secondSmallest = numbers.stream()
        .sorted()
        .skip(1)
        .findFirst()
        .orElse(-1);

System.out.println(secondSmallest);
```

---

# 9. Find First Non-Repeated Number

### Question

```java
List<Integer> numbers = List.of(2,4,5,2,4,7,8);
```

Return first non-repeated number.

### Answer

```java
Integer result = numbers.stream()
        .collect(Collectors.groupingBy(
                Function.identity(),
                LinkedHashMap::new,
                Collectors.counting()
        ))
        .entrySet()
        .stream()
        .filter(entry -> entry.getValue() == 1)
        .map(Map.Entry::getKey)
        .findFirst()
        .orElse(-1);

System.out.println(result);
```

---

# 10. Group Employees by Department

### Question

```java
List<Employee> employees;
```

Group employees by department.

### Answer

```java
Map<String, List<Employee>> result = employees.stream()
        .collect(Collectors.groupingBy(
                Employee::getDepartment
        ));
```

---

# 11. Group Employee Names by Department

### Question

Return only employee names department-wise.

### Answer

```java
Map<String, List<String>> result = employees.stream()
        .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.mapping(
                        Employee::getName,
                        Collectors.toList()
                )
        ));
```

---

# 12. Count Employees in Each Department

### Question

Return employee count department-wise.

### Answer

```java
Map<String, Long> result = employees.stream()
        .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.counting()
        ));
```

---

# 13. Total Salary of Each Department

### Question

Find total salary of every department.

### Answer

```java
Map<String, Integer> result = employees.stream()
        .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.summingInt(
                        Employee::getSalary
                )
        ));
```

---

# 14. Highest Paid Employee in Each Department

### Question

Return highest paid employee department-wise.

### Answer

```java
Map<String, Optional<Employee>> result = employees.stream()
        .collect(Collectors.groupingBy(
                Employee::getDepartment,
                Collectors.maxBy(
                        Comparator.comparing(
                                Employee::getSalary
                        )
                )
        ));
```

---

# 15. Find Duplicate Numbers

### Question

```java
List<Integer> numbers = List.of(1,2,3,2,4,5,1,6,4);
```

Return duplicate numbers.

### Answer

```java
List<Integer> duplicates = numbers.stream()
        .collect(Collectors.groupingBy(
                Function.identity(),
                Collectors.counting()
        ))
        .entrySet()
        .stream()
        .filter(entry -> entry.getValue() > 1)
        .map(Map.Entry::getKey)
        .toList();

System.out.println(duplicates);
```

---

# 16. Find Unique Numbers

### Question

```java
List<Integer> numbers = List.of(1,2,3,2,4,5,1,6,4);
```

Return elements appearing exactly once.

### Answer

```java
List<Integer> unique = numbers.stream()
        .collect(Collectors.groupingBy(
                Function.identity(),
                Collectors.counting()
        ))
        .entrySet()
        .stream()
        .filter(entry -> entry.getValue() == 1)
        .map(Map.Entry::getKey)
        .toList();

System.out.println(unique);
```

---

# 17. First Non-Repeated Character

### Question

```java
String str = "programming";
```

Return first non-repeated character.

### Answer

```java
String result = Arrays.stream(str.split(""))
        .collect(Collectors.groupingBy(
                Function.identity(),
                LinkedHashMap::new,
                Collectors.counting()
        ))
        .entrySet()
        .stream()
        .filter(entry -> entry.getValue() == 1)
        .map(Map.Entry::getKey)
        .findFirst()
        .orElse("");

System.out.println(result);
```

---

---

# 18. Find Top K Most Frequently Purchased Products.

### Question

```java
  List<String> gadgets = List.of(
                "Phone",
                "Laptop",
                "Phone",
                "Laptop",
                "Laptop",
                "TV",
                "Phone"
        );

        int k = 2;
```

Return gadgets.

### Answer

```java
List<Map.Entry<String, Long>> result =
                gadgets.stream()
                        .collect(Collectors.groupingBy(
                                Function.identity(),
                                Collectors.counting()))
                        .entrySet()
                        .stream()
                        .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                        .limit(k)
                        .toList();

        System.out.println(result);
```

# 19. Remove the duplicate object with the name

### Question

```java
        List<User> users = Arrays.asList(new User("Naveen"),new User("Rangaraj"),new User("Naveen"));
```

Return gadgets.

### Answer

```java
List<User> tempUser = users.stream()
                    .collect(Collectors.toMap(
                            User::getName,
                            user -> user,
                            (user1,user2) -> user1
                    ))
                    .values()
                    .stream()
                    .toList();
```

---

# Methods Covered

## Stream Operations

- stream()
- filter()
- map()
- distinct()
- sorted()
- skip()
- findFirst()
- max()
- mapToInt()

## Collectors

- groupingBy()
- mapping()
- counting()
- summingInt()
- maxBy()
- toList()

## Utility Methods

- Function.identity()
- Comparator.comparing()
- Map.Entry::getKey
- Map.Entry::getValue
- Integer::compareTo
- String::toUpperCase

## Map Methods

- entrySet()
- getKey()
- getValue()

## Special Collections

- LinkedHashMap
- HashMap
