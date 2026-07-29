"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useStates = () =>
  useFezCrud<never, FezStatesResponse>(FEZ_ENDPOINTS.states.path, {
    queryKey: [...FEZ_ENDPOINTS.states.queryKey],
  });
