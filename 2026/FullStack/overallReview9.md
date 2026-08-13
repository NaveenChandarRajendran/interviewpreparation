# Spring / Java / AWS Interview Revision Notes

## 1. Spring Framework vs Spring Boot

### Spring Framework

Spring Framework is the core framework that provides features such as:

-   IoC / Dependency Injection
-   Beans
-   ApplicationContext
-   Spring MVC
-   AOP
-   Transaction management
-   Spring Security

### Spring Boot

Spring Boot is built on top of Spring Framework and reduces boilerplate
configuration.

It provides:

-   Auto-configuration
-   Starter dependencies
-   Embedded servers
-   Production-ready features
-   Less manual configuration

### Interview answer

> Spring Framework is the core framework providing features such as IoC,
> Dependency Injection, AOP, Spring MVC and transaction management.
> Spring Boot is built on top of Spring and simplifies application
> development using auto-configuration, starter dependencies and
> embedded servers.

------------------------------------------------------------------------

# 2. What Spring Boot Removes / Simplifies

Think:

**Traditional Spring → more manual configuration**

**Spring Boot → convention + auto-configuration**

## Application configuration

Traditional Spring may require explicit configuration such as:

``` java
@Configuration
@ComponentScan("com.example")
public class AppConfig {
}
```

and manually creating the application context.

Spring Boot:

``` java
@SpringBootApplication
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

`@SpringBootApplication` combines:

-   `@Configuration`
-   `@EnableAutoConfiguration`
-   `@ComponentScan`

## Database configuration

Traditional Spring may require manual configuration of:

-   DataSource
-   EntityManagerFactory
-   TransactionManager
-   JPA/Hibernate configuration

Spring Boot can configure these automatically when the correct
dependencies and properties are provided.

Example:

``` properties
spring.datasource.url=jdbc:mysql://localhost:3306/test
spring.datasource.username=root
spring.datasource.password=password
```

## Web server

Traditional Spring applications commonly require deployment to an
externally installed Tomcat server.

Spring Boot can include embedded Tomcat.

With:

``` xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

you can run:

``` bash
java -jar application.jar
```

and the embedded server starts.

## JSON conversion

Spring Boot's web starter includes and configures Jackson by default, so
Java objects can automatically be converted to JSON responses.

## Dependency management

Instead of manually selecting compatible versions for many Spring
libraries, Spring Boot starters and dependency management provide
compatible versions.

## Component scanning

Spring Boot automatically scans components from the package of the main
application class and its subpackages.

### Interview answer

> Spring Boot reduces boilerplate configuration. In traditional Spring,
> we may manually configure things like DataSource, JPA, transaction
> manager, MVC components and server deployment. Spring Boot uses
> auto-configuration, starter dependencies and embedded servers to
> configure most of these automatically based on dependencies and
> properties.

------------------------------------------------------------------------

# 3. Tomcat

## What is Apache Tomcat?

Apache Tomcat is primarily a **Servlet container and web server** used
to run Java web applications.

It receives HTTP requests and provides the runtime for Servlet-based web
applications.

Example flow:

``` text
Browser
   ↓ HTTP request
Tomcat :8080
   ↓
Spring MVC
   ↓
Controller
   ↓
Service
   ↓
Database
```

Tomcat's job is not to contain your business logic. It handles the
web/Servlet layer and passes requests into the application.

## Why do we need Tomcat?

Something needs to:

1.  Listen on a port such as 8080
2.  Accept HTTP requests
3.  Pass requests to the Java web application
4.  Receive the application's response
5.  Send the HTTP response back to the client

Tomcat performs this role for Servlet-based Spring applications.

## Spring Boot and Tomcat

Spring Boot can use **embedded Tomcat**, so you normally don't need to
install Tomcat separately.

``` text
Spring Boot Application
        |
        +--- Spring MVC
        |
        +--- Embedded Tomcat
                    |
                  :8080
```

### Interview answer

> Tomcat is primarily a Servlet container and web server. It implements
> the Java Servlet and related web specifications. Spring Boot can embed
> Tomcat, allowing us to run the application directly without separately
> installing and deploying to Tomcat.

------------------------------------------------------------------------

# 4. Node.js vs Tomcat

Node.js does not normally require a separate Tomcat server.

Node.js provides HTTP server capabilities through its built-in HTTP
module.

Example:

``` javascript
const http = require('http');

const server = http.createServer((req, res) => {
    res.end("Hello");
});

server.listen(3000);
```

With Express:

``` javascript
const express = require('express');

const app = express();

app.get('/users', (req, res) => {
    res.json([]);
});

app.listen(3000);
```

Conceptually:

``` text
Node.js
   ↓
HTTP Server
   ↓
Express
   ↓
Routes
   ↓
Application
```

Spring Boot:

``` text
Spring Boot
   ↓
Spring MVC
   ↓
Embedded Tomcat
   ↓
HTTP :8080
```

### Key point

> Node.js provides HTTP server capabilities through its runtime, while
> Spring Boot commonly uses an embedded Servlet container such as
> Tomcat.

------------------------------------------------------------------------

# 5. Web Server vs Application Server

## Web Server

A web server primarily handles HTTP/HTTPS requests and serves web
content.

Examples:

-   Apache HTTP Server
-   Nginx
-   IIS

## Application Server

An application server provides a runtime for executing
application/business logic and often provides enterprise services.

Examples:

-   WebLogic
-   WildFly
-   WebSphere

## Tomcat

Tomcat is primarily a **Servlet container and web server**, rather than
a complete Jakarta EE application server.

### Interview answer

> A web server primarily handles HTTP requests and serves web content,
> while an application server provides a runtime for executing business
> logic and enterprise application services. Tomcat is primarily a
> Servlet container and web server.

------------------------------------------------------------------------

# 6. Jakarta EE

**Jakarta EE** is the successor to **Java EE**.

It is a set of specifications/APIs for building enterprise Java
applications.

Examples include specifications for:

-   Servlets
-   REST
-   JPA
-   CDI
-   Transactions
-   Security

It is a specification/platform, not one particular server.

``` text
Jakarta EE
   |
   +-- Servlet
   +-- REST
   +-- JPA
   +-- CDI
   +-- Transactions
   +-- Security
```

Servers/frameworks can implement these specifications.

## Tomcat and Jakarta EE

Tomcat mainly implements the **Servlet specification**. It does not
implement the complete Jakarta EE platform.

## Java EE → Jakarta EE

The ecosystem was previously called Java EE. After the technology moved
to the Eclipse Foundation, it became Jakarta EE.

## javax vs jakarta

Older applications commonly use:

``` java
import javax.servlet.*;
```

Newer Jakarta-based applications use:

``` java
import jakarta.servlet.*;
```

### Interview answer

> Jakarta EE is the successor to Java EE. It provides specifications and
> APIs for enterprise Java applications, such as Servlets, REST, JPA,
> CDI and transactions. Tomcat mainly implements the Servlet
> specification rather than the complete Jakarta EE platform.

------------------------------------------------------------------------

# 7. Spring JDBC

Spring JDBC is a Spring module that simplifies database access using
JDBC.

The main class commonly used is:

**JdbcTemplate**

Without Spring JDBC, raw JDBC involves handling:

-   Connection
-   PreparedStatement
-   ResultSet
-   Exception handling
-   Resource cleanup

Spring JDBC simplifies this.

Example:

``` java
String sql = "SELECT * FROM users WHERE id = ?";

User user = jdbcTemplate.queryForObject(
    sql,
    (rs, rowNum) -> new User(
        rs.getInt("id"),
        rs.getString("name")
    ),
    1
);
```

Spring handles much of the JDBC boilerplate.

``` text
Your Code
   ↓
JdbcTemplate
   ↓
Get Connection
   ↓
Execute SQL
   ↓
Process ResultSet
   ↓
Close Resources
```

## Spring JDBC vs JPA

  Spring JDBC               Spring Data JPA
  ------------------------- ---------------------------------------
  SQL-oriented              ORM-oriented
  Uses JdbcTemplate         Uses Repository/Entity
  Usually write SQL         Hibernate generates SQL in many cases
  More direct SQL control   More abstraction
  No ORM                    ORM

Example:

Spring JDBC:

``` java
jdbcTemplate.query("SELECT * FROM users", ...);
```

JPA:

``` java
userRepository.findAll();
```

### Interview answer

> Spring JDBC is a Spring module that simplifies database access using
> JDBC. Its main class is JdbcTemplate, which handles connection
> management, query execution, exception handling and resource cleanup,
> allowing developers to focus mainly on SQL and result processing.

------------------------------------------------------------------------

# 8. How to Answer If You Know JPA but the JD Says Spring JDBC

If asked:

**"Have you worked with Spring JDBC?"**

Be honest:

> My primary experience has been with Spring Data JPA and Hibernate
> rather than JdbcTemplate. But I understand Spring JDBC and
> JdbcTemplate, including connection management, query execution,
> prepared statements, exception handling and resource cleanup. I can
> work with it if the project requires it.

If asked:

**"What's the difference between Spring JDBC and JPA?"**

> Spring JDBC is SQL-oriented. We use JdbcTemplate and generally write
> SQL queries ourselves. JPA is ORM-oriented, where we work with Java
> entities and repositories, and Hibernate handles the object-relational
> mapping and much of the SQL generation.

If asked:

**"Can you work with Spring JDBC?"**

> Although my hands-on experience is mainly with JPA, I understand the
> Spring JDBC programming model and JdbcTemplate. Since I already
> understand JDBC and database operations, I would be comfortable
> working with it.

------------------------------------------------------------------------

# 9. JDBI

**JDBI** is a third-party Java library that makes working with JDBC
easier.

It is different from Spring JDBC.

``` text
JDBC
  ↓
Low-level database API

JDBI
  ↓
Simplifies JDBC

Spring JDBC
  ↓
Spring abstraction around JDBC

JPA/Hibernate
  ↓
ORM
```

Example JDBI:

``` java
@SqlQuery("SELECT * FROM users WHERE id = :id")
User findUser(@Bind("id") int id);
```

## JDBI vs Spring JDBC

                    JDBI                Spring JDBC
  ----------------- ------------------- ---------------
  Type              Java library        Spring module
  Built on          JDBC                JDBC
  Main API          Jdbi / SQL Object   JdbcTemplate
  SQL               Write SQL           Write SQL
  ORM               No                  No
  Spring-specific   No                  Yes

## JDBI vs JPA

JDBI:

> I want to write SQL but avoid JDBC boilerplate.

JPA:

> I want to work with Java objects/entities and use ORM.

------------------------------------------------------------------------

# 10. Spark Java

**Spark Java** is a lightweight Java web framework used to build REST
APIs and web applications.

It is NOT the same as Apache Spark.

Example:

``` java
import static spark.Spark.*;

public class Application {
    public static void main(String[] args) {

        get("/users", (req, res) -> {
            return "Users list";
        });
    }
}
```

## Spark Java vs Spring Boot

  Spark Java            Spring Boot
  --------------------- --------------------------------------------
  Lightweight           Full-featured ecosystem
  Simple setup          More features
  Minimal framework     Built on Spring Framework
  Good for small APIs   Common for enterprise applications
  Less abstraction      DI, AOP, Security, JPA, Transactions, etc.

### Important distinction

**Spark Java** → lightweight Java web framework.

**Apache Spark** → distributed data-processing/big-data framework.

------------------------------------------------------------------------

# 11. Apache Maven

**Apache Maven** is a build automation and dependency management tool
mainly used for Java projects.

It helps with:

-   Dependency management
-   Compilation
-   Testing
-   Packaging
-   Build automation

## pom.xml

POM = **Project Object Model**

It contains:

-   Dependencies
-   Plugins
-   Java version
-   Build configuration
-   Project information

Example dependency:

``` xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```

Maven downloads required dependencies automatically.

``` text
pom.xml
   ↓
Maven
   ↓
Downloads dependencies
   ↓
Compiles code
   ↓
Runs tests
   ↓
Packages application
   ↓
JAR / WAR
```

## Common Maven commands

``` bash
mvn clean
```

Removes generated build files.

``` bash
mvn compile
```

Compiles source code.

``` bash
mvn test
```

Runs tests.

``` bash
mvn package
```

Compiles, tests and creates JAR/WAR.

``` bash
mvn clean install
```

Cleans, builds, tests and installs the artifact into the local Maven
repository.

### Interview answer

> Apache Maven is a build automation and dependency management tool
> mainly used for Java projects. We define dependencies and build
> configuration in pom.xml. Maven downloads dependencies, manages
> versions, compiles code, runs tests and packages the application.

------------------------------------------------------------------------

# 12. AWS Aurora PostgreSQL

**Amazon Aurora PostgreSQL** is an AWS-managed relational database that
is PostgreSQL-compatible.

Think:

> PostgreSQL-compatible database + AWS managed infrastructure + high
> availability/scalability features.

## Normal PostgreSQL

Depending on how it is deployed, you may be responsible for:

-   Server
-   Storage
-   Backups
-   Replication
-   Maintenance

## Aurora PostgreSQL

AWS manages much of the underlying infrastructure.

``` text
Your Application
       ↓
Aurora PostgreSQL
       ↓
AWS manages
 ├── Storage
 ├── Backups
 ├── Replication
 ├── Failover
 └── Maintenance
```

Aurora separates compute and storage, allowing the storage layer to
scale independently.

## Why use Aurora?

Common reasons:

-   High availability
-   Automatic backups
-   Automatic storage scaling
-   Replication
-   Automatic failover
-   Managed AWS infrastructure

## Spring Boot connection

Spring Boot can connect to Aurora PostgreSQL using JDBC/JPA like a
PostgreSQL database.

Example:

``` properties
spring.datasource.url=jdbc:postgresql://aurora-endpoint:5432/mydb
spring.datasource.username=admin
spring.datasource.password=*****
```

Application flow:

``` text
Spring Boot
    ↓
JDBC / JPA / Hibernate
    ↓
Aurora PostgreSQL
    ↓
Database
```

### Interview answer

> Amazon Aurora PostgreSQL is a fully managed relational database
> service from AWS that is PostgreSQL-compatible. It provides features
> such as high availability, automatic backups, replication, failover
> and scalable storage while AWS manages most of the underlying database
> infrastructure.

------------------------------------------------------------------------

# 13. AWS SNS

**Amazon SNS (Simple Notification Service)** is a fully managed
publish/subscribe messaging service.

Think of SNS as a **broadcast system**.

``` text
Publisher
   ↓
SNS Topic
   ↓
 ┌───────┬─────────┬─────────┐
 ↓       ↓         ↓
SQS    Lambda    Email/SMS
```

## Example

Suppose an order is created:

``` text
Spring Boot
    ↓
Publish "Order Created"
    ↓
SNS Topic
    ↓
 ├── SQS → Order processing
 ├── Lambda → Another action
 └── Email → Notification
```

The publisher does not need to directly call every consumer.

## Important SNS terms

**Topic** → Channel where messages are published.

**Publisher** → Application that sends a message.

**Subscriber** → Service that receives the message.

**Subscription** → Connection between a topic and subscriber.

------------------------------------------------------------------------

# 14. SNS vs Kafka

SNS and Kafka can look similar because both support asynchronous
messaging, but they are different.

  -----------------------------------------------------------------------
  SNS                                 Kafka
  ----------------------------------- -----------------------------------
  Pub/Sub / fan-out                   Event streaming

  Fully managed AWS service           Distributed streaming platform

  Topic + subscribers                 Topics + partitions

  Commonly used for                   High-volume event streaming
  notifications/fan-out               

  Limited replay compared with Kafka  Durable log and replay

  AWS manages infrastructure          Kafka infrastructure or managed
                                      Kafka

  No Kafka-style partition/offset     Partitions and offsets
  model                               
  -----------------------------------------------------------------------

## SNS example

``` text
              SNS Topic
                  ↓
       "Order Created!"
          ↙      ↓      ↘
       SQS    Lambda    Email
```

SNS says:

> I have a message; deliver it to the subscribed endpoints.

## Kafka example

``` text
             Kafka Topic
                  ↓
       ┌───────────────────┐
       │ P0 │ P1 │ P2 │ P3 │
       └───────────────────┘
          ↓       ↓
      Consumer  Consumer
```

Kafka maintains a durable event log, and consumers track their position
using offsets.

## SNS + SQS

SNS and SQS are often used together:

``` text
Producer
   ↓
 SNS
 ↓    ↓
SQS  SQS
 ↓    ↓
C1   C2
```

This provides fan-out plus queue-based consumption.

### Interview answer

> SNS and Kafka are both used for asynchronous messaging, but SNS is
> primarily a managed pub/sub and fan-out service, whereas Kafka is a
> distributed event-streaming platform with durable logs, partitions,
> offsets and message replay.

------------------------------------------------------------------------

# Quick Revision Cheat Sheet

  -----------------------------------------------------------------------
  Topic                               One-line meaning
  ----------------------------------- -----------------------------------
  Spring Framework                    Core Java framework providing IoC,
                                      DI, AOP, MVC, transactions, etc.

  Spring Boot                         Simplifies Spring application
                                      configuration and deployment

  Tomcat                              Servlet container and web server

  Node.js                             JavaScript runtime with HTTP server
                                      capabilities

  Web Server                          Handles HTTP/HTTPS requests and web
                                      content

  Application Server                  Runtime for application/business
                                      logic and enterprise services

  Jakarta EE                          Enterprise Java
                                      specifications/platform; successor
                                      to Java EE

  Spring JDBC                         Spring abstraction for JDBC, mainly
                                      using JdbcTemplate

  JDBI                                Third-party library that simplifies
                                      JDBC

  JPA                                 Java ORM specification

  Hibernate                           Common JPA implementation

  Spark Java                          Lightweight Java web framework

  Apache Maven                        Java build and dependency
                                      management tool

  Aurora PostgreSQL                   AWS-managed PostgreSQL-compatible
                                      relational database

  AWS SNS                             Managed pub/sub and fan-out
                                      messaging service

  Kafka                               Distributed event-streaming
                                      platform with partitions and
                                      offsets
  -----------------------------------------------------------------------

## Most important interview distinctions

### Spring vs Spring Boot

``` text
Spring       → Framework
Spring Boot  → Simplifies Spring
```

### Tomcat vs Spring Boot

``` text
Tomcat       → Web/Servlet runtime
Spring Boot  → Application framework + auto-configuration
```

### JDBC vs JPA

``` text
JDBC → SQL/database API
JPA  → ORM specification
```

### Spring JDBC vs JPA

``` text
Spring JDBC → SQL-oriented
JPA         → Entity/ORM-oriented
```

### SNS vs Kafka

``` text
SNS   → Pub/Sub / Fan-out
Kafka → Event streaming / durable log
```

### Spark Java vs Apache Spark

``` text
Spark Java  → Java web framework
Apache Spark → Big-data processing framework
```
