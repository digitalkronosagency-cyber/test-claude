# seo-ecommerce

Product page and marketplace SEO analysis for e-commerce.

## Four Analysis Modes

1. **Product Page Analysis** (no API required) — on-page SEO signals, title tags, meta descriptions, heading structure, image optimization, internal linking, content quality
2. **Google Shopping Intelligence** — DataForSEO Merchant API: competitive pricing, seller landscapes, listing quality patterns
3. **Amazon Marketplace Comparison** — cross-marketplace benchmarks: average price, median rating, free shipping prevalence
4. **Keyword Gap Detection** — identifies where sites rank organically but lack Shopping presence (and vice versa)

## Schema Validation

Validates Product schema against Google requirements:
- **Required**: name, image, description, brand, offers
- **Enhancements**: aggregate ratings, shipping details, return policies
- **Common errors**: currency symbols in price fields, missing required fields

## Cost Controls

All DataForSEO calls require cost guardrail check before execution. Prompt for user approval on expensive endpoints (especially Amazon searches). Log credits after each query.

## Cross-Skill Integration

References output from: seo-schema, seo-images, seo-content, seo-technical.
