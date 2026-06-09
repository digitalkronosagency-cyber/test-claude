# seo-drift

SEO change monitoring — captures baseline snapshots of SEO-critical page elements and detects changes over time. "Git for SEO."

## Commands

- `/seo drift baseline <url>` — Capture current SEO state as reference snapshot
- `/seo drift compare <url>` — Compare current page to stored baseline
- `/seo drift history <url>` — Show change history and past comparisons

## Tracked Elements (13 fields)

Title tags, meta descriptions, canonical URLs, heading structure (H1–H3), JSON-LD schema, Open Graph tags, Core Web Vitals, HTTP status codes, content hashes.

## Severity Classification

| Level | Response |
|-------|----------|
| CRITICAL | SEO-breaking changes — immediate action required |
| WARNING | Potential impact — investigate within one week |
| INFO | Awareness items — may be intentional |

17 comparison rules with specific thresholds and recommended actions.

## Data Storage

SQLite at `~/.cache/claude-seo/drift/baselines.db`. URL normalization ensures consistent matching.

## Security

- SSRF protection blocks private IPs and reserved ranges
- Parameterized SQL queries (no injection)
- TLS verification always enforced
- Validated fetch pipeline for all HTTP calls
