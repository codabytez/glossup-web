"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useCancelOrder = () =>
  useFezCrud<FezCancelOrderPayload, FezCancelOrderResponse>(FEZ_ENDPOINTS.cancelOrder.path, {
    queryKey: [...FEZ_ENDPOINTS.cancelOrder.queryKey],
    invalidateKeys: [[...FEZ_ENDPOINTS.orders.queryKey], [...FEZ_ENDPOINTS.searchOrders.queryKey]],
  });
