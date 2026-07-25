# React Notes

---

# React Ecosystem (Big Picture)

Think of React as **3 things working together**:

- **Components** → UI building blocks
- **Virtual DOM** → Smart UI update system
- **Reconciliation** → Decides what needs to be updated

---

# React Rendering Flow ⭐ (Very Important)

Whenever **state** or **props** change:

```text
State / Props change
        │
        ▼
Component re-renders
        │
        ▼
New Virtual DOM is created
        │
        ▼
React compares Old Virtual DOM vs New Virtual DOM (Diffing)
        │
        ▼
Only the required changes are applied to the Real DOM
```

---

# Virtual DOM

The **Virtual DOM** is:

- A lightweight JavaScript object
- A copy (representation) of the Real DOM
- Created and managed by React

### Why?

Updating the Real DOM is expensive.

React first updates the Virtual DOM, compares it with the previous version, and updates only the changed parts in the Real DOM.

---

# Reconciliation & Diffing ⭐ (Interview Gold)

## Reconciliation

Reconciliation is the process of comparing the **old Virtual DOM** with the **new Virtual DOM** to determine what has changed.

## Diffing Rules

### Rule 1: Same Element Type

Only the changed props or content are updated.

```jsx
<h1>Hello</h1>
```

↓

```jsx
<h1>Hello Naveen</h1>
```

Only the text changes.

---

### Rule 2: Different Element Type

Destroy the old node and create a new one.

```jsx
<div>Hello</div>
```

↓

```jsx
<p>Hello</p>
```

React removes the `<div>` and creates a new `<p>`.

---

### Rule 3: Keys

Keys help React identify which list items have changed.

Without keys:

- React may re-render the entire list.

With keys:

- React updates only the changed item.

---

# JSX

JSX allows us to write HTML-like syntax inside JavaScript.

Example:

```jsx
const element = <p>Hello Naveen</p>;
```

## How JSX Works

The browser **does not understand JSX** directly.

During build time:

```text
JSX
   │
   ▼
Babel
   │
   ▼
React.createElement(...)
   │
   ▼
JavaScript
   │
   ▼
Browser
```

### Summary

- Browser understands JavaScript.
- React internally works with `React.createElement()`.
- JSX is just syntactic sugar.

### Is JSX Mandatory?

**Answer:** No.

JSX is optional.

React can be written using `React.createElement()` directly.

---

# Controlled vs Uncontrolled Components

## Controlled Component

The form value is controlled by React State.

```jsx
function Login() {
  const [email, setEmail] = React.useState("");

  return (
    <input
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="Email"
    />
  );
}
```

### Flow

```text
User types
      │
      ▼
onChange
      │
      ▼
setState
      │
      ▼
Re-render
      │
      ▼
Updated value shown
```

### Characteristics

- Form data stored in React state
- React has full control
- Single source of truth

---

## Uncontrolled Component

The DOM controls the form value.

```jsx
const inputRef = useRef();

<input ref={inputRef} />
```

Characteristics:

- Value stored in the DOM
- Access using `ref`
- React is not involved in every change

---

# useRef

## Purpose

`useRef` is used to:

- Access DOM elements directly
- Store mutable values without causing re-renders

Example:

```jsx
const countRef = useRef(0);

const handleClick = () => {
  countRef.current += 1;
  console.log(countRef.current);
};

return <button onClick={handleClick}>Click</button>;
```

### Important Points

- Value persists between renders
- Updating `.current` does **not** trigger a re-render

### Rule

- If the UI should change → **useState**
- If only logic/value should persist → **useRef**

---

# useMemo

## Purpose

`useMemo` memoizes the **result/value** of an expensive computation.

It recalculates only when dependencies change.

```jsx
const expensiveValue = useMemo(() => slowFunction(count), [count]);
```

Example:

```jsx
const filteredUsers = useMemo(() => {
  return users.filter((user) => user.active);
}, [users]);
```

### Use Cases

- Expensive calculations
- Filtering large arrays
- Sorting data
- Performance optimization

---

# useCallback

## Purpose

`useCallback` memoizes a **function**.

It returns the same function instance unless dependencies change.

```jsx
const handleClick = useCallback(() => {
  console.log("Clicked");
}, []);
```

## Real-World Use Cases

### 1. Passing handlers to child components

```jsx
<SaveButton onSave={handleSave} />
```

---

### 2. Function dependency in useEffect

```jsx
useEffect(() => {
  fetchData();
}, [fetchData]);
```

---

### 3. Prevent unnecessary re-creations

```jsx
const fetchData = useCallback(() => {
  // API call
}, []);
```

---

# useContext

Context API allows data sharing across components without prop drilling.

## Three Parts

1. `createContext`
2. `Provider`
3. `useContext`

---

## createContext

```jsx
import { createContext } from "react";

export const UserContext = createContext(null);
```

---

## Provider

```jsx
import { UserContext } from "./UserContext";

function App() {
  const user = {
    name: "Naveen",
    role: "Admin",
  };

  return (
    <UserContext.Provider value={user}>
      <Dashboard />
    </UserContext.Provider>
  );
}
```

---

## useContext

```jsx
import { useContext } from "react";
import { UserContext } from "./UserContext";

function Dashboard() {
  const user = useContext(UserContext);

  return <h2>Welcome {user.name}</h2>;
}
```

## Important

When the **context value changes**, **all consuming components re-render**.

### Best Use Cases

- Authentication
- Theme
- Language
- Locale

> Context is **not** a replacement for Redux or other state management libraries.

---

# React Batching

Batching groups multiple state updates into a **single re-render**.

---

## React 17

Batching works **only inside React event handlers**.

Example:

```jsx
const handleClick = () => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
};
```

Result:

- ✅ One re-render

---

Outside React events:

```jsx
setTimeout(() => {
  setCount((c) => c + 1);
  setFlag((f) => !f);
}, 1000);
```

Result in React 17:

- ❌ Two re-renders

---

# React 18 - Automatic Batching 🚀

React 18 batches updates everywhere.

Supported in:

- React events
- `setTimeout`
- Promises
- `async/await`
- Native event handlers

Result:

- ✅ Single re-render

---

# Concurrent Rendering (React 18)

Concurrent Rendering allows React to prepare multiple UI updates without blocking user interactions.

### Features

- Rendering can pause
- High-priority updates execute first
- Low-priority work waits
- Rendering resumes later

```text
Start Rendering
       │
       ▼
Pause Rendering
       │
       ▼
Handle User Input
       │
       ▼
Resume Rendering
```

## Important

Concurrent Rendering **does NOT mean**:

- Parallel processing
- Multi-threading

React still runs on a **single JavaScript thread**.

It simply schedules work more intelligently.

---

## What React Can Interrupt

- Rendering
- Reconciliation

## What React Cannot Interrupt

- Browser DOM updates
- JavaScript that is already executing

---

# createRoot vs ReactDOM.render

## ReactDOM.render (Legacy)

Characteristics:

- Legacy rendering
- Synchronous rendering
- No concurrent features

```jsx
ReactDOM.render(<App />, document.getElementById("root"));
```

---

## createRoot (React 18)

Characteristics:

- Enables Concurrent Rendering
- Automatic batching
- Better scheduling
- Future-proof API

```jsx
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));

root.render(<App />);
```

---

# Interview Quick Revision ⭐

## Virtual DOM

- Lightweight JavaScript object
- Copy of Real DOM
- Enables efficient updates

---

## Reconciliation

Compares old and new Virtual DOM to determine UI changes.

---

## Diffing Rules

- Same element → Update props/content
- Different element → Replace node
- Keys → Update only changed list items

---

## JSX

- HTML inside JavaScript
- Compiled by Babel
- Converted to `React.createElement()`

---

## Controlled Component

- React controls form state
- Uses `useState`
- Single source of truth

---

## Uncontrolled Component

- DOM controls value
- Uses `ref`

---

## useRef

- Access DOM
- Store mutable values
- No re-render

---

## useMemo

Memoizes **values**.

---

## useCallback

Memoizes **functions**.

---

## useContext

Shares data globally without prop drilling.

---

## React Batching

Multiple state updates → Single re-render.

---

## Concurrent Rendering

React schedules rendering intelligently without blocking the UI.

---

## createRoot

React 18 rendering API supporting concurrent features and automatic batching.