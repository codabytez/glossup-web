import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.url(),
    SHOPIFY_STORE_DOMAIN: z.string().min(1),
    SHOPIFY_ADMIN_API_KEY: z.string().min(1),
    SHOPIFY_ADMIN_API_VERSION: z.string().min(1),
    FEZ_API_KEY: z.string().min(1),
    FEZ_API_BASE_URL: z.url(),
    FEZ_WEBHOOK_SECRET: z.string().min(1),
    SENTRY_DSN: z.url(),
  },
  client: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().min(1),
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: z.string().min(1),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
    NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
  },
});
