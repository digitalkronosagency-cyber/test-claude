# seo

Universal SEO analysis orchestrator. Coordinates 24 sub-skills and 18 sub-agents to deliver full-site audits, single-page deep-dives, and industry-specific optimization.

## Commands

- `/seo audit <url>` — Complete website audit with parallel subagent delegation
- `/seo page <url>` — Single-page deep analysis
- `/seo schema <url>` — Schema markup detection and validation
- `/seo content <url>` — Content quality and E-E-A-T analysis
- `/seo technical <url>` — Technical SEO audit across 9 categories
- `/seo images <url>` — Image optimization audit
- `/seo local <url>` — Local SEO analysis
- `/seo geo <url>` — AI search / GEO optimization

## Orchestration

On audit commands: detect business type, spawn relevant subagents in parallel, synthesize findings through a 10-principle thinking framework (PERCEIVE → ANALYZE → VALIDATE → ACT). Results feed into prioritized action plans with dependency sequencing.

## Industry Detection

Automatically identifies: SaaS (pricing pages, trial signups), local services (location signals), e-commerce (product schemas), publishers (blog presence), agencies (portfolio pages).

## SEO Health Score (0-100)

| Category | Weight |
|----------|--------|
| Content Quality | 23% |
| Technical SEO | 22% |
| On-Page SEO | 20% |
| Schema | 10% |
| Performance | 10% |
| AI Search Readiness | 10% |
| Images | 5% |

Recommendations: Critical → High → Medium → Low based on impact and urgency.

## Quality Standards

- Warning at 30+ location pages without sufficient unique content
- Hard stop at 50+ location pages
- HowTo schema deprecated post-September 2023
- FAQ schema restricted to gov/health sites (August 2023 Google guidelines)
