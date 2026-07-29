"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useSearchOrders = () =>
  useFezCrud<FezSearchOrdersPayload, FezSearchOrdersResponse>(FEZ_ENDPOINTS.searchOrders.path, {
    queryKey: [...FEZ_ENDPOINTS.searchOrders.queryKey],
  });
