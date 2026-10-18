import "server-only";

import { env } from "@/lib/env";

const BASE_URL = "https://judge.me/api/v1";

export async function judgemeGet<T>(
  path: string,
  params: Record<string, string | number> = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("shop_domain", env.JUDGEME_SHOP_DOMAIN);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    headers: { "X-Api-Token": env.JUDGEME_API_TOKEN },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Judge.me API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}
