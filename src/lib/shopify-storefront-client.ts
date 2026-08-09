import { createStorefrontApiClient } from "@shopify/storefront-api-client";

import { env } from "@/lib/env";

/**
 * Client-safe Storefront API client — no `server-only` guard, since cart
 * mutations happen interactively in the browser. Uses the same public token
 * as `src/lib/shopify.ts`, which is safe to expose client-side by design.
 */
export const shopifyStorefront = createStorefrontApiClient({
  storeDomain: env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  publicAccessToken: env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
});
