import "server-only";

import { env } from "@/lib/env";

interface AdminGraphqlResponse<T> {
  data?: T;
  errors?: unknown;
}

interface ShopifyAccessTokenResponse {
  access_token: string;
  scope: string;
  expires_in: number;
}

let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

async function getAccessToken(): Promise<string> {
  // Refresh 60s before actual expiry
  if (cachedToken && tokenExpiry && tokenExpiry > new Date(Date.now() + 60_000)) {
    return cachedToken;
  }

  const res = await fetch(
    `https://${env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/oauth/access_token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: env.SHOPIFY_ADMIN_CLIENT_ID,
        client_secret: env.SHOPIFY_ADMIN_CLIENT_SECRET,
        grant_type: "client_credentials",
      }),
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error(`Shopify Admin token exchange failed: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as ShopifyAccessTokenResponse;

  cachedToken = data.access_token;
  tokenExpiry = new Date(Date.now() + data.expires_in * 1000);
  return cachedToken;
}

export async function adminGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<AdminGraphqlResponse<T>> {
  const token = await getAccessToken();

  const res = await fetch(
    `https://${env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/admin/api/${env.NEXT_PUBLIC_SHOPIFY_API_VERSION}/graphql.json`,
    {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
      cache: "no-store",
    },
  );
  return res.json() as Promise<AdminGraphqlResponse<T>>;
}
