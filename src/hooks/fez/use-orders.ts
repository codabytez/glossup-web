"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useOrders = (orderId: string) =>
  useFezCrud<FezCreateOrderPayload, FezGetOrderResponse>(
    `${FEZ_ENDPOINTS.orders.path}/${orderId}`,
    { queryKey: [...FEZ_ENDPOINTS.orders.queryKey, orderId] },
  );
