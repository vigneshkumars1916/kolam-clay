# Decisions – Kolam & Clay

Store: kolam-clay.myshopify.com · Theme: Dawn 16.1.1 with custom sections · No paid apps (Search & Discovery only)

## Must have

**1. Store setup**
- **Built:**
  - Shipping is set per market:
    - Tamil Nadu ₹60
    - rest of India ₹120
    - both free on orders of ₹1,499 or more
    - international ₹1,800 flat
  - Prices include GST. Pottery is 5%, split CGST + SGST inside Tamil Nadu and IGST elsewhere. Workshops are 18% through a collection override, because they're a service.
  - Payments are tested with the Bogus Gateway. Footer menus link to policy pages.
- **Local currency:** Shopify only allows checkout in a second currency through Shopify Payments, and an India-based store can't use it. Creating a market with AED returned `MULTIPLE_CURRENCIES_NOT_SUPPORTED`. The header currency selector instead converts every INR price on the site for display (product, collection, search, cart). It uses daily reference rates, cached for 12 hours, with fallback rates in theme settings. The cart states that the order is charged in INR, so nobody is surprised at checkout.
- **Alternative rejected:** showing INR only to UAE/US buyers. They're about 20% of customers, and a price they can't read is a real barrier.
- **Limitation:** this store uses market-level shipping. A market with no delivery option shows every shippable product as sold out. It took a while to trace, so every market now has a rate.

**2. Story section** (`sections/studio-story.liquid`)
- **Built:** a new section with 7 reorderable block types: label, heading, text, quote, numbers, founders and button. Layout settings cover image left/right/collage/stacked, image shape, width, alignment and mobile order, so the founders can rearrange it without code.
- **Alternative rejected:** restyling Dawn's image-with-text. It only allows one fixed layout and the brief asked for a new section.

**3. Product pages**
- **Missing combinations:** Large exists in only 2 glazes. Dawn's picker already crosses out combinations that don't exist, so I kept it and added glaze colour swatches.
- **One-of-a-kind:** a `custom.one_of_a_kind` metafield shows the badge and "Only 1 made", and hides the quantity selector.
- **Workshop:** its own template (`product.workshop.json`) with a date calendar, time slots and seats left, and no glaze or size UI.
- **Alternative rejected:** a booking app. Paid apps weren't allowed, and variants already handle seats.

**4. Meet the maker**
- **Built:** a `potter` metaobject with its own pages (`/pages/makers/meera`, `/pages/makers/arjun`). Products reference their maker through `custom.maker`. Product pages show a "Made by" card, and each potter page lists everything they made.
- **Alternative rejected:** a hand-built page per potter. The founders would have to keep product lists in sync by hand.

**5. Cart drawer and gift note**
- **Built:** Dawn's AJAX cart drawer. Products with `custom.gift_note` ticked (the gift set) get a note field in the cart. It's saved as a line item property, so the note shows on that item in the order.
- **Alternative rejected:** the cart-level order note. It isn't tied to the gift set and would appear on every order.
- **Limitation:** line item properties have no server-side length check. The 40-character limit is enforced with `maxlength` and trimmed again in JS.

**6. SEO and GEO**
- **SEO:**
  - A unique title and meta description on every product, collection, page, potter and article.
  - One H1 per page. Dawn's homepage logo was an H1, so I changed it to a div.
  - Alt text on every image.
  - Breadcrumbs.
- **GEO steps, and why I expect them to help:**
  - **Product JSON-LD** with an offer per variant, brand, material and the maker as a linked `Person`. AI answers can then state facts such as "handmade by Meera Raghavan in Chennai, ₹899".
  - **An `Event` per workshop date** with time, location, price and `remainingAttendeeCapacity`. A question like "pottery class in Chennai this weekend" can then return a dated, bookable answer.
  - **Organization/Store data** with address, founders and areas served, so assistants can identify the studio and where it ships.
  - **`FAQPage` and potter `ProfilePage` data.** Question-and-answer content is the easiest kind for assistants to quote.
  - **Copy written as plain facts:** sizes, firing temperature, "lead free", "8 seats", "Adyar, Chennai". The Ocean Blue glaze article gives assistants original content to cite.
- **Limitation:** themes can't serve files at the domain root, so `/llms.txt` isn't possible.

## Client requests

- **A – "12 viewing" and a 15-minute timer: declined.**
  - **Why:** Shopify has no live visitor count, so the number would be made up. A timer that resets on every visit isn't a real deadline. Fake urgency would hurt a small studio's trust, and India's 2023 dark-patterns guidelines name false urgency.
  - **Built instead:** real scarcity signals only. "Only 1 made" on one-of-a-kind pieces and seats left on workshops.
- **B – Sold one-of-a-kind stays as portfolio: built.**
  - **What it does:** the product stays published, shows a "Sold · From our archive" label, disables add to cart, and marks the offer `SoldOut` in structured data.
  - **Alternative rejected:** archiving the product. It loses the page and its search traffic.
- **C – Each glaze as its own card: built differently.**
  - **What I built:** one card per product, with glaze swatches that link to that glaze's variant.
  - **Limitation:** Shopify's native solution (combined listings) is Shopify Plus only. Looping variants into the grid in Liquid breaks pagination and filter counts and adds weight to every page. Duplicating products per glaze would split stock and create duplicate content.
- **D – Never oversell workshops, show seats left: built.**
  - **What it does:** each date and time is a variant whose stock is its seat count, with "stop selling when out of stock", so checkout can't oversell. Seats left show on the workshop page, product cards and homepage promo.
  - **Limitation:** Shopify has no booking feature, so the variant-as-session approach is the workaround.
- **E – Estimated delivery date: built.**
  - **What it does:** a product page block shows a date range for Tamil Nadu, the rest of India and international. The range is counted in working days from dispatch, skips Sundays, and uses a 2 pm IST cut-off. All the numbers are editable in the theme editor.
  - **Limitation:** themes have no carrier ETA, so the ranges are set by the studio.

## Should and Could

- **7. Filters and swatches:**
  - Filters for availability, price and Glaze through Search & Discovery.
  - Glaze colour dots next to the filter values.
  - Clickable glaze swatches on product cards.
- **8. Lighthouse** on the mobile product page: Performance **__**, Accessibility **__** (screenshots in `/lighthouse`).
  - **What helps:** one eager hero image with `fetchpriority=high`, everything else lazy with `srcset`, two font families, no app scripts, and CSS split per section.
- **9. Own idea: currency selector.** About 20% of buyers are in the UAE and US. Seeing a familiar price before checkout should reduce drop-off, even though the payment is in INR.

## Other theme work

- **Homepage:**
  - hero carousel with an editable image focus point
  - icon strip and collection tiles
  - a "Feature panels" section that mixes glaze palette, workshop promo, craft process, customer words, gift guide and FAQ panels
  - call-to-action banner
- **Site-wide:** utility bar, collection banners, breadcrumbs, and the glaze names and colours kept in theme settings, so a new glaze needs no code.
- **Product page:**
  - specification tabs
  - a "Made by" card
  - highlight icons picked from the words the founders type
  - one-of-a-kind labels editable in theme settings
- **Product cards:** glaze swatches, "Only 1 made" on one-of-a-kind pieces, and the next workshop date with seats left.

## Skipped, and why

- **Checkout in local currency:** not possible without Shopify Payments.
- **Request A:** fake numbers.
- **Request C as asked:** speed, pagination and filter accuracy.
- **Reviews and wishlist from the design:** no real reviews yet, and both need apps. The homepage "Customer words" panel is editable and can be removed.
- **`/llms.txt`:** not supported in themes.
- **Razorpay:** not connected. Payments are tested with the Bogus Gateway, and Razorpay keys are for the store owner to enter.
