# react-best-practices

Performance optimization guide for React and Next.js — 70 rules across 8 categories.

**License:** MIT | **Version:** 1.0.0 | **Author:** Vercel Engineering

## When to Apply

- Writing new React components or Next.js pages
- Implementing data fetching
- Reviewing code for performance issues
- Refactoring existing applications

## Categories (Priority Order)

### 1. Eliminating Waterfalls (CRITICAL)
Prevent sequential async operations that block each other.
- Fetch data in parallel with `Promise.all()` or via Server Components
- Never `await` inside loops for independent requests
- Use `<Suspense>` boundaries to parallelize rendering

### 2. Bundle Size Optimization (CRITICAL)
Reduce JavaScript payload.
- Use barrel-file-free imports: `import X from 'lib/x'` not `import { X } from 'lib'`
- Dynamic `import()` for routes and heavy components
- `next/dynamic` with `{ ssr: false }` for client-only components
- Tree-shake by avoiding namespace imports

### 3. Server-Side Performance (HIGH)
- Prefer React Server Components for data-fetching components
- Cache expensive computations with `React.cache()` or `unstable_cache`
- Stream responses with `<Suspense>` instead of blocking full renders

### 4. Client-Side Data Fetching (MEDIUM-HIGH)
- Deduplicate requests — use SWR or React Query
- Minimize client-side fetches; prefer RSC
- Use `stale-while-revalidate` patterns

### 5. Re-render Optimization (MEDIUM)
- Memoize with `useMemo` / `useCallback` only when profiling shows it helps
- Stabilize object/array props — don't create inline in JSX
- Use `React.memo` for expensive pure components

### 6. Rendering Performance (MEDIUM)
- Virtualize long lists (`react-virtual`, `@tanstack/virtual`)
- Avoid layout thrash — batch DOM reads/writes
- Use CSS `content-visibility: auto` for off-screen content

### 7. JavaScript Performance (LOW-MEDIUM)
- Prefer native browser APIs over heavy utility libraries
- Debounce/throttle high-frequency event handlers
- Use `Web Workers` for CPU-intensive tasks

### 8. Advanced Patterns (LOW)
- `useTransition` for non-urgent state updates
- `useDeferredValue` for deferred rendering of expensive lists
- Streaming SSR with `renderToReadableStream`
