# Adding a product via the Shopify Admin GraphQL API (developers)

A step-by-step guide to adding a new product via raw `curl` calls to the Shopify **Admin GraphQL API** — no scripts, dependencies, or Shopify Admin UI clicking required. For non-technical product uploads, see `product-upload-guide.md` (CSV) or `add-product-via-shopify-admin.md` (Shopify Admin UI) instead. Worked example throughout uses "The Wash" — swap in your own values for a new product.

---

## Prerequisites

You need a Shopify **Admin API access token** with `write_products` scope. This repo's `.env.local` currently has a placeholder (`SHOPIFY_ADMIN_API_KEY=placeholder-admin-key`) — you need a real one before any of this works.

### Get an Admin API token

1. Go to [dev.shopify.com/dashboard](https://dev.shopify.com/dashboard) → your app (or create a new one) → **API access**
2. Under **Scopes**, add `write_products`
3. Release the version, install the app on `glossup-dev.myshopify.com`
4. Get your **Client ID** / **Client secret** from the app's **Settings** tab
5. Exchange them for an Admin API access token via the client-credentials grant:

```bash
curl -X POST "https://glossup-dev.myshopify.com/admin/oauth/access_token" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "grant_type": "client_credentials"
  }'
```

This returns `{"access_token": "shpat_...", ...}`. Put that in `.env.local` as `SHOPIFY_ADMIN_API_KEY`, and use it below as `$TOKEN`.

Every request below needs these two headers:

```bash
X-Shopify-Access-Token: $TOKEN
Content-Type: application/json
```

---

## Step 1 — Create the product with variants

`productCreate` makes the base product. Pass variant prices and compare-at prices directly via `productVariantsBulkCreate` right after (this repo's earlier product-creation used a tool that couldn't set `compareAtPrice` at creation time — doing it via raw GraphQL, you can set everything in one pass).

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateProduct($input: ProductInput!) { productCreate(input: $input) { product { id } userErrors { field message } } }",
    "variables": {
      "input": {
        "title": "The Wash",
        "descriptionHtml": "<p>Gentle &amp; hydrating body wash formulated with niacinamide, tea tree oil, and ceramides.</p>",
        "productType": "Body Care",
        "vendor": "GlossUp",
        "status": "ACTIVE",
        "productOptions": [{ "name": "Size", "values": [{ "name": "25ml" }, { "name": "50ml" }, { "name": "75ml" }] }]
      }
    }
  }'
```

Save the returned `product.id` (e.g. `gid://shopify/Product/1234567890`) — you need it for every step below.

## Step 2 — Set variant prices (including compare-at)

First, find the auto-created variant IDs:

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { product(id: \"gid://shopify/Product/YOUR_PRODUCT_ID\") { variants(first: 10) { nodes { id title } } } }"}'
```

Then set price + compareAtPrice on each:

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation UpdateVariants($productId: ID!, $variants: [ProductVariantsBulkInput!]!) { productVariantsBulkUpdate(productId: $productId, variants: $variants) { userErrors { field message } } }",
    "variables": {
      "productId": "gid://shopify/Product/YOUR_PRODUCT_ID",
      "variants": [
        { "id": "gid://shopify/ProductVariant/VARIANT_1_ID", "price": "22900", "compareAtPrice": "54300" },
        { "id": "gid://shopify/ProductVariant/VARIANT_2_ID", "price": "22900", "compareAtPrice": "54300" },
        { "id": "gid://shopify/ProductVariant/VARIANT_3_ID", "price": "22900", "compareAtPrice": "54300" }
      ]
    }
  }'
```

## Step 3 — Add the image

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateMedia($productId: ID!, $media: [CreateMediaInput!]!) { productCreateMedia(productId: $productId, media: $media) { mediaUserErrors { field message } } }",
    "variables": {
      "productId": "gid://shopify/Product/YOUR_PRODUCT_ID",
      "media": [{ "originalSource": "https://your-image-url.png", "alt": "The Wash — Gloss Up body wash", "mediaContentType": "IMAGE" }]
    }
  }'
```

The image URL must be a publicly reachable HTTPS URL (a deployed Vercel URL works, e.g. `https://glossup.vercel.app/products/the-wash.png` — local file paths don't work).

## Step 4 — Add to a collection

Find collection IDs:

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { collections(first: 20) { nodes { id title handle } } }"}'
```

Then add the product:

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation AddToCollection($id: ID!, $productIds: [ID!]!) { collectionAddProducts(id: $id, productIds: $productIds) { userErrors { field message } } }",
    "variables": { "id": "gid://shopify/Collection/YOUR_COLLECTION_ID", "productIds": ["gid://shopify/Product/YOUR_PRODUCT_ID"] }
  }'
```

Repeat for a second collection if the product belongs to more than one (e.g. The Cream is in both Body Care and Skincare).

## Step 5 — Set the metafields

There are 7 custom fields the frontend reads (`src/queries/products.ts`). All must exist as **metafield definitions** already (Settings → Custom data → Products in Shopify Admin, or `metafieldDefinitionCreate`) with **Storefront API access set to `PUBLIC_READ`** — otherwise the frontend won't be able to read them, even if the value is set correctly. See the "Metafield access" gotcha below.

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation SetMetafields($metafields: [MetafieldsSetInput!]!) { metafieldsSet(metafields: $metafields) { userErrors { field message } } }",
    "variables": {
      "metafields": [
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "rating", "type": "number_decimal", "value": "4.2" },
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "review_count", "type": "single_line_text_field", "value": "1.4k" },
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "benefits", "type": "json", "value": "[\"Gently cleanses skin\",\"Deeply nourishes and hydrates\"]" },
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "core_ingredients", "type": "json", "value": "[{\"percent\":\"3.5%\",\"name\":\"Niacinamide\"}]" },
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "all_ingredients", "type": "multi_line_text_field", "value": "Aqua • Niacinamide • Tea Tree Oil" },
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "how_to_use", "type": "json", "value": "[{\"num\":\"01\",\"text\":\"Wet your skin with warm water.\"}]" },
        { "ownerId": "gid://shopify/Product/YOUR_PRODUCT_ID", "namespace": "custom", "key": "faqs", "type": "json", "value": "[{\"q\":\"Are your products suitable for all skin types?\",\"a\":\"Yes!\",\"defaultOpen\":true}]" }
      ]
    }
  }'
```

---

## Gotcha: metafield Storefront API access

Metafield **definitions** default to admin-only visibility. The Storefront API (what the Next.js frontend actually queries) returns `null` for any metafield whose definition doesn't explicitly grant `PUBLIC_READ` — silently, no error. This bit us once already (see git history around the initial 4-product setup).

If you're adding a metafield **key** that doesn't exist yet, set its access when creating the definition:

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/admin/api/2026-04/graphql.json" \
  -H "X-Shopify-Access-Token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation CreateDef($def: MetafieldDefinitionInput!) { metafieldDefinitionCreate(definition: $def) { createdDefinition { id } userErrors { field message } } }",
    "variables": { "def": { "name": "Rating", "namespace": "custom", "key": "rating", "type": "number_decimal", "ownerType": "PRODUCT", "access": { "storefront": "PUBLIC_READ" } } }
  }'
```

The 7 keys this project already uses (`rating`, `review_count`, `benefits`, `core_ingredients`, `all_ingredients`, `how_to_use`, `faqs`) already have definitions with `PUBLIC_READ` set — you only need this step for a genuinely new metafield key.

---

## Verify it worked

Query the Storefront API directly (the public token is in `.env.local` as `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`):

```bash
curl -s -X POST "https://glossup-dev.myshopify.com/api/2026-04/graphql.json" \
  -H "X-Shopify-Storefront-Access-Token: YOUR_PUBLIC_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "query { product(handle: \"the-wash\") { title priceRange { minVariantPrice { amount } } coreIngredients: metafield(namespace: \"custom\", key: \"core_ingredients\") { value } } }"}'
```

If `coreIngredients` comes back `null` here but the value is definitely set (check via the Admin API `product.metafields` query), it's the access-grant gotcha above — not a bug in your data.

Then just visit `/products/your-product-handle` on the running site. If it's a genuinely new product handle (never queried before), there's no stale-cache risk. If you're re-testing a product you already viewed while its data was broken, do a full `rm -rf .next && npm run dev` restart first — Next.js caches fetch responses, and a stale "broken" result can outlive the fix otherwise.
