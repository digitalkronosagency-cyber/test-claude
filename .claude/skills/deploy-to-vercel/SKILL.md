# deploy-to-vercel

Deploy projects to Vercel using the optimal method for the current environment.

## Decision Flow

1. Check project state: git remote, Vercel link status, CLI installation, available teams
2. Select deployment method based on project state
3. Execute deployment
4. Return deployment URL

## Deployment Methods

### Git Push (Ideal)
When project is linked and has a git remote:
```bash
git add -A && git commit -m "..." && git push
```
Vercel auto-builds. Non-production branches → preview deployments.

### CLI Deploy (Linked, no git remote)
```bash
vercel deploy [path] -y --no-wait
```

### Link First (authenticated but not linked)
```bash
vercel link --scope <team-slug>
# then deploy
vercel deploy -y --no-wait
```

### Fallback Script (sandboxed environments)
Use the provided deploy script that requires no credentials. Returns a claimable URL.

## Key Behaviors

- **Always deploy as preview** unless user explicitly requests production
- Present team options as a bulleted list; proceed immediately after selection
- **Never push without user approval**
- Use `--no-wait` for immediate URL return (don't block on build completion)
- Include both preview URL and claim URL for no-auth deployments

## Output

Always display the live preview URL after deployment.
