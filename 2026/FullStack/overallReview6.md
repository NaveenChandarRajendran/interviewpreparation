# Interview Revision Notes

---

## 1. Rollback specific method in a transaction (a, b, c)

**Problem:** `c` fails, want to rollback only `a`, keep `b`.

**Key fact:** Plain rollback undoes everything *after* a point — it can't cherry-pick one method out of order.

### Case 1 — Savepoints (undo everything after a point)
```java
TransactionStatus mainTx = txManager.getTransaction(new DefaultTransactionDefinition());
try {
    a();
    Object savepoint = mainTx.createSavepoint(); // mark after a
    b();
    c(); // fails
    txManager.commit(mainTx);
} catch (Exception e) {
    mainTx.rollbackToSavepoint(savepoint); // undoes b (and c), KEEPS a
    txManager.commit(mainTx);
}
```
Savepoints are ordered — you can't skip over `b` and touch only `a`.

### Case 2 — Compensating transaction (undo `a` specifically, keep `b`)
Each method runs in its own transaction (`REQUIRES_NEW`), so nothing auto-rolls-back. On failure, manually write "undo" logic.
```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void doA() { ... }

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void compensateA() {
    // explicit inverse logic: delete row a inserted, revert a flag, etc.
}
```
```java
aService.doA();
bService.doB();
try {
    cService.doC();
} catch (Exception e) {
    aService.compensateA(); // manual undo, b left as-is
    throw e;
}
```

**Summary:** No single-transaction way to pick one arbitrary method to rollback. Use `REQUIRES_NEW` per step + manual compensating method. This is the same idea as the **Saga pattern** in microservices.

---

## 2. `toBe(true)` vs `toBeTruthy()`

| | `toBe(true)` | `toBeTruthy()` |
|---|---|---|
| Check | Strict `===` equality with literal `true` | JS truthiness (anything not `false, 0, "", null, undefined, NaN`) |
| `1` | ❌ fail | ✅ pass |
| `"yes"` | ❌ fail | ✅ pass |
| `{}` / `[]` | ❌ fail | ✅ pass (always truthy) |

```javascript
expect(true).toBe(true);     // pass
expect(1).toBe(true);        // fail
expect(1).toBeTruthy();      // pass
expect(0).toBeTruthy();      // fail
```

**Rule of thumb:** If the function's return type is an actual `boolean`, use `toBe(true)` — stricter, catches bugs where you accidentally return `1`/`"true"` instead of real `true`. Use `toBeTruthy()` only when you don't care about the exact type/value, just that something exists.

---

## 3. Virtual DOM vs Shadow DOM (unrelated concepts, similar names)

| | Virtual DOM | Shadow DOM |
|---|---|---|
| What | JS concept (React/Vue) — in-memory tree, diffed before touching real DOM | Real browser API — encapsulated DOM subtree with scoped styles |
| Purpose | Performance — minimize expensive real DOM writes | Style/markup isolation |
| Native browser feature? | No | Yes |

```jsx
// Virtual DOM — you write declarative code, React diffs old vs new tree
function Counter({ count }) {
  return <div>Count: {count}</div>;
}
```

```javascript
// Shadow DOM — real browser API, CSS doesn't leak in/out
class MyWidget extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `<style>p{color:red}</style><p>Hello</p>`;
  }
}
customElements.define('my-widget', MyWidget);
```

Native elements like `<video>`, `<input type="date">` already use Shadow DOM internally.

---

## 4. `CanActivate` — Angular Route Guards

Runs **before** a route activates. Return `true` (proceed), `false` (block), or a `UrlTree` (redirect).

```typescript
// Angular 15+ functional style (current recommended)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.isLoggedIn() ? true : router.parseUrl('/login');
};
```
```typescript
{ path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
```

### Guard family
| Guard | Purpose |
|---|---|
| `CanActivate` | Can this route be entered? |
| `CanActivateChild` | Can child routes be entered? |
| `CanDeactivate` | Can you leave this route? (e.g. unsaved changes prompt) |
| `CanMatch` | Should this route/module even match/lazy-load? |
| `Resolve` | Pre-fetch data before activation (not a guard, but related) |

Guards can also return `Observable<boolean>` / `Promise<boolean>` for async checks (e.g. API call to verify token).

---

## 5. Micro Frontends

**Core idea:** Split one large frontend into independently built, deployed, and owned sub-apps composed together at **runtime**.

**⚠️ Common mistake (real interview story):** Installing a shared component library via `npm install @org/reference-data` is **NOT** micro frontend — that's build-time bundling. Every consuming project gets its own copy baked into its build; updates need a rebuild/redeploy of every consumer.

### The real test
> "If Team X deploys their part right now, does the Shell app show it immediately WITHOUT being rebuilt/redeployed?"
- npm package approach → **No** → just a shared component library
- True micro frontend → **Yes** → runtime composition

### Webpack Module Federation example (the real thing)
```js
// Remote app (Cart team) — exposes a component
// webpack.config.js
new ModuleFederationPlugin({
  name: 'cartApp',
  filename: 'remoteEntry.js',
  exposes: { './Cart': './src/Cart.jsx' },
  shared: ['react', 'react-dom'],
});
```
```js
// Shell app — consumes it at runtime
new ModuleFederationPlugin({
  name: 'shell',
  remotes: { cartApp: 'cartApp@https://cart.example.com/remoteEntry.js' },
  shared: ['react', 'react-dom'],
});
```
```jsx
const Cart = React.lazy(() => import('cartApp/Cart'));
// Shell fetches Cart's JS live from cart.example.com at runtime
```

### Other approaches
- **iframes** — simple, isolated, but bad for shared state/SEO
- **Web Components** — framework-agnostic custom elements (`<cart-widget>`)
- **Single-SPA** — meta-framework to mount/unmount different frontend apps by route

### Challenges
- Shared state across MFEs (event bus, custom events)
- Style collisions (Shadow DOM, CSS Modules, BEM naming)
- Duplicate dependencies (solved via `shared: []` singleton config)

---

## 6. What is Webpack?

A **module bundler**. Follows `import`/`export` from an entry file, builds a dependency graph, outputs optimized bundles for the browser.

```js
// webpack.config.js — minimal
module.exports = {
  entry: './src/index.js',
  output: { filename: 'bundle.js', path: path.resolve(__dirname, 'dist') },
  mode: 'production',
};
```

| Feature | What it does |
|---|---|
| Loaders | Let webpack process non-JS files (`css-loader`, `babel-loader` for JSX) |
| Plugins | Broader build tasks (`HtmlWebpackPlugin` auto-injects script tags) |
| Code splitting | Load JS chunks on demand |
| Tree shaking | Removes unused exports from final bundle |
| Module Federation | Lets separate webpack builds share code at runtime (→ micro frontends) |

**Alternatives:** Vite (faster dev server, native ESM + esbuild), esbuild (very fast, Go-based), Rollup (great for bundling libraries).

CRA / Angular CLI / Vue CLI all run webpack (or esbuild) under the hood already.

---

## 7. Angular 16 — Key Features

- **Signals (experimental)** — new reactivity primitive inspired by Solid.js
  ```typescript
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  increment() { this.count.update(v => v + 1); }
  ```
- **Non-destructive hydration** — SSR reuses existing DOM instead of destroying/rebuilding it (fixes flicker)
- **esbuild-based builder + Vite dev server** — much faster builds
- **Required inputs**: `@Input({ required: true }) userId!: string;`
- **Router → component input binding** — route params auto-bind to `@Input()`, no more manual `ActivatedRoute` subscription
  ```typescript
  provideRouter(routes, withComponentInputBinding())
  // then: @Input() id!: string;  // auto-bound from :id
  ```
- `ng new --standalone` flag, TypeScript 5.0 support, CSP support for inline styles

---

## 8. Angular 17 → 21 — Major Updates Timeline

| Version | Key additions |
|---|---|
| **17** (Nov 2023) | New built-in control flow `@if/@for/@switch` (replaces `*ngIf/*ngFor/*ngSwitch`), mandatory `track` in `@for`; **Deferrable views `@defer`** for lazy-loading template chunks; esbuild/Vite default; signal inputs previewed |
| **18** (May 2024) | Zoneless change detection introduced (experimental); function-based route redirects; `@defer` + control flow → stable |
| **19** (Nov 2024) | Signal-based APIs (inputs, `linkedSignal`) matured further |
| **20** (May 2025) | **Signals reached full stability**; zoneless reached stable API milestone |
| **21** (Nov 2025) | **Zoneless is now default for new projects** (no Zone.js at all); experimental **Signal Forms**; `*ngIf/*ngFor/*ngSwitch` formally **deprecated**; `SimpleChanges` became generic (real typing in `ngOnChanges` instead of `any`) |

### New control flow example (v17+)
```html
@if (isAuth) {
  <div>Welcome back</div>
} @else {
  <div>Please log in</div>
}

@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
} @empty {
  <li>No items found</li>
}
```

### Deferrable view example
```html
@defer (on viewport) {
  <heavy-comment-section />
} @placeholder {
  <div>Scroll to load comments</div>
}
```

**One-line memory hook:** 16 → Signals (experimental) → 17 → new control flow + `@defer` → 18 → zoneless (experimental) → 20 → Signals stable → 21 → zoneless is default + old directives deprecated.

---

## 9. Zone.js vs Signals (Zoneless)

### What Zone.js does
Monkey-patches async browser APIs (`setTimeout`, `Promise`, DOM events) so Angular knows "something async happened → recheck the UI."

```
Click event → Zone.js intercepts → handler runs, mutates data
→ Zone.js signals "task finished" → Angular checks the ENTIRE component tree
→ DOM updated wherever needed
```

### Problems with Zone.js
- Blunt — walks/diffs the **whole tree** on every async event, even unrelated components
- Adds bundle size (patches many browser APIs)
- Harder debugging (patched stack traces)
- Interop friction with libraries not written for it

### The replacement: Signals
Signals make dependencies **explicit** — Angular knows exactly which template bindings depend on a signal, so only those update.

```typescript
count = signal(0);
doubled = computed(() => this.count() * 2);
increment() { this.count.update(v => v + 1); } // Angular knows EXACTLY what changed
```

```
Signal changes → Angular knows exactly which bindings depend on it
→ ONLY those specific DOM nodes update (no tree-wide recheck)
```

**Status:** Angular 21 makes zoneless the default for **new** projects. Existing projects keep Zone.js until you actively opt out — nothing breaks automatically. CLI ships a migration tool for moving to zoneless incrementally.

```typescript
// To go zoneless explicitly
bootstrapApplication(AppComponent, {
  providers: [provideExperimentalZonelessChangeDetection()]
});
```

---

## 10. Migrating Angular 19 → 21

### Golden rule
**Angular enforces ONE major version per `ng update` run — you cannot skip versions.**

```bash
# On Angular 19
ng update @angular/cli @angular/core
# → lands on Angular 20 (NOT 21, even though 21 is latest)

# Run it again while on 20
ng update @angular/cli @angular/core
# → NOW lands on Angular 21
```

So: **19 → 20 → 21** = two separate `ng update` runs, test after each.

### Pre-flight checklist
1. Commit all changes first — never run `ng update` on a dirty tree
2. Create a backup branch
3. Check TypeScript version requirement (v20/v21 both need TS 5.8+)
4. Run full test suite on v19 first as a baseline

### After each hop
- Run test suite immediately — breaking changes surface fastest here
- Fix anything the schematic couldn't auto-migrate
- Commit as a checkpoint before the next hop

### Things to watch for landing on v21
- **Karma → Vitest**: `ng generate @angular/core:karma-to-vitest`
- **HttpClient** now provided at root by default — check custom `HttpClientModule` setups
- **Third-party libs** (e.g. PrimeNG) need matching version bumps — old versions won't work with new Angular
- Zone.js is **not removed automatically** — safe to upgrade without going zoneless immediately

### What `ng update` actually fixes (important distinction!)
✅ **Does fix automatically (via migration schematics):**
- Renamed APIs
- Required flags added to existing code (e.g. `standalone: false` on old NgModule components)
- Config file updates (`angular.json`, `tsconfig.json`)

❌ **Does NOT fix:**
- Your own application logic bugs
- Behavioral changes needing manual judgment (e.g. code relying on Zone.js side effects under zoneless)
- Third-party library incompatibilities (you must upgrade those libs yourself)
- Anything without a written schematic — you get a warning, not a fix

**Why test after every hop:** A "clean" migration (zero schematic errors) only means known patterns were rewritten — it does NOT guarantee your app still behaves correctly.

---
