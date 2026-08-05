# Streams based problems

# Esay

## P-1 Filter even numbers

### Solution

```java
     List<Integer> numbers = List.of(2, 5, 8, 11, 14, 17, 20);
        List<Integer> evenNo = numbers.stream()
                .filter((n) -> n % 2 == 0)
                .toList();
                System.out.println(evenNo);  
```

## P-2 Remove duplicate numbers

### Solution

```java
    List<Integer> numbers = List.of(1, 2, 3, 2, 4, 5, 1, 6, 4);
List<Integer> removeDuplicateNo = numbers.stream()
        .distinct()
        .toList();

       System.out.print(removeDuplicateNo); 
```


## P-3 Uppercase string

### Solution

```java
   List<String> names = List.of(
        "Ram",
        "John",
        "Raj",
        "Steve"
);
List<String> upperCase = names.stream()
        .map(n -> n.toUpperCase())
        .toList();
        System.out.println(upperCase);
```

