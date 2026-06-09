# vercel-cli-with-tokens

Deploy and manage Vercel projects using token-based authentication (no interactive login required).

## Setup

### 1. Locate Your Token

Check for `VERCEL_TOKEN` in environment or `.env` file. Export it:
```bash
export VERCEL_TOKEN=your_token_here
```

**Critical**: Once `VERCEL_TOKEN` is exported as an environment variable, the Vercel CLI reads it natively — **do not pass it as a `--token` flag** (exposes token in shell history and process listings).

### 2. Find Project Details

Check for `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` in environment or `.env` file. These allow targeting the correct project without `vercel link`.

## Deployment Methods

### Quick Deploy (with project ID)
```bash
vercel deploy -y --no-wait
```

### Full Flow (without project ID)
```bash
vercel link --repo --scope <team-slug> -y
vercel deploy -y --no-wait
```

Default to **preview deployments** unless production is explicitly requested.

## Common Operations

```bash
# Add environment variable
vercel env add VAR_NAME --scope <team-slug>

# List deployments
vercel ls --format json --scope <team-slug>

# Inspect a deployment
vercel inspect <deployment-url>

# Manage domains
vercel domains ls --scope <team-slug>
```

## Security Rules

- Never commit tokens to files tracked by git
- Never pass tokens as CLI arguments — always use environment variables
- Never log or print token values
