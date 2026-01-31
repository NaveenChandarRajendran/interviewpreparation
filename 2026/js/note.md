🚀 JavaScript Interview Notes📦 Objects & BasicsThe objects are referenceShallow copyJavaScriptconst copy = {...user}; // But this will not copy the nested objects. Its still shared
Deep copyJavaScriptconst deep = JSON.parse(JSON.stringify(user));
Object Freeze and SealingObject.freeze(obj); // this object does not have add/update/deleteObject.seal(obj); // update allowedDifference between == and === for objects?If we try {} == {} it will be false. The objects are compared by the reference, not by value.What is this inside an object?this refers to the object which is invoked by the method.⚙️ Execution ContextIn Environment in which how the javascript code is executed.It has two types:Global Execution Context: It defers the global variables, functions this (window) etc.Function Execution Context: It creates everytime within the function call.It has two phases:Memory creation phase (Hoisting): JS scans code and allocate the Memory.variable -> undefinedfunctions -> full function definitionlet/const -> store with uninitializedExecution Phases: Executing the code.Common Tricky Interview QuestionJavaScriptconsole.log(x);

function foo() {
  console.log(x);
  var x = 20;
}

var x = 10;
foo();

// Output:
// undefined
// undefined
Reason: Global x hoisted → undefined. Function x hoisted → undefined (shadowing).🔄 Event LoopingIt is the Mechanism which allows Javascript (single thread) to handle async operations.How it works?It keep on check the call stack. If call stack is empty then it calls microtask after that Macrotask then repeat.call stack (empty means) -> Micro task -> Macro taskMicro task: Promise.then, catch, finally.Macro task: setTimeout, setInterval, DOM events.Note: micro task have HIGHER priority than Macrotask.Tricky Interview QuestionsQ1) Predict the outputJavaScriptsetTimeout(() => console.log("A"), 0);
Promise.resolve().then(() => console.log("B"));
console.log("C");

// Output: C, B, A
Q2) What happens if microtasks keep coming?Macrotask waits, UI can freeze.Q3) Is setTimeout guaranteed to run in given time?Ans - No.🏗️ HoistingHoisting is the process by which JavaScript allocates memory for variables and functions before code execution, allowing access to declarations before they appear in the code.Note:Only declaration are hoisted.Initialization are not hoisted.Hoisting with varJavaScriptconsole.log(a);
var a = 10;
// output -> undefined
Hoisting with let and constJavaScriptconsole.log(b);
let b = 20;
// Output -> ReferenceError: Cannot access 'b' before initialization
Why? let and const ARE hoisted but kept in Temporal Dead Zone (TDZ).Hoisting with FunctionsJavaScripthello();
function hello() {
  console.log("Hello");
}
// ✔ Works because function declarations are hoisted with full definition.
Difference between hoisting in functions and blocks?var → function-scopedlet/const → block-scoped🔢 undefined + 1The javascript tries to convert the undefined to number because of the + operator. It returns NaN.Output: NaN🛑 Temporary Dead Zone (TDZ)It is present in the memory execution phase where the let and const are allocated in memory but not accessible. If initial value is assigned, then we can access. It restricts accessing the variable before assigning an initial value.🎯 Event DelegationIt is the process of adding the event listeners to the parent level instead of giving to all its child elements.Example:JavaScriptconst ul = document.querySelector("ul");

ul.addEventListener("click", (event) => {
  if (event.target.tagName === "LI") {
    console.log(event.target.textContent);
  }
});
📞 Call, Apply and BindUsed to control the this value when calling a function.callJavaScriptconst user = { name: "naveen" };
function greet(city, country) {
  console.log(this.name, city, country);
}

greet.call(user, "Chennai", "India"); 
// ✔ Calls immediately, arguments passed one by one
applyJavaScriptgreet.apply(user, ["Chennai", "India"]);
// ✔ Calls immediately, arguments passed as array
bind (important)JavaScriptconst boundGreet = greet.bind(user, "Chennai", "India");
boundGreet();
// ✔ Returns a new function, does NOT execute immediately.
Real-world example (without bind vs with bind):JavaScript// Without bind: returns undefined because 'this' points to window/undefined
const user = {
    name: "Naveen",
    greet(){
        setTimeout(function(){ console.log(this.name); }, 1000)
    }
}

// With bind:
setTimeout(function(){
    console.log(this.name);
}.bind(this), 1000)
Important note: For arrow functions, call, apply, and bind do not work; they always output undefined.🧬 PrototypePrototype is an object where other objects inherit properties and methods through the prototype chain.✅ Good (shared via prototype):JavaScriptfunction User(name){
    this.name = name;
}
User.prototype.greet = function(){
    console.log("Hi " + this.name);
}
const user1 = new User("Naveen");
Prototype chain: user1 -> User.prototype -> Object.prototype -> nullPrototype vs Class:Behind the scenes, a class is just syntax sugar for prototypes. class User { greet() {} } is actually User.prototype.greet.Object.create() & prototype:JavaScriptconst parent = { role: "admin" };
const child = Object.create(parent);
child.role; // "admin" (child → parent → Object.prototype)
🔒 ClosureClosure is when a function remembers its variables from its outer scope even after the outer function has finished execution.Example (Data Privacy):JavaScriptfunction bankAccount() {
  let balance = 1000;
  return {
    deposit(amount) { balance += amount; console.log(balance); },
    getBalance() { return balance; }
  };
}
const account = bankAccount();
account.deposit(500); // 1500
console.log(account.balance); // ❌ undefined
Closure in Loops (FAMOUS INTERVIEW TRAP ⚠️):Using var:JavaScriptfor (var i = 1; i <= 3; i++) {
  setTimeout(() => { console.log(i); }, 1000);
}
// Output: 4, 4, 4 (shared i reference)
Using let:JavaScriptfor (let i = 1; i <= 3; i++) {
  setTimeout(() => { console.log(i); }, 1000);
}
// Output: 1, 2, 3 (let creates new binding per iteration)
🍛 CurryingFunctional programming technique where a function takes arguments one at a time and returns a new function.Instead of add(2, 3), we do add(2)(3).Example: const add = a => b => a + b;Use Case: ReusabilityJavaScriptconst multiply = a => b => a * b;
const double = multiply(2);
double(5); // 10
🏁 Promise.race vs Promise.anyrace: Looks for the first promise settled (resolved OR rejected).any: Looks for the first SUCCESS (resolve). Ignores rejections.What if ALL fail in Promise.any?It returns an AggregateError: All promises were rejected.🛠️ Object.create vs Object.assignObject.create: Creates object based on prototype. Accessed via prototype chain. No property copying.Object.assign: Creates a new object via shallow copy. All properties are copied.📊 Object methodsObject.entries: Returns key and value in array format [["name", "Naveen"]]. Ignores prototype properties.Object.fromEntries: Opposite of entries. Converts array of pairs into an object.🎯 target vs currentTargettarget: Where the click happened.currentTarget: Who is handling the click (where the listener is attached).📜 async vs defer<script src="app.js"></script>: Stops HTML parsing. Large scripts freeze UI.async: Loads asynchronously and executes as soon as ready. No order guaranteed. (Use for: Ads, Analytics).defer: Loads asynchronously but executes after HTML parsing. Preserves order. (Use for: Main app JS).💎 SOLID PrinciplesS – Single Responsibility: Class should have only one reason to change.O – Open / Closed: Open for extension but closed for modification.L – Liskov Substitution: Child class should replace parent without breaking behavior.I – Interface Segregation: Don’t force a class to implement methods it doesn’t need.D – Dependency Inversion: High-level modules should depend on abstractions.🌵 DRY PrincipleDon’t Repeat Yourself. Every piece of logic should exist in only one place. Over-abstraction can reduce readability.👨‍🏭 Web WorkersRun JS in background thread.Main Thread: Handles UI, has DOM access.Web Worker: No DOM access, non-blocking, handles background tasks.Communication: postMessage (send) and onmessage (receive).🏗️ Class vs PrototypeFeaturePrototypeClassSyntaxFunction-basedCleaner, OOP-styleReadabilityHarderEasierHoistingFunction hoistedNot hoisted🔄 Iterators & GeneratorsIterator: Object that returns {value:any, done:boolean}. Used in for...of, spread operator, Array.from().Generator: Special function that can pause execution.JavaScriptfunction* numbers(){
  yield 1;
  yield 2;
}
// yield = pause + return value. Used for Lazy Loading.
🔝 High Order Function (HOF)A function that operates on other functions (takes them as argument or returns them).Examples: map(), filter(), reduce().🔢 Array MethodsMutating: push, pop, unshift, shift, splice, sort.Non-Mutating: map, filter, slice, reduce.some(): At least one element matches.every(): All elements match.Slice vs SpliceSlice: Returns new array, does not change original. slice(start, end).Splice: Changes original array. Returns removed elements. splice(start, deleteCount, items).Flat vs Flatmapflat(depth): Flattens nested arrays. Use Infinity for full flatten.flatMap(): Map + flat (depth 1). Efficient transformation + flattening.