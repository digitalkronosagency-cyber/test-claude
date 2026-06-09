# seo-images

Image optimization audit — analyzes alt text, file size, format, responsive images, lazy loading, and performance.

## Analysis Dimensions

### Alt Text
- Presence, descriptiveness, keyword relevance
- Length: 10–125 characters
- Flags: keyword stuffing, uninformative descriptions

### File Size Thresholds

| Type | Warning | Critical |
|------|---------|----------|
| Thumbnails | > 50KB | > 100KB |
| Content images | > 100KB | > 200KB |
| Hero images | > 200KB | > 400KB |

### Format Priority

1. WebP (97%+ browser support)
2. AVIF (92%+ support)
3. JPEG / PNG (fallback)

Note: JPEG XL restored by Chrome (November 2025).

### Responsive Images
- Check `srcset` and `sizes` attributes
- Match layout breakpoints and device pixel ratios

### Lazy Loading Detection

Reports `lazy_method` per image: `native | perfmatters | ewww | js-generic | none`

**Do NOT flag "not lazy-loaded"** when JS lazy-loaders (Perfmatters, EWWW, lazysizes) are detected — they intentionally strip the native `loading="lazy"` attribute and use `data-src` placeholders.

### Performance
- `fetchpriority="high"` for LCP images
- `decoding="async"` for non-LCP images
- Width/height attributes to prevent CLS

## Advanced Features

- **Image SERP Analysis**: Cross-references on-page images with Google Images rankings via DataForSEO
- **File Optimization**: Converts formats using exiftool, cwebp, ImageMagick, or FFmpeg
- **AI Image Labeling**: `DigitalSourceType` metadata required for Google Merchant Center compliance on AI-generated product images
