# Angular & JavaScript Interview Notes
**Topics Covered**
1. PUT vs PATCH
2. @Controller vs @RestController
3. Nullish Coalescing Operator (??)
4. DomSanitizer & XSS Protection
5. ng-container
6. CanActivate Route Guard
7. Creating Guards using Angular CLI
8. Jasmine: toBeTrue() vs toBeTruthy()

---

# 1. PUT vs PATCH

## PUT

- Replaces the entire resource.
- Client sends the complete object.
- Missing fields may become null or default depending on implementation.
- Idempotent.

### Example

Current User

```json
{
  "id": 1,
  "name": "Naveen",
  "email": "abc@gmail.com"
}
```

Request

```http
PUT /users/1
```

```json
{
  "name": "Naveen Kumar",
  "email": "xyz@gmail.com"
}
```

Result

```json
{
  "id": 1,
  "name": "Naveen Kumar",
  "email": "xyz@gmail.com"
}
```

---

## PATCH

- Updates only specified fields.
- Remaining fields stay unchanged.
- Used for partial updates.

Example

```http
PATCH /users/1
```

```json
{
    "email":"new@gmail.com"
}
```

Result

```json
{
    "id":1,
    "name":"Naveen",
    "email":"new@gmail.com"
}
```

---

## Interview Answer

PUT replaces the complete resource while PATCH updates only selected fields.

---

# 2. @Controller vs @RestController

## @Controller

Used for MVC applications.

Returns View Names.

Example

```java
@Controller
public class HomeController{

    @GetMapping("/home")
    public String home(){
        return "home";
    }

}
```

Spring looks for

```
home.html
```

or

```
home.jsp
```

---

## Returning JSON using @Controller

Need

```java
@ResponseBody
```

Example

```java
@Controller
public class UserController{

    @ResponseBody
    @GetMapping("/user")
    public User getUser(){
        return new User(1,"Naveen");
    }

}
```

---

## @RestController

Shortcut for

```java
@Controller
@ResponseBody
```

Example

```java
@RestController
public class UserController{

    @GetMapping("/user")
    public User getUser(){
        return new User(1,"Naveen");
    }

}
```

Automatically returns JSON.

---

## Interview Answer

@Controller returns views.

@RestController returns JSON/XML response body.

---

# 3. Nullish Coalescing Operator (??)

Returns right side only if left side is

- null
- undefined

Syntax

```javascript
value ?? defaultValue
```

Example

```javascript
let name = null;

console.log(name ?? "Guest");
```

Output

```
Guest
```

---

## Difference between || and ??

Example

```javascript
let count = 0;

console.log(count || 10);
```

Output

```
10
```

Because

```
0
```

is falsy.

---

Using ??

```javascript
let count = 0;

console.log(count ?? 10);
```

Output

```
0
```

because ??

checks only

- null
- undefined

---

## || treats these as false

- false
- 0
- ""
- NaN
- null
- undefined

## ?? checks only

- null
- undefined

---

## React Example

```javascript
const username = user?.name ?? "Guest";
```

---

## Interview Answer

Use ??

when you want default values only for null or undefined.

---

# 4. DomSanitizer

Purpose

Prevent XSS attacks.

---

## Problem

User enters

```html
<script>alert("Hack")</script>
```

Should browser execute?

No.

Angular protects by default.

---

## Using Interpolation

```html
<p>{{description}}</p>
```

Output

```
<script>alert("Hack")</script>
```

Shown as text.

No execution.

---

## Using innerHTML

```html
<div [innerHTML]="description"></div>
```

Angular sanitizes HTML.

Input

```html
<h1>Hello</h1>
<script>alert("Hack")</script>
```

Browser receives

```html
<h1>Hello</h1>
```

Script removed.

---

## Dangerous Case

```typescript
sanitizer.bypassSecurityTrustHtml(description);
```

Angular trusts the HTML.

If description comes from user input

❌ Possible XSS vulnerability.

---

## Database Flow

User

```
<script>alert()</script>
```

↓

Angular

↓

Spring Boot

↓

Database

↓

Another user opens page

↓

Angular displays data

Safe if using

```html
{{description}}
```

or

```html
[innerHTML]
```

Unsafe if developer uses

```typescript
bypassSecurityTrustHtml()
```

for untrusted data.

---

## Interview Answer

Angular escapes interpolation and sanitizes innerHTML automatically. DomSanitizer should only be used for trusted HTML because bypass methods disable Angular's built-in XSS protection.

---

# 5. ng-container

Invisible container.

Does NOT create HTML element.

Useful for grouping multiple elements.

---

## Example

```html
<ng-container *ngIf="isLoggedIn">

    <h1>Welcome</h1>

    <button>Logout</button>

</ng-container>
```

DOM becomes

```html
<h1>Welcome</h1>

<button>Logout</button>
```

No wrapper.

---

## Why not div?

Using div

```html
<div *ngIf="isLoggedIn">

...

</div>
```

Creates

```html
<div>

...

</div>
```

Extra div may affect CSS.

---

## Structural Directive Problem

Invalid

```html
<li
*ngFor="let user of users"
*ngIf="user.active">
</li>
```

Only one structural directive allowed.

Correct

```html
<ng-container *ngFor="let user of users">

    <li *ngIf="user.active">

        {{user.name}}

    </li>

</ng-container>
```

---

## HTML Semantic Rule

This is valid

```html
<ng-container>

<p>Hello</p>

<span>World</span>

</ng-container>
```

This is invalid

```html
<p>

<ng-container>

<div>Hello</div>

</ng-container>

</p>
```

Because after Angular removes ng-container

Browser sees

```html
<p>

<div>Hello</div>

</p>
```

Invalid HTML.

---

## Interview Answer

ng-container groups elements without adding extra DOM nodes.

---

# 6. CanActivate Route Guard

Purpose

Prevent navigation to routes.

---

Flow

```
User

↓

Dashboard

↓

CanActivate

↓

true

↓

Dashboard Opens
```

or

```
false

↓

Redirect Login
```

---

Example

```typescript
@Injectable({
providedIn:'root'
})

export class AuthGuard implements CanActivate{

canActivate():boolean{

if(localStorage.getItem("token")){

return true;

}

this.router.navigate(['/login']);

return false;

}

}
```

Routes

```typescript
{
path:'dashboard',
component:DashboardComponent,
canActivate:[AuthGuard]
}
```

---

Return Types

```typescript
boolean
```

or

```typescript
Observable<boolean>
```

or

```typescript
Promise<boolean>
```

---

Important Interview Point

CanActivate protects Angular routes only.

Backend APIs must still validate JWT/session.

---

# 7. Creating Guard

CLI Command

```bash
ng g guard guards/auth
```

or

```bash
ng generate guard guards/auth
```

Without Test

```bash
ng g guard guards/auth --skip-tests
```

Generated

```
auth.guard.ts

auth.guard.spec.ts
```

Modern Angular generates Functional Guards.

Older projects often use Class Guards.

---

# 8. Jasmine Testing
## toBeTrue() vs toBeTruthy()

These are **not the same**.

---

### toBeTrue()

Checks if the value is **strictly `true`**.

Example:

```typescript
expect(true).toBeTrue();     // ✅ Pass
expect(false).toBeTrue();    // ❌ Fail
expect(1).toBeTrue();        // ❌ Fail
expect("hello").toBeTrue();  // ❌ Fail
```

Only the boolean value `true` passes.

---

### toBeTruthy()

Checks if the value is **truthy** in JavaScript.

These values are truthy:

```typescript
expect(true).toBeTruthy();      // ✅
expect(1).toBeTruthy();         // ✅
expect("Angular").toBeTruthy(); // ✅
expect([]).toBeTruthy();        // ✅
expect({}).toBeTruthy();        // ✅
```

Falsy values:

```typescript
expect(false).toBeTruthy();      // ❌
expect(0).toBeTruthy();          // ❌
expect("").toBeTruthy();         // ❌
expect(null).toBeTruthy();       // ❌
expect(undefined).toBeTruthy();  // ❌
expect(NaN).toBeTruthy();        // ❌
```

---

### Real Angular Example

```typescript
component.isLoggedIn = true;

expect(component.isLoggedIn).toBeTrue();
```

Good when the variable should be exactly a boolean.

If checking whether an object exists:

```typescript
expect(component.user).toBeTruthy();
```

If `user` is:

```typescript
{
  id: 1,
  name: "Naveen"
}
```

The test passes because the object is truthy.

---

## Difference

| toBeTrue() | toBeTruthy() |
|------------|--------------|
| Only passes for `true` | Passes for any truthy value |
| Strict boolean check | JavaScript truthiness check |
| Best for boolean flags | Best for checking existence/non-empty values |

---

## Interview Answer

`toBeTrue()` verifies that the value is exactly `true`. `toBeTruthy()` verifies that the value is truthy according to JavaScript rules, meaning values like non-empty strings, objects, arrays, and non-zero numbers also pass.

---

# Quick Revision

| Topic | Key Point |
|--------|-----------|
| PUT | Replace complete resource |
| PATCH | Partial update |
| @Controller | Returns View |
| @RestController | Returns JSON |
| ?? | Default only for null/undefined |
| DomSanitizer | Protects against XSS |
| ng-container | Invisible wrapper |
| CanActivate | Controls route access |
| ng g guard | Creates route guard |
| toBeTrue() | Strictly `true` |
| toBeTruthy() | Any truthy value |