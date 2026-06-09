# seo-dataforseo

Live SEO data via the DataForSEO MCP server — 10 API modules, 79+ tools covering SERP, keywords, backlinks, on-page analysis, and AI visibility tracking.

## Prerequisites

```bash
./extensions/dataforseo/install.sh
```

Verify MCP server connectivity before use.

## Cost Management (Mandatory)

Before every API call:
```bash
python scripts/dataforseo_costs.py check
```

Outcomes:
- `"approved"` → proceed immediately
- `"needs_approval"` → request user confirmation with cost estimates
- `"blocked"` → halt execution

After every call:
```bash
python scripts/dataforseo_costs.py log
```

## API Modules

| Module | Tools |
|--------|-------|
| SERP Analysis | Organic results, YouTube, video, Google Images |
| Keyword Research | Ideas, volume, difficulty, intent, trends |
| Domain Analysis | Backlinks, competitors, ranked keywords, traffic, subdomains |
| Technical | On-page Lighthouse, tech stack detection, WHOIS |
| Content & AI | Business listings, ChatGPT scraper, LLM mention tracking |

## Important Notes

- YouTube analysis has highest AI visibility correlation (0.737)
- Filtered image searches with `site:` or `filetype:` = **5x standard API cost** — warn user explicitly before executing
