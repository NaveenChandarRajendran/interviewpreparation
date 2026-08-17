import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

public class Problems {

    class SingleTon(){
        private static SingleTon SINGLETON_INSTANCE = new SingleTon();
        private SingleTon(){

        }

        public SingleTon getInstance(){
            if(SINGLETON_INSTANCE == null){
                SINGLETON_INSTANCE = new SingleTon();
            }
            return SINGLETON_INSTANCE;
        }
    }

    public static void main(String[] args) {

            List<Integer> numbers = List.of(1,2,3,4,5,6,7,8);



    }
}
