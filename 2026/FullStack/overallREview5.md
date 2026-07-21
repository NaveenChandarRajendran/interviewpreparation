# Spring Security - Important Classes (Interview Notes)

## Why do we use Spring Security?

Spring Security is used to secure a Spring Boot application.

It provides:
- Authentication (Who are you?)
- Authorization (What are you allowed to access?)
- Password Encryption
- JWT Authentication
- Protection against common attacks (CSRF, Session Fixation, etc.)

---

# Spring Security Authentication Flow

```text
UI
 │
 │ Username & Password
 ▼
Controller
 │
 ▼
AuthService
 │
 ▼
AuthenticationManager.authenticate()
 │
 ▼
UsernamePasswordAuthenticationToken
 │
 ▼
CustomUserDetailsService
 │
 ▼
UserRepository
 │
 ▼
Database
 │
 ▼
PasswordEncoder.matches()
 │
 ▼
Authentication Success
 │
 ▼
JwtService.generateToken()
 │
 ▼
JWT returned to UI
```

For every authenticated request:

```text
UI
 │
 │ Authorization : Bearer JWT
 ▼
JwtAuthenticationFilter
 │
 ▼
JwtService.validateToken()
 │
 ▼
CustomUserDetailsService
 │
 ▼
SecurityContextHolder
 │
 ▼
Controller
```

---

# 1. SecurityFilterChain

## Purpose

The main configuration class of Spring Security.

It defines:
- Which APIs are public
- Which APIs require login
- Session management
- JWT Filter
- CSRF configuration

## Example

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http)
        throws Exception {

    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth ->
                auth
                    .requestMatchers("/login").permitAll()
                    .anyRequest().authenticated()
        );

    return http.build();
}
```

## Interview Answer

> SecurityFilterChain is used to configure all security rules in a Spring Boot application. It specifies which endpoints are public, which require authentication, and configures filters like JWT authentication.

---

# 2. AuthenticationManager

## Purpose

Responsible for authenticating a user.

It checks whether the username and password are valid.

We usually call only:

```java
authenticationManager.authenticate(...)
```

Internally it calls:

```text
AuthenticationManager
        │
        ▼
DaoAuthenticationProvider
        │
        ▼
CustomUserDetailsService
        │
        ▼
PasswordEncoder
```

## Example

```java
Authentication authentication =
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            username,
            password
        )
    );
```

## Interview Answer

> AuthenticationManager is a Spring Security interface responsible for authenticating users. It internally calls UserDetailsService and PasswordEncoder to validate user credentials.

---

# 3. UsernamePasswordAuthenticationToken

## Purpose

This class stores the username and password during login.

Think of it as a container.

Before authentication:

```text
Username
Password
```

After authentication:

```text
Username
Authorities
Roles
Authenticated = true
```

## Example

```java
new UsernamePasswordAuthenticationToken(
        username,
        password
);
```

## Interview Answer

> UsernamePasswordAuthenticationToken is an implementation of the Authentication interface. It carries the username and password to AuthenticationManager for authentication.

---

# 4. UserDetailsService

## Purpose

Loads user details from the database.

Spring Security automatically calls:

```java
loadUserByUsername(username)
```

We never call this method directly.

## Example

```java
@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) {

        User user = repository.findByUsername(username)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                List.of(new SimpleGrantedAuthority(user.getRole()))
        );
    }
}
```

## Interview Answer

> UserDetailsService loads user information from the database. During login, Spring Security automatically calls loadUserByUsername() to retrieve the user's username, password, and roles.

---

# 5. UserDetails

## Purpose

Represents the authenticated user.

It contains:

- Username
- Password
- Roles
- Authorities
- Account Status

Spring Security uses this object internally.

## Example

```java
UserDetails user =
    userDetailsService.loadUserByUsername(username);
```

## Interview Answer

> UserDetails is an interface that represents a logged-in user. It stores user credentials and authorities used by Spring Security.

---

# 6. PasswordEncoder

## Purpose

Encrypts passwords before saving them.

Also compares entered password with encrypted password.

Common implementation:

```java
BCryptPasswordEncoder
```

## Example

```java
passwordEncoder.encode(password);

passwordEncoder.matches(rawPassword, encodedPassword);
```

## Interview Answer

> PasswordEncoder is responsible for hashing passwords before storing them in the database and verifying passwords during login.

---

# 7. SecurityContextHolder

## Purpose

Stores the currently logged-in user.

Anywhere in the application we can access the logged-in user.

## Example

```java
Authentication authentication =
        SecurityContextHolder
                .getContext()
                .getAuthentication();
```

## Interview Answer

> SecurityContextHolder stores authentication information for the current request. It allows us to access the logged-in user's details anywhere in the application.

---

# 8. Authentication

## Purpose

Represents the authenticated user.

Contains:

- Username
- Roles
- Authorities
- Authentication status

## Example

```java
Authentication authentication =
        SecurityContextHolder
            .getContext()
            .getAuthentication();
```

## Interview Answer

> Authentication represents the current authenticated user. It contains user details, authorities, and authentication status.

---

# 9. OncePerRequestFilter

## Purpose

Custom JWT filter.

Runs once for every HTTP request.

Responsibilities:

- Read JWT token
- Validate token
- Load user
- Store Authentication in SecurityContextHolder

## Example

```java
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // Validate JWT

        filterChain.doFilter(request, response);
    }
}
```

## Interview Answer

> OncePerRequestFilter ensures the JWT filter executes only once per request. It is commonly extended to implement JWT authentication.

---

# 10. JwtAuthenticationFilter (Custom Class)

## Purpose

Every request passes through this filter.

Responsibilities:

- Read Authorization Header
- Extract JWT
- Validate JWT
- Load User
- Set Authentication in SecurityContextHolder

## Example

```java
String authHeader =
        request.getHeader("Authorization");

if(authHeader != null &&
   authHeader.startsWith("Bearer ")){

    String token = authHeader.substring(7);

    String username =
            jwtService.extractUsername(token);

    UserDetails user =
            userDetailsService.loadUserByUsername(username);

    UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                    user,
                    null,
                    user.getAuthorities());

    SecurityContextHolder
            .getContext()
            .setAuthentication(authentication);
}
```

## Interview Answer

> JwtAuthenticationFilter intercepts every request, validates the JWT token, loads the user details, and stores the authenticated user in SecurityContextHolder.

---

# 11. JwtService (Custom Class)

## Purpose

Responsible for JWT operations.

- Generate JWT
- Validate JWT
- Extract Username
- Check Expiration

> **Note:** JwtService is **not part of Spring Security**. It is a custom service that uses a JWT library (such as JJWT) to create and validate tokens.

## Example

```java
String token =
        jwtService.generateToken(username);

String username =
        jwtService.extractUsername(token);
```

## Interview Answer

> JwtService is a custom service responsible for generating, validating, and parsing JWT tokens using a JWT library.

---

# Quick Interview Revision Table

| Class | Purpose |
|---------|---------|
| SecurityFilterChain | Configure security rules |
| AuthenticationManager | Authenticate username and password |
| UsernamePasswordAuthenticationToken | Holds username and password |
| UserDetailsService | Loads user from database |
| UserDetails | Represents authenticated user |
| PasswordEncoder | Encrypts and verifies passwords |
| Authentication | Represents logged-in user |
| SecurityContextHolder | Stores authenticated user for current request |
| OncePerRequestFilter | Runs JWT filter once per request |
| JwtAuthenticationFilter | Validates JWT on every request |
| JwtService | Generates and validates JWT |

---

# 1 Minute Interview Summary

> In our project, we use Spring Security to secure REST APIs using JWT authentication. The `SecurityFilterChain` configures security rules. During login, the controller calls `AuthenticationManager.authenticate()`, which internally uses `UserDetailsService` to load the user from the database and `PasswordEncoder` to verify the password. Once authentication succeeds, our custom `JwtService` generates a JWT token and returns it to the client. For every subsequent request, `JwtAuthenticationFilter` (which extends `OncePerRequestFilter`) reads and validates the JWT, loads the user details, and stores the authenticated user in `SecurityContextHolder`. Controllers can then access the authenticated user through the `Authentication` object.