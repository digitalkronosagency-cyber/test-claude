# test-driven-development

Write the test first. Watch it fail. Write minimal code to pass.

## The Iron Law

**NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST.**

Any code written before its corresponding test must be deleted entirely — no keeping it as reference material.

## Red-Green-Refactor Cycle

### RED Phase
- Write a minimal test demonstrating desired functionality
- Run it — verify it fails with the expected error message
- If it passes immediately, the test is wrong

### GREEN Phase
- Write the simplest code that makes the test pass
- No over-engineering, no extra features
- Stop the moment the test goes green

### REFACTOR Phase
- Clean up code while keeping all tests passing
- Remove duplication, improve naming and clarity
- No new behavior — only structural improvement

## Why Tests-After Fails

Writing tests after implementation produces tests that pass immediately — which proves nothing. It doesn't confirm the test actually validates behavior. Manual testing is ad-hoc and cannot systematically catch regressions.

## Rationalizations to Reject

- "It's too simple to test" → write the test
- "I already manually tested it" → write the test
- "I'll add tests later" → write the test now
- "The test would just duplicate the code" → write the test

## Verification Checklist

Before claiming completion:
- [ ] Every new function has a corresponding test
- [ ] Each test was observed failing before implementation
- [ ] All tests pass with no warnings or errors
