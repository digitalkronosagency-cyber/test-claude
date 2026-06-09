# vercel-optimize

Observability-first performance and cost audit for Vercel deployments — recommendations grounded in production metrics, not codebase scanning alone.

**License:** MIT | **Version:** 1.0.0 | **Author:** Vercel

## Prerequisites

- Vercel CLI v53+ with observability commands
- Authenticated: `vercel login`
- Project linked: `vercel link`
- Node.js 20+
- Observability Plus subscription (for route-level metrics)

**Auth safety**: Never expose tokens in shell commands or chat.

## Supported Frameworks

| Framework | Status |
|-----------|--------|
| Next.js (App/Pages Router) | Full support |
| SvelteKit | Supported |
| Nuxt | Supported |
| Astro | Limited |
| Hono, Remix, others | Blocked unless user accepts limited audit |

For unsupported frameworks: pause and request explicit user consent before proceeding with code-only analysis.

## Investigation Pipeline

1. **Signal collection** — Metrics, usage, project config, codebase scan
2. **Gating** — Deterministic filtering to top 6 candidates (configurable)
3. **Deep-dive** — Route-bound code analysis for gated candidates
4. **Verification** — Validate citations against framework/version docs
5. **Report** — Customer-facing markdown with impact framing

## Safety Guardrails

- No recommendations without traffic-backed metrics or verified scanner findings
- All citations validated against framework/version docs
- Streaming/long-lived routes protected from wall-clock duration recommendations
- Auth-sensitive paths kept dynamic by default
- Workflow endpoints hard-gated from investigation

## Core Doctrine

**Metrics first**: Recommendations stem from production Vercel signals. Codebase scanning is secondary and scope-bound to routes identified by metrics.
