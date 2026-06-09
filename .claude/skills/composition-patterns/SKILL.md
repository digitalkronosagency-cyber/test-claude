# composition-patterns

React component composition patterns — eliminate boolean prop proliferation and build scalable, reusable component libraries.

**License:** MIT | **Version:** 1.0.0 | **Author:** Vercel

## When to Apply

- Refactoring components with many boolean props
- Building reusable component libraries
- Making codebases easier for humans and AI agents to work with at scale

## Rule Categories (Priority Order)

### 1. Component Architecture (Highest Impact)
- **Never use boolean props for customization** — booleans create combinatorial explosion and hide intent
- Use compound components to expose internal structure
- Prefer explicit variants (`variant="primary"`) over flags (`isPrimary`)

### 2. State Management
- Use provider-based state handling for shared state
- Define context interfaces explicitly — never expose raw `setState`
- Co-locate state with the components that own it

### 3. Implementation Patterns
- Prefer children-based composition over render props where possible
- Use explicit variants: `<Button variant="danger">` not `<Button danger>`
- Compound components: `<Select>`, `<Select.Option>`, `<Select.Trigger>`

### 4. React 19 APIs
- Leverage `use()`, `useOptimistic()`, and `useActionState()` where appropriate
- Use Server Components to eliminate client-side data fetching waterfalls

## Anti-Patterns to Avoid

```tsx
// BAD — boolean prop proliferation
<Button primary large rounded disabled loading />

// GOOD — explicit variant + compound structure
<Button variant="primary" size="large" shape="rounded" state="loading" />
```

```tsx
// BAD — render props for simple composition
<List renderItem={(item) => <Row data={item} />} />

// GOOD — children-based composition
<List>
  {items.map(item => <List.Row key={item.id} data={item} />)}
</List>
```
