# Dad Gains — product photo & video spec

Use this list for a phone or DSLR shoot of the **real pouch** (or a high-quality print prototype). Swap files in `public/images/` and `public/videos/` without changing HTML filenames when possible.

## Filenames (site wiring)

**Until photography exists**, the site uses **SVG illustrations**: `dadgains-pouch-hero.svg`, `dadgains-morning-abstract.svg`, `dadgains-glass-pour.svg`, and **`dadgains-nutrition-label.svg`** (Supplement Facts preview on the shop PDP). Replace those paths in `index.html`, `shop.html`, and `og:image` when you have real files—or keep filenames and overwrite the SVGs.

| Role | Suggested file | Notes |
|------|----------------|--------|
| Hero / OG | `public/images/hero-product.webp` (+ `.png` fallback) | ~1200–1600px wide WebP; use a **raster** for `og:image` (social crawlers often ignore SVG). |
| Shop gallery | `product-pouch.jpg`, `product-lifestyle.jpg`, `product-pour.jpg` (or `.webp`) | Update `shop.html` thumb `data-src` when assets exist. |
| Pour loop | `public/videos/pour.mp4` | 10–15s, muted, H.264; compress (e.g. HandBrake). Home hero `<video>` already points here. |

## Shot list

1. **Pouch, front** — Matte bag on a neutral counter; soft natural or diffused light; label readable; slight angle OK.
2. **Lifestyle** — Person holding the bag at chest/waist height; real environment (kitchen counter, not sterile white void).
3. **Pour** — Clear glass with ice; pour the mixed **Lemonade** product; capture color and clarity (should read bright/citrus-clear, not milky); avoid harsh flash.
4. **Back / panel** — Nutrition and ingredients panel if label art is final (optional fourth gallery thumb).

## Lighting & trust

- Prefer **consistent color temperature** (daylight or one key + fill).
- Avoid heavy beauty retouch on the **packaging text** — legibility matters for supplements.
- For video: **stable phone or tripod**, 1080p minimum, export for web (short GOP, reasonable bitrate).

## If the physical bag is not ready

Use a **temporary mockup** (print template, Printful-style mock, or designer comp), label it as placeholder internally, and replace with real photography before heavy paid traffic.
