# My Microservices + Kafka Notes

## PART 1: MONOLITH TO MICROSERVICES MIGRATION

### Big rule #1: JPA relationships only work inside ONE service's database
- In the monolith, `Order` had `@ManyToOne User`, and `OrderItem` had `@ManyToOne Product`.
- In microservices, each service has its OWN database. You cannot JPA-join across databases.
- Fix: replace `@ManyToOne User user` with a plain `Long userId` field. Same for Product → `Long productId`.
- Exception: `OrderItem → Order` stayed as a real `@ManyToOne`, because both entities live together in `order-service`'s own database. Only CROSS-service references become plain IDs.

### Big rule #2: Category stayed inside product-service
- Not every entity needs to be its own microservice.
- Category is small and tightly coupled to Product's purpose, so it became a normal entity inside product-service with a normal `@ManyToOne` to it — no extra network calls needed.
- Lesson: split services along business capability, not by splitting every table.

### Feign Client — calling another service over HTTP, declaratively
- Feign lets you write an interface, and Spring creates the real HTTP-calling code for you.
- Example:
```java
@FeignClient(name = "USER-SERVICE")
public interface UserClient {
    @GetMapping("/users/{id}")
    UserInfo getUserById(@PathVariable Long id);
}
```
- `name` must match the service's name as registered in Eureka.
- The method signature mirrors the real REST endpoint in the other service.
- Local DTOs like `UserInfo`/`ProductInfo` are NOT the same class as the real service's DTO — they're a separate, minimal copy with only the fields this service actually needs.
- IMPORTANT: Feign does NOT return null on a 404, like `Optional` does in JPA. It THROWS `FeignException.NotFound` instead.
  - Wrong (dead code, never reached): `if (user == null) throw new ResourceNotFoundException(...)`
  - Right:
```java
try {
    user = userClient.getUserById(id);
} catch (FeignException.NotFound e) {
    throw new ResourceNotFoundException("User not found");
}
```

### @Transactional — undo half-finished work on failure
- Without it: if creating an order fails partway (e.g. 2nd item's product doesn't exist), the Order and 1st OrderItem are already saved in the DB — leaving broken, half-created data behind.
- `@Transactional` on a service method wraps all DB writes in one transaction. If an exception is thrown anywhere inside, ALL the DB writes in that method roll back together.
- It only controls DATABASE operations. It does NOT roll back HTTP calls (like Feign GET calls) — but that's fine here since those are just reads, nothing to undo.

### Denormalization — storing a copy of data on purpose
- Problem: `OrderItem` only stores `productId`, not the product's name. So `productName` was always null.
- Fix: store `productName` as its OWN column in `OrderItem`, filled in at the moment the order is created (using the name from the Feign call you already made to get the price).
- This is intentional duplication, not a mistake. It means: even if the product gets renamed later in product-service, this order's history still shows the name as it was AT THE TIME OF PURCHASE. This is how real e-commerce order history works.

### Gotchas worth remembering
- `@EnableJpaAuditing` must be added to EVERY service's main class separately — otherwise `created_at`/`updated_at` silently stay null (no error, just wrong data).
- `.properties` files use `#` for comments, NOT `//`.
- Each microservice needs its OWN database (e.g. `userdb`, `productdb`, `orderdb`) — proper microservices pattern, not shared tables.
- A catch-all exception handler that doesn't log anything makes debugging "blind" — always log the real exception somewhere, even temporarily with `ex.printStackTrace()`, when chasing a generic 500 error.
- `host.docker.internal` showing up in Eureka instance names = Docker Desktop adds this to the Windows hosts file, which can confuse Java's hostname lookup. Usually not an actual problem if everything's running on the same machine — test with a direct curl first before assuming it's broken.

---

## PART 2: WHAT IS KAFKA

### The core problem Kafka solves
- REST/Feign = synchronous. order-service calling product-service means order-service is stuck waiting, and FAILS if product-service is slow or down.
- Kafka = asynchronous. Instead of "call and wait," a service just PUBLISHES an event. Other services read it WHENEVER they're ready. The publisher doesn't need the reader to be available right now.

### Core vocabulary
- **Producer** — a service that publishes (sends) messages.
- **Topic** — a named channel/category for messages (e.g. `order-created`).
- **Consumer** — a service that reads messages from a topic.
- **Broker** — the actual Kafka server that stores and routes messages. Messages are saved to disk, not just memory — so a consumer that's down can catch up later.

### Partitions — simple version
- A topic is split into partitions. Think of a topic as a notebook, and each partition is one page in it.
- If you don't say how many partitions a topic should have, Kafka defaults to 1 (this is what happened with `order-created` — it's always partition `order-created-0`).
- A partition is an ATOMIC unit — it cannot be split between two consumers in the same group at the same time. One partition = one consumer (within the same group) at a time.
- More partitions = more consumers can work in parallel on the same topic. Partition count is the hard ceiling on parallelism within one consumer group.

### Consumer Groups — simple version
- A consumer group is a named team of consumer instances sharing the work of reading a topic.
- Rule: each partition is owned by only ONE consumer in a group at a time.
- If you have 1 partition and 2 consumer instances in the same group: 1 instance does the work, the 2nd sits idle (a partition can't be divided).
- DIFFERENT consumer groups reading the SAME topic each get their OWN full, independent copy of every message. They don't know about each other and don't share progress.
  - Example: `notification-service-group` and `email-service-group` both subscribed to `order-created` → BOTH get every single event, separately. One isn't "using up" the message for the other.

### Offsets
- Each consumer group tracks, per partition, "how far have I read" — this is called the offset.
- If a consumer crashes and restarts, it resumes from its last committed offset (doesn't miss messages, doesn't need to replay everything).
- `auto-offset-reset=latest` (the default): a BRAND NEW consumer group only reads messages published AFTER it joins — it ignores everything already sitting in the topic. This is why my first 6 test orders never showed up in notification-service — the consumer group didn't exist yet when those messages were sent, so it started reading from "now onward," skipping all history.
- The CLI tool `--from-beginning` flag ignores offsets and reads the whole topic from the start — that's a special CLI-only behavior, not what a real `@KafkaListener` does by default.

### Serializers / Deserializers
- Kafka only understands raw bytes — it doesn't know what a Java object is.
- Serializer (producer side): converts your Java object → bytes (we used `JsonSerializer`, which turns the object into JSON text).
- Deserializer (consumer side): converts bytes back → Java object (we used `JsonDeserializer`, the reverse).
- `JsonDeserializer.TRUSTED_PACKAGES = "*"` — a security setting that controls which packages of classes are allowed to be deserialized into. `"*"` = trust everything (fine for local learning, NOT recommended for real production).

---

## PART 3: ACTUAL CODE PIECES USED

### Producer side (in order-service)
```java
// Manual bean config (needed because Boot 4.1.0 autoconfig for Kafka didn't kick in automatically)
@Configuration
public class KafkaProducerConfig {
    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
```

```java
// Sending the actual event, inside createOrder(), right before returning the response
OrderCreatedEvent event = new OrderCreatedEvent(savedOrder.getUserId(), savedOrder.getId(), savedOrder.getTotalPrice());
kafkaTemplate.send("order-created", String.valueOf(savedOrder.getId()), event);
```

### Consumer side (in notification-service)
```java
// Manual bean config — same reason as producer side
@Configuration
public class KafkaConsumerConfig {
    @Bean
    public ConsumerFactory<String, Object> consumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "notification-service-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "*");
        return new DefaultKafkaConsumerFactory<>(props);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        return factory;
    }
}
```

```java
// The actual listener — gets called automatically by Spring whenever a message arrives
@Component
public class OrderCreatedConsumer {
    @KafkaListener(topics = "order-created", groupId = "notification-service-group")
    public void handleOrderCreated(OrderCreatedEvent event) {
        System.out.println("Received order created event: " + event.getOrderId()
            + ", user: " + event.getUserId() + ", total: " + event.getTotalPrice());
    }
}
```

```java
// VERY IMPORTANT — without this, @KafkaListener methods are just inert/ignored.
// Normally Spring Boot adds this automatically via autoconfig, but that wasn't
// working on this Boot version, so it had to be added explicitly.
@SpringBootApplication
@EnableKafka
public class NotificationServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(NotificationServiceApplication.class, args);
    }
}
```

---

## PART 4: BIGGEST DEBUGGING LESSON OF THIS SESSION

On Spring Boot 4.1.0 + spring-kafka 4.1.0, Kafka's AUTOCONFIGURATION did not activate properly:
- Producer side: failed LOUDLY — app wouldn't start, clear error: "no KafkaTemplate bean found."
- Consumer side: failed SILENTLY — app started fine, no errors anywhere, but the listener simply never ran. No bean error because nothing forced the dependency the way constructor injection did for KafkaTemplate.

Fix for both: manually define the missing beans yourself with `@Configuration` classes, instead of relying on Spring Boot to auto-create them. And for the consumer specifically, also manually add `@EnableKafka` since that wasn't being added automatically either.

Lesson: when using brand-new/cutting-edge framework versions, autoconfiguration ("magic") can lag behind. Knowing how to wire a bean manually is the fallback skill that gets you unstuck. Also: "the app started with no errors" does NOT mean everything is working — always verify with a real end-to-end test, not just absence of errors.

### Debugging process that worked (general technique, reusable later)
1. Confirm the dependency is REALLY in pom.xml and REALLY downloaded (`mvn dependency:tree | findstr <name>`).
2. Confirm package structure is correct for component scanning.
3. Confirm files are saved in the right physical location (`Get-ChildItem -Recurse -Filter *.java`).
4. Rule out IDE caching by running directly via `mvn spring-boot:run` instead of the IDE's run button.
5. Add a plain `System.out.println(...)` directly inside suspected bean methods to prove, with certainty, whether that exact piece of code is even running.
6. Turn on `logging.level.org.springframework.boot.autoconfigure=DEBUG` to see what Spring Boot's autoconfiguration actually considered and matched/rejected.