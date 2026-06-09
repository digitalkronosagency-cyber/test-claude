# seo-geo

AI Search / Generative Engine Optimization (GEO) — optimize content for AI-powered search platforms.

**Core principle**: Optimizing for generative AI search is still SEO. AEO and GEO are rebranded labels for the same work.

## Key Data Points (2025-2026)

- Brand mentions correlate 3x more strongly with AI visibility than backlinks
- YouTube mentions have strongest correlation with AI citations (~0.737)
- Domain rating shows weak correlation (~0.266)
- Only 11% of domains appear in both ChatGPT and Google AI Overviews for identical queries
- Google AI Mode launched May 2025 — zero organic blue links, AI citation is the only visibility mechanism

## GEO Scoring Criteria

| Factor | Weight |
|--------|--------|
| Authority & Brand Signals | 20% |
| Technical Accessibility | 20% |
| Structural Readability | 20% |
| Citability Score | 25% |
| Multi-Modal Content | 15% |

**Citability**: Optimal passage length 134–167 words, clear quotable sentences with specific facts.
**Multi-Modal**: Text + images + video = 156% higher AI selection rate.

## Practical Actions

- Allow key AI crawlers in robots.txt: `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`
- Create `/llms.txt` for structured content guidance
- Add question-based definitions in first 60 words
- Implement Author and Organization schema
- Build brand presence: Wikipedia, Reddit, YouTube, LinkedIn
- Server-side render critical content (AI crawlers don't execute JavaScript)
