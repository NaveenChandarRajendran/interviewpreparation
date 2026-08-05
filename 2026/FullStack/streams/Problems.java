import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Problems {
    public static void main(String[] args) {

       String str = "programming";
       String charec = Arrays.stream(str.split("")).collect(Collectors.groupingBy(
               Function.identity(),
               LinkedHashMap::new,
               Collectors.counting()
       )).entrySet()
               .stream()
               .filter(n -> n.getValue()==1)
               .findFirst()
               .map(Map.Entry::getKey)
               .get();

        System.out.println(charec);
    }
}
