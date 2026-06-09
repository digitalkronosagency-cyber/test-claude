# executing-plans

Execute pre-written implementation plans through a structured, verified process.

> **Prefer `subagent-driven-development`** when available — it produces higher quality results.

## Process

1. **Load and critically review the plan** — raise concerns before starting, not mid-execution
2. **Execute tasks in sequence** — mark progress after each task
3. **Run verifications** after each task
4. **Complete with `finishing-a-development-branch`** sub-skill

## Safety Rules

- **Stop immediately on blockers** — never guess or force through
- **Never force through repeated verification failures** — escalate instead
- **Always work in isolated git worktrees** — never on main/master without explicit consent
- **Ask for clarification** on any unclear instructions before proceeding
- Follow plan steps exactly — if the plan needs to change, revisit the review stage

## When to Return to Review Stage

- Partner updates the plan
- Fundamental approach changes are needed
- A blocker reveals the plan's assumptions were wrong
