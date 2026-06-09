# seo-audit

Comprehensive website SEO audit — crawls up to 500 pages and delegates analysis to specialized subagents.

## Command

`/seo audit <url>`

## Crawl Scope

- Follow internal links up to 500 pages
- Respect robots.txt
- Apply timeouts and concurrency limits

## Subagent Delegation

Spawns up to 15 specialist agents:
- **8 core agents**: technical, content, schema, sitemap, performance, visual, geo, local
- **7 conditional agents**: triggered by e-commerce detection, available API credentials, etc.

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

## Output Deliverables

- Comprehensive findings document
- Prioritized action plan sorted by severity
- Desktop and mobile screenshots
- Optional professional PDF report via `scripts/google_report.py`

## Integrations (Optional)

- **DataForSEO**: Live SERP data, organic traffic analytics
- **Google APIs**: Core Web Vitals field data, indexation status

## Error Handling

| Scenario | Action |
|----------|--------|
| Unreachable URL | Report clearly, suggest user verify URL |
| robots.txt block | Report blocked paths, audit accessible pages |
| Rate limiting | Back off and report limitation |
| Timeout | Report partial results with timeout note |
