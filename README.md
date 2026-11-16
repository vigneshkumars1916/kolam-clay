# Kolam & Clay – Shopify theme

Theme for Kolam & Clay, a two-person pottery studio in Chennai. Built on **Dawn 16.1.1** with the studio's own sections, snippets and styles added on top. Dawn files are only changed where a feature needed a hook, so the theme can still take Dawn updates.

## Running it locally

```bash
npm install -g @shopify/cli
shopify theme dev --store kolam-clay.myshopify.com
```

Pull editor changes before committing so settings made in the theme editor aren't lost:

```bash
shopify theme pull --store kolam-clay.myshopify.com --only templates/*.json --only sections/*.json --only config/settings_data.json
```

## What's custom

| Area | Files |
| --- | --- |
| Design tokens, type, shared styles | `snippets/brand-head.liquid`, `assets/brand.css` |
| Kolam ornament and icon set | `snippets/kolam-ornament.liquid`, `snippets/line-icon.liquid` |
| Homepage hero carousel | `sections/home-hero.liquid`, `assets/home-hero.js` |
| Studio story (built from scratch) | `sections/studio-story.liquid` |
| Icon strip, collection tiles, product columns | `sections/icon-strip.liquid`, `sections/collection-tiles.liquid`, `sections/product-columns.liquid` |
| Feature panels (glaze palette, workshop promo, process, reviews, gift guide, FAQ) | `sections/feature-panels.liquid` |
| Utility bar, breadcrumbs, call-to-action banner | `sections/utility-bar.liquid`, `sections/breadcrumbs.liquid`, `sections/cta-banner.liquid` |
| Product page additions | `sections/main-product.liquid` (badge, highlights, one-of-a-kind notice, gift note hint blocks), `sections/maker-spotlight.liquid`, `sections/product-tabs.liquid` |
| Glaze swatches | `snippets/glaze-color.liquid`, `snippets/is-glaze-option.liquid`, `snippets/product-variant-options.liquid`, `snippets/card-extras.liquid`, `snippets/facet-glaze-dot.liquid` |
| Product cards | `snippets/card-badges.liquid`, `snippets/card-extras.liquid` |
| Shop / collection banner | `sections/collection-hero.liquid` |
| Workshop booking | `sections/workshop-booking.liquid`, `assets/workshop-booking.js`, `templates/product.workshop.json` |
| Gift note in cart | `snippets/gift-note-field.liquid`, `assets/gift-note.js` |
| Makers | `sections/makers-grid.liquid`, `sections/maker-profile.liquid`, `templates/metaobject/potter.json`, `templates/page.makers.json` |
| Structured data | `snippets/product-structured-data.liquid`, `snippets/workshop-structured-data.liquid`, `snippets/organization-structured-data.liquid`, breadcrumbs and FAQ sections |

## Data the theme expects

**Potter metaobject** (`potter`, published on the online store at `/pages/makers/...`): name, role, portrait, short bio, full story, quote, feature image, specialties, throwing since, Instagram, SEO title and description.

**Product metafields** (`custom` namespace): `maker` (potter reference), `one_of_a_kind`, `badge`, `highlights`, `material`, `finish`, `capacity`, `dimensions`, `story`, `story_image`, `gift_note`.

**Variant metafields** (workshop sessions): `custom.session_start`, `custom.session_end`.

**Theme settings → Studio & brand**: glaze names and colours, one-of-a-kind labels, studio address for structured data, gift note wording.

## Editing guide for the studio

Everything below is done in **Online Store → Themes → Customize**. Nothing needs code.

- **Homepage sections**: add, hide, duplicate, drag to reorder or remove any section from the left sidebar. Every heading, paragraph, image, button and colour scheme is a setting on the section or one of its blocks.
- **Studio story**: content is made of blocks (label, heading, text, quote, numbers, founders, button). Drag the blocks to change their order. Layout (image left or right, collage, stacked), image shape, width, alignment and colours are section settings.
- **Feature panels**: one section type that holds one to three panels. Pick any mix of Glaze palette, Workshop promo, Craft process, Customer words, Gift guide and FAQ. FAQ answers are also published to search engines.
- **New glaze**: add a line such as `Terracotta Red:#B5502C` under Theme settings → Studio & brand → Glaze colours, then add the glaze as an option value on the product. Swatches update on the product page, product cards, filters and the homepage palette.
- **Product details**: edit the product in Shopify admin. Highlights, specs, the story, the maker and the badge are fields at the bottom of the product page. Highlight icons follow the words you type ("Microwave safe" shows the microwave icon).
- **One-of-a-kind piece**: tick *One of a kind* and set stock to 1. When it sells it stays visible with a "Sold · From our archive" label and can't be bought. Labels are under Theme settings → Studio & brand.
- **Workshop dates**: add a variant with the date and time slot, set its stock to the number of seats, and fill in *Session starts* and *Session ends*. The calendar, seat count and search engine event data update on their own. Shopify won't sell more seats than the stock.
- **Gift notes**: tick *Allow gift note* on any product. Buyers get a 40-character note field in the cart, and the note appears on the order.
- **New potter**: Content → Metaobjects → Potter → Add entry. Their page and the Our Makers grid update automatically. Pick them in a product's *Maker* field to link their work.
