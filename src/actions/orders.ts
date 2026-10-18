"use server";

import { getSessionToken } from "@/actions/auth";
import { getCustomerOrder, getCustomerOrders } from "@/queries/customer";

const EMPTY_PAGE: CustomerOrdersPage = { orders: [], hasNextPage: false, endCursor: null };

export async function getOrders(params?: {
  first?: number;
  after?: string;
}): Promise<CustomerOrdersPage> {
  const token = await getSessionToken();
  if (!token) return EMPTY_PAGE;
  return getCustomerOrders(token, params);
}

export async function getOrder(name: string): Promise<CustomerOrderDetail | null> {
  const token = await getSessionToken();
  if (!token) return null;
  return getCustomerOrder(token, name);
}
