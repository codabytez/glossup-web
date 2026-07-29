"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useDeliveryTimeEstimate = () =>
  useFezCrud<FezDeliveryTimeEstimatePayload, FezDeliveryTimeEstimateResponse>(
    FEZ_ENDPOINTS.deliveryTimeEstimate.path,
    { queryKey: [...FEZ_ENDPOINTS.deliveryTimeEstimate.queryKey] },
  );
