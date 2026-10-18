import { env } from "@/lib/env";

/** When true, catalog, reviews and cart are served from `src/data/mock-catalog.ts`. */
export const USE_MOCK_DATA = env.NEXT_PUBLIC_USE_MOCK_DATA === "true";
