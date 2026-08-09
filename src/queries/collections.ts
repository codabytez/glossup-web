import "server-only";

import { shopify } from "@/lib/shopify";

const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        handle
        title
        descriptionHtml
        image {
          url
          altText
        }
        products(first: 250) {
          nodes {
            id
          }
        }
      }
    }
  }
`;

interface CollectionNode {
  handle: string;
  title: string;
  descriptionHtml: string;
  image: { url: string; altText: string | null } | null;
  products: { nodes: { id: string }[] };
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export async function getCollections(first = 20): Promise<Category[]> {
  const { data, errors } = await shopify.request<{ collections: { nodes: CollectionNode[] } }>(
    COLLECTIONS_QUERY,
    { variables: { first } },
  );

  if (errors) {
    console.error("getCollections GraphQL error:", errors);
  }

  return (
    data?.collections.nodes.map((node) => ({
      slug: node.handle,
      name: node.title,
      count: String(node.products.nodes.length),
      description: stripHtml(node.descriptionHtml),
      image: node.image?.url ?? "",
    })) ?? []
  );
}
