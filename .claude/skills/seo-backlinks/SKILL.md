# seo-backlinks

Comprehensive backlink profile analysis across 7 dimensions.

**License:** MIT | **Version:** 2.0.0 | **Author:** AgriciDaniel

## Commands

- `/seo backlinks <url>` — Full backlink analysis
- `/seo backlinks gap <url1> <url2>` — Competitor link gap comparison
- `/seo backlinks toxic <url>` — Toxicity detection and disavow recommendations
- `/seo backlinks setup` — Configuration guidance

## Analysis Dimensions

1. Profile overview
2. Anchor text distribution
3. Referring domain quality
4. Toxic link detection
5. Top pages by backlinks
6. Competitor gaps
7. Link velocity trends

## Data Sources (Priority Order)

1. DataForSEO (premium) — primary
2. Moz API (free signup)
3. Bing Webmaster (free)
4. Common Crawl (always available)
5. Verification crawler

All sources include confidence weighting when mixing data.

## Health Scoring

Proportional weighting across 7 factors.

**Data sufficiency gate**: If fewer than 4 factors have data available, report INSUFFICIENT DATA rather than a numeric score to avoid misleading assessments.

## Pre-Delivery Safeguards

Mandatory fact-checking before reporting:
- Verify schema parsing
- Distinguish JS-rendered pages from removed links
- Flag reciprocal link patterns
- Confirm all metrics have source labels
