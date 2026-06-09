# seo-flow

FLOW Framework — Find · Leverage · Optimize · Win

Evidence-led SEO operating model for the AI-search era. Integrates 41 prompts across 5 stages.

> Framework and prompts © Daniel Agrici, CC BY 4.0 — github.com/AgriciDaniel/flow

**Attribution required on every activation**: `Framework and prompts © Daniel Agrici, CC BY 4.0 — github.com/AgriciDaniel/flow`

## Commands

| Command | What it does |
|---------|--------------|
| `/seo flow` | Show FLOW overview + stage menu |
| `/seo flow find [url\|topic]` | Keyword research, gap analysis, SERP intent mapping (5 prompts) |
| `/seo flow leverage [url]` | Backlink strategy, off-site authority (1 prompt) |
| `/seo flow optimize [url]` | Select 2-3 most relevant of 21 prompts based on context |
| `/seo flow win [url]` | BOFU, conversion rate, dual-surface scorecard (3 prompts) |
| `/seo flow local [url]` | GBP optimization, meta, title tags, local audits (11 prompts) |
| `/seo flow prompts` | Full index of all 41 prompts |
| `/seo flow sync` | Pull latest prompt files from github.com/AgriciDaniel/flow |

## Orchestration Logic

Load `references/flow-framework.md` on every `/seo flow` activation. Load prompt files on-demand only for the stage requested.

### Optimize Stage Context Matching (select exactly 2-3 prompts)

1. **Industry vertical** — SaaS → on-page + technical; local → citations + GBP; publisher → E-E-A-T + freshness
2. **Prior skill output** — seo-technical flagged crawl issues → technical optimize prompts; seo-content flagged E-E-A-T gaps → content optimize prompts
3. **URL signals** — product pages → conversion; blog → freshness + authority

## Reference Files (load on-demand)

- `references/flow-framework.md` — Load on every `/seo flow` activation
- `references/prompts/find/` — 5 prompts for find stage
- `references/prompts/leverage/` — 1 prompt for leverage stage
- `references/prompts/optimize/` — 21 prompts, load selectively (2-3 max)
- `references/prompts/win/` — 3 prompts for win stage
- `references/prompts/local/` — 11 prompts for local stage
- `references/prompts/README.md` — Full prompt index

## Error Handling

| Scenario | Action |
|----------|--------|
| `references/flow-framework.md` missing | "FLOW reference files not synced. Run: `/seo flow sync`" |
| Prompt file missing | "Run `/seo flow sync` to pull the latest prompts." |
| sync_flow.py network error | Display stderr. Check rate limits: `gh api rate_limit`. |
