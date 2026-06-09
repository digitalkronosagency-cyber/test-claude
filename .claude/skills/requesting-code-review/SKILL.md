# requesting-code-review

Request code reviews at the right moments and act on feedback effectively. "Review early, review often."

## When to Request (Mandatory)

- After each task in subagent-driven development
- Upon completing major features
- Before merging to main

## When to Request (Optional but Beneficial)

- When facing obstacles or uncertainty
- Before significant refactoring

## 3-Step Process

1. **Get commit hashes** — base commit and current HEAD
2. **Dispatch code reviewer subagent** — with specific context:
   - Description of what was implemented
   - Requirements being met
   - Base and current commit hashes
3. **Address feedback** by priority:
   - **Critical** → fix immediately before proceeding
   - **Important** → fix before advancing to next task
   - **Minor** → document for future attention

## Response Guidelines

- Never dismiss feedback casually
- Never proceed with unresolved critical issues
- Reasoned pushback is acceptable when reviewer assessment is technically incorrect
- Always verify suggestions against your actual codebase before implementing
