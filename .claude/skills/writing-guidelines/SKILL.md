# writing-guidelines

Audit documentation and prose against Vercel's Writing Guidelines — checks files for voice, tone, and style compliance.

**License:** MIT | **Version:** 1.0.0 | **Author:** Vercel

## Trigger Phrases

Activate when user says: "review my docs", "check writing style", "audit prose", "check voice", "check tone", "handbook compliance".

## Workflow

1. Fetch current guidelines from the source URL (fetched fresh each time)
2. Examine specified files
3. Cross-reference against all established rules
4. Output results in `file:line` format

## Guidelines Source

Fetched fresh from:
```
https://raw.githubusercontent.com/vercel-labs/writing-guidelines/main/command.md
```

## Usage

- Specify individual files or glob patterns for review
- If no files provided, ask the user which content to review
- Output violations as `file:line: [rule] description`

## What Gets Reviewed

- Voice and tone consistency
- Clarity and conciseness
- Terminology and brand language
- Formatting conventions (headings, lists, code blocks)
- Documentation structure and completeness
