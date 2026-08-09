"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useUpdateOrder = () =>
  useFezCrud<FezUpdateOrderPayload[], FezUpdateOrderResponse>(FEZ_ENDPOINTS.updateOrder.path, {
    queryKey: [...FEZ_ENDPOINTS.updateOrder.queryKey],
    invalidateKeys: [[...FEZ_ENDPOINTS.orders.queryKey]],
  });
