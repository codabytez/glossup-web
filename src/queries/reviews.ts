import "server-only";

import { cache } from "react";

import { judgemeGet } from "@/lib/judgeme";

interface JudgemeReviewsResponse {
  current_page: number;
  per_page: number;
  reviews: JudgemeReview[];
}

const PER_PAGE = 100;

function isPublished(review: JudgemeReview): boolean {
  return review.curated === "ok" && !review.hidden;
}

/** Fetches every review in the store, paginating until a short page ends it. Memoized per request. */
const fetchAllReviews = cache(async (): Promise<JudgemeReview[]> => {
  const all: JudgemeReview[] = [];
  let page = 1;

  for (;;) {
    const { reviews } = await judgemeGet<JudgemeReviewsResponse>("/reviews", {
      per_page: PER_PAGE,
      page,
    });
    all.push(...reviews);
    if (reviews.length < PER_PAGE) break;
    page += 1;
  }

  return all;
});

function summarize(reviews: JudgemeReview[]): ProductReviewSummary {
  const published = reviews.filter(isPublished);
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: published.filter((r) => r.rating === stars).length,
  }));
  const average =
    published.length > 0 ? published.reduce((sum, r) => sum + r.rating, 0) / published.length : 0;

  return { reviews: published, average, total: published.length, distribution };
}

/** Full review summary (list + average + distribution) for a single Shopify product. */
export async function getProductReviews(shopifyProductId: string): Promise<ProductReviewSummary> {
  const all = await fetchAllReviews();
  const productReviews = all.filter((r) => String(r.product_external_id) === shopifyProductId);
  return summarize(productReviews);
}

/** Lightweight rating + count per product, for badges across listing/card views. */
export async function getAllProductRatings(): Promise<
  Map<string, { rating: number; reviewCount: number }>
> {
  const all = await fetchAllReviews();
  const byProduct = new Map<string, JudgemeReview[]>();

  for (const review of all) {
    if (!isPublished(review) || review.product_external_id == null) continue;
    const key = String(review.product_external_id);
    const list = byProduct.get(key) ?? [];
    list.push(review);
    byProduct.set(key, list);
  }

  const ratings = new Map<string, { rating: number; reviewCount: number }>();
  for (const [externalId, reviews] of byProduct) {
    const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    ratings.set(externalId, { rating: average, reviewCount: reviews.length });
  }
  return ratings;
}
