# writing-plans

Break down specifications into bite-sized, actionable implementation tasks with full context for a developer starting from scratch.

## Output Location

Plans saved to: `docs/superpowers/plans/YYYY-MM-DD-<feature-name>.md`

## Plan Structure

Each plan includes:
- Header with feature name, date, and context
- File structure overview
- Task-by-task steps with checkboxes

## Task Requirements

Each task must include:
- **File mappings** — exactly which files to create or modify
- **Test-first approach** — failing test → minimal implementation → passing test
- **Complete code examples** — no placeholders like "TBD" or "add validation here"
- **Exact commands** — with expected output
- **Commit points** — after each logical chunk of work

## Guiding Principles

- **DRY** — Don't Repeat Yourself
- **YAGNI** — You Aren't Gonna Need It
- **TDD** — every task starts with a failing test
- **Single responsibility** — clear file boundaries, one purpose per unit

## Audience Assumption

Write for a skilled developer with **minimal context** about the codebase or problem domain. Assume capability, not prior knowledge. Everything needed must be in the plan.

## After Writing

Invoke `executing-plans` or `subagent-driven-development` to execute the plan.
