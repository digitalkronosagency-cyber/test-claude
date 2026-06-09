# react-view-transitions

Smooth, native animations using React's View Transition API — no third-party animation libraries needed.

## Core Concept

Use `<ViewTransition>` components to animate UI state changes via the browser's native `document.startViewTransition`.

## Browser Support

Chromium 111+, Firefox 144+, Safari 18.2+ — graceful degradation elsewhere.

**Next.js note**: App Router bundles React canary internally — no need to install `react@canary` separately.

## Animation Priority Order

Use animations that communicate meaningful spatial relationships:

1. **Shared element transitions** — communicates "same thing, going deeper"
2. **Suspense reveals** — communicates "data loaded"
3. **List identity** — communicates "same items, new arrangement"
4. **State change enter/exit** — communicates appearance/disappearance
5. **Route changes** — communicates navigation to new location

> If you can't articulate what an animation communicates, skip it.

## Critical Rules

- `<ViewTransition>` must appear **before** any DOM nodes to activate enter/exit animations
- Only `startTransition`, `useDeferredValue`, or `Suspense` activate view transitions — regular `setState` does **not** animate
- Always use `default="none"` to prevent unwanted cross-fades on every transition, then explicitly enable only desired animations

## Pattern Example

```tsx
import { ViewTransition } from 'react';

// Wrap the element that should animate
<ViewTransition>
  <Card key={id} data={item} />
</ViewTransition>

// Trigger inside startTransition
startTransition(() => {
  setSelectedId(newId);
});
```

## What to Avoid

- Animating every state change — adds noise, not clarity
- Using view transitions as a substitute for loading states
- Relying on cross-fade default — always specify intent explicitly
