"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useCreateOrder = () =>
  useFezCrud<FezCreateOrderPayload, FezCreateOrderResponse>(FEZ_ENDPOINTS.createOrder.path, {
    queryKey: [...FEZ_ENDPOINTS.createOrder.queryKey],
    invalidateKeys: [[...FEZ_ENDPOINTS.orders.queryKey]],
  });
