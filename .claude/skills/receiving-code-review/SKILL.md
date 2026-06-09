# receiving-code-review

Evaluate code review feedback with technical rigor — not performative agreement.

## Core Principle

"Verify before implementing. Ask before assuming. Technical correctness over social comfort."

## Process

1. Read the entire review completely
2. Restate each technical requirement in your own words
3. Verify against your actual codebase — not assumptions
4. Evaluate technical soundness of each suggestion
5. Respond with reasoning
6. Implement one item at a time, with testing after each

## Banned Responses

Never say:
- "You're absolutely right!"
- "Great point!"
- Any performative agreement language

Instead: restate technical requirements clearly, ask clarifying questions, provide reasoned pushback when technically warranted.

## Handling Unclear Feedback

Stop before implementing anything if items are unclear. State explicitly which points you understand and which need clarification. Never partially implement when confused.

## Pushback Guidelines

Push back when:
- Feedback lacks context about your codebase
- Suggestion violates YAGNI (You Aren't Gonna Need It)
- Contradicts established architectural decisions

Use technical reasoning, not defensiveness. Let your code changes demonstrate you understood the feedback — not your words.

## External Reviewer Evaluation

Before implementing suggestions from external reviewers, verify:
- The suggestion doesn't break existing functionality
- It actually serves a purpose in your codebase
- It accounts for your full technical context
