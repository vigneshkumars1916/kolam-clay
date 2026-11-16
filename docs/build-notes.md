# Build notes

Technical facts about how each brief item is implemented and the Shopify limits hit along the way. Use them as reference when writing DECISIONS.md. They're not a substitute for it.

## Must items: where they live

| # | Item | Implementation |
| --- | --- | --- |
| 1 | Store setup | Products, collections, menus, pages, potters: done through the Admin API. Currency, taxes, payments, markets, shipping, policies: admin settings (see `STORE-SETUP.md`). |
| 2 | Story section | `sections/studio-story.liquid`. New section, not a Dawn restyle. Content = 7 block types (label, heading, text, quote, numbers, founders, button), reorderable. Layout = image left / right / collage / stacked, image shape, width %, alignment, panel on/off, mobile order, colour scheme, padding. |
| 3 | Product pages | Glaze × Size: Dawn's variant picker already marks combinations that don't exist as unavailable (strikethrough); glaze values render as colour swatches from a theme setting. One-of-a-kind: `custom.one_of_a_kind` metafield → badge, "only 1 made" notice, quantity selector hidden, sold state message. Workshop: separate template `product.workshop.json` with its own section (calendar, time slots, seats left, participants). |
| 4 | Meet the maker | `potter` metaobject with online-store pages (`/pages/makers/<handle>`), `custom.maker` reference on products, "Made by" card on product pages, potter page lists every product whose maker is that potter, Our Makers grid page. |
| 5 | Cart drawer + gift note | Dawn's drawer (AJAX, no reloads). Gift note field appears on lines whose product has `custom.gift_note` ticked; max 40 characters enforced in the input and trimmed in JS; saved as line item property `Gift note`, which shows on the order in admin. |
| 6 | SEO / GEO | Unique SEO title + description on every product, collection and page. One H1 per page (Dawn's header logo was an H1 on the homepage; changed to a div). Breadcrumbs with BreadcrumbList data. Product JSON-LD with per-variant offers, brand, manufacturer, material, `Made by` property and a linked `Person` (`makesOffer`). Workshop: one `Event` per session with start/end, location, organiser, performer, price and `remainingAttendeeCapacity`. Sitewide `Organization`/`Store` with address, founders, areas served. `FAQPage` from FAQ panels. `ProfilePage` + `Person` on potter pages. Journal article as citable long-form content. Alt text: product images need alt text set in admin once photos are uploaded. |

## Should items

- **7 – Filters and swatches:** vertical filter sidebar from Dawn; glaze colour dots added to filter values; swatches on product cards link to that glaze's variant. Glaze, product type and filter order are configured in the free Search & Discovery app.
- **8 – Lighthouse:** not measured yet, because photos aren't uploaded. Things already in place that help: one hero image loaded eagerly with `fetchpriority=high`, everything else lazy, `srcset` widths on every image, two font families only, no third-party apps, section CSS split per section.

## Shopify limitations hit

- **Seats per date:** Shopify has no booking primitive. Each session is a variant whose inventory is the seat count, tracked with "stop selling when out of stock", so checkout can't oversell. Seats left = variant inventory.
- **Workshop "nothing shipped":** the variants are set to not require shipping, so ticket-only carts skip delivery.
- **One card per glaze:** Shopify's combined listings, which do this natively, are Shopify Plus only. Liquid can loop variants inside a collection grid, but it breaks pagination counts and filters.
- **Gift note limit:** line item properties have no server-side length validation, so the 40-character limit is enforced in the theme (input `maxlength` and in JS before saving).
- **Policies:** the Admin API scope available here can't write legal policies; they're pasted in admin.
- **Root files for AI crawlers (e.g. `/llms.txt`):** Shopify themes can't serve arbitrary files at the domain root.
- **Store timezone:** session dates are formatted in the store's timezone, so the store must be set to IST for dates to show correctly.

## Open decisions (yours to make)

| Request | Technical facts that bear on it |
| --- | --- |
| A – "12 viewing" + 15-min timer | Shopify has no live visitor count available to themes, so the number would have to be invented. A timer that resets per visit isn't tied to any real deadline. |
| B – sold one-of-a-kind stays as portfolio | Already behaves this way: product stays published, sold label + message, add to cart disabled, offer marked `SoldOut` in structured data. |
| C – every glaze as its own card | See limitation above. Current build: one card per product with clickable glaze swatches. |
| D – never oversell workshops, show seats | Built: inventory-tracked variants, seats left on the workshop page, product cards and homepage promo. |
| E – estimated delivery date abroad | Not built. Possible inputs: `localization.country` for the buyer's market and day ranges from the shipping policy. Shopify has no carrier ETA available to themes. |
| Reviews / ratings in the design | No paid apps allowed; there are no real reviews yet. The homepage "Customer words" panel holds editable quotes. Decide whether to keep, label or remove it. |
| Wishlist hearts in the design | Not built; needs either an app or a browser-storage-only list. |
