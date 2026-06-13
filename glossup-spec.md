# GlossUp — Technical Specification

> Cosmetics E-Commerce Storefront | Version 1.0 | Confidential

---

## 1. Project Overview

GlossUp is a Nigerian cosmetics e-commerce brand delivering a premium shopping experience through a Next.js storefront backed by Shopify. The platform targets customers across Nigeria, initially focusing on Lagos and Abuja.

### 1.1 Team

| Role              | Responsibilities                                     |
| ----------------- | ---------------------------------------------------- |
| Product Manager   | Roadmap, requirements, stakeholder management        |
| Brand Designer    | Visual identity, brand guidelines, assets            |
| UI/UX Designer    | Wireframes, component designs, design system         |
| Frontend Engineer | Next.js development, Shopify integration, deployment |

### 1.2 MVP Scope

- Landing page (homepage)
- Product listing & product detail page
- Cart & checkout (Shopify-powered)
- Order tracking page

### 1.3 Tech Stack

| Layer          | Technology             | Purpose                                       |
| -------------- | ---------------------- | --------------------------------------------- |
| Frontend       | Next.js (App Router)   | Storefront UI & routing                       |
| Language       | TypeScript             | Type safety across the codebase               |
| Styling        | Tailwind CSS           | Utility-first styling                         |
| Components     | shadcn/ui              | Accessible UI primitives                      |
| Animation      | Framer Motion          | Page transitions & micro-interactions         |
| State          | Zustand                | Client-side cart state management             |
| Data Fetching  | TanStack Query         | Server state, caching, order tracking polling |
| Forms          | React Hook Form + Zod  | Form handling & validation                    |
| E-Commerce     | Shopify Storefront API | Products, orders, fulfillment                 |
| Payments       | Paystack (via Shopify) | Nigerian payment processing                   |
| Logistics      | GIG Logistics API      | Order tracking & fulfillment                  |
| Deployment     | Vercel                 | Hosting & preview deployments                 |
| Env Validation | @t3-oss/env-nextjs     | Type-safe environment variables               |

---

## 2. Repository & Project Setup

### 2.1 Repository

- **Repo name:** `glossup-web`
- **Platform:** GitHub (personal account)
- **Visibility:** Private
- **Default branch:** `main` (protected)

### 2.2 Branch Strategy

| Branch      | Purpose               | Rules                                                 |
| ----------- | --------------------- | ----------------------------------------------------- |
| `main`      | Production            | Protected — PRs from `dev` only, all checks must pass |
| `dev`       | Staging / integration | Protected — all feature PRs merge here first          |
| `feature/*` | New features          | Branch off `dev`, PR back to `dev`                    |
| `fix/*`     | Bug fixes             | Branch off `dev`, PR back to `dev`                    |
| `chore/*`   | Config & tooling      | Branch off `dev`, PR back to `dev`                    |

### 2.3 Commit Convention

All commits must follow [Conventional Commits](https://www.conventionalcommits.org/) format, enforced via Commitlint + Husky:

```text
feat: add order tracking page
fix: resolve cart quantity update bug
chore: configure ESLint rules
refactor: extract product card into reusable component
style: update button hover states
docs: update README with setup instructions
```

### 2.4 CI/CD Pipeline

**GitHub Actions — runs on every push and PR:**

- ESLint lint check
- TypeScript type check (`tsc --noEmit`)
- Prettier format check
- Build verification (`pnpm build`)

**Vercel Integration:**

- Push to `dev` → Vercel staging preview deployment
- Merge to `main` → Vercel production deployment
- Every PR → Vercel preview URL generated automatically

---

## 3. Tooling & Configuration

### 3.1 Dependencies

| Package                                               | Type | Purpose                                          |
| ----------------------------------------------------- | ---- | ------------------------------------------------ |
| `husky`                                               | Dev  | Git hooks management                             |
| `lint-staged`                                         | Dev  | Run linters on staged files only                 |
| `@commitlint/cli` + `@commitlint/config-conventional` | Dev  | Enforce conventional commit messages             |
| `eslint`                                              | Dev  | Code linting (extended from Next.js defaults)    |
| `prettier`                                            | Dev  | Code formatting                                  |
| `framer-motion`                                       | Prod | Animations & page transitions                    |
| `@shadcn/ui`                                          | Prod | Accessible component primitives (Radix UI based) |
| `zustand`                                             | Prod | Lightweight cart state management                |
| `@tanstack/react-query`                               | Prod | Server state, caching, polling                   |
| `react-hook-form`                                     | Prod | Performant form handling                         |
| `zod`                                                 | Prod | Schema validation (forms + env)                  |
| `@shopify/storefront-api-client`                      | Prod | Shopify Storefront API SDK                       |
| `@t3-oss/env-nextjs`                                  | Prod | Type-safe environment variable validation        |
| `clsx`                                                | Prod | Conditional class merging                        |
| `tailwind-merge`                                      | Prod | Tailwind class conflict resolution               |
| `date-fns`                                            | Prod | Date formatting for orders & delivery estimates  |
| `nuqs`                                                | Prod | URL search param state management                |
| `next-sitemap`                                        | Dev  | Auto-generate sitemap.xml for SEO                |
| `@sentry/nextjs`                                      | Prod | Error tracking & monitoring                      |

### 3.2 Husky Hooks

**`pre-commit`**

- lint-staged runs Prettier + ESLint on all staged `.ts` / `.tsx` files

**`commit-msg`**

- Commitlint validates message against conventional commits spec

### 3.3 Environment Variables

All env vars are validated at build time using `@t3-oss/env-nextjs`. The app will **fail to build** if any required variable is missing — catching issues before they hit production.

| Variable                               | Scope  | Description                                     |
| -------------------------------------- | ------ | ----------------------------------------------- |
| `SHOPIFY_STORE_DOMAIN`                 | Server | Shopify store domain (`*.myshopify.com`)        |
| `SHOPIFY_ADMIN_API_KEY`                | Server | Shopify Admin API key (used for order tracking) |
| `SHOPIFY_ADMIN_API_VERSION`            | Server | API version e.g. `2025-01`                      |
| `GIG_API_KEY`                          | Server | GIG Logistics API key                           |
| `GIG_API_BASE_URL`                     | Server | GIG Logistics API base URL                      |
| `SENTRY_DSN`                           | Server | Sentry error tracking DSN                       |
| `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN`     | Client | Shopify domain for Storefront API calls         |
| `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` | Client | Public Storefront access token                  |

---

## 4. Folder Structure

> Every UI element must be broken into the smallest meaningful reusable component. No monolithic page files.

```text
glossup-web/
├── src/
│   ├── app/
│   │   ├── (store)/
│   │   │   ├── page.tsx                      # Landing page
│   │   │   ├── products/
│   │   │   │   └── [handle]/
│   │   │   │       └── page.tsx              # Product detail page
│   │   │   ├── cart/
│   │   │   │   └── page.tsx                  # Cart page
│   │   │   └── track-order/
│   │   │       └── page.tsx                  # Order tracking page
│   │   ├── api/
│   │   │   ├── shopify/
│   │   │   │   └── route.ts                  # Shopify webhook handler
│   │   │   └── track/
│   │   │       └── route.ts                  # Order tracking API endpoint
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                               # shadcn primitives (Button, Input, Badge, etc.)
│   │   ├── layout/                           # Navbar, Footer, MobileMenu
│   │   ├── product/                          # ProductCard, ProductGallery, ProductInfo,
│   │   │                                     # ProductPrice, AddToCartButton, QuantitySelector
│   │   ├── cart/                             # CartDrawer, CartItem, CartSummary, CartEmpty
│   │   └── order/                            # TrackingForm, TrackingTimeline,
│   │                                         # TrackingStatusBadge, OrderSummaryCard
│   ├── lib/
│   │   ├── shopify/
│   │   │   ├── client.ts                     # Storefront API client
│   │   │   ├── queries.ts                    # GraphQL queries
│   │   │   └── types.ts                      # Shopify TypeScript types
│   │   ├── gig/
│   │   │   └── client.ts                     # GIG Logistics API client
│   │   └── env.ts                            # @t3-oss env schema & validation
│   ├── hooks/                                # useCart, useTrackOrder, useProduct
│   ├── store/                                # Zustand cart store
│   └── types/                                # Global TypeScript types
├── public/                                   # Static assets, images, icons
├── .env.local                                # Local env (gitignored)
├── .env.example                              # Documented env template (committed)
├── .husky/                                   # Git hooks
├── .eslintrc.json
├── .prettierrc
├── commitlint.config.js
├── next.config.ts
└── tailwind.config.ts
```

---

## 5. Architecture & Data Flow

### 5.1 Shopify Integration Strategy

| API            | Usage                                       | Called From                      |
| -------------- | ------------------------------------------- | -------------------------------- |
| Storefront API | Products, collections, cart creation        | Client (public storefront token) |
| Admin API      | Order lookup by order number + email        | Server only (route handler)      |
| Webhooks       | Fulfillment events → trigger status updates | `api/shopify/route.ts`           |

### 5.2 Order Tracking Flow

1. Customer submits order number + email on `/track-order`
2. Next.js server action calls Shopify Admin API (server-side only)
3. Response returns fulfillment status + tracking number + carrier
4. If carrier is GIG → hit GIG Logistics API with tracking number for granular status
5. If GIG API is unavailable → show Shopify fulfillment status + deep-link to GIG tracking page with tracking number pre-filled
6. Render branded status timeline with Framer Motion animations

### 5.3 Cart State

- Cart is managed client-side with Zustand
- On checkout → Shopify cart is created via Storefront API
- Customer is redirected to Shopify-hosted checkout
- Paystack processes payment via Shopify's Paystack plugin
- On order completion → Shopify sends fulfillment webhook

---

## 6. Pages & Components

> Pages are composition layers only. All logic lives in hooks or child components.

### 6.1 Landing Page `/`

**Sections:**

- Hero — brand statement + CTA to shop
- Featured products — pulled from Shopify collection
- Brand story / values
- Newsletter signup
- Footer

**Components:**

- `HeroSection`
- `FeaturedProductsGrid`
- `ProductCard` _(reused across pages)_
- `NewsletterForm`
- `Navbar`, `Footer` _(layout)_

---

### 6.2 Product Page `/products/[handle]`

**Sections:**

- Product image gallery with zoom
- Product name, price, description
- Variant selector (shade, size, etc.)
- Add to cart
- Related products

**Components:**

- `ProductGallery`
- `ProductInfo`
- `ProductPrice`
- `VariantSelector`
- `AddToCartButton`
- `QuantitySelector`
- `RelatedProducts`

---

### 6.3 Cart `/cart`

**Sections:**

- Cart items list with quantity controls
- Order summary with subtotal
- Proceed to checkout button

**Components:**

- `CartItem`
- `CartSummary`
- `CartEmpty` _(empty state)_
- `CartDrawer` _(slide-in for desktop)_

---

### 6.4 Order Tracking `/track-order`

**Sections:**

- Input form: order number + email
- Status timeline: Placed → Processing → Shipped → Out for Delivery → Delivered
- Estimated delivery info
- Carrier tracking deep-link fallback

**Components:**

- `TrackingForm`
- `TrackingTimeline`
- `TrackingStatusBadge`
- `OrderSummaryCard`
- `TrackingError` _(not found / error state)_

---

## 7. Component Design Principles

| Principle             | Rule                                                                                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Single Responsibility | Each component does one thing only. `ProductPrice` only renders price. `ProductGallery` only handles images. |
| No Logic in Pages     | Pages compose components. All data fetching and business logic lives in hooks.                               |
| Props Over State      | Prefer passing data as props. Lift state only when truly necessary.                                          |
| Custom Hooks          | All data fetching logic goes in `/hooks`. Components stay clean and presentational.                          |
| Typed Props           | Every component must have a fully typed `Props` interface in TypeScript. No `any`.                           |
| Accessible by Default | Use shadcn/ui primitives (Radix UI) — keyboard navigation and ARIA attributes handled out of the box.        |

---

## 8. SEO

- Next.js Metadata API for all page-level meta tags
- Dynamic OG images for product pages
- `next-sitemap` for auto-generated `sitemap.xml` and `robots.txt`
- Semantic HTML throughout — `h1`, `article`, `nav`, `main`, etc.
- JSON-LD structured data on product pages

---

## 9. Error Handling & Monitoring

- Sentry for runtime error tracking (client + server)
- `error.tsx` boundary per route segment
- `not-found.tsx` for 404 pages
- API routes return structured JSON with proper HTTP status codes
- Zod validation errors surface as field-level messages in forms
- GIG API failure falls back gracefully to tracking URL deep-link

---

## 10. Deployment

| Environment | Trigger         | URL                           |
| ----------- | --------------- | ----------------------------- |
| Production  | Merge to `main` | `glossup.com` (custom domain) |
| Staging     | Merge to `dev`  | Vercel auto-generated URL     |
| Preview     | Any PR opened   | Vercel PR preview URL         |

- All environment variables configured in Vercel dashboard per environment
- Build command: `pnpm build`
- Node.js version: 20.x (LTS)
- Sentry source maps uploaded on production build

---

_GlossUp Technical Specification v1.0 — Confidential_
