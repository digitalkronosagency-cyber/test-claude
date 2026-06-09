# seo-image-gen

AI image generation for SEO assets using Gemini via the banana Creative Director pipeline.

## Prerequisites

```bash
./extensions/banana/install.sh
```

Check MCP availability: verify `gemini_generate_image` or `set_aspect_ratio` tools are available before proceeding.

## Commands

| Command | What it does |
|---------|-------------|
| `/seo image-gen og <description>` | OG/social preview image (1200×630) |
| `/seo image-gen hero <description>` | Blog hero image (widescreen, dramatic) |
| `/seo image-gen product <description>` | Product photography (white BG, studio) |
| `/seo image-gen infographic <description>` | Infographic visual (vertical, data-heavy) |
| `/seo image-gen custom <description>` | Custom image with full Creative Director pipeline |
| `/seo image-gen batch <description> [N]` | Generate N variations (default: 3) |

## Use Case Defaults

| Use Case | Aspect Ratio | Resolution | Domain Mode |
|----------|-------------|------------|-------------|
| OG/Social | 16:9 | 1K | Product or UI/Web |
| Blog Hero | 16:9 | 2K | Cinema or Editorial |
| Schema Image | 4:3 | 1K | Product |
| Social Square | 1:1 | 1K | UI/Web |
| Product Photo | 4:3 | 2K | Product |
| Infographic | 2:3 | 4K | Infographic |
| Pinterest Pin | 2:3 | 2K | Editorial |

## Generation Pipeline

1. Identify use case from command or context
2. Apply SEO defaults from use cases table
3. Set aspect ratio via `set_aspect_ratio` MCP tool
4. Construct Reasoning Brief using banana Creative Director pipeline
5. Generate via `gemini_generate_image` MCP tool
6. Run post-generation SEO checklist

## Post-Generation SEO Checklist

After every successful generation:
1. **Alt text**: descriptive, keyword-rich
2. **File naming**: `keyword-description-widthxheight.webp`
3. **WebP conversion**: `magick output.png -quality 85 output.webp`
4. **File size**: < 200KB heroes, < 100KB thumbnails
5. **Schema**: suggest ImageObject markup
6. **OG tags**: og:image, og:image:width, og:image:height, og:image:alt

## Model Routing

| Scenario | Model | Resolution |
|----------|-------|-----------|
| OG images, social previews | gemini-3.1-flash-image-preview | 1K |
| Hero images, product photos | gemini-3.1-flash-image-preview | 2K |
| Infographics with text | gemini-3.1-flash-image-preview (thinking: high) | 2K |
| Quick drafts | gemini-2.5-flash-image | 512 |

## Approximate Costs

| Resolution | Cost/image |
|-----------|-----------|
| 512 | ~$0.02 |
| 1K | ~$0.04 |
| 2K | ~$0.08 |
| 4K | ~$0.16 |

Log every generation: `python3 scripts/cost_tracker.py log --model MODEL --resolution RES --prompt "brief"`
