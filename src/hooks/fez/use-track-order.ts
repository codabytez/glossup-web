"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useTrackOrder = (orderNumber: string) =>
  useFezCrud<never, FezTrackOrderResponse>(`${FEZ_ENDPOINTS.trackOrder.path}/${orderNumber}`, {
    queryKey: [...FEZ_ENDPOINTS.trackOrder.queryKey, orderNumber],
    enabled: !!orderNumber,
  });
