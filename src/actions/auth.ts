"use server";

import { cookies } from "next/headers";

import {
  createCustomer,
  createCustomerAccessToken,
  deleteCustomerAccessToken,
  getCustomerByToken,
  recoverCustomerPassword,
  resetCustomerPassword,
  type CreateCustomerInput,
} from "@/queries/customer";

const SESSION_COOKIE = "glossup_customer_token";

interface AuthResult {
  success: boolean;
  errors: CustomerUserError[];
}

async function setSessionCookie(token: string, expiresAt: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function logIn(email: string, password: string): Promise<AuthResult> {
  const { accessToken, expiresAt, errors } = await createCustomerAccessToken(email, password);
  if (errors.length > 0 || !accessToken || !expiresAt) {
    return { success: false, errors };
  }
  await setSessionCookie(accessToken, expiresAt);
  return { success: true, errors: [] };
}

export async function signUp(input: CreateCustomerInput): Promise<AuthResult> {
  const { customer, errors } = await createCustomer(input);
  if (errors.length > 0 || !customer) {
    return { success: false, errors };
  }
  return logIn(input.email, input.password);
}

export async function recoverPassword(email: string): Promise<AuthResult> {
  const errors = await recoverCustomerPassword(email);
  return { success: errors.length === 0, errors };
}

export async function resetPassword(
  id: string,
  resetToken: string,
  password: string,
): Promise<AuthResult> {
  const customerId = id.startsWith("gid://") ? id : `gid://shopify/Customer/${id}`;
  const { accessToken, expiresAt, errors } = await resetCustomerPassword(
    customerId,
    resetToken,
    password,
  );
  if (errors.length > 0 || !accessToken || !expiresAt) {
    return { success: false, errors };
  }
  await setSessionCookie(accessToken, expiresAt);
  return { success: true, errors: [] };
}

export async function logOut(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await deleteCustomerAccessToken(token);
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SESSION_COOKIE)?.value ?? null;
}

export async function getSession(): Promise<Customer | null> {
  const token = await getSessionToken();
  if (!token) return null;
  const customer = await getCustomerByToken(token);
  if (!customer) {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
  }
  return customer;
}
