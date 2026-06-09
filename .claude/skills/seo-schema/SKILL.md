# seo-schema

Schema markup detection, validation, and JSON-LD generation.

## Detection

Scans for: JSON-LD scripts (preferred), Microdata attributes, RDFa markup.

## Validation

- Required properties per type
- Google rich result type support
- Common issues: missing `@context`, invalid `@type`, placeholder text, relative URLs, improper date formatting

## Schema Status (February 2026)

### Active Types
Organization, LocalBusiness, Product, Article, BlogPosting, Event, VideoObject, Person, BreadcrumbList, SiteNavigationElement, FAQPage (gov/health only), Recipe, Review, Course

### Restricted
- **FAQ** — Government and healthcare authority sites only (August 2023)

### Deprecated (do not recommend)
- **HowTo** — Removed September 2023
- **SpecialAnnouncement** — Deprecated July 31, 2025
- **CourseInfo, Dataset, VehicleListing** — Retired late 2025

## Implementation Note

Structured data injected via JavaScript may face delayed processing. Use server-rendered HTML for Product and Offer schemas.

## Output

1. Detailed validation report (Critical / High / Medium / Low issues)
2. Ready-to-use JSON-LD code snippets with templates for common page types
