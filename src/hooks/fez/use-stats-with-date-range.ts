"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useStatsWithDateRange = () =>
  useFezCrud<FezStatsWithDateRangePayload, FezStatsWithDateRangeResponse>(
    FEZ_ENDPOINTS.statsWithDateRange.path,
    { queryKey: [...FEZ_ENDPOINTS.statsWithDateRange.queryKey] },
  );
