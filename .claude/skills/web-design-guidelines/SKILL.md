# web-design-guidelines

Audit UI code against Vercel's Web Interface Guidelines — reviews files for design and accessibility best practices.

**License:** MIT | **Version:** 1.0.0 | **Author:** Vercel

## Trigger Phrases

Activate when user says: "review my UI", "check accessibility", "audit design", "review UX", "check my site against best practices".

## Workflow

1. Fetch current guidelines from the Vercel Labs source (guidelines are fetched fresh each time to ensure currency)
2. Examine specified files
3. Flag violations in `file:line` format

## Guidelines Source

Fetched fresh from:
```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/guidelines.md
```

## Usage

- Specify individual files or glob patterns for review
- If no files provided, ask the user which files to review
- Output violations as `file:line: [rule] description`

## What Gets Reviewed

- Accessibility compliance (ARIA, keyboard navigation, color contrast)
- Responsive design patterns
- Component structure and semantic HTML
- UX patterns and interaction design
- Visual consistency and design system adherence
