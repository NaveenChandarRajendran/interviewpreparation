# React Portals

## What is a Portal?

A **Portal** allows you to render a React component **outside of its parent DOM hierarchy** while keeping it inside the same React component tree.

Normally, a component renders inside its parent element.

Without Portal:

```text
App
 └── Modal
      └── Rendered inside App div
```

With Portal:

```text
React Component Tree

App
 └── Modal

        │
        ▼

DOM Tree

<body>
   <div id="root"></div>

   <div id="modal-root">
       Modal renders here
   </div>
</body>
```

Although the Modal appears outside `#root` in the DOM, React still treats it as a child of `App`.

---

# Why do we need Portals?

Sometimes a component is trapped inside its parent's CSS.

Example:

```css
.parent {
    overflow: hidden;
}
```

If you open a modal:

```jsx
<div className="parent">
    <Modal />
</div>
```

The modal gets clipped because of `overflow: hidden`.

A Portal renders the modal outside the parent, solving this issue.

---

# Common Use Cases

- ✅ Modal/Dialog
- ✅ Popup
- ✅ Tooltip
- ✅ Dropdown
- ✅ Toast Notifications

---

# Syntax

```jsx
import { createPortal } from "react-dom";

createPortal(children, container);
```

- `children` → React element to render
- `container` → DOM node where it should be rendered

---

# Example

### index.html

```html
<body>
    <div id="root"></div>

    <div id="modal-root"></div>
</body>
```

---

### Modal.jsx

```jsx
import { createPortal } from "react-dom";

function Modal() {
  return createPortal(
    <div className="modal">
      This is Modal
    </div>,
    document.getElementById("modal-root")
  );
}

export default Modal;
```

---

### App.jsx

```jsx
function App() {
  return (
    <>
      <h1>Dashboard</h1>
      <Modal />
    </>
  );
}
```

Output:

```text
<body>

<div id="root">
    Dashboard
</div>

<div id="modal-root">
    This is Modal
</div>

</body>
```

---

# Event Bubbling (Interview Question ⭐)

Even though the portal renders outside the DOM hierarchy,

**Events still bubble through the React component tree.**

Example:

```jsx
function App() {

  const handleClick = () => {
    console.log("Parent clicked");
  };

  return (
    <div onClick={handleClick}>
      <Modal />
    </div>
  );
}
```

Clicking inside the Modal still triggers:

```
Parent clicked
```

because React event propagation follows the **React tree**, not the DOM tree.

---

# Advantages

- Escapes CSS restrictions (`overflow: hidden`, `z-index`)
- Better UI layering
- Cleaner DOM structure
- React Context still works
- Event bubbling still works

---

# Interview Answer (30 Seconds)

> React Portal is a feature that allows rendering a component outside its parent DOM hierarchy while keeping it inside the same React component tree. It is mainly used for modals, tooltips, dropdowns, and toast notifications where the UI needs to escape parent CSS restrictions like `overflow: hidden` or `z-index`. Even though the DOM location changes, React Context and event bubbling continue to work normally.

---

# Quick Revision

- Render outside parent DOM ✅
- Still inside React tree ✅
- Uses `createPortal()` ✅
- Used for Modals, Tooltips, Toasts, Dropdowns ✅
- Event bubbling still works ✅
- Context still works ✅

# Event Bubbling in React (and JavaScript)

## What is Event Bubbling?

**Event Bubbling** is the process where an event starts from the **target element** and then propagates upward through its parent elements.

```text
Child
  │
  ▼
Parent
  │
  ▼
Grandparent
  │
  ▼
Document
```

---

# Example

```jsx
function App() {
  return (
    <div onClick={() => console.log("Parent clicked")}>
      <button onClick={() => console.log("Button clicked")}>
        Click Me
      </button>
    </div>
  );
}
```

If you click the button:

```
Button clicked
Parent clicked
```

### Flow

```text
Button Click
     │
     ▼
Button onClick
     │
     ▼
Parent onClick
```

The event "bubbles" from the child to the parent.

---

# Real-World Example

Imagine a company hierarchy:

```text
Employee
   │
Manager
   │
Director
```

If an employee reports an issue:

```text
Employee
   │
Manager
   │
Director
```

The information travels upward through each level.

Event bubbling works in the same way.

---

# How to Stop Event Bubbling?

Use:

```jsx
event.stopPropagation();
```

Example:

```jsx
function App() {
  return (
    <div onClick={() => console.log("Parent clicked")}>
      <button
        onClick={(event) => {
          event.stopPropagation();
          console.log("Button clicked");
        }}
      >
        Click Me
      </button>
    </div>
  );
}
```

Output:

```
Button clicked
```

The parent `onClick` is **not** called.

---

# Event Bubbling with React Portals ⭐

This is a common interview question.

```jsx
function App() {
  return (
    <div onClick={() => console.log("App clicked")}>
      <Modal />
    </div>
  );
}
```

Assume `Modal` is rendered using `createPortal()` into `#modal-root`.

Even though the modal is outside the parent **DOM**, clicking inside the modal still prints:

```
App clicked
```

### Why?

React events follow the **React Component Tree**, not the DOM tree.

---

# Event Bubbling vs Event Capturing

## Event Bubbling (Default)

```text
Target
   │
Parent
   │
Grandparent
```

Flow:

```
Target → Parent → Grandparent
```

---

## Event Capturing

Flow:

```
Grandparent → Parent → Target
```

In React, you can use the capture phase with:

```jsx
<div onClickCapture={() => console.log("Capture")}>
  <button>Click</button>
</div>
```

Execution order:

```
Capture
Button Click
Bubble
```

---

# Interview Answer (30 Seconds)

> Event bubbling is the process where an event starts from the target element and propagates upward through its parent elements. For example, clicking a button inside a div first triggers the button's `onClick`, then the parent div's `onClick`. We can stop this propagation using `event.stopPropagation()`. In React, event bubbling also works across Portals because events follow the React component tree rather than the DOM tree.

---

# Quick Revision

- Event starts at the target element ✅
- Travels upward to parent elements ✅
- Default behavior in JavaScript and React ✅
- Stop using `event.stopPropagation()` ✅
- React Portals still support event bubbling ✅
- Event Capturing flows from parent to child ✅


# React.memo

## What is React.memo?

`React.memo` is a **Higher-Order Component (HOC)** that memoizes a component.

It prevents a **functional component** from re-rendering **if its props have not changed**.

> Think of it as a cache for the rendered output of a component.

---

# Why do we need React.memo?

Normally, when a parent component re-renders, **all child components also re-render**, even if their props haven't changed.

Example:

```jsx
function Parent() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <Child />
    </>
  );
}
```

```jsx
function Child() {
  console.log("Child Rendered");

  return <h2>Child Component</h2>;
}
```

Clicking the button prints:

```
Child Rendered
Child Rendered
Child Rendered
```

Even though `Child` has no props, it still re-renders because the parent re-rendered.

---

# Using React.memo

```jsx
const Child = React.memo(function Child() {
  console.log("Child Rendered");

  return <h2>Child Component</h2>;
});
```

Now:

```
Parent Re-render
       │
       ▼
React compares previous props
       │
       ▼
Props unchanged?
       │
    Yes ▼
Skip Child Re-render ✅
```

---

# Example

```jsx
const Child = React.memo(({ name }) => {
  console.log("Child Render");

  return <h2>{name}</h2>;
});

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <button onClick={() => setCount(count + 1)}>
        {count}
      </button>

      <Child name="Naveen" />
    </>
  );
}
```

Clicking the button:

```
Only Parent re-renders
```

Child does **not** re-render because `name` never changes.

---

# How React.memo Works

```text
Parent Re-renders
        │
        ▼
Compare Previous Props
        │
        ▼
Props Changed?
      /      \
    Yes       No
    │          │
Re-render   Skip Rendering
```

React performs a **shallow comparison** of props.

---

# What is Shallow Comparison?

React compares only the **top-level values** of props.

### Primitive Values

```jsx
<Child age={25} />
```

Old:

```
25
```

New:

```
25
```

No re-render.

---

### Objects

```jsx
<Child user={{ name: "Naveen" }} />
```

Every render creates a **new object**.

```jsx
{} !== {}
```

Even if the contents are the same, React sees a different object reference.

Result:

```
Child Re-renders ❌
```

---

# React.memo with useCallback

Without `useCallback`:

```jsx
<Child onClick={() => console.log("Hello")} />
```

A new function is created on every render.

React thinks the prop changed.

So `React.memo` **cannot** skip the render.

---

Using `useCallback`:

```jsx
const handleClick = useCallback(() => {
  console.log("Hello");
}, []);

<Child onClick={handleClick} />
```

Now the function reference remains the same.

`React.memo` works correctly.

---

# React.memo with useMemo

```jsx
const user = useMemo(() => {
  return {
    name: "Naveen",
  };
}, []);

<Child user={user} />
```

Without `useMemo`, a new object is created every render.

With `useMemo`, the object reference stays the same.

---

# When Should You Use React.memo?

✅ Large child components

✅ Expensive rendering

✅ Components receiving stable props

✅ Dashboard widgets

✅ Tables

✅ Charts

✅ Lists

---

# When NOT to Use React.memo

❌ Small components

❌ Components that always receive changing props

❌ Components where comparison cost is greater than rendering cost

Remember:

> `React.memo` itself performs a comparison, so it also has a small performance cost.

---

# React.memo vs useMemo vs useCallback

| Feature | React.memo | useMemo | useCallback |
|---------|------------|----------|-------------|
| Memoizes | Component | Value | Function |
| Prevents Re-render | ✅ | ❌ | ❌ |
| Used For | Child components | Expensive calculations | Event handlers |
| Returns | Component | Value | Function |

---

# Real-World Example

Imagine a dashboard with:

```text
Dashboard
│
├── Header
├── Sidebar
├── Chart
├── UserTable
└── Footer
```

If only the Header state changes, you don't want the **Chart** and **UserTable** to re-render because they are expensive.

Wrapping them with `React.memo` improves performance by skipping unnecessary renders.

---

# Interview Answer (30 Seconds)

> `React.memo` is a Higher-Order Component that memoizes a functional component. It prevents unnecessary re-renders by performing a shallow comparison of props. If the props have not changed, React reuses the previous rendered output instead of rendering the component again. It is commonly used for expensive child components and is often combined with `useCallback` and `useMemo` to keep function and object references stable.

---

# Quick Revision

- Memoizes a **component** ✅
- Prevents unnecessary re-renders ✅
- Uses **shallow comparison** of props ✅
- Works only for **functional components** ✅
- Often used with **useCallback** and **useMemo** ✅
- Best for expensive child components ✅

# Lazy Loading in React

## What is Lazy Loading?

**Lazy Loading** is a technique where React loads a component **only when it is needed**, instead of loading everything when the application starts.

Instead of downloading the entire application upfront, React downloads parts of it on demand.

---

# Why do we need Lazy Loading?

Imagine your application has:

```text
App
├── Home
├── Dashboard
├── Reports
├── Admin
├── Settings
└── Profile
```

Without Lazy Loading:

```text
User opens app
        │
        ▼
Browser downloads
Home + Dashboard + Reports + Admin + Settings + Profile
```

Even if the user only visits the **Home** page, every page's JavaScript is downloaded.

Problems:

- ❌ Large bundle size
- ❌ Slower initial page load
- ❌ Longer download time

---

With Lazy Loading:

```text
User opens app
        │
        ▼
Download only Home

Later...

User opens Dashboard
        │
        ▼
Download Dashboard
```

Result:

- ✅ Smaller initial bundle
- ✅ Faster first load
- ✅ Better performance

---

# How React Implements Lazy Loading

React provides:

- `React.lazy()`
- `Suspense`

They work together.

---

# Step 1: Import the Component Lazily

Instead of:

```jsx
import Dashboard from "./Dashboard";
```

Use:

```jsx
import { lazy } from "react";

const Dashboard = lazy(() => import("./Dashboard"));
```

The component is now loaded **only when React needs it**.

---

# Step 2: Wrap with Suspense

```jsx
import { Suspense, lazy } from "react";

const Dashboard = lazy(() => import("./Dashboard"));

function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Dashboard />
    </Suspense>
  );
}
```

---

# What is Suspense?

`Suspense` displays a fallback UI while the lazy component is being downloaded.

```text
User opens Dashboard
        │
        ▼
Downloading Dashboard.js
        │
        ▼
Loading...
        │
        ▼
Dashboard appears
```

---

# Real-World Example (React Router)

```jsx
import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./Home"));
const Dashboard = lazy(() => import("./Dashboard"));
const Profile = lazy(() => import("./Profile"));

function App() {
  return (
    <Suspense fallback={<h2>Loading...</h2>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Suspense>
  );
}
```

Now:

- Visiting `/` downloads only **Home**
- Visiting `/dashboard` downloads **Dashboard**
- Visiting `/profile` downloads **Profile**

---

# Behind the Scenes

Without Lazy Loading:

```text
Bundle.js

Home
Dashboard
Profile
Admin
Settings
Reports
```

One large JavaScript bundle.

---

With Lazy Loading:

```text
bundle.js

Home.js

Dashboard.chunk.js

Profile.chunk.js

Admin.chunk.js

Settings.chunk.js
```

Webpack/Vite splits the application into multiple **chunks**.

These chunks are downloaded only when required.

This process is called **Code Splitting**.

---

# Lazy Loading vs Code Splitting

Many people confuse these.

### Code Splitting

Splits the application into multiple JavaScript files (chunks).

### Lazy Loading

Loads those chunks only when needed.

```text
Code Splitting
       │
Creates multiple chunks
       │
       ▼
Lazy Loading
Downloads chunks on demand
```

---

# Advantages

- Faster initial page load
- Smaller bundle size
- Better user experience
- Reduced bandwidth usage
- Improved performance for large applications

---

# Limitations

- Slight delay the first time a lazy component loads
- Must use `Suspense`
- Not useful for very small applications

---

# Interview Questions ⭐

## Why do we use Suspense?

Because lazy-loaded components are loaded asynchronously. `Suspense` provides a fallback UI while the component is being downloaded.

---

## Can we lazy load every component?

Technically yes, but it's **not recommended**.

Best candidates:

- Pages
- Dashboards
- Reports
- Admin screens
- Heavy components

Avoid lazy loading:

- Buttons
- Small reusable components
- Navbar
- Header

---

## Does Lazy Loading improve SEO?

For traditional React SPA, lazy loading doesn't directly improve SEO.

For frameworks like **Next.js**, lazy loading can improve performance while server-side rendering handles SEO.

---

# Interview Answer (30 Seconds)

> Lazy Loading is a performance optimization technique where React loads components only when they are required instead of loading the entire application during the initial page load. React provides `React.lazy()` to dynamically import components and `Suspense` to display a fallback UI while the component is loading. Lazy loading works together with code splitting to reduce the initial bundle size and improve application performance.

---

# Quick Revision

- Loads components only when needed ✅
- Uses `React.lazy()` ✅
- Requires `Suspense` ✅
- Displays fallback UI while loading ✅
- Improves initial load performance ✅
- Works with Code Splitting ✅
- Best for pages and large components ✅

# Error Boundaries in React

## What is an Error Boundary?

An **Error Boundary** is a React component that catches **JavaScript errors** in its child component tree and displays a fallback UI instead of crashing the entire application.

Think of it as a **try-catch for React UI rendering**.

---

# Why do we need Error Boundaries?

Imagine this component:

```jsx
function UserProfile() {
  throw new Error("Something went wrong!");

  return <h1>User Profile</h1>;
}
```

Without an Error Boundary:

```text
App
 ├── Header
 ├── Sidebar
 ├── UserProfile ❌
 └── Footer
```

Result:

```
Entire React application crashes.
```

---

With an Error Boundary:

```text
App
 ├── Header
 ├── Sidebar
 ├── Error Boundary
 │      │
 │      ▼
 │   UserProfile ❌
 │
 │   Fallback UI
 └── Footer
```

Result:

```
Header
Sidebar
Something went wrong.
Footer
```

Only the failed section is replaced with a fallback UI.

---

# How to Create an Error Boundary

As of React 18, **Error Boundaries must be Class Components**.

```jsx
import React from "react";

class ErrorBoundary extends React.Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error);
    console.log(errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

# Using Error Boundary

```jsx
<ErrorBoundary>
  <UserProfile />
</ErrorBoundary>
```

If `UserProfile` crashes:

```
Something went wrong.
```

is displayed instead of crashing the whole application.

---

# Important Lifecycle Methods

## 1. getDerivedStateFromError()

```jsx
static getDerivedStateFromError(error) {
  return {
    hasError: true,
  };
}
```

Purpose:

- Updates state
- Shows fallback UI

---

## 2. componentDidCatch()

```jsx
componentDidCatch(error, errorInfo) {
    console.log(error);
}
```

Purpose:

- Log errors
- Send errors to monitoring tools (Sentry, LogRocket, etc.)

---

# What Error Boundaries Catch

✅ Errors during rendering

✅ Errors in lifecycle methods

✅ Errors in constructors of child components

---

# What Error Boundaries DO NOT Catch

❌ Event handlers

```jsx
<button
  onClick={() => {
    throw new Error("Clicked");
  }}
>
  Click
</button>
```

Use normal `try...catch` here.

---

❌ Asynchronous code

```jsx
setTimeout(() => {
  throw new Error("Timeout");
}, 1000);
```

---

❌ API calls

```jsx
fetch(...)
```

Handle using:

```jsx
try {
} catch {}
```

---

❌ Server-side rendering (SSR)

---

❌ Errors inside the Error Boundary itself

---

# Real-World Example

```text
Dashboard

├── Header
├── Sidebar
├── ErrorBoundary
│      │
│      ▼
│    Charts
├── ErrorBoundary
│      │
│      ▼
│    UserTable
└── Footer
```

If the **Charts** component crashes:

- Header still works ✅
- Sidebar still works ✅
- UserTable still works ✅
- Footer still works ✅

Only the Charts section shows the fallback UI.

---

# Error Boundary vs try...catch

| Error Boundary | try...catch |
|---------------|-------------|
| Catches rendering errors | Catches synchronous JavaScript errors |
| Works for React components | Works for any JavaScript code |
| Shows fallback UI | Handles exceptions manually |
| Class Component | Normal JavaScript |

---

# Interview Questions ⭐

## Why are Error Boundaries class components?

React currently supports Error Boundaries only through the lifecycle methods:

- `getDerivedStateFromError()`
- `componentDidCatch()`

These are available only in class components.

---

## Can Hooks create Error Boundaries?

❌ No.

There is no built-in Hook like:

```jsx
useErrorBoundary()
```

(Some third-party libraries provide similar functionality.)

---

## Where should we use Error Boundaries?

Good places:

- Dashboard widgets
- Charts
- Payment pages
- Profile pages
- Third-party components
- Complex UI sections

Avoid wrapping every small component individually.

---

# Interview Answer (30 Seconds)

> An Error Boundary is a React class component that catches JavaScript errors during rendering, lifecycle methods, and constructors of its child components. Instead of crashing the entire application, it displays a fallback UI. It is implemented using `getDerivedStateFromError()` and `componentDidCatch()`. Error Boundaries do not catch errors in event handlers, asynchronous code, or API calls.

---

# Quick Revision

- Catches rendering errors ✅
- Displays fallback UI ✅
- Prevents entire app from crashing ✅
- Must be a **Class Component** ✅
- Uses `getDerivedStateFromError()` ✅
- Uses `componentDidCatch()` ✅
- Does **not** catch event handler or async errors ✅