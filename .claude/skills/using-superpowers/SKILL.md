# using-superpowers

Mandatory framework for invoking skills before taking action or responding to requests.

## Core Rule

**"If you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill."**

Check for applicable skills BEFORE:
- Clarifying questions
- File exploration
- Any response to the user

## Instruction Hierarchy

1. **User's explicit instructions** — highest priority, always supersedes skills
2. **Superpowers skills** — override default behavior
3. **Default system prompt** — lowest priority

## Workflow

1. Check for applicable skills before anything else
2. Announce which skill you're invoking and its purpose
3. Follow skill instructions exactly
4. For checklisted processes (TDD, debugging): create todos for each item
5. Adapt pattern skills to context; maintain strict discipline for process skills

## Skill Priority Order

Process skills first, then implementation skills:
1. `brainstorming` / `systematic-debugging` (determine approach)
2. `writing-plans` / `test-driven-development` (structure work)
3. `executing-plans` / `subagent-driven-development` (build)
4. `verification-before-completion` (confirm)
5. `finishing-a-development-branch` (ship)

## Red Flags — You're Skipping Skills

Stop if you're thinking:
- "This is simple, I don't need a skill"
- "I need more context first"
- "I'll check a few files quickly"

These thoughts indicate you're rationalizing away the skill-check step. **Check skills first.**
