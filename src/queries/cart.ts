import { USE_MOCK_DATA } from "@/lib/mock";
import { shopifyStorefront } from "@/lib/shopify-storefront-client";
import { toNaira } from "@/lib/utils";
import {
  addMockCartLines,
  createMockCart,
  getMockCart,
  removeMockCartLine,
  updateMockCartLine,
} from "@/queries/mock-cart";

const CART_FIELDS_FRAGMENT = `#graphql
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    lines(first: 100) {
      nodes {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
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
            product {
              handle
              title
              featuredImage {
                url
                altText
              }
              variants(first: 10) {
                nodes {
                  id
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CART_QUERY = `#graphql
  ${CART_FIELDS_FRAGMENT}
  query Cart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`;

const CART_CREATE_MUTATION = `#graphql
  ${CART_FIELDS_FRAGMENT}
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `#graphql
  ${CART_FIELDS_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `#graphql
  ${CART_FIELDS_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `#graphql
  ${CART_FIELDS_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const CART_BUYER_IDENTITY_UPDATE_MUTATION = `#graphql
  ${CART_FIELDS_FRAGMENT}
  mutation CartBuyerIdentityUpdate($cartId: ID!, $customerAccessToken: String!) {
    cartBuyerIdentityUpdate(
      cartId: $cartId
      buyerIdentity: { customerAccessToken: $customerAccessToken }
    ) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface CartLineNode {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    price: { amount: string };
    compareAtPrice: { amount: string } | null;
    selectedOptions: { name: string; value: string }[];
    product: {
      handle: string;
      title: string;
      featuredImage: { url: string; altText: string | null } | null;
      variants: { nodes: { id: string; selectedOptions: { name: string; value: string }[] }[] };
    };
  };
}

interface CartNode {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: { nodes: CartLineNode[] };
}

function mapCart(node: CartNode): Cart {
  return {
    id: node.id,
    checkoutUrl: node.checkoutUrl,
    totalQuantity: node.totalQuantity,
    lines: node.lines.nodes.map((line) => {
      const price = line.merchandise.price.amount;
      const compareAt = line.merchandise.compareAtPrice?.amount;
      return {
        id: line.id,
        variantId: line.merchandise.id,
        slug: line.merchandise.product.handle,
        name: line.merchandise.product.title,
        image: line.merchandise.product.featuredImage?.url ?? "",
        size:
          line.merchandise.selectedOptions.find((o) => o.name === "Size")?.value ??
          line.merchandise.selectedOptions[0]?.value ??
          "",
        price: toNaira(price),
        compareAtPrice:
          compareAt && Number(compareAt) > Number(price) ? toNaira(compareAt) : undefined,
        quantity: line.quantity,
        productVariants: line.merchandise.product.variants.nodes.map((v) => ({
          id: v.id,
          size:
            v.selectedOptions.find((o) => o.name === "Size")?.value ??
            v.selectedOptions[0]?.value ??
            "",
        })),
      };
    }),
  };
}

function logErrors(
  context: string,
  errors: unknown,
  userErrors?: { field: string[]; message: string }[],
) {
  if (errors) console.error(`${context} GraphQL error:`, errors);
  if (userErrors && userErrors.length > 0) console.error(`${context} user error:`, userErrors);
}

export async function getCart(cartId: string): Promise<Cart | null> {
  if (USE_MOCK_DATA) return getMockCart(cartId);
  const { data, errors } = await shopifyStorefront.request<{ cart: CartNode | null }>(CART_QUERY, {
    variables: { id: cartId },
  });
  logErrors("getCart", errors);
  return data?.cart ? mapCart(data.cart) : null;
}

export async function createCart(merchandiseId: string, quantity: number): Promise<Cart | null> {
  if (USE_MOCK_DATA) return createMockCart(merchandiseId, quantity);
  const { data, errors } = await shopifyStorefront.request<{
    cartCreate: { cart: CartNode | null; userErrors: { field: string[]; message: string }[] };
  }>(CART_CREATE_MUTATION, {
    variables: { lines: [{ merchandiseId, quantity }] },
  });
  logErrors("createCart", errors, data?.cartCreate.userErrors);
  return data?.cartCreate.cart ? mapCart(data.cartCreate.cart) : null;
}

export async function addCartLines(
  cartId: string,
  merchandiseId: string,
  quantity: number,
): Promise<Cart | null> {
  if (USE_MOCK_DATA) return addMockCartLines(cartId, merchandiseId, quantity);
  const { data, errors } = await shopifyStorefront.request<{
    cartLinesAdd: { cart: CartNode | null; userErrors: { field: string[]; message: string }[] };
  }>(CART_LINES_ADD_MUTATION, {
    variables: { cartId, lines: [{ merchandiseId, quantity }] },
  });
  logErrors("addCartLines", errors, data?.cartLinesAdd.userErrors);
  return data?.cartLinesAdd.cart ? mapCart(data.cartLinesAdd.cart) : null;
}

export async function updateCartLineQuantity(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<Cart | null> {
  if (USE_MOCK_DATA) return updateMockCartLine(cartId, lineId, { quantity });
  const { data, errors } = await shopifyStorefront.request<{
    cartLinesUpdate: { cart: CartNode | null; userErrors: { field: string[]; message: string }[] };
  }>(CART_LINES_UPDATE_MUTATION, {
    variables: { cartId, lines: [{ id: lineId, quantity }] },
  });
  logErrors("updateCartLineQuantity", errors, data?.cartLinesUpdate.userErrors);
  return data?.cartLinesUpdate.cart ? mapCart(data.cartLinesUpdate.cart) : null;
}

export async function updateCartLineVariant(
  cartId: string,
  lineId: string,
  merchandiseId: string,
): Promise<Cart | null> {
  if (USE_MOCK_DATA) return updateMockCartLine(cartId, lineId, { variantId: merchandiseId });
  const { data, errors } = await shopifyStorefront.request<{
    cartLinesUpdate: { cart: CartNode | null; userErrors: { field: string[]; message: string }[] };
  }>(CART_LINES_UPDATE_MUTATION, {
    variables: { cartId, lines: [{ id: lineId, merchandiseId }] },
  });
  logErrors("updateCartLineVariant", errors, data?.cartLinesUpdate.userErrors);
  return data?.cartLinesUpdate.cart ? mapCart(data.cartLinesUpdate.cart) : null;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<Cart | null> {
  if (USE_MOCK_DATA) return removeMockCartLine(cartId, lineId);
  const { data, errors } = await shopifyStorefront.request<{
    cartLinesRemove: { cart: CartNode | null; userErrors: { field: string[]; message: string }[] };
  }>(CART_LINES_REMOVE_MUTATION, {
    variables: { cartId, lineIds: [lineId] },
  });
  logErrors("removeCartLine", errors, data?.cartLinesRemove.userErrors);
  return data?.cartLinesRemove.cart ? mapCart(data.cartLinesRemove.cart) : null;
}

/**
 * Links a cart to a customer so Shopify's hosted checkout recognizes them as signed in.
 * Takes the customer access token directly — only ever call this from server code
 * (e.g. a Server Action reading the httpOnly session cookie), never from the client.
 */
export async function linkCartToCustomer(
  cartId: string,
  customerAccessToken: string,
): Promise<Cart | null> {
  if (USE_MOCK_DATA) return null; // no customer accounts in mock mode
  const { data, errors } = await shopifyStorefront.request<{
    cartBuyerIdentityUpdate: {
      cart: CartNode | null;
      userErrors: { field: string[]; message: string }[];
    };
  }>(CART_BUYER_IDENTITY_UPDATE_MUTATION, {
    variables: { cartId, customerAccessToken },
  });
  logErrors("linkCartToCustomer", errors, data?.cartBuyerIdentityUpdate.userErrors);
  return data?.cartBuyerIdentityUpdate.cart ? mapCart(data.cartBuyerIdentityUpdate.cart) : null;
}
