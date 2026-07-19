# GlossUp — Integration & Fulfillment Guide

Everything you need to set up the full GlossUp commerce stack: Shopify as the product and order layer, Fez Delivery as the logistics layer, and the complete order fulfillment flow that ties them together. The frontend (Next.js) stays exactly as built — this guide covers what to do in each system and what the code layer will look like once we wire it up.

---

## Contents

- [1. Prerequisites](#1-prerequisites)
- [2. Get Your Storefront API Token](#2-get-your-storefront-api-token)
- [3. Store Settings](#3-store-settings)
- [4. Collections (Categories)](#4-collections-categories)
- [5. Metafield Definitions](#5-metafield-definitions-one-time-setup)
  - [5.1 Rating](#51-rating)
  - [5.2 Review Count](#52-review-count)
  - [5.3 Benefits](#53-benefits)
  - [5.4 Core Ingredients](#54-core-ingredients)
  - [5.5 All Ingredients](#55-all-ingredients)
  - [5.6 How to Use](#56-how-to-use)
  - [5.7 FAQs](#57-faqs)
- [6. Creating Products](#6-creating-products)
- [7. Summary: All Fields Per Product](#7-summary-all-fields-per-product)
- [8. Customer Reviews — Judge.me](#8-customer-reviews--judgeme)
- [9. What Changes in the Codebase](#9-what-changes-in-the-codebase)
- [10. Code Layer Overview](#10-code-layer-overview-for-reference)
- [11. Environment Variables](#11-environment-variables)
- [12. About Fez Delivery](#12-about-fez-delivery)
- [13. Fez — Account Setup](#13-fez--account-setup)
- [14. Order Fulfillment Flow](#14-order-fulfillment-flow)
  - [Stage 1 — Customer places order](#stage-1--customer-places-order)
  - [Stage 2 — Team is notified](#stage-2--team-is-notified)
  - [Stage 3 — Team packs the order](#stage-3--team-packs-the-order)
  - [Stage 4 — Team creates shipment](#stage-4--team-creates-shipment-one-action)
  - [Stage 5 — Fez picks up and ships](#stage-5--fez-picks-up-and-ships)
  - [Stage 6 — Customer tracks their order](#stage-6--customer-tracks-their-order)
  - [Stage 7 — Delivery and auto-update](#stage-7--delivery-and-auto-update)
- [15. Fez API Reference](#15-fez-api-reference)
- [16. Fez Delivery Rates](#16-fez-delivery-rates)
- [17. Error Handling](#17-error-handling)
- [18. Admin Dashboard — Order Management Views](#18-admin-dashboard--order-management-views)
- [19. All API Endpoints Involved](#19-all-api-endpoints-involved)

---

## 1. Prerequisites

- A Shopify store at `glossup-dev.myshopify.com` (already referenced in `.env.local`)
- Access to Shopify Admin
- The following already installed in the codebase:
  - `@shopify/storefront-api-client` — for querying products, collections, and cart
  - `@tanstack/react-query` — for data fetching and caching
  - `.env.local` already has the right variable names

---

## 2. Get Your Storefront API Token

This is the one credential that unlocks everything.

1. Go to **Shopify Admin → Settings → Apps and sales channels → Develop apps**
2. Click **Create an app** → name it `GlossUp Storefront`
3. Click **Configure Storefront API scopes** and enable:
   - `unauthenticated_read_product_listings` — Product and Collection objects
   - `unauthenticated_read_product_inventory` — variant `quantityAvailable` field
   - `unauthenticated_read_checkouts` + `unauthenticated_write_checkouts` — Cart object
   - `unauthenticated_read_customers` + `unauthenticated_write_customers` — Customer object
   - `unauthenticated_read_content` — pages, blogs, articles
   - `unauthenticated_read_metaobjects` — metafields and metaobjects
4. Click **Save → Install app → Reveal token once**
5. Copy the token and paste it into `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=glossup-dev.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-token-here
```

> The token is shown only once. Save it somewhere safe.

---

## 3. Store Settings

Before creating products, configure the store basics.

### Currency

Settings → General → Store currency → Set to **Nigerian Naira (NGN ₦)**

### Shipping zones

Settings → Shipping and delivery → add Nigeria as your shipping zone. Delivery rates will be added here later.

---

## 4. Collections (Categories)

Collections in Shopify are the equivalent of your product categories. Create these first so you can assign products to them as you go.

Go to **Products → Collections → Create collection**. Create one for each:

| Collection title | Handle (auto-generated) | Condition |
| ---------------- | ----------------------- | --------- |
| Skincare         | `skincare`              | Manual    |
| Body Care        | `body-care`             | Manual    |
| Targeted Care    | `targeted-care`         | Manual    |
| Soap             | `soap`                  | Manual    |
| Fragrance        | `fragrance`             | Manual    |
| Essential Oils   | `essential-oils`        | Manual    |

Set each collection type to **Manual** so you control which products appear in each.

---

## 5. Metafield Definitions (One-Time Setup)

Metafields are custom fields that store per-product data that Shopify doesn't have natively — things like benefits, ingredients, FAQs, and ratings.

> **Note:** Shopify ships pre-built standard metafield definitions for common fields (ISBN, ingredients, care instructions, etc.) under **Settings → Custom data → Standard definitions**. You can use those instead of creating a custom definition for any field they already cover — they behave identically.

Go to **Settings → Custom data → Products → Add definition** and create the following:

### 5.1 Rating

| Field             | Value                            |
| ----------------- | -------------------------------- |
| Name              | Rating                           |
| Namespace and key | `custom.rating`                  |
| Type              | Decimal number                   |
| Description       | Aggregate star rating (e.g. 4.2) |

### 5.2 Review Count

| Field             | Value                                         |
| ----------------- | --------------------------------------------- |
| Name              | Review Count                                  |
| Namespace and key | `custom.review_count`                         |
| Type              | Single line text                              |
| Description       | Display string for review count (e.g. "1.4k") |

> Note: Once Judge.me is installed (see Section 8), it syncs the aggregate rating back to `custom.rating` automatically. You won't need to fill this in manually per product.

### 5.3 Benefits

| Field             | Value                                                   |
| ----------------- | ------------------------------------------------------- |
| Name              | Benefits                                                |
| Namespace and key | `custom.benefits`                                       |
| Type              | JSON                                                    |
| Description       | Array of benefit strings shown in the product accordion |

Example value:

```json
[
  "Gently cleanses skin",
  "Deeply nourishes and hydrates",
  "Enriched with natural moisturizers",
  "Infused with botanical extracts",
  "Leaves skin soft and smooth",
  "Provides a refreshed feeling all day long"
]
```

### 5.4 Core Ingredients

| Field             | Value                                                         |
| ----------------- | ------------------------------------------------------------- |
| Name              | Core Ingredients                                              |
| Namespace and key | `custom.core_ingredients`                                     |
| Type              | JSON                                                          |
| Description       | Array of {percent, name} objects shown as the ingredient grid |

Example value:

```json
[
  { "percent": "3.5%", "name": "Niacinamide" },
  { "percent": "2.0%", "name": "Hyaluronic Acid" },
  { "percent": "1.5%", "name": "Alpha Arbutin" },
  { "percent": "2.5%", "name": "Vitamin C" },
  { "percent": "2.2%", "name": "Zinc PCA" },
  { "percent": "5.0%", "name": "Coenzyme Q10" }
]
```

### 5.5 All Ingredients

| Field             | Value                                                |
| ----------------- | ---------------------------------------------------- |
| Name              | All Ingredients                                      |
| Namespace and key | `custom.all_ingredients`                             |
| Type              | Multi-line text                                      |
| Description       | Full ingredient list shown in the expandable section |

Example value:

```text
Niacinamide • Hyaluronic Acid • Alpha Arbutin • Vitamin C • Zinc PCA • Coenzyme Q10 • Retinol • Ceramides • Glycerin • Aloe Vera • Peptides • Squalane
```

### 5.6 How to Use

| Field             | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| Name              | How to Use                                                   |
| Namespace and key | `custom.how_to_use`                                          |
| Type              | JSON                                                         |
| Description       | Array of {num, text} steps shown in the How to Use accordion |

Example value:

```json
[
  { "num": "01", "text": "Wet your face with warm water to prepare your skin for cleansing." },
  {
    "num": "02",
    "text": "Apply a small amount to your skin, massaging gently in circular motions."
  },
  {
    "num": "03",
    "text": "Work the cleanser into a rich lather, focusing on areas that need extra nourishment."
  },
  { "num": "04", "text": "Rinse thoroughly with lukewarm water until all residue is removed." },
  {
    "num": "05",
    "text": "Pat dry with a clean towel to help your skin retain its natural moisture."
  },
  {
    "num": "06",
    "text": "Follow up with your favorite moisturizer to lock in hydration and softness."
  }
]
```

### 5.7 FAQs

| Field             | Value                                              |
| ----------------- | -------------------------------------------------- |
| Name              | FAQs                                               |
| Namespace and key | `custom.faqs`                                      |
| Type              | JSON                                               |
| Description       | Array of {q, a} objects shown in the FAQ accordion |

Example value:

```json
[
  {
    "q": "Are your products suitable for all skin types?",
    "a": "Yes! The Wash is formulated to be gentle enough for all skin types, including sensitive skin.",
    "defaultOpen": true
  },
  {
    "q": "What ingredients are in your formulas?",
    "a": "Our formulas are built around proven actives: Niacinamide (3.5%) for brightening and pore refinement, Hyaluronic Acid (2.0%) for deep hydration.",
    "defaultOpen": false
  },
  {
    "q": "How do I choose the right product for my skin?",
    "a": "Start with your main concern. If you want to address uneven tone or dullness, reach for The Wash.",
    "defaultOpen": false
  }
]
```

---

## 6. Creating Products

Go to **Products → Add product**. Repeat for each product.

### Fields to fill in per product

#### Title

The product name. Examples: `The Wash`, `The Scrub`, `The Cream`, `Gloss Up Hand Cream`

#### Description

Short product description. Examples:

- The Wash → `Gentle & hydrating body wash`
- The Scrub → `Exfoliating body scrub`
- The Cream → `Rich body cream`
- Gloss Up Hand Cream → `Nourishing hand cream`

#### Media

Upload the product images. The main image goes first — it becomes `product.featuredImage` in the API. Additional images form the gallery shown in the lightbox. Upload in the order you want them displayed.

#### Pricing

| Field            | Value   |
| ---------------- | ------- |
| Price            | `22900` |
| Compare-at price | `54300` |

> Enter numbers only. Shopify uses the store currency (NGN) set in Section 3.

#### Inventory

Set a stock quantity or check **Track quantity** depending on whether you want to manage stock.

#### Variants — Sizes

Under **Variants**, click **Add options like size or color**:

- Option name: `Size`
- Option values: `25ml`, `50ml`, `75ml`

Shopify creates 3 variants automatically. You can give each variant the same price or different prices per size.

#### Search engine listing (handle)

Scroll to the bottom, click **Edit website SEO**, and set the handle manually:

| Product             | Handle                |
| ------------------- | --------------------- |
| The Wash            | `the-wash`            |
| The Scrub           | `the-scrub`           |
| The Cream           | `the-cream`           |
| Gloss Up Hand Cream | `gloss-up-hand-cream` |

The handle becomes the URL: `/products/the-wash`. This must match the slugs used in the frontend routes.

#### Product type

`Skincare`, `Body Care`, etc. Used for filtering.

#### Collections

Assign each product to the relevant collection(s) from the right-hand sidebar.

#### Metafields

Scroll to the bottom of the product page — after defining them in Section 5, all 7 metafields appear here as input fields. Fill in the JSON values and text for each product.

---

## 7. Summary: All Fields Per Product

Here's the complete checklist for each product entry:

- [ ] Title
- [ ] Description
- [ ] Images (main + gallery)
- [ ] Price → `22900`
- [ ] Compare-at price → `54300`
- [ ] Variants: Size → `25ml`, `50ml`, `75ml`
- [ ] Handle (SEO) → e.g. `the-wash`
- [ ] Collection(s) assigned
- [ ] Metafield: `custom.rating`
- [ ] Metafield: `custom.review_count`
- [ ] Metafield: `custom.benefits` (JSON)
- [ ] Metafield: `custom.core_ingredients` (JSON)
- [ ] Metafield: `custom.all_ingredients` (text)
- [ ] Metafield: `custom.how_to_use` (JSON)
- [ ] Metafield: `custom.faqs` (JSON)

---

## 8. Customer Reviews — Judge.me

Shopify doesn't have a native review submission system. Judge.me handles the full reviews lifecycle.

### Install

1. Go to **Shopify Admin → Apps → Search "Judge.me"**
2. Install **Judge.me Product Reviews** (free plan)
3. Follow the onboarding — it connects to your store automatically

### What it does automatically

- Sends a post-purchase email to every customer with a "Leave a review" link
- Hosts the review submission form (customer never needs to come back to your site to submit)
- Stores star ratings and written reviews
- Syncs the aggregate rating back to Shopify as a metafield (maps to `custom.rating`)

### What we do on the frontend

- Query Judge.me's API (or Shopify metafields) to get the review list per product
- Feed the data into the existing `ProductReviews` component
- The star rating in the product info panel comes from the synced `custom.rating` metafield

---

## 9. What Changes in the Codebase

Once Shopify is configured, here is what gets replaced in the frontend:

| Current                                 | Replaced with                                                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/products.json`                | Shopify Storefront API queries                                                                                                         |
| Hardcoded `SIZES` array in components   | Variant options from Shopify (`product.options`)                                                                                       |
| Hardcoded content in `ProductFeatures`  | Metafield values per product                                                                                                           |
| Zustand cart store (client-only)        | Shopify Cart API (persistent, survives refresh)                                                                                        |
| `/checkout/success` mock page           | Shopify-hosted checkout URL (`cart.checkoutUrl`) — the old Checkout API was fully shut down April 1, 2025; Cart API is the only option |
| Static `rating` / `reviewCount` in JSON | Metafields (synced by Judge.me)                                                                                                        |

Everything else — every component, every animation, the mobile layout, the lightbox, the cart drawer UI — stays exactly as is. Only the data layer changes.

---

## 10. Code Layer Overview (for reference)

Once setup is complete, the integration follows this structure:

```text
src/
  lib/
    shopify.ts          ← Storefront API client (singleton)
    fez.ts              ← Fez Delivery API client (singleton)
  queries/
    products.ts         ← getProducts, getProductByHandle
    collections.ts      ← getCollections, getCollectionByHandle
    cart.ts             ← cartCreate, cartLinesAdd, cartLinesUpdate, cartLinesRemove
  hooks/
    use-products.ts     ← React Query wrappers around the queries
    use-cart.ts         ← cart mutations + state
  app/
    api/
      shopify/
        webhook/route.ts  ← receives orders/create from Shopify
      fez/
        webhook/route.ts  ← receives shipment.delivered from Fez
```

The Shopify client is initialised once:

```ts
// src/lib/shopify.ts
import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const shopify = createStorefrontApiClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  apiVersion: "2026-04",
  publicAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!,
});
```

All product pages become dynamic routes that fetch from Shopify instead of reading from `products.json`. Collections map directly to the existing category filter on the shop page.

---

## 11. Environment Variables

`.env.local` — fill in the real values after completing Section 2:

```env
# Shopify Storefront (public — safe to expose to browser)
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=glossup-dev.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your-storefront-token-here

# Shopify Admin API (server-only — never expose to browser)
SHOPIFY_STORE_DOMAIN=glossup-dev.myshopify.com
SHOPIFY_ADMIN_API_KEY=your-admin-api-key-here
SHOPIFY_ADMIN_API_VERSION=2026-04

# Fez Delivery API (server-only — never expose to browser)
FEZ_API_KEY=your-fez-api-key-here
FEZ_API_BASE_URL=https://apisandbox.fezdelivery.co/v1
FEZ_WEBHOOK_SECRET=your-fez-webhook-secret-here
```

> `NEXT_PUBLIC_*` variables are safe to expose to the browser. The Admin API key, Fez API key, and webhook secrets must never be used in client-side code. Replace `FEZ_API_BASE_URL` with the production URL once Fez approves your business account.

---

## 12. About Fez Delivery

Fez Delivery is the logistics partner handling all GlossUp domestic shipments. They are a tech-driven Nigerian logistics company with nationwide coverage.

| Stat                        | Value                          |
| --------------------------- | ------------------------------ |
| Orders completed            | 1,938,000+                     |
| Business customers          | 27,000+                        |
| First-attempt delivery rate | 92%                            |
| Coverage                    | All 36 Nigerian states         |
| Intrastate delivery         | Next business day after pickup |
| Interstate delivery         | 2–5 business days after pickup |

Services relevant to GlossUp: local doorstep delivery, real-time tracking, same-day options in Lagos, and a Shipping API with webhooks.

**Fez contact (for onboarding and account setup):**

- Website: [www.fezdelivery.co](https://www.fezdelivery.co)
- Email: [josiah@fezdelivery.co](mailto:josiah@fezdelivery.co)
- Phone / WhatsApp: 07010431828

---

## 13. Fez — Account Setup

1. Register a business account at [businessportal.fezdelivery.co](https://businessportal.fezdelivery.co/)
2. Complete onboarding and KYC
3. Go to **Developers → Manage Keys** and generate your API key
4. Store the key in `.env.local` (see Section 11)

> During development use the sandbox base URL: `https://apisandbox.fezdelivery.co/v1`. Fez will provide the production URL after account approval.

---

## 14. Order Fulfillment Flow

The complete lifecycle of a GlossUp order — from payment to doorstep.

### Systems involved

| System                  | Role                                                            |
| ----------------------- | --------------------------------------------------------------- |
| GlossUp Storefront      | Customer-facing Next.js shopping experience                     |
| Shopify                 | Order management, payment orchestration, customer notifications |
| Paystack                | Payment processing (via Shopify's Paystack plugin)              |
| Fez Delivery            | Logistics — shipment creation, pickup, delivery, tracking       |
| GlossUp Admin Dashboard | Internal tool for the team to manage and fulfill orders         |

### Stage 1 — Customer places order

Customer browses, adds to cart, proceeds to Shopify-hosted checkout, and pays via Paystack.

Behind the scenes:

- Paystack processes the payment and notifies Shopify
- Shopify creates the order with status **Unfulfilled**
- Shopify sends the customer an **order confirmation email** automatically

### Stage 2 — Team is notified

- Shopify notifies the team via admin email
- The new order appears in the GlossUp Admin Dashboard via the `orders/create` Shopify webhook
- Team sees: order number, customer name and address, items, variants, payment status

### Stage 3 — Team packs the order

Team reviews the order, physically picks and packs the items, and notes the package weight. No API calls at this stage.

### Stage 4 — Team creates shipment (one action)

Team opens the order on the Admin Dashboard, clicks **Create Shipment**, enters the package weight, and confirms. This triggers two automated API calls in sequence:

#### Step A — Create shipment on Fez

```json
POST /v1/shipments

{
  "pickup_address": "store address",
  "delivery_address": "customer delivery address from Shopify order",
  "package_weight": 0.5,
  "recipient_name": "customer name",
  "recipient_phone": "customer phone",
  "order_reference": "#1001"
}

Response:
{
  "tracking_number": "FEZ-XXXXXXXX",
  "estimated_delivery": "2026-07-22",
  "status": "shipment_created"
}
```

#### Step B — Mark order as fulfilled on Shopify

```json
POST /admin/api/2026-04/orders/{id}/fulfillments.json

{
  "tracking_number": "FEZ-XXXXXXXX",
  "tracking_company": "Fez Delivery",
  "tracking_url": "https://fezdelivery.co/track/FEZ-XXXXXXXX",
  "notify_customer": true
}
```

Shopify automatically sends the customer a **shipping confirmation email** with the tracking number and link to track.

Order status is now: **Fulfilled**

### Stage 5 — Fez picks up and ships

Fez dispatches a rider to collect from the store. The package moves through their network with status updates at each checkpoint.

| Status             | Description                              |
| ------------------ | ---------------------------------------- |
| `shipment_created` | Shipment booked, awaiting pickup         |
| `picked_up`        | Package collected from store             |
| `in_transit`       | Package moving through Fez network       |
| `at_hub`           | Package at a Fez sorting hub             |
| `out_for_delivery` | Rider on the way to customer             |
| `delivered`        | Package handed to customer               |
| `failed_delivery`  | Delivery attempted, customer unavailable |

### Stage 6 — Customer tracks their order

The customer can track via the link in the shipping email, or by going to `/track-order` on the storefront and entering their order number and email.

Behind the scenes:

1. Next.js server action receives order number + email
2. Calls Shopify Admin API to fetch fulfillment details (including Fez tracking number)
3. Calls Fez API: `GET /track/{tracking_number}`
4. Returns: current status, checkpoints, estimated delivery
5. Renders a branded tracking timeline on the page

Fallback: if Fez API is unavailable, show the last known Shopify fulfillment status and a direct link to `fezdelivery.co/track/{tracking_number}`.

### Stage 7 — Delivery and auto-update

When Fez delivers, they fire a webhook to `/api/fez/webhook`:

```json
{
  "event": "shipment.delivered",
  "tracking_number": "FEZ-XXXXXXXX",
  "delivered_at": "2026-07-22T14:30:00Z",
  "recipient": "Customer Name"
}
```

Your app receives this, validates the webhook signature, and logs the delivery on the Shopify order. No manual action from the team required.

### Summary

| Stage                                     | Actor                       | Type                |
| ----------------------------------------- | --------------------------- | ------------------- |
| Place order & pay                         | Customer                    | Manual              |
| Order confirmation email                  | Shopify                     | Automatic           |
| Order appears in admin dashboard          | Shopify webhook → Dashboard | Automatic           |
| Pack the order                            | Team                        | Manual              |
| Create shipment (one click)               | Team via Admin Dashboard    | Manual — one action |
| Call Fez API to create shipment           | App                         | Automatic           |
| Call Shopify to fulfill + attach tracking | App                         | Automatic           |
| Shipping confirmation email to customer   | Shopify                     | Automatic           |
| Pickup & transit updates                  | Fez                         | Automatic           |
| Customer tracks order                     | Customer via storefront     | Self-serve          |
| Physical delivery                         | Fez rider                   | Physical            |
| Mark as delivered in Shopify              | Fez webhook → App           | Automatic           |

---

## 15. Fez API Reference

### Authentication

All requests require the API key in the header:

```text
Authorization: Bearer YOUR_FEZ_API_KEY
Content-Type: application/json
```

### Endpoints

| Method | Endpoint                   | Purpose                                    |
| ------ | -------------------------- | ------------------------------------------ |
| `POST` | `/shipments`               | Create a shipment, returns tracking number |
| `GET`  | `/track/{tracking_number}` | Get live tracking status and checkpoints   |

### Create Shipment — Response

```json
{
  "tracking_number": "FEZ-12345678",
  "estimated_delivery": "2026-07-22",
  "status": "shipment_created"
}
```

### Track Shipment — Response

```json
{
  "tracking_number": "FEZ-12345678",
  "status": "in_transit",
  "estimated_delivery": "2026-07-22",
  "checkpoints": [
    { "status": "shipment_created", "timestamp": "2026-07-19T14:00:00Z", "location": "Lagos" },
    { "status": "picked_up", "timestamp": "2026-07-20T10:30:00Z", "location": "Lagos" },
    { "status": "in_transit", "timestamp": "2026-07-20T14:00:00Z", "location": "Ibadan" }
  ]
}
```

> The exact request/response shapes above are based on the designed fulfillment flow. Confirm field names against the full Fez API docs during onboarding — available at: [fez-delivery-co.gitbook.io/fezcorporate-api-docs](https://fez-delivery-co.gitbook.io/fezcorporate-api-docs)

---

## 16. Fez Delivery Rates

All rates are **VAT-inclusive**. Base weight covers packages from **0.5 kg to 4 kg**. Heavier packages attract an additional per-kilogram surcharge.

| Route type                     | Additional KG rate |
| ------------------------------ | ------------------ |
| Intrastate (within same state) | ₦800/kg            |
| Interstate (between states)    | ₦1,000/kg          |

### Lagos rates

Since GlossUp ships from Lagos, these are the primary rates:

| Destination                                           | VAT-Inclusive Rate |
| ----------------------------------------------------- | ------------------ |
| Within Lagos                                          | ₦2,700             |
| South-West (Ekiti, Ondo, Osun, Oyo, Ogun)             | ₦4,569             |
| South-East (Enugu, Anambra, Imo, Abia, Ebonyi)        | ₦5,644             |
| South-South (Rivers, Delta, Edo, Bayelsa)             | ₦5,644             |
| South-South (Akwa-Ibom, Cross River)                  | ₦6,719             |
| North-Central (Kwara)                                 | ₦5,644             |
| North-Central (Abuja)                                 | ₦6,181             |
| North-Central (Niger, Benue, Kogi, Nasarawa, Plateau) | ₦6,450             |
| North-West (all 7 states)                             | ₦6,450             |
| North-East (all 6 states)                             | ₦6,450             |

> The full rate sheet (`Local Rates.pdf`) covers rates from all hub cities — Abuja, Port-Harcourt, Ibadan, Ogun, Ekiti/Ondo/Osun, Delta, Edo, and Enugu — to all 36 states.

---

## 17. Error Handling

| Scenario                                                  | Behaviour                                                                                 |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Fez API fails during shipment creation                    | Error shown on admin dashboard; order stays Unfulfilled; team can retry                   |
| Shopify fulfillment call fails after Fez shipment created | Log the Fez tracking number; surface a retry button on the dashboard                      |
| Fez tracking API unavailable on `/track-order`            | Show last known Shopify fulfillment status + deep-link to `fezdelivery.co/track/{number}` |
| Fez delivery webhook not received                         | Order stays as Fulfilled in Shopify — team can manually mark as delivered from dashboard  |
| Customer enters wrong order number or email               | Show "Order not found" error state on the tracking page                                   |

---

## 18. Admin Dashboard — Order Management Views

The GlossUp Admin Dashboard (separate build) needs the following order-related views to support this flow:

- **Orders List** — all orders, filterable by status (Unfulfilled, Fulfilled, Delivered)
- **Order Detail** — full order info, customer, items, payment status
- **Create Shipment** — form to enter package weight and trigger the Fez + Shopify API calls
- **Shipment Status** — live Fez tracking status per order
- **Retry Fulfillment** — button to retry failed Shopify or Fez API calls

---

## 19. All API Endpoints Involved

| API               | Endpoint                                    | Purpose                                     |
| ----------------- | ------------------------------------------- | ------------------------------------------- |
| Shopify Admin API | `GET /orders.json`                          | Fetch orders for admin dashboard            |
| Shopify Admin API | `POST /orders/{id}/fulfillments.json`       | Mark order fulfilled + attach tracking      |
| Shopify Admin API | `GET /orders.json?name={num}&email={email}` | Look up order for `/track-order` page       |
| Shopify Webhook   | `POST /api/shopify/webhook`                 | Receive `orders/create` event from Shopify  |
| Fez API           | `POST /shipments`                           | Create shipment, returns tracking number    |
| Fez API           | `GET /track/{tracking_number}`              | Get live tracking status and checkpoints    |
| Fez Webhook       | `POST /api/fez/webhook`                     | Receive `shipment.delivered` event from Fez |
