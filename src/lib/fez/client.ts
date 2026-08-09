// server-only — never import this file from client components or hooks
import "server-only";

import axios from "axios";

import { env } from "@/lib/env";
import { FEZ_ENDPOINTS } from "./endpoints";

let cachedToken: string | null = null;
let tokenExpiry: Date | null = null;

async function getToken(): Promise<string> {
  // Refresh 60s before actual expiry
  if (cachedToken && tokenExpiry && tokenExpiry > new Date(Date.now() + 60_000)) {
    return cachedToken;
  }

  const res = await axios.post<FezAuthResponse>(
    `${env.FEZ_API_BASE_URL}${FEZ_ENDPOINTS.auth.path}`,
    { user_id: env.FEZ_USER_ID, password: env.FEZ_PASSWORD },
    {
      headers: {
        "secret-key": env.FEZ_SECRET_KEY,
        "Content-Type": "application/json",
      },
    },
  );

  if (res.data.status === "Error") {
    throw new Error(`Fez auth failed: ${res.data.description}`);
  }

  const token = res.data.authDetails.authToken;
  cachedToken = token;
  tokenExpiry = new Date(res.data.authDetails.expireToken);
  return token;
}

export const fezApi = axios.create({
  baseURL: env.FEZ_API_BASE_URL,
  headers: {
    "secret-key": env.FEZ_SECRET_KEY,
    "Content-Type": "application/json",
  },
});

fezApi.interceptors.request.use(async (config) => {
  const token = await getToken();
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});
