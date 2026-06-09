# seo-google

Google SEO APIs — Search Console, PageSpeed Insights v5, CrUX, Indexing API v3, and GA4 organic traffic.

**License:** MIT | **Version:** 2.0.0 | **Author:** AgriciDaniel

## Credential Tiers

| Tier | Access |
|------|--------|
| 0 | API key only |
| 1 | OAuth / service account |
| 2 | Tier 1 + GA4 configuration |
| 3 | Tier 2 + Google Ads credentials |

## Commands

| Command | API Used |
|---------|----------|
| `/seo google pagespeed <url>` | PageSpeed Insights + CrUX lab+field metrics |
| `/seo google crux <url>` | CrUX-only fast check, 25-week trends |
| `/seo google gsc <property>` | Search Console query analytics |
| `/seo google inspect <url>` | URL Inspection (indexation status) |
| `/seo google sitemaps <property>` | Sitemap status |
| `/seo google index <url>` | Indexing API submission (200/day quota) |
| `/seo google ga4 <property>` | Organic traffic reports |
| `/seo google youtube <query>` | Video search + metadata |
| `/seo google nlp <url>` | Entity extraction, sentiment, E-E-A-T |

## Rate Limits

| API | Limit |
|-----|-------|
| PageSpeed Insights | 240 QPM / 25K QPD |
| GSC Search Analytics | 1,200 QPM |
| Indexing API | 380 RPM, 200 publish/day |

## Key Technical Notes

- INP replaced FID on March 12, 2024
- `round_trip_time` replaced `effectiveConnectionType` in CrUX (Feb 2025)
- YouTube mentions correlate 0.737 with AI visibility
