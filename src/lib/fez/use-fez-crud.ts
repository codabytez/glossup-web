"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Axios instance that proxies through our own Next.js API routes
// This keeps Fez credentials server-only
const fezProxyApi = axios.create({ baseURL: "/api/fez" });

interface FezCrudOptions {
  queryKey?: string | string[];
  invalidateKeys?: string[][];
  enabled?: boolean;
  refetchInterval?: number;
  refetchOnWindowFocus?: boolean;
}

export const useFezCrud = <TParams, TData>(endpoint: string, options?: FezCrudOptions) => {
  const queryClient = useQueryClient();
  const queryKey = Array.isArray(options?.queryKey)
    ? options.queryKey
    : [options?.queryKey ?? endpoint];

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey });
    options?.invalidateKeys?.forEach((key) => {
      queryClient.invalidateQueries({ queryKey: key });
    });
  };

  const getAll = useQuery<TData, Error>({
    queryKey,
    queryFn: async () => {
      const res = await fezProxyApi.get<TData>(endpoint);
      return res.data;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    refetchOnWindowFocus: options?.refetchOnWindowFocus,
  });

  const create = useMutation<TData, Error, TParams | FormData>({
    mutationFn: async (data) => {
      const res = await fezProxyApi.post<TData>(endpoint, data);
      return res.data;
    },
    onSuccess: invalidateAll,
  });

  const update = useMutation<TData, Error, { id?: string | number; data: TParams }>({
    mutationFn: async ({ id, data }) => {
      const url = id ? `${endpoint}/${id}` : endpoint;
      const res = await fezProxyApi.put<TData>(url, data);
      return res.data;
    },
    onSuccess: invalidateAll,
  });

  const remove = useMutation<TData, Error, string | number | TParams>({
    mutationFn: async (idOrData) => {
      if (typeof idOrData === "string" || typeof idOrData === "number") {
        const res = await fezProxyApi.delete<TData>(`${endpoint}/${idOrData}`);
        return res.data;
      }
      const res = await fezProxyApi.delete<TData>(endpoint, { data: idOrData });
      return res.data;
    },
    onSuccess: invalidateAll,
  });

  const post = useMutation<TData, Error, TParams>({
    mutationFn: async (data) => {
      const res = await fezProxyApi.post<TData>(endpoint, data);
      return res.data;
    },
    onSuccess: invalidateAll,
  });

  return { getAll, create, update, remove, post };
};
