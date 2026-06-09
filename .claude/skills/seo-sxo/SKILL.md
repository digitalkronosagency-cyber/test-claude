# seo-sxo

Search Experience Optimization (SXO) — identifies why well-optimized pages fail to rank by detecting page-type mismatches.

**Core insight**: A page can score 95/100 on technical SEO and still fail to rank because it is the **wrong page type** for the keyword.

## When to Use

- Page ranks for technical signals but not for target keyword
- Suspected mismatch between content format and SERP expectation
- Diagnosing ranking problems rooted in strategic misalignment

## Commands

- `/seo sxo <url>` — Full SXO analysis
- `/seo sxo <url> <keyword>` — SXO analysis for specific keyword

## 7-Step Pipeline

1. **Target Acquisition** — Fetch and parse the URL
2. **SERP Backwards Analysis** — Classify top 10 results by page type, format, signals
3. **Mismatch Detection** — Compare your page against SERP consensus
4. **User Story Derivation** — Extract intent from PAA questions, ads, related searches
5. **Gap Analysis** — Score alignment across 7 dimensions (0–100)
6. **Persona Scoring** — Rate relevance, clarity, trust, action for 4–7 derived personas
7. **Wireframe Generation** — Optional IST/SOLL redesign with concrete recommendations
