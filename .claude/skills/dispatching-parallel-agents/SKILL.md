# dispatching-parallel-agents

Handle multiple independent problems by delegating them to specialized agents working concurrently rather than sequentially.

## When to Use

- Multiple failures with different root causes
- Problems in separate subsystems with no dependencies between them
- Each problem can be understood without context from others

**Do NOT use** when failures are interconnected, investigations require full system understanding, or agents might interfere with shared state.

## Process

1. **Group by domain** — categorize failures/tasks by affected components
2. **Create focused prompts** — each agent receives specific scope and constraints
3. **Dispatch concurrently** — all agents work simultaneously
4. **Review results** — verify no conflicts between fixes, then integrate

## Prompt Construction Rules

- Agents never inherit your session's context or history
- Construct exactly what each agent needs — no more, no less
- Every prompt must be: focused, self-contained, and specify expected output clearly
- Never say "fix it" — give concrete, specific objectives

## Success Metric

6 independent test failures solved in parallel instead of sequentially = significant time savings. Scope each agent tightly to prevent scope creep.
