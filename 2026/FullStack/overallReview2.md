# Java Spring Boot Interview Notes

## 1. Circuit Breaker

-   Prevents repeated calls to an unhealthy service.
-   States:
    -   Closed -\> Normal
    -   Open -\> Fail fast
    -   Half-Open -\> Test recovery
-   Use in microservices to avoid cascading failures.

**Interview Answer** \> Circuit Breaker prevents cascading failures by
stopping requests to a failing service until it recovers.

------------------------------------------------------------------------

## 2. Retry

-   Used for temporary failures (timeouts/network glitches).
-   Do not retry permanent failures (e.g. HTTP 400).
-   Often combined with Circuit Breaker.

------------------------------------------------------------------------

## 3. JWT Tampering

-   JWT = Header + Payload + Signature.
-   If payload (role USER -\> ADMIN) is modified, signature becomes
    invalid.
-   Spring Security verifies the signature.
-   Response: 401 Unauthorized.

------------------------------------------------------------------------

## 4. Spring Singleton

-   Spring beans are Singleton by default.
-   One bean instance serves many request threads.
-   Singleton != Thread-safe.
-   Keep services stateless.

------------------------------------------------------------------------

## 5. Thread Safety

Avoid mutable instance variables.

Good: - Local variables - AtomicInteger - ConcurrentHashMap

------------------------------------------------------------------------

## 6. synchronized

-   Only one thread enters the critical section.
-   Others wait.
-   Safe but may reduce concurrency.

------------------------------------------------------------------------

## 7. AtomicInteger

-   Thread-safe counter.
-   Use incrementAndGet().
-   Better than synchronized for simple counters.

------------------------------------------------------------------------

## 8. Thread Pool

-   Tomcat creates worker threads.
-   Reuses threads.
-   Avoid new Thread() per request.

Request Flow: Client -\> Tomcat -\> Thread Pool -\> Controller -\>
Service -\> Repository -\> DB -\> Response

------------------------------------------------------------------------

## 9. HashMap put()

hashCode() -\> Bucket -\> equals() -\> Store/Update. Java 8 converts
long collision chains to Red-Black Tree.

------------------------------------------------------------------------

## 10. ArrayList vs LinkedList

### ArrayList

-   Dynamic array
-   Fast get(index)
-   Slow middle insertion

### LinkedList

-   Nodes connected by references
-   Fast link update
-   Slow random access

Insertion: 1. Find position. 2. newNode.next = current.next 3.
current.next = newNode

------------------------------------------------------------------------

## 11. CompletableFuture

-   Runs independent tasks in parallel.
-   supplyAsync()
-   allOf()
-   join()
-   thenApply()

Use when multiple independent API/database/service calls can run
simultaneously.

------------------------------------------------------------------------

## 12. Memory Leak

Definition: Objects are no longer needed but still referenced, so GC
cannot remove them.

Common Causes: - Static collections - Cache without eviction - Unclosed
resources - Event listeners

Tools: - VisualVM - Eclipse MAT - JProfiler

------------------------------------------------------------------------

## 13. wait(), notify(), notifyAll()

wait() - Releases lock - WAITING state

notify() - Wakes one waiting thread - Does NOT release the lock

notifyAll() - Wakes all waiting threads

Important: The waiting thread resumes only after: 1. Current thread
exits synchronized block. 2. Lock becomes available. 3. Waiting thread
reacquires the lock.

wait() vs sleep()

wait(): - Releases lock - Object class - Needs notify()

sleep(): - Does not release lock - Thread class - Wakes after timeout

------------------------------------------------------------------------

## 14. Cache

Why Cache? - Reduce DB load - Faster response

Cache Hit: Data found in cache.

Cache Miss: Fetch from DB -\> Store in cache -\> Return response.

TTL: Time To Live for cache entries.

After Update: Evict or update cache to avoid stale data.

Redis vs HashMap: - HashMap: Local to one instance. - Redis: Shared
across all application instances.

------------------------------------------------------------------------

## Quick One-Liners

-   Singleton beans are safe when stateless.
-   Tomcat thread pool handles HTTP requests.
-   AtomicInteger provides atomic updates without explicit locking.
-   hashCode() finds bucket, equals() finds the exact key.
-   notify() wakes a thread but does not immediately let it continue.
-   Memory leak = reachable objects that are no longer useful.
