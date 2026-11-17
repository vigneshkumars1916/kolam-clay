# Store setup

Settings that live in Shopify admin rather than in the theme, as configured on kolam-clay.myshopify.com.

## Store details (Settings → General)

- Store name: **Kolam & Clay**
- Address: 14, 2nd Cross Street, Gandhi Nagar, Adyar, Chennai 600020, Tamil Nadu, India
- Store currency: **Indian rupee (INR)**, money format `₹{{amount}}`
- Time zone: **(GMT+05:30) Asia/Kolkata**. Workshop session dates and delivery estimates are calculated in this zone.
- Unit system: metric, weight in grams

## Markets and currency (Settings → Markets)

- **India** is the primary market and checkout currency.
- Shopify only charges in a local currency through Shopify Payments, which isn't available for stores based in India. The theme's currency selector therefore converts prices for display, and checkout is always charged in INR. The cart shows a note saying so whenever a currency other than INR is selected.

## Shipping (Settings → Markets → each market → Shipping)

| Market | Option | Rate |
| --- | --- | --- |
| Tamil Nadu (sub-market of India) | Standard delivery (Tamil Nadu) | ₹60, free on orders of ₹1,499 or more |
| India (rest of India) | Standard delivery | ₹120, free on orders of ₹1,499 or more |
| International markets | International shipping | ₹1,800 per order |

Workshop tickets are set to **not require shipping**, so a cart with only tickets skips the delivery step.

## Taxes (Settings → Taxes and duties → India)

- **Include tax in prices**: on. Shelf prices are GST-inclusive.
- **Charge tax on shipping rates**: on.
- Pottery (HSN 6912 / 6913): 5% GST, split as 2.5% CGST + 2.5% SGST for Tamil Nadu buyers and 5% IGST for other states.
- Workshops (services): 18% GST through a product override on the Workshops collection.
- A demo store has no GSTIN. A live store would add its registration number here.

## Payments (Settings → Payments)

- Test mode uses Shopify's **Bogus Gateway**. Card number `1` approves a payment and `2` declines it.
- Razorpay (live store): install the Razorpay app from the Shopify App Store, enter the key ID and secret from the Razorpay dashboard in the app, and use Razorpay's test keys until going live.

## Inventory

- One location: **Shop location**, Chennai.
- Regular pieces track stock and stop selling at zero.
- One-of-a-kind pieces have stock 1 and the `custom.one_of_a_kind` metafield ticked.
- Each workshop session is a variant whose stock is its seat count.

## Collection filters (Search & Discovery app)

Under **Filters**, add in this order:

1. Availability
2. Price
3. **Glaze** (variant option)
4. Product type

The theme adds glaze colour dots to the Glaze filter values automatically.

## Policies

Store policies (Settings → Policies) and the matching pages linked in the footer use the copy in [`docs/policies`](policies).

## Sharing the store

- Online Store → Preferences: keep password protection on and share the storefront password.
- Settings → Users → Security: copy the **collaborator request code** for reviewers.
