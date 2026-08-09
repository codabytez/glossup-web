"use server";

import { getSessionToken } from "@/actions/auth";
import { adminGraphql } from "@/lib/shopify-admin";
import { getCustomerWishlist } from "@/queries/customer";

const WISHLIST_METAFIELDS_SET_MUTATION = `#graphql
  mutation SetWishlist($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      userErrors {
        field
        message
      }
    }
  }
`;

export async function getWishlist(): Promise<string[]> {
  const token = await getSessionToken();
  if (!token) return [];
  const wishlist = await getCustomerWishlist(token);
  return wishlist?.handles ?? [];
}

export async function toggleWishlistItem(productHandle: string): Promise<string[]> {
  const token = await getSessionToken();
  if (!token) throw new Error("Not signed in");

  const current = await getCustomerWishlist(token);
  if (!current) throw new Error("Could not load customer");

  const handles = current.handles.includes(productHandle)
    ? current.handles.filter((h) => h !== productHandle)
    : [...current.handles, productHandle];

  const { data, errors } = await adminGraphql<{
    metafieldsSet: { userErrors: { field: string[]; message: string }[] };
  }>(WISHLIST_METAFIELDS_SET_MUTATION, {
    metafields: [
      {
        ownerId: current.customerId,
        namespace: "custom",
        key: "wishlist",
        type: "list.single_line_text_field",
        value: JSON.stringify(handles),
      },
    ],
  });

  if (errors) console.error("toggleWishlistItem GraphQL error:", errors);
  if (data?.metafieldsSet.userErrors.length) {
    console.error("toggleWishlistItem user error:", data.metafieldsSet.userErrors);
  }

  return handles;
}
