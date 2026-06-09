# writing-skills

Create and maintain skills using TDD applied to process documentation.

## Core Principle

"Writing skills IS Test-Driven Development applied to process documentation."

Follow RED-GREEN-REFACTOR:
- **RED**: establish baseline behavior without the skill; document rationalizations verbatim
- **GREEN**: write minimal documentation addressing specific failures
- **REFACTOR**: close loopholes through iterative testing

## The Iron Law

No skill deploys without a failing test first. No exceptions — not for "simple additions" or documentation updates.

## When to Create a Skill

Create a skill when:
- The technique wasn't intuitively obvious to you
- The pattern applies broadly across projects
- Others would benefit from the reference

Do NOT create for:
- One-off solutions
- Project-specific conventions

## Skill Structure

File: `SKILL.md` in a flat namespace directory (letters, numbers, hyphens only).

Required frontmatter:
```yaml
name: skill-name
description: Use when... [list specific triggering conditions]
```

**Critical**: Description must start with "Use when..." and list specific triggers — never summarize the skill's workflow. A summary creates a shortcut that bypasses reading the full content.

## Testing by Skill Type

| Type | Test Approach |
|------|--------------|
| Discipline-enforcing | Academic questions + pressure scenarios (time, sunk cost, exhaustion) |
| Technique | Application + variation + edge case scenarios |
| Pattern | Recognition + counter-example scenarios |
| Reference | Retrieval + application scenarios |

## Common Loopholes to Close

Skills enforcing behavioral rules must:
- Explicitly forbid specific workarounds
- Address rationalization attempts with rationalization tables and red-flag lists
