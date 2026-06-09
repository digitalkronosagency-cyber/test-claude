# seo-maps

Maps Intelligence — local business presence across Google Maps, Bing Places, Apple Maps, and OpenStreetMap.

## Capability Tiers

| Tier | Requirements | Capabilities |
|------|-------------|-------------|
| Free | None | Basic GBP audit, NAP check |
| DataForSEO | DataForSEO credentials | Geo-grid rank tracking, competitor mapping |
| DataForSEO + Google | Both API sets | Full field data, review intelligence, GBP audit |

## Core Features

- **Geo-grid rank tracking**: Position mapping across geographic grid points
- **GBP audits**: Profile completeness, category accuracy, photo count, Q&A
- **Review intelligence**: Velocity, sentiment, response rate analysis
- **Competitor mapping**: Local pack competitor identification and gap analysis
- **Multi-platform coverage**: Google Maps, Bing Places, Apple Maps, OpenStreetMap

## Commands

- `/seo maps audit <business>` — Full local presence audit
- `/seo maps grid <url>` — Geo-grid rank visualization
- `/seo maps competitors <url>` — Local competitor analysis
- `/seo maps reviews <business>` — Review intelligence report

## Security

- SSRF protection for all URL fetches
- Rate limiting respected per platform
