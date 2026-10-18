import "server-only";

import { getMockReviews, MOCK_PRODUCTS, type MockProduct } from "@/data/mock-catalog";
import { USE_MOCK_DATA } from "@/lib/mock";
import { shopify } from "@/lib/shopify";
import { toNaira } from "@/lib/utils";
import { getAllProductRatings, getProductReviews } from "@/queries/reviews";

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    handle
    title
    description
    featuredImage {
      url
      altText
    }
    priceRange {
      minVariantPrice {
        amount
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
      }
    }
    collections(first: 5) {
      nodes {
        handle
      }
    }
    coreIngredients: metafield(namespace: "custom", key: "core_ingredients") {
      value
    }
    shortDescription: metafield(namespace: "custom", key: "short_description") {
      value
    }
    variants(first: 10) {
      nodes {
        id
        availableForSale
        price {
          amount
        }
        compareAtPrice {
          amount
        }
        selectedOptions {
          name
          value
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      ...ProductCard
      images(first: 10) {
        nodes {
          url
          altText
        }
      }
      benefits: metafield(namespace: "custom", key: "benefits") {
        value
      }
      allIngredients: metafield(namespace: "custom", key: "all_ingredients") {
        value
      }
      howToUse: metafield(namespace: "custom", key: "how_to_use") {
        value
      }
    }
  }
`;

interface VariantNode {
  id: string;
  availableForSale: boolean;
  price: { amount: string };
  compareAtPrice: { amount: string } | null;
  selectedOptions: { name: string; value: string }[];
}

interface ProductCardNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } } | null;
  collections: { nodes: { handle: string }[] };
  coreIngredients: { value: string } | null;
  shortDescription: { value: string } | null;
  variants: { nodes: VariantNode[] };
}

/** Shopify GID (e.g. "gid://shopify/Product/123") -> numeric id, matching Judge.me's external_id. */
function shopifyNumericId(gid: string): string {
  return gid.split("/").pop() ?? gid;
}

interface ProductDetailNode extends ProductCardNode {
  images: { nodes: { url: string; altText: string | null }[] };
  benefits: { value: string } | null;
  allIngredients: { value: string } | null;
  howToUse: { value: string } | null;
}

function parseJsonMetafield<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function mapVariant(node: VariantNode): ProductVariant {
  const price = node.price.amount;
  const compareAt = node.compareAtPrice?.amount;
  return {
    id: node.id,
    size:
      node.selectedOptions.find((o) => o.name === "Size")?.value ?? node.selectedOptions[0]?.value,
    price: toNaira(price),
    compareAtPrice: compareAt && Number(compareAt) > Number(price) ? toNaira(compareAt) : undefined,
    availableForSale: node.availableForSale,
  };
}

function mapProductCard(
  node: ProductCardNode,
  rating: { rating: number; reviewCount: number } | undefined,
): Product {
  const coreIngredients = parseJsonMetafield<{ percent: string; name: string }[]>(
    node.coreIngredients?.value,
    [],
  );
  const price = node.priceRange.minVariantPrice.amount;
  const compareAt = node.compareAtPriceRange?.minVariantPrice.amount;
  const categories = node.collections.nodes.map((c) => c.handle);

  return {
    slug: node.handle,
    name: node.title,
    description: node.shortDescription?.value ?? node.description,
    price: toNaira(price),
    originalPrice: compareAt && Number(compareAt) > Number(price) ? toNaira(compareAt) : undefined,
    image: node.featuredImage?.url ?? "",
    rating: rating?.rating ?? 0,
    reviewCount: String(rating?.reviewCount ?? 0),
    category: categories[0],
    categories,
    variants: node.variants.nodes.map(mapVariant),
    ingredients: coreIngredients.map((i) => i.name),
  };
}

function summarizeMockReviews(product: MockProduct): ProductReviewSummary {
  const reviews = getMockReviews(product);
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: reviews.filter((r) => r.rating === stars).length,
  }));
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  return { reviews, average, total: reviews.length, distribution };
}

function mapMockProduct(product: MockProduct): Product {
  const [cheapest] = product.variants;
  const summary = summarizeMockReviews(product);
  return {
    slug: product.slug,
    name: product.name,
    description: product.shortDescription,
    price: toNaira(cheapest?.price ?? 0),
    originalPrice: cheapest?.compareAtPrice ? toNaira(cheapest.compareAtPrice) : undefined,
    image: product.image,
    rating: summary.average,
    reviewCount: String(summary.total),
    category: product.categories[0],
    categories: product.categories,
    variants: product.variants.map((v) => ({
      id: v.id,
      size: v.size,
      price: toNaira(v.price),
      compareAtPrice: v.compareAtPrice ? toNaira(v.compareAtPrice) : undefined,
      availableForSale: true,
    })),
    ingredients: product.features.coreIngredients.map((i) => i.name),
  };
}

export async function getProducts(first = 50): Promise<Product[]> {
  if (USE_MOCK_DATA) return MOCK_PRODUCTS.slice(0, first).map(mapMockProduct);

  const [{ data, errors }, ratings] = await Promise.all([
    shopify.request<{ products: { nodes: ProductCardNode[] } }>(PRODUCTS_QUERY, {
      variables: { first },
    }),
    getAllProductRatings(),
  ]);
  if (errors) {
    console.error("getProducts GraphQL error:", errors);
  }
  return (
    data?.products.nodes.map((node) =>
      mapProductCard(node, ratings.get(shopifyNumericId(node.id))),
    ) ?? []
  );
}

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  if (USE_MOCK_DATA) {
    const product = MOCK_PRODUCTS.find((p) => p.slug === handle);
    if (!product) return null;
    return {
      ...mapMockProduct(product),
      description: product.description,
      images: product.images,
      features: product.features,
      reviewSummary: summarizeMockReviews(product),
    };
  }

  const { data, errors } = await shopify.request<{ product: ProductDetailNode | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { variables: { handle } },
  );
  if (errors) {
    console.error("getProductByHandle GraphQL error:", errors);
  }
  if (!data?.product) return null;

  const reviewSummary = await getProductReviews(shopifyNumericId(data.product.id));

  return {
    ...mapProductCard(data.product, {
      rating: reviewSummary.average,
      reviewCount: reviewSummary.total,
    }),
    description: data.product.description,
    images: data.product.images.nodes.map((img) => img.url),
    features: {
      benefits: parseJsonMetafield<string[]>(data.product.benefits?.value, []),
      coreIngredients: parseJsonMetafield<{ percent: string; name: string }[]>(
        data.product.coreIngredients?.value,
        [],
      ),
      allIngredients: data.product.allIngredients?.value ?? "",
      howToUse: parseJsonMetafield<{ num: string; text: string }[]>(
        data.product.howToUse?.value,
        [],
      ),
    },
    reviewSummary,
  };
}
