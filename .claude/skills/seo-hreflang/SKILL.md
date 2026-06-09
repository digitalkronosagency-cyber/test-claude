# seo-hreflang

Hreflang validation and international SEO audit tool.

## 8 Validation Checks

1. **Self-Referencing Tags** — Every page must hreflang to itself
2. **Return Tags** — Bidirectional relationships required between language versions
3. **x-default Tag** — Required fallback for unmatched languages
4. **Language Code Validation** — ISO 639-1 two-letter codes (not three-letter)
5. **Region Code Validation** — ISO 3166-1 Alpha-2, proper capitalization
6. **Canonical URL Alignment** — No hreflang on non-canonical pages
7. **Protocol Consistency** — Uniform HTTP/HTTPS across all variants
8. **Cross-Domain Support** — Validates relationships across different domains

## Implementation Methods

| Method | Best For |
|--------|----------|
| HTML link tags | < 50 language variants |
| HTTP headers | Non-HTML files (PDFs) |
| XML sitemaps | Large-scale or cross-domain deployments |

## Advanced Analysis

- **Cultural Adaptation Assessment** — Content suitability beyond technical requirements
- **Content Parity Audit** — Page structure, SEO elements, word count consistency across languages
- **Locale Format Validation** — Numbers, dates, currency, phone formats per region

## Output

Detailed report with Critical / High / Medium / Low severity issues and specific remediation guidance.
