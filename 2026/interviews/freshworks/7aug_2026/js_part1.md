# Frontend Interview Notes - JavaScript Fundamentals (Part 1)
## Execution Context, Hoisting, Scope, Closures, this, call(), apply(), bind()

---

# 1. Execution Context

## Definition

Execution Context is the environment where JavaScript executes code.

Every JavaScript program creates an Execution Context before execution starts.

Execution Context has **2 phases**:

```
1. Memory Creation Phase

2. Execution Phase
```

---

## Memory Creation Phase

JavaScript scans the entire file.

Memory Allocation:

- Variables → undefined
- Function Declarations → Entire function stored

Example

```javascript
console.log(a);

var a = 10;

function greet(){
    console.log("Hello");
}
```

Memory

```
a → undefined

greet → Entire Function
```

---

## Execution Phase

JavaScript executes line by line.

```
console.log(a)

↓

undefined

↓

a = 10

↓

greet()
```

---

## Interview Answer

> Every JavaScript program first creates an Execution Context. During the Memory Creation Phase, variables are initialized with `undefined` and function declarations are stored completely. During the Execution Phase, the code runs line by line and variables receive their actual values.

---

# 2. Hoisting

## Definition

Hoisting means JavaScript moves variable and function declarations into memory before execution.

---

## var

```javascript
console.log(a);

var a = 10;
```

Output

```
undefined
```

Reason

```
Memory

↓

a = undefined

↓

console.log(a)

↓

undefined
```

---

## let

```javascript
console.log(a);

let a = 10;
```

Output

```
ReferenceError
```

---

## const

```javascript
console.log(a);

const a = 10;
```

Output

```
ReferenceError
```

---

# Temporal Dead Zone (TDZ)

Both **let** and **const** are hoisted.

But they remain inaccessible until execution reaches their declaration.

```
Memory

↓

TDZ

↓

Declaration

↓

Accessible
```

---

# var vs let vs const

| Feature | var | let | const |
|----------|-----|-----|-------|
| Hoisted | ✅ | ✅ | ✅ |
| TDZ | ❌ | ✅ | ✅ |
| Redeclare | ✅ | ❌ | ❌ |
| Reassign | ✅ | ✅ | ❌ |
| Scope | Function | Block | Block |

---

## Interview Trap

### Is let hoisted?

✅ Correct Answer

Yes.

It is hoisted but remains inside the Temporal Dead Zone until initialization.

---

# 3. Scope

## Types

```
Global Scope

Function Scope

Block Scope
```

---

## Global Scope

```javascript
let a = 10;
```

Accessible everywhere.

---

## Function Scope

```javascript
function test(){
    let a = 10;
}
```

Accessible only inside the function.

---

## Block Scope

```javascript
if(true){
    let a = 10;
}
```

Accessible only inside the block.

---

# 4. Closures

## Definition

A Closure is created when an inner function remembers variables from its outer lexical scope even after the outer function has finished executing.

---

Example

```javascript
function outer(){

    let count = 0;

    return function(){

        count++;

        console.log(count);

    };

}

const counter = outer();

counter();
counter();
counter();
```

Output

```
1
2
3
```

Reason

The returned function still remembers `count`.

---

## Uses of Closures

- Private Variables
- Data Hiding
- React Hooks
- Event Handlers
- Memoization
- Currying

---

## Interview Answer

> A closure allows an inner function to access variables from its outer lexical scope even after the outer function has returned.

---

# 5. this Keyword

## Golden Rule

> **this is decided when a regular function is called, NOT where it is defined.**

---

## Object Method

```javascript
const user = {

    name: "Naveen",

    greet(){
        console.log(this.name);
    }

};

user.greet();
```

Output

```
Naveen
```

Reason

```
user.greet()

↓

Caller = user

↓

this = user
```

---

## Regular Function

```javascript
function test(){

    console.log(this);

}

test();
```

Output

Strict Mode

```
undefined
```

Non-Strict Browser

```
window
```

---

## Arrow Function

```javascript
const user = {

    name: "Naveen",

    greet: () => {

        console.log(this);

    }

};

user.greet();
```

Arrow functions **do not create their own this**.

They inherit `this` from the surrounding (lexical) scope.

---

## Golden Rule

Regular Function

```
Who called me?
```

Arrow Function

```
Where was I created?
```

---

# Regular Function vs Arrow Function

| Regular Function | Arrow Function |
|------------------|---------------|
| Own this | No own this |
| this depends on caller | this depends on outer scope |
| Dynamic | Lexical |

---

# Example

Regular Function

```javascript
const obj = {

    name:"JS",

    greet(){

        console.log(this.name);

    }

};
```

Output

```
JS
```

---

Arrow Function

```javascript
const obj = {

    name:"JS",

    greet:()=>{

        console.log(this.name);

    }

};
```

Output

```
undefined
```

(Browser classic scripts may instead read `window.name`.)

Reason

Arrow inherited global `this`.

---

# Nested Function Interview Question

```javascript
const user = {

    name:"Naveen",

    greet(){

        function inner(){

            console.log(this.name);

        }

        inner();

    }

};

user.greet();
```

Output

```
Naveen

undefined
```

Reason

`inner()` is a regular function.

It gets its own `this`.

```
inner()

↓

No caller object

↓

this = undefined (strict mode)
```

---

# Nested Arrow Function

```javascript
const user = {

    name:"Naveen",

    greet(){

        const inner = () => {

            console.log(this.name);

        };

        inner();

    }

};

user.greet();
```

Output

```
Naveen

Naveen
```

Reason

Arrow captures `this` from `greet()`.

```
greet()

↓

this = user

↓

Arrow captures user
```

---

# 6. call()

Changes `this` and executes immediately.

```javascript
function greet(city){

    console.log(this.name, city);

}

const user = {

    name:"Naveen"

};

greet.call(user,"Chennai");
```

Output

```
Naveen Chennai
```

---

# Syntax

```javascript
function.call(thisArg,arg1,arg2)
```

---

# 7. apply()

Same as `call()`.

Difference:

Arguments are passed as an array.

```javascript
greet.apply(user,["Chennai"]);
```

Output

```
Naveen Chennai
```

---

# Syntax

```javascript
function.apply(thisArg,[args])
```

---

# 8. bind()

Returns a new function.

Does NOT execute immediately.

```javascript
const fn = greet.bind(user);

fn();
```

Output

```
Naveen
```

---

# call vs apply vs bind

| Method | Executes Immediately | Arguments |
|----------|----------------------|-----------|
| call() | ✅ | Separate |
| apply() | ✅ | Array |
| bind() | ❌ | Returns New Function |

---

# When to Use bind()

Commonly used when passing methods as callbacks.

Example

```javascript
button.addEventListener(

    "click",

    dashboard.handleClick.bind(dashboard)

);
```

Reason

Without `bind()`, the callback may lose the intended object context.

---

# Common Interview Traps

## Trap 1

```javascript
const fn = user.greet;

fn();
```

Output

```
undefined
```

Reason

No object called `fn()`.

---

## Trap 2

```javascript
const user = {

    name:"Naveen",

    greet(){

        return () => {

            console.log(this.name);

        };

    }

};

const fn = user.greet();

fn();
```

Output

```
Naveen
```

Reason

Arrow captured `this` from `greet()`.

---

# Quick Revision

✅ Execution Context

- Memory Phase
- Execution Phase

---

✅ Hoisting

- var → undefined
- let/const → TDZ

---

✅ TDZ

Accessible only after declaration.

---

✅ Scope

- Global
- Function
- Block

---

✅ Closure

Inner function remembers outer variables.

---

✅ Regular Function

this depends on **caller**.

---

✅ Arrow Function

this depends on **where it was created**.

---

✅ call()

Changes this and executes immediately.

---

✅ apply()

Same as call.

Arguments passed as array.

---

✅ bind()

Returns new function with permanently bound this.

---

# Interview One-Liners

### Execution Context

Memory Phase + Execution Phase.

---

### Hoisting

Declarations are processed before execution.

---

### TDZ

Area where let/const exist but cannot be accessed.

---

### Closure

Inner function remembers outer variables.

---

### this

Regular Function → Caller decides.

Arrow Function → Creation scope decides.

---

### call()

Execute immediately.

---

### apply()

Execute immediately with array arguments.

---

### bind()

Returns new function with fixed `this`.

---

# 30-Second Revision

✅ Execution Context → Memory + Execution

✅ var → undefined

✅ let/const → TDZ

✅ Closure → Remembers outer variables

✅ Regular Function → Who called me?

✅ Arrow Function → Where was I created?

✅ call → Immediate

✅ apply → Immediate + Array

✅ bind → Returns new function