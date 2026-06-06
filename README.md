# GlossUp

GlossUp is a Nigerian cosmetics e-commerce brand. This repo is the storefront — a Next.js (App Router) app backed by Shopify, targeting customers in Lagos and Abuja.

## Tech Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Animation:** Framer Motion
- **State:** Zustand (cart) + TanStack Query (server state)
- **Forms:** React Hook Form + Zod
- **Commerce:** Shopify Storefront API (client) + Admin API (server-side order lookup)
- **Payments:** Paystack via Shopify
- **Logistics:** GIG Logistics API (order tracking)
- **Monitoring:** Sentry
- **Deployment:** Vercel

See [glossup-spec.md](./glossup-spec.md) for the full technical specification.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Copy the env template and fill in real values (see [Environment Variables](#environment-variables)):

```bash
cp .env.example .env.local
```

Run the dev server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Scripts

| Script              | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `pnpm dev`          | Start the dev server                      |
| `pnpm build`        | Production build (also generates sitemap) |
| `pnpm start`        | Start the production server               |
| `pnpm lint`         | Run ESLint                                |
| `pnpm type-check`   | Run `tsc --noEmit`                        |
| `pnpm format`       | Format files with Prettier                |
| `pnpm format:check` | Check formatting without writing          |

## Environment Variables

All env vars are validated at build time via `@t3-oss/env-nextjs` — the build fails if any required variable is missing. See [.env.example](./.env.example) for the full list (Shopify Storefront/Admin API, GIG Logistics, Sentry).

## Project Structure

Pages are composition-only — all data fetching and business logic live in `/hooks`, and every UI element is broken into the smallest meaningful reusable component (no monolithic page files). See section 4 of [glossup-spec.md](./glossup-spec.md) for the full folder layout and component breakdown.

## Git Workflow

- `main` — production (protected, PRs from `dev` only)
- `dev` — staging/integration (protected, all feature PRs merge here first)
- `feature/*`, `fix/*`, `chore/*` — branch off `dev`, PR back to `dev`

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), enforced via Commitlint + Husky. A `pre-push` hook runs lint, type-check, format check, and a production build before code is pushed.

## Deployment

Hosted on Vercel:

- Merge to `main` → production (`glossup.com`)
- Merge to `dev` → staging preview
- Every PR → automatic preview URL
