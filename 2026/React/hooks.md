---

# 1. useCallback

## Why?

In React, every time a component re-renders, all functions inside that component are recreated.

Most of the time this is fine.

However, if a function is passed as a prop to a child component wrapped with `React.memo`, React treats it as a new prop because the function reference changes.

As a result, the child component re-renders even though nothing has actually changed.

`useCallback` prevents this by returning the same function reference until one of its dependencies changes.

This helps avoid unnecessary re-renders and improves performance.

---

## Flow

```text
Parent Component Re-renders

↓

Without useCallback

↓

New Function Created

↓

Child receives new function reference

↓

React.memo detects prop change

↓

Child Re-renders


-------------------------------------


Parent Component Re-renders

↓

useCallback checks dependencies

↓

Dependencies unchanged

↓

Returns same function reference

↓

React.memo sees same prop

↓

Child does NOT re-render
```

---

## React Example

Without `useCallback`

```jsx
import React, { useState } from "react";

const Child = React.memo(({ onClick }) => {
    console.log("Child Rendered");
    return <button onClick={onClick}>Click</button>;
});

function Parent() {

    const [count, setCount] = useState(0);

    const handleClick = () => {
        console.log("Button Clicked");
    };

    return (
        <>
            <button onClick={() => setCount(count + 1)}>
                Count : {count}
            </button>

            <Child onClick={handleClick} />
        </>
    );
}
```

Every time the count changes,

- Parent re-renders.
- `handleClick` is recreated.
- Child receives a new function reference.
- Child re-renders even though nothing changed.

---

Using `useCallback`

```jsx
import React, { useState, useCallback } from "react";

const Child = React.memo(({ onClick }) => {
    console.log("Child Rendered");
    return <button onClick={onClick}>Click</button>;
});

function Parent() {

    const [count, setCount] = useState(0);

    const handleClick = useCallback(() => {
        console.log("Button Clicked");
    }, []);

    return (
        <>
            <button onClick={() => setCount(count + 1)}>
                Count : {count}
            </button>

            <Child onClick={handleClick} />
        </>
    );
}
```

Now,

- Parent re-renders.
- `useCallback` returns the same function.
- Child receives the same function reference.
- Child does not re-render.

---

## Dependency Example

```jsx
const handleSearch = useCallback(() => {
    console.log(searchText);
}, [searchText]);
```

If `searchText` changes,

- React creates a new function.
- Otherwise, the same function reference is reused.

---

## Real Project Example

Imagine an **E-Commerce application**.

You have:

- Search Bar
- Product List
- Product Card

```text
Home Page

├── Search Bar
├── Product List (React.memo)
│     ├── Product Card
│     ├── Product Card
│     ├── Product Card
```

Each Product Card receives a Delete function.

```jsx
<ProductCard
    product={product}
    onDelete={handleDelete}
/>
```

If the user types in the Search Bar,

- Search state changes.
- Parent component re-renders.

Without `useCallback`

- `handleDelete` is recreated.
- Every Product Card receives a new function reference.
- Hundreds of Product Cards re-render unnecessarily.

With `useCallback`

```jsx
const handleDelete = useCallback((id) => {
    deleteProduct(id);
}, []);
```

Now,

- Parent re-renders.
- Same function reference is passed.
- Product Cards do not re-render.
- Only the Search Bar updates.

This improves performance, especially in applications with large lists or complex UI components.

---

## When to Use

Use `useCallback` when:

- Passing functions to child components wrapped with `React.memo`.
- Rendering large lists.
- Child component rendering is expensive.
- A stable function reference is needed inside `useEffect`.

---

## When NOT to Use

Avoid using `useCallback` for every function.

Reasons:

- React stores the memoized function internally.
- Dependencies must be compared on every render.
- Adds unnecessary complexity if no performance issue exists.

Use it only when it prevents unnecessary re-renders or solves a specific performance problem.

---

## Important Points

- `useCallback` memoizes a function.
- It returns the same function reference until dependencies change.
- It does **not** make the function execute faster.
- It mainly prevents unnecessary child component re-renders.
- Often used together with `React.memo`.
- Useful for performance optimization in large React applications.
- Do not use it everywhere; use it only when needed.

---
---

# 2. useReducer

## Why?

React provides `useState` to manage component state.

It works well for simple state updates.

However, when a component has multiple related state values or complex update logic, using multiple `useState` hooks can make the code difficult to read and maintain.

`useReducer` centralizes all state update logic into a single reducer function, making the code more organized and predictable.

---

## Flow

```text
User Action

↓

dispatch(action)

↓

Reducer Function

↓

Determines Action Type

↓

Creates New State

↓

React Updates Component

↓

UI Re-renders
```

---

## Key Terms

### State

The current data of the component.

```jsx
const initialState = {
    count: 0
};
```

---

### Action

An object describing what should happen.

```jsx
{
    type: "INCREMENT"
}
```

or

```jsx
{
    type: "SET_NAME",
    payload: "Naveen"
}
```

---

### Reducer

A function that receives the current state and an action, then returns the new state.

```jsx
function reducer(state, action) {

    switch (action.type) {

        case "INCREMENT":
            return {
                count: state.count + 1
            };

        case "DECREMENT":
            return {
                count: state.count - 1
            };

        default:
            return state;
    }
}
```

---

### Dispatch

`dispatch()` sends an action to the reducer.

```jsx
dispatch({
    type: "INCREMENT"
});
```

---

## React Example

```jsx
import { useReducer } from "react";

const initialState = {
    count: 0
};

function reducer(state, action) {

    switch (action.type) {

        case "INCREMENT":
            return {
                count: state.count + 1
            };

        case "DECREMENT":
            return {
                count: state.count - 1
            };

        default:
            return state;
    }
}

function Counter() {

    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <>
            <h2>{state.count}</h2>

            <button
                onClick={() =>
                    dispatch({ type: "INCREMENT" })
                }
            >
                +
            </button>

            <button
                onClick={() =>
                    dispatch({ type: "DECREMENT" })
                }
            >
                -
            </button>
        </>
    );
}
```

When the user clicks the "+" button,

- `dispatch()` sends the action.
- The reducer receives the action.
- The reducer creates a new state.
- React updates the UI.

---

## useState vs useReducer

### Using useState

```jsx
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [address, setAddress] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

As the component grows, many `useState` hooks can make the code harder to manage.

---

### Using useReducer

```jsx
const initialState = {
    name: "",
    email: "",
    phone: "",
    address: "",
    loading: false,
    error: null
};

const [state, dispatch] = useReducer(reducer, initialState);
```

Now all state updates happen inside one reducer, making the component easier to maintain.

---

## Real Project Example

Imagine you're building a **User Registration Form**.

The form contains:

- Name
- Email
- Password
- Loading
- Error Message
- Success Message

When the user clicks **Register**:

```text
User Clicks Register

↓

dispatch({ type: "REGISTER_REQUEST" })

↓

loading = true

↓

API Call

↓

Success

↓

dispatch({
    type: "REGISTER_SUCCESS"
})

↓

Store User Details

↓

loading = false

↓

Show Success Message
```

If the API fails:

```text
dispatch({
    type: "REGISTER_FAILURE",
    payload: "Email already exists"
})
```

The reducer updates:

- loading
- error
- success
- user information

All related updates are handled in one place, making the logic easier to understand and maintain.

---

## Advantages

- Keeps complex state logic in one place.
- Makes state updates predictable.
- Easier to maintain large components.
- Reduces multiple `useState` hooks.
- Better for forms, dashboards, and complex UI.

---

## When to Use

Use `useReducer` when:

- Managing multiple related state values.
- State updates depend on previous state.
- Business logic is becoming complex.
- Building forms with many fields.
- Managing loading, success, and error states together.

---

## When NOT to Use

Avoid `useReducer` when:

- Managing simple values like a counter.
- Updating one or two independent state variables.
- `useState` is already sufficient.

---

## Important Points

- `useReducer` is an alternative to `useState`.
- It manages complex state logic.
- State updates happen through `dispatch()`.
- The reducer decides how the state should change.
- Every update returns a new state object.
- It makes large components easier to maintain.
- Commonly used for forms, dashboards, and complex user interactions.

---

## Interview One-Liner

`useReducer` is a React Hook used to manage complex state. Instead of updating state directly, actions are dispatched to a reducer function, which returns the new state. It is useful when state logic becomes complex or multiple related state values need to be managed together.

---

---

# 1. useLayoutEffect

## Why?

`useLayoutEffect` is similar to `useEffect`, but it runs **before the browser paints the screen**.

It is mainly used when you need to measure or update the DOM before the user sees it.

---

## Flow

```text
Component Renders

↓

DOM Updated

↓

useLayoutEffect Executes

↓

Browser Paints Screen
```

---

## Example

```jsx
import { useLayoutEffect, useRef } from "react";

function App() {

    const divRef = useRef();

    useLayoutEffect(() => {
        console.log(divRef.current.offsetWidth);
    }, []);

    return <div ref={divRef}>Hello</div>;
}
```

---

## Real Project Example

In a Dashboard, calculate the card width before rendering charts to prevent layout flickering.

---

## Important Points

- Similar to `useEffect`.
- Runs before browser paint.
- Used for DOM measurements.
- Avoid using it for API calls.

---

## Interview One-Liner

`useLayoutEffect` runs synchronously after the DOM updates but before the browser paints, making it useful for layout calculations and DOM measurements.

---

# 2. useId

## Why?

Generates a unique and stable ID for components.

Mostly used for accessibility.

---

## Flow

```text
Component Renders

↓

React Generates Unique ID

↓

Assign ID to Elements
```

---

## Example

```jsx
import { useId } from "react";

function App() {

    const id = useId();

    return (
        <>
            <label htmlFor={id}>Email</label>
            <input id={id} />
        </>
    );
}
```

---

## Real Project Example

Reusable Input component generates unique IDs for labels and inputs across the application.

---

## Important Points

- Generates unique IDs.
- Prevents duplicate IDs.
- Mainly used for accessibility.
- Not meant for generating list keys.

---

## Interview One-Liner

`useId` generates stable unique IDs for reusable components, mainly to improve accessibility.

---

# 3. useImperativeHandle

## Why?

Allows a child component to expose only selected methods to its parent using refs.

---

## Flow

```text
Parent

↓

Ref

↓

Child

↓

Expose Required Methods
```

---

## Example

```jsx
useImperativeHandle(ref, () => ({
    focusInput() {
        inputRef.current.focus();
    }
}));
```

---

## Real Project Example

Reusable Input component exposes only a `focusInput()` method so the parent can focus the field after validation fails.

---

## Important Points

- Used with `forwardRef`.
- Exposes selected methods.
- Improves component encapsulation.
- Parent cannot access everything inside the child.

---

## Interview One-Liner

`useImperativeHandle` customizes the value exposed through a ref, allowing the parent to access only specific methods.

---

# 4. useTransition

## Why?

Allows non-urgent updates to run in the background without blocking urgent UI updates.

---

## Flow

```text
User Action

↓

Urgent Update

↓

Low Priority Update

↓

UI Remains Responsive
```

---

## Example

```jsx
const [isPending, startTransition] = useTransition();

startTransition(() => {
    setProducts(filteredProducts);
});
```

---

## Real Project Example

In an E-Commerce application, searching thousands of products updates the search input immediately while filtering the product list happens in the background.

---

## Important Points

- Marks updates as low priority.
- Prevents UI lag.
- Useful for expensive rendering.
- Improves user experience.

---

## Interview One-Liner

`useTransition` lets React prioritize urgent updates while delaying expensive rendering work.

---

# 5. useDeferredValue

## Why?

Delays expensive UI updates while allowing the latest user input to update immediately.

---

## Flow

```text
User Types

↓

Input Updates Immediately

↓

Deferred Value Updates Later

↓

Expensive Component Re-renders
```

---

## Example

```jsx
const deferredSearch = useDeferredValue(searchText);
```

---

## Real Project Example

In a Product Search page, the search box updates instantly while the large product list updates using the deferred search value.

---

## Important Points

- Returns a delayed version of a value.
- Useful for search and filtering.
- Reduces UI lag.
- No manual debounce required.

---

## Interview One-Liner

`useDeferredValue` returns a deferred version of a rapidly changing value, helping expensive UI updates happen later.

---

# 6. useSyncExternalStore

## Why?

Allows React components to subscribe to external data sources safely.

---

## Flow

```text
External Store Changes

↓

React Detects Change

↓

Component Receives Latest State

↓

UI Updates
```

---

## Example

```jsx
const data = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot
);
```

---

## Real Project Example

Redux internally uses this hook so components automatically update whenever the Redux Store changes.

---

## Important Points

- Used for external stores.
- Supports concurrent rendering.
- Commonly used by Redux and state libraries.
- Rarely used directly in applications.

---

## Interview One-Liner

`useSyncExternalStore` safely subscribes React components to external stores such as Redux.

---