import "server-only";

import { shopify } from "@/lib/shopify";

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
