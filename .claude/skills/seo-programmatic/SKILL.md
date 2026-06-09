# seo-programmatic

Programmatic SEO analysis and planning — audit and build pages generated at scale from structured data.

## Assessment Areas

### Data Quality Evaluation
- CSV/JSON files, API endpoints, database queries
- Row count, uniqueness, freshness
- Records must have enough unique attributes to generate distinct content

### Template Design Standards
- Avoid "mad-libs patterns" where only keywords change
- Each page must read as a standalone, valuable resource
- Dynamic sections must add genuine information, not just keyword variations

### URL Structure
Recommended patterns: `/tools/[tool-name]`, `/[city]/[service]`, `/glossary/[term]`
- Lowercase, hyphenated, under 100 characters, no query parameters

## Quality Gates

| Metric | Threshold | Action |
|--------|-----------|--------|
| Unique content | < 40% | Warning |
| Unique content | < 30% | Hard stop |
| Word count | < 300 words | Flag for review |

Reflects Google's March 2024 Scaled Content Abuse policy (45% reduction in low-quality content through 2025).

## Safe vs High-Risk Patterns

**Safe:**
- Integration pages with real documentation
- Template pages with downloadable content
- Glossary entries with 200+ word definitions

**High-risk (avoid):**
- Location pages with only city names swapped
- Competitor comparisons without real data
- AI-generated content without human review
