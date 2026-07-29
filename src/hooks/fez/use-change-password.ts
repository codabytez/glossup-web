"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useChangePassword = () =>
  useFezCrud<FezChangePasswordPayload, FezChangePasswordResponse>(
    FEZ_ENDPOINTS.changePassword.path,
    { queryKey: [...FEZ_ENDPOINTS.changePassword.queryKey] },
  );
