# verification-before-completion

Run fresh verification before claiming any success or completion. "Evidence before claims, always."

## The Rule

**Never assert positive status without fresh verification command output demonstrating success.**

This covers: completion claims, "should work" statements, commits, pull requests, task closures, and delegation handoffs.

## 5-Step Verification Process

1. **Identify the proof command** — what command proves this works?
2. **Execute it completely** — run it fresh, don't rely on prior output
3. **Review full output** — including exit codes, warnings, and stderr
4. **Confirm output supports your claim** — don't interpret ambiguous output as success
5. **Only then state your conclusion** — backed by the evidence

## Banned Language (Without Fresh Evidence)

- "should work"
- "probably passes"
- "I believe this is correct"
- "the tests should be fine"

## Red Flags — Stop Immediately

- Feeling satisfied before running verification
- Trusting an agent's self-reported success without independent verification
- Assuming a task is done because it "looks right"
- Skipping verification because you're confident

## Why This Matters

Past failures traced to unverified claims: shipped broken code, damaged trust, wasted time on rework. This standard is non-negotiable.
