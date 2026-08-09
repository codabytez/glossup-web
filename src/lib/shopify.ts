import "server-only";

import { createStorefrontApiClient } from "@shopify/storefront-api-client";

import { env } from "@/lib/env";

export const shopify = createStorefrontApiClient({
  storeDomain: env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  apiVersion: env.NEXT_PUBLIC_SHOPIFY_API_VERSION,
  publicAccessToken: env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
});
