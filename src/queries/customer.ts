import "server-only";

import { shopify } from "@/lib/shopify";
import { toNaira } from "@/lib/utils";

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation CustomerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION = `#graphql
  mutation CustomerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
    customerAccessTokenCreate(input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_RECOVER_MUTATION = `#graphql
  mutation CustomerRecover($email: String!) {
    customerRecover(email: $email) {
      customerUserErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_RESET_MUTATION = `#graphql
  mutation CustomerReset($id: ID!, $input: CustomerResetInput!) {
    customerReset(id: $id, input: $input) {
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION = `#graphql
  mutation CustomerAccessTokenDelete($customerAccessToken: String!) {
    customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
      deletedAccessToken
      userErrors {
        field
        message
      }
    }
  }
`;

const CUSTOMER_QUERY = `#graphql
  query CustomerByToken($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
    }
  }
`;

interface CustomerNode {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface CreateCustomerInput {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  acceptsMarketing?: boolean;
}

export async function createCustomer(
  input: CreateCustomerInput,
): Promise<{ customer: Customer | null; errors: CustomerUserError[] }> {
  const { data, errors } = await shopify.request<{
    customerCreate: { customer: CustomerNode | null; customerUserErrors: CustomerUserError[] };
  }>(CUSTOMER_CREATE_MUTATION, { variables: { input } });
  if (errors) console.error("createCustomer GraphQL error:", errors);
  return {
    customer: data?.customerCreate.customer ?? null,
    errors: data?.customerCreate.customerUserErrors ?? [],
  };
}

export async function createCustomerAccessToken(
  email: string,
  password: string,
): Promise<{
  accessToken: string | null;
  expiresAt: string | null;
  errors: CustomerUserError[];
}> {
  const { data, errors } = await shopify.request<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION, { variables: { input: { email, password } } });
  if (errors) console.error("createCustomerAccessToken GraphQL error:", errors);
  return {
    accessToken: data?.customerAccessTokenCreate.customerAccessToken?.accessToken ?? null,
    expiresAt: data?.customerAccessTokenCreate.customerAccessToken?.expiresAt ?? null,
    errors: data?.customerAccessTokenCreate.customerUserErrors ?? [],
  };
}

export async function recoverCustomerPassword(email: string): Promise<CustomerUserError[]> {
  const { data, errors } = await shopify.request<{
    customerRecover: { customerUserErrors: CustomerUserError[] };
  }>(CUSTOMER_RECOVER_MUTATION, { variables: { email } });
  if (errors) console.error("recoverCustomerPassword GraphQL error:", errors);
  return data?.customerRecover.customerUserErrors ?? [];
}

export async function resetCustomerPassword(
  id: string,
  resetToken: string,
  password: string,
): Promise<{
  accessToken: string | null;
  expiresAt: string | null;
  errors: CustomerUserError[];
}> {
  const { data, errors } = await shopify.request<{
    customerReset: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_RESET_MUTATION, { variables: { id, input: { resetToken, password } } });
  if (errors) console.error("resetCustomerPassword GraphQL error:", errors);
  return {
    accessToken: data?.customerReset.customerAccessToken?.accessToken ?? null,
    expiresAt: data?.customerReset.customerAccessToken?.expiresAt ?? null,
    errors: data?.customerReset.customerUserErrors ?? [],
  };
}

const CUSTOMER_UPDATE_MUTATION = `#graphql
  mutation CustomerUpdate($customerAccessToken: String!, $customer: CustomerUpdateInput!) {
    customerUpdate(customerAccessToken: $customerAccessToken, customer: $customer) {
      customer {
        id
        firstName
        lastName
        email
      }
      customerAccessToken {
        accessToken
        expiresAt
      }
      customerUserErrors {
        field
        message
      }
    }
  }
`;

export interface UpdateCustomerInput {
  firstName?: string;
  lastName?: string;
}

export async function updateCustomer(
  token: string,
  input: UpdateCustomerInput,
): Promise<{
  customer: Customer | null;
  accessToken: string | null;
  expiresAt: string | null;
  errors: CustomerUserError[];
}> {
  const { data, errors } = await shopify.request<{
    customerUpdate: {
      customer: CustomerNode | null;
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      customerUserErrors: CustomerUserError[];
    };
  }>(CUSTOMER_UPDATE_MUTATION, {
    variables: { customerAccessToken: token, customer: input },
  });
  if (errors) console.error("updateCustomer GraphQL error:", errors);
  return {
    customer: data?.customerUpdate.customer ?? null,
    accessToken: data?.customerUpdate.customerAccessToken?.accessToken ?? null,
    expiresAt: data?.customerUpdate.customerAccessToken?.expiresAt ?? null,
    errors: data?.customerUpdate.customerUserErrors ?? [],
  };
}

export async function deleteCustomerAccessToken(token: string): Promise<void> {
  const { errors } = await shopify.request(CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION, {
    variables: { customerAccessToken: token },
  });
  if (errors) console.error("deleteCustomerAccessToken GraphQL error:", errors);
}

export async function getCustomerByToken(token: string): Promise<Customer | null> {
  const { data, errors } = await shopify.request<{ customer: CustomerNode | null }>(
    CUSTOMER_QUERY,
    { variables: { customerAccessToken: token } },
  );
  if (errors) console.error("getCustomerByToken GraphQL error:", errors);
  return data?.customer ?? null;
}

const CUSTOMER_WISHLIST_QUERY = `#graphql
  query CustomerWishlist($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      metafield(namespace: "custom", key: "wishlist") {
        value
      }
    }
  }
`;

export async function getCustomerWishlist(
  token: string,
): Promise<{ customerId: string; handles: string[] } | null> {
  const { data, errors } = await shopify.request<{
    customer: { id: string; metafield: { value: string } | null } | null;
  }>(CUSTOMER_WISHLIST_QUERY, { variables: { customerAccessToken: token } });
  if (errors) console.error("getCustomerWishlist GraphQL error:", errors);
  if (!data?.customer) return null;

  let handles: string[] = [];
  if (data.customer.metafield?.value) {
    try {
      handles = JSON.parse(data.customer.metafield.value) as string[];
    } catch {
      handles = [];
    }
  }
  return { customerId: data.customer.id, handles };
}

const ORDER_LINE_ITEM_FRAGMENT = `#graphql
  fragment OrderLineItemFields on OrderLineItem {
    title
    quantity
    originalTotalPrice {
      amount
    }
    variant {
      title
      image {
        url
      }
    }
  }
`;

const CUSTOMER_ORDERS_QUERY = `#graphql
  ${ORDER_LINE_ITEM_FRAGMENT}
  query CustomerOrders($customerAccessToken: String!, $first: Int!, $after: String) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: $first, after: $after, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          statusUrl
          totalPrice {
            amount
          }
          lineItems(first: 10) {
            nodes {
              ...OrderLineItemFields
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

const CUSTOMER_ORDER_QUERY = `#graphql
  ${ORDER_LINE_ITEM_FRAGMENT}
  query CustomerOrder($customerAccessToken: String!, $query: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 1, query: $query) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillmentStatus
          statusUrl
          subtotalPrice {
            amount
          }
          totalShippingPrice {
            amount
          }
          totalTax {
            amount
          }
          totalPrice {
            amount
          }
          shippingAddress {
            address1
            address2
            city
            province
            country
            zip
          }
          lineItems(first: 50) {
            nodes {
              ...OrderLineItemFields
            }
          }
          successfulFulfillments(first: 5) {
            trackingCompany
            trackingInfo {
              number
              url
            }
          }
        }
      }
    }
  }
`;

interface OrderLineItemNode {
  title: string;
  quantity: number;
  originalTotalPrice: { amount: string };
  variant: { title: string; image: { url: string } | null } | null;
}

interface OrderNode {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string;
  statusUrl: string;
  totalPrice: { amount: string };
  lineItems: { nodes: OrderLineItemNode[] };
}

interface OrderDetailNode extends OrderNode {
  subtotalPrice: { amount: string };
  totalShippingPrice: { amount: string };
  totalTax: { amount: string };
  shippingAddress: {
    address1: string | null;
    address2: string | null;
    city: string | null;
    province: string | null;
    country: string | null;
    zip: string | null;
  } | null;
  successfulFulfillments: {
    trackingCompany: string | null;
    trackingInfo: { number: string | null; url: string | null }[];
  }[];
}

function mapLineItem(item: OrderLineItemNode): OrderLineItem {
  return {
    title: item.title,
    quantity: item.quantity,
    image: item.variant?.image?.url ?? null,
    variantTitle: item.variant?.title ?? null,
    price: toNaira(item.originalTotalPrice.amount),
  };
}

function mapOrder(node: OrderNode): CustomerOrder {
  return {
    id: node.id,
    name: node.name,
    processedAt: node.processedAt,
    financialStatus: node.financialStatus,
    fulfillmentStatus: node.fulfillmentStatus,
    statusUrl: node.statusUrl,
    total: toNaira(node.totalPrice.amount),
    lineItems: node.lineItems.nodes.map(mapLineItem),
  };
}

export async function getCustomerOrders(
  token: string,
  { first = 10, after }: { first?: number; after?: string } = {},
): Promise<CustomerOrdersPage> {
  const { data, errors } = await shopify.request<{
    customer: {
      orders: { nodes: OrderNode[]; pageInfo: { hasNextPage: boolean; endCursor: string | null } };
    } | null;
  }>(CUSTOMER_ORDERS_QUERY, { variables: { customerAccessToken: token, first, after } });
  if (errors) console.error("getCustomerOrders GraphQL error:", errors);

  return {
    orders: (data?.customer?.orders.nodes ?? []).map(mapOrder),
    hasNextPage: data?.customer?.orders.pageInfo.hasNextPage ?? false,
    endCursor: data?.customer?.orders.pageInfo.endCursor ?? null,
  };
}

export async function getCustomerOrder(
  token: string,
  orderName: string,
): Promise<CustomerOrderDetail | null> {
  const { data, errors } = await shopify.request<{
    customer: { orders: { nodes: OrderDetailNode[] } } | null;
  }>(CUSTOMER_ORDER_QUERY, {
    variables: { customerAccessToken: token, query: `name:${orderName}` },
  });
  if (errors) console.error("getCustomerOrder GraphQL error:", errors);

  const node = data?.customer?.orders.nodes[0];
  if (!node) return null;

  return {
    ...mapOrder(node),
    subtotal: toNaira(node.subtotalPrice.amount),
    shipping: toNaira(node.totalShippingPrice.amount),
    tax: toNaira(node.totalTax.amount),
    shippingAddress: node.shippingAddress,
    tracking: node.successfulFulfillments.flatMap((f) =>
      f.trackingInfo.length > 0
        ? f.trackingInfo.map((t) => ({ company: f.trackingCompany, number: t.number, url: t.url }))
        : [{ company: f.trackingCompany, number: null, url: null }],
    ),
  };
}
