# Shopify notification email templates

Shopify's transactional emails (password reset, order confirmation, shipping
updates, etc.) are edited in Shopify Admin under **Settings → Notifications**,
not in this codebase — Shopify hosts and sends them directly. This folder is
just a reference copy of the ones we've customized, so we don't have to
re-derive the branding from scratch each time, and so changes are visible in
git history like everything else.

## Where to edit the real thing

Admin → **Settings → Notifications** → pick the notification → **Edit code**.
Paste the corresponding `.liquid` file's contents in, save, then send yourself
a test.

## Files

- [`password-reset.liquid`](./password-reset.liquid) — "Customer account
  password reset" notification. Subject: `Reset your Gloss Up password`.

## Brand pattern to reuse for the next template

Every notification email should follow this same structure and token set so
they feel like one system:

- **Top accent bar** — 4px solid `#990B33` (`primary-900`), full width, first
  thing in the `<body>`.
- **Logo header** — centered, `border-bottom: 1px solid #F4F4F5`
  (`grey-100`). Uses `shop.email_logo_url` if set in Admin → Settings →
  Brand, otherwise falls back to a styled "GLOSS UP" text wordmark
  (`Georgia, 'Times New Roman', Times, serif`, `#990B33`, uppercase,
  letter-spacing `1.5px`) — swap to the real logo image once one is uploaded
  to Shopify's brand assets.
- **Content card** — the message + CTA sit inside a soft card:
  `background:#FAFAFA; border:1px solid #F4F4F5; border-radius:12px`. Don't
  float copy loose on white — it reads flat without a focal point.
- **Copy hierarchy**: small uppercase eyebrow label in `#990B33`
  (11px, weight 600, letter-spacing 1.5px) → headline in `#09090B` (26px,
  weight 500) → body copy in `#52525C` (14px) → fine-print/security note in
  `#A1A1AA` (12px) below the CTA.
- **CTA button** — bulletproof table-button pattern (not a plain styled
  `<a>` — Outlook desktop ignores `border-radius`/`padding` on links, so the
  radius/background must live on the `<td>` via `bgcolor` + inline `style`,
  not just a CSS class). Pill shape: `border-radius:999px`, background
  `#990B33`, text `#FFFAFA`, `padding:14px 36px`, weight 500. **One CTA per
  email** — don't add competing secondary links.
- **Footer** — centered, `#71717B` (grey-500), 12px: copyright line
  (`©{{ 'now' | date: "%Y" }} Gloss Up. All rights reserved.`) then a support
  contact line linking `mailto:{{ shop.email }}` in `#990B33`.
- **Font**: Work Sans via `@import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600&display=swap')`
  with a `'Helvetica Neue', Helvetica, Arial, sans-serif` fallback for clients
  that strip the import (Outlook desktop).

## TODO

The reset link in `password-reset.liquid` currently points at the Vercel
deployment domain:

```liquid
{{ customer.reset_password_url | replace: shop.url, 'https://glossup.vercel.app' }}
```

**Update this once a custom domain (e.g. `glossup.com`, matching `SITE_URL` in
`.env.example`) is connected in Vercel** — otherwise password-reset emails
keep linking to the `.vercel.app` domain instead of the real storefront URL.
