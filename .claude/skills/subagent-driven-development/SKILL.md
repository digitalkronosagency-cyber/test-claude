# subagent-driven-development

Execute implementation plans by dispatching specialized subagents per task, with built-in quality gates.

**Core formula**: Fresh subagent per task + two-stage review (spec then quality) = high quality, fast iteration.

## When to Use

- You have an implementation plan with mostly independent tasks
- You want to stay within the current session (vs. spawning parallel sessions)

## Process

1. Extract all tasks from the plan upfront
2. For each task:
   - Dispatch implementer subagent
   - Run spec compliance review
   - Run code quality review
   - If issues found: implementer fixes → reviewer re-checks
3. Continue until all tasks complete
4. Run final comprehensive review across entire implementation

## Model Selection

Use the least capable model sufficient for each role:
- **Cheap models** — isolated, mechanical tasks
- **Standard models** — multi-file integration work
- **Most capable models** — architectural decisions and broad reviews

## Non-Negotiable Rules

- Never skip reviews
- Never proceed with unresolved issues
- Spec compliance check must complete **before** code quality review begins
- Each subagent gets only the context it needs — no session history inheritance
