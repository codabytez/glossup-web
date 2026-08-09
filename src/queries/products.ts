import "server-only";

import { shopify } from "@/lib/shopify";
import { toNaira } from "@/lib/utils";

const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
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
    rating: metafield(namespace: "custom", key: "rating") {
      value
    }
    reviewCount: metafield(namespace: "custom", key: "review_count") {
      value
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
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string } };
  compareAtPriceRange: { minVariantPrice: { amount: string } } | null;
  collections: { nodes: { handle: string }[] };
  rating: { value: string } | null;
  reviewCount: { value: string } | null;
  coreIngredients: { value: string } | null;
  shortDescription: { value: string } | null;
  variants: { nodes: VariantNode[] };
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

function mapProductCard(node: ProductCardNode): Product {
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
    rating: node.rating ? Number(node.rating.value) : 0,
    reviewCount: node.reviewCount?.value ?? "0",
    category: categories[0],
    categories,
    variants: node.variants.nodes.map(mapVariant),
    ingredients: coreIngredients.map((i) => i.name),
  };
}

export async function getProducts(first = 50): Promise<Product[]> {
  const { data, errors } = await shopify.request<{ products: { nodes: ProductCardNode[] } }>(
    PRODUCTS_QUERY,
    { variables: { first } },
  );
  if (errors) {
    console.error("getProducts GraphQL error:", errors);
  }
  return data?.products.nodes.map(mapProductCard) ?? [];
}

export async function getProductByHandle(handle: string): Promise<ProductDetail | null> {
  const { data, errors } = await shopify.request<{ product: ProductDetailNode | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { variables: { handle } },
  );
  if (errors) {
    console.error("getProductByHandle GraphQL error:", errors);
  }
  if (!data?.product) return null;

  return {
    ...mapProductCard(data.product),
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
  };
}
