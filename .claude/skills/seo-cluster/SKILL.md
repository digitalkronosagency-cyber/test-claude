# seo-cluster

Semantic topic clustering — groups keywords based on Google SERP overlap rather than text similarity.

## Commands

- `/seo cluster plan <seed-keyword>` — Full planning workflow
- `/seo cluster execute` — Creates content (requires claude-blog or generates briefs)
- `/seo cluster map` — Regenerates the HTML visualization

## 6-Step Workflow

1. **Seed Keyword Expansion** — Generates 30-50 variants using related searches, PAA, and intent modifiers
2. **SERP Overlap Clustering** — Analyzes shared top-10 results to determine keyword relationships
3. **Intent Classification** — Categorizes keywords as informational, commercial, transactional, or navigational
4. **Hub-and-Spoke Architecture** — Designs pillar pages with 2-5 supporting clusters
5. **Internal Link Matrix** — Creates bidirectional linking structure with mandatory spoke-to-pillar connections
6. **Interactive Visualization** — Generates an HTML cluster map showing relationships

## Output

- Machine-readable JSON plan
- Markdown summary
- Interactive HTML visualization
- Content briefs
- Quality scorecard

## Integrations

- DataForSEO for enhanced SERP data (cost check before API calls)
- Resume capabilities for interrupted execution
- Optional PDF reporting via Google integration
