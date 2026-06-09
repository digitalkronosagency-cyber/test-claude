# seo-page

Deep single-page SEO analysis covering on-page elements, content quality, technical meta tags, schema, images, and performance.

Use when user says "analyze this page", "check page SEO", "single URL", "check this page", "page analysis", or provides a single URL for review.

**License:** MIT | **Version:** 2.0.0 | **Author:** AgriciDaniel

## What to Analyze

### On-Page SEO
- Title tag: 50–60 characters, includes primary keyword, unique
- Meta description: 150–160 characters, compelling, includes keyword
- H1: exactly one, matches page intent, includes keyword
- H2–H6: logical hierarchy (no skipped levels), descriptive
- URL: short, descriptive, hyphenated, no parameters
- Internal links: sufficient, relevant anchor text, no orphan pages
- External links: to authoritative sources, reasonable count

### Content Quality
- Word count vs page type minimums
- Readability: Flesch Reading Ease score, grade level
- Keyword density: natural (1–3%), semantic variations present
- E-E-A-T signals: author bio, credentials, first-hand experience markers
- Content freshness: publication date, last updated date

### Technical Elements
- Canonical tag: present, self-referencing or correct
- Meta robots: index/follow unless intentionally blocked
- Open Graph: og:title, og:description, og:image, og:url
- Twitter Card: twitter:card, twitter:title, twitter:description
- Hreflang: if multi-language, correct implementation

### Schema Markup
- Detect all types (JSON-LD preferred)
- Validate required properties
- NEVER recommend HowTo (deprecated) or FAQ (restricted to gov/health)

### Images
- Alt text: present, descriptive, includes keywords where natural
- File size: flag > 200KB (warning), > 500KB (critical)
- Format: recommend WebP/AVIF over JPEG/PNG
- Dimensions: width/height set for CLS prevention
- Lazy loading: report `lazy_method` per image (native | perfmatters | ewww | js-generic | none)
- Do NOT flag "not lazy-loaded" when JS lazy-loaders are detected

### Core Web Vitals (reference only)
- Flag potential LCP issues (huge hero images, render-blocking resources)
- Flag potential INP issues (heavy JS, no async/defer)
- Flag potential CLS issues (missing image dimensions, injected content)

## Output

```
Overall Score: XX/100

On-Page SEO:     XX/100  ████████░░
Content Quality: XX/100  ██████████
Technical:       XX/100  ███████░░░
Schema:          XX/100  █████░░░░░
Images:          XX/100  ████████░░
```

Issues organized by priority: Critical → High → Medium → Low

## Error Handling

| Scenario | Action |
|----------|--------|
| URL unreachable | Report clearly, suggest user verify URL |
| Requires authentication | Report limitation, suggest providing rendered HTML |
| JavaScript-rendered (empty body) | Analyze available HTML, flag incomplete results |
