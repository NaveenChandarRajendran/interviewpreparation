import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collector;
import java.util.stream.Collectors;

public class practice {
    public static void main(String[] args) {
        // List<Integer> intergerList = Arrays.asList(1, 2, 3, 4);
        // intergerList.stream()
        // .forEach(System.out::println);

        // // Sorted
        // List<String> stringList = Arrays.asList("Java", "Python", "C++++++",
        // "JavaScript");

        // List<String> sortedList = stringList.stream()
        // .sorted().toList();
        // sortedList.forEach(System.out::println);
        // // Sort with string length
        // List<String> sortedStringLength = stringList.stream()
        // .sorted(Comparator.comparingInt(String::length)).toList();
        // sortedStringLength.forEach(System.out::println);

        // GroupBy
        // List<String> names = List.of("naveen", "gayathri", "krishikaa", "nambi",
        // "krithika");
        // Map<Character, List<String>> sortByChar =
        // names.stream().collect(Collectors.groupingBy(s -> s.charAt(0)));
        // System.out.println(sortByChar);
    }
}