interface JudgemeReviewer {
  id: number;
  name: string | null;
  email: string | null;
}

interface JudgemeReview {
  id: number;
  title: string | null;
  body: string;
  rating: number;
  product_external_id: number | null;
  product_title: string | null;
  product_handle: string | null;
  reviewer: JudgemeReviewer;
  curated: string;
  hidden: boolean;
  verified: string;
  created_at: string;
}

interface ReviewDistributionBucket {
  stars: number;
  count: number;
}

interface ProductReviewSummary {
  reviews: JudgemeReview[];
  average: number;
  total: number;
  distribution: ReviewDistributionBucket[];
}
