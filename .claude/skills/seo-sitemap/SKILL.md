# seo-sitemap

XML sitemap analysis and generation tool.

**License:** MIT | **Version:** 2.0.0 | **Author:** AgriciDaniel

## Analysis Mode

Validates existing XML sitemaps:
- Format validity
- URL count (protocol limit: 50,000 URLs)
- HTTP response codes for all URLs
- Modification date accuracy
- Deprecated tags: `<priority>` and `<changefreq>` are ignored by Google

## Generation Mode

Interactive process:
1. Identify business type
2. Apply quality safeguards
3. Warning at 30+ location pages
4. **Hard stop at 50+ location pages** (require justification)

## Quality Standards

**Safe approaches:**
- Integration pages with actual setup documentation
- Glossary entries with 200+ word definitions

**Penalty-risk patterns (avoid):**
- Location pages with only city name swapped
- AI-generated content without human review

## Output

- **Analysis**: `VALIDATION-REPORT.md` with findings and recommendations
- **Generation**: `sitemap.xml` (or split files + index) + `STRUCTURE.md` documenting site architecture
