# systematic-debugging

Investigate root causes before attempting any fixes.

## The Iron Law

**NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST.**

"Violating the letter of this process is violating the spirit of debugging."

## 4 Required Phases (Sequential — Do Not Skip)

### 1. Root Cause Investigation
- Read error messages thoroughly
- Reproduce the failure consistently
- Review recent changes
- Gather diagnostic evidence at component boundaries
- Trace data flows backward from the failure point

### 2. Pattern Analysis
- Locate working examples in the codebase
- Study reference implementations completely
- Identify differences between working and broken code
- Understand all dependencies involved

### 3. Hypothesis and Testing
- Form specific theories about causation
- Test with minimal, isolated changes
- Verify results; form new hypotheses if initial ones fail

### 4. Implementation
- Create a failing test case first
- Implement a single fix addressing the root cause
- Verify the fix works without breaking other functionality

## Escalation Rule

If **3 or more fix attempts fail**: stop patching symptoms and question architectural soundness. Continuing beyond this is a red flag.

## Red Flags — Reset the Process

- "Quick fix for now, investigate later"
- Proposing solutions before understanding data flows
- Trying a fix because it "looks right"
- Fixing the symptom without understanding why it appeared
