# seo-technical

Technical SEO audit across 9 categories.

## 9 Audit Categories

1. **Crawlability** — robots.txt, XML sitemaps, noindex tags, crawl depth
2. **Indexability** — canonical tags, duplicate content, pagination, hreflang
3. **Security** — HTTPS enforcement, security headers (CSP, HSTS, X-Frame-Options)
4. **URL Structure** — clean URLs, logical hierarchy, redirect chains, consistency
5. **Mobile Optimization** — responsive design, touch targets, font sizing
6. **Core Web Vitals** — LCP (< 2.5s), INP (< 200ms), CLS (< 0.1)
7. **Structured Data** — JSON-LD validation and schema markup
8. **JavaScript Rendering** — CSR vs SSR detection, dynamic rendering
9. **IndexNow Protocol** — support for non-Google search engines

## Key Updates (2025-2026)

**AI Crawler Management (7 major crawlers):**
- `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `Applebot`, `Bytespider`
- Blocking `Google-Extended` prevents Gemini training use but does NOT affect Google Search indexing

**Core Web Vitals:**
- FID fully removed from Chrome tools (September 9, 2024)
- INP (Interaction to Next Paint) is the replacement metric

**Mobile-First Indexing:**
- Complete as of July 5, 2024 — Google exclusively uses mobile Googlebot

**JavaScript SEO:**
- Canonical, robots directives, and structured data must be server-rendered
- Never inject SEO-critical elements via JavaScript

## Output

Technical Score (0–100) with category breakdowns and prioritized remediation guidance.
