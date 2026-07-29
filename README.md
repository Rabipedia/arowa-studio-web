# Arowa Studio

A production e-commerce platform built from scratch and deployed live.

**Live site:** [arowastudio.com](https://arowastudio.com)
**Backend repo:** [arowa-studio-cms](https://github.com/Rabipedia/arowa-studio-cms)

Arowa Studio is a curated lifestyle and home goods store serving the UAE market.
This repository contains the Next.js storefront; the Strapi backend lives in a
separate repository.

<!-- Add a screenshot here: ![Arowa Studio storefront](./docs/screenshot.png) -->

---

## Architecture

A headless setup with a clear separation between presentation and commerce logic.

Browser
│
▼
Next.js 16 (Vercel) ← storefront, SSR/ISR, BFF proxy routes
│
▼
Strapi 5 (Railway) ← catalog, orders, pricing, checkout logic
│
├── PostgreSQL (Railway) ← persistent data
├── Cloudinary ← media storage and delivery
└── Stripe ← payments and webhooks


All commerce logic — pricing, order placement, inventory — lives in Strapi as
custom controllers and services. The frontend never calculates money.

---

## Tech Stack

**Frontend**
Next.js 16 (App Router, Server Components) · React 19 · TypeScript ·
Tailwind CSS v4 · React Hook Form · Zod · Stripe.js

**Backend**
Strapi 5 (headless CMS) · PostgreSQL · Stripe Node SDK · Docker (local dev)

**Infrastructure**
Vercel (frontend) · Railway (backend + database) · Cloudinary (media)

---

## Engineering Decisions

The parts of this project I'd want to talk through in a code review.

### Transactional order placement

Placing an order writes three things: the order, its line items, and an
inventory decrement on each variant. These must all succeed or all roll back —
a partial write means either overselling stock you can't fulfil, or an order
whose inventory was never reserved.

All three are wrapped in `strapi.db.transaction()`. This is also the main reason
checkout logic lives in Strapi rather than in Next.js route handlers: calling
Strapi's REST API from the frontend would make each write a separate HTTP
request with no transactional boundary.

### Server-side re-pricing

The cart stores only `{ variantId, quantity }` — never prices. Totals are
recomputed server-side from live database values at quote time and again at
order placement.

A tampered client can send any payload it likes; it cannot influence what the
customer is charged. This is also why `CartItem` deliberately carries no price
snapshot: a cart should always reflect current catalog pricing.

### Immutable order snapshots

`Order` and `OrderItem` freeze everything they reference — product name, variant
label, unit price, shipping cost, tax rate, COD fee — at the moment of purchase.

Catalog prices change. Tax rates change. An order placed last month must still
show what the customer actually agreed to pay, not today's numbers. The
relations are kept alongside the snapshots for traceability.

### Webhook-driven fulfilment

Card orders are created as `pending_payment` with **no inventory decrement**.
Stock only moves when Stripe's `payment_intent.succeeded` webhook arrives and
its signature verifies.

The browser is never the source of truth for payment. A customer can close the
tab, lose connection, or lie outright — only Stripe's server-to-server
confirmation is trusted. Cash-on-delivery orders decrement immediately, since
there is no payment gap to wait on.

Webhook signature verification requires the raw request body, which Strapi's
body parser normally discards — this needed `includeUnparsed: true` in the body
middleware config.

### Webhook idempotency

Stripe retries webhooks on timeout, on non-2xx responses, and sometimes for
redundancy. Without a guard, a retry would decrement inventory twice for one
order.

The handler checks `paymentStatus === "paid"` and returns early, making the
endpoint safe to call repeatedly with the same event.

### Guest order access via capability tokens

Guest checkout is the primary flow — forced account creation is a well-documented
cause of cart abandonment. But orders can't be publicly readable by order number
either, or anyone could enumerate them.

Each order gets an unguessable `accessToken` (UUID v4) at creation. The order URL
carries it as a query parameter, and the lookup endpoint authorises on
`orderNumber + token`. The token is a Strapi `private` field, so it never appears
in API responses.

A wrong token and a nonexistent order both return 404 — distinguishing them would
leak which order numbers exist.

### httpOnly cookie authentication

JWTs are stored in httpOnly cookies, not `localStorage`. Client-side JavaScript
cannot read them, so an XSS vulnerability can't exfiltrate a session token.

Because the client can't read the token, it also can't attach it to requests —
so authenticated calls route through Next.js route handlers acting as a
Backend-for-Frontend, reading the cookie server-side and forwarding it as a
Bearer token.

### ISR with on-demand revalidation

Catalog pages cache indefinitely (`revalidate = false`) and serve from Vercel's
CDN with zero database queries on normal traffic.

When content is published in Strapi, a webhook hits a secret-protected
revalidation endpoint which calls `revalidatePath()` on the affected routes. The
next visitor triggers one regeneration; everyone after gets the cached copy.

Content updates appear within seconds, with no redeploy and no per-request
database load — rather than choosing between stale pages and re-fetching on
every view.

### Cached aggregates via lifecycle hooks

`Product.displayPrice` is denormalised — it stores the lowest effective price
across a product's variants, maintained by a Strapi lifecycle hook that
recomputes on variant create, update, and delete (including bulk deletes).

Product listings would otherwise run an aggregate query per card. The hook keeps
the read path a simple column read. Updates target the document rather than the
row so both draft and published versions stay consistent.

---

## Features

- Product catalog with categories and multi-attribute variants
  (e.g. design × colour × size), with per-variant pricing, stock, and images
- Filtering, sorting, search, and pagination — all URL-driven, so any view is
  shareable and back-button friendly
- Cart with localStorage persistence
- Guest checkout with cash-on-delivery
- Stripe card payments with webhook-confirmed fulfilment
- Customer accounts with middleware-protected routes
- Token-secured order confirmation and lookup
- CMS-managed hero banners and navigation
- WhatsApp ordering channel for the UAE market
- Per-product SEO metadata generated server-side

---

## Local Development

Requires Node.js 22+, Docker Desktop, and a running instance of the
[backend repo](https://github.com/Rabipedia/arowa-studio-cms).

```bash
git clone https://github.com/Rabipedia/arowa-studio-web.git
cd arowa-studio-web
npm install
cp .env.example .env.local   # then fill in the values
npm run dev

Environment variables
Variable	Purpose
STRAPI_URL	Strapi base URL, server-side only
NEXT_PUBLIC_STRAPI_URL	Strapi base URL, exposed to the browser
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY	Stripe publishable key
REVALIDATE_SECRET	Shared secret for the ISR revalidation webhook

Project Structure
src/
├── app/
│   ├── api/              BFF route handlers (auth, revalidation)
│   ├── product/[slug]/   Product detail with variant selection
│   ├── shop/             Catalog with URL-state filtering
│   ├── checkout/         Checkout flow
│   ├── order/[orderNumber]/  Token-secured order lookup
│   └── account/          Middleware-protected customer area
├── components/           UI, layout, product, checkout components
├── context/              Cart and auth providers
├── lib/                  Strapi client, formatting, validation schemas
└── types/                TypeScript interfaces for the Strapi API


Known Limitations

Deliberate trade-offs made to ship, with planned fixes:

Orders are not yet linked to authenticated accounts. Order.customer is
currently always null. The fix is to derive the customer id from a verified
JWT server-side rather than accepting it from the request body.
Monetary values are stored as floats. Integer minor units (fils) would be
correct; the current approach is acceptable at AED precision and current
volume but should be migrated.
The cart is localStorage-only. Server-side Cart/CartItem tables exist
in the schema but are not wired up, so carts don't sync across devices.
No automated test suite yet. Payment and checkout paths were verified
manually end-to-end in production.
Webhook integrity checks are partial. Signature verification is in place;
cross-checking the charged amount against the order total is not yet.