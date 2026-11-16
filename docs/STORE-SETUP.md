# Store setup checklist

Settings that live in Shopify admin rather than in the theme. Tick them off in order.

## 1. Store details (Settings → General)

- Store name: **Kolam & Clay**
- Store address: 14, 2nd Cross Street, Gandhi Nagar, Adyar, Chennai 600020, Tamil Nadu, India
- Store currency: **Indian rupee (INR)** (change this before any test order)
- Time zone: **(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi**
- Unit system: Metric, weight in grams

## 2. Taxes (Settings → Taxes and duties)

- Turn on **Include tax in prices**, so ₹ prices on the site are GST-inclusive.
- India: add the GST registration number if you have one. The fictional brand can leave it blank.

## 3. Payments (Settings → Payments)

- Development store: activate **Bogus Gateway** (or Shopify Payments in test mode).
- Test card for the Bogus Gateway: name `Bogus Gateway`, card number `1` for a successful payment.

## 4. Markets (Settings → Markets)

- **India**: primary market, INR.
- **UAE**: international market with **local currency AED**, prices rounded.

## 5. Shipping (Settings → Shipping and delivery → General shipping rates)

| Zone | Rate | Condition |
| --- | --- | --- |
| Tamil Nadu | ₹79 | Orders under ₹1,499 |
| Tamil Nadu | Free | Orders ₹1,499 and above |
| Rest of India | ₹149 | Orders under ₹1,499 |
| Rest of India | Free | Orders ₹1,499 and above |
| International (UAE, US) | ₹1,200 (shown in local currency) | All orders |

Workshop tickets are set to **not require shipping**, so a cart with only tickets skips the delivery step.

## 6. Collection filters (Search & Discovery app, free, by Shopify)

Install **Shopify Search & Discovery**, then under Filters add, in this order:
1. Availability
2. Price
3. **Glaze** (variant option)
4. Product type (labelled "Collections")

The theme shows glaze colour dots next to the Glaze filter values automatically.

## 7. Policies (Settings → Policies)

Paste these in. The footer links to them.

### Shipping policy

> **Where we ship.** We ship across India and to the United Arab Emirates and the United States. Every piece is packed by hand in paper and corrugated card, with no plastic.
>
> **Rates and delivery times.** Tamil Nadu: ₹79, 2–4 working days. Rest of India: ₹149, 4–7 working days. Free shipping in India on orders of ₹1,499 or more. UAE and US: a flat international rate shown at checkout in your local currency, 7–12 working days; import duties, if any, are paid by the receiver. Orders leave the studio within 2 working days and you'll get a tracking link by email.
>
> **Workshops.** Workshop tickets are not shipped. Your booking confirmation has the studio address, date and time.
>
> **Breakages.** If anything arrives broken, email a photo of the piece and the box to hello@kolamandclay.in within 48 hours of delivery and we'll send a replacement or a full refund.

### Refund policy

> **Returns.** You can return unused pieces within 7 days of delivery. Write to hello@kolamandclay.in with your order number and we'll arrange a pickup within India. For international orders, return shipping is paid by the buyer. Refunds go back to your original payment method within 5–7 working days of the piece reaching the studio.
>
> **Not returnable.** One-of-a-kind pieces, gift sets with a personal note, and pieces that have been used.
>
> **Breakages.** Send a photo within 48 hours of delivery and we'll replace the piece or refund you in full. You don't need to send it back.
>
> **Workshops.** Seats can be moved to another date up to 48 hours before your session. Within 48 hours we can't refund or move the seat, but you can send a friend in your place.

### Privacy policy

> Kolam & Clay collects only the information needed to process your order or workshop booking: your name, email, phone number and delivery address. Payments are handled by our payment providers; we never see or store your card details. We use your email to send order updates, and only send our newsletter if you sign up for it. We don't sell or share your details with anyone except the courier delivering your parcel. To see or delete the information we hold about you, write to hello@kolamandclay.in.

### Terms of service

> These terms apply to purchases from Kolam & Clay, 14, 2nd Cross Street, Gandhi Nagar, Adyar, Chennai 600020, India.
>
> **Handmade pieces.** Every piece is thrown and glazed by hand, so size, colour and pattern vary slightly from the photographs. These variations are part of the craft and not defects.
>
> **Prices.** Prices in India are in rupees and include GST. International prices are shown in your local currency and exclude import duties.
>
> **Workshops.** A workshop ticket reserves one seat for one person on the date and time chosen. Participants under 16 must be accompanied by an adult.
>
> **Governing law.** These terms are governed by the laws of India, and any disputes are subject to the courts of Chennai.

### Contact information

> Kolam & Clay, 14, 2nd Cross Street, Gandhi Nagar, Adyar, Chennai 600020, Tamil Nadu, India. Email hello@kolamandclay.in. Phone +91 98400 00000.

## 8. Before submitting

- Online Store → Preferences: set the homepage title and meta description, and keep the password page on with a password you'll share.
- Publish the **Dawn** theme (Online Store → Themes → Dawn → Publish).
- Settings → Users and permissions: copy the **collaborator request code**.
