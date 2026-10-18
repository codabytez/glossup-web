"use server";

import { getSessionToken } from "@/actions/auth";
import { linkCartToCustomer as linkCartToCustomerQuery } from "@/queries/cart";

export async function linkCartToCustomer(cartId: string): Promise<void> {
  const token = await getSessionToken();
  if (!token) return;
  await linkCartToCustomerQuery(cartId, token);
}
