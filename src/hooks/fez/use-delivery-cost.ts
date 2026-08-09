"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useDeliveryCost = () =>
  useFezCrud<FezDeliveryCostPayload, FezDeliveryCostResponse>(FEZ_ENDPOINTS.deliveryCost.path, {
    queryKey: [...FEZ_ENDPOINTS.deliveryCost.queryKey],
  });
