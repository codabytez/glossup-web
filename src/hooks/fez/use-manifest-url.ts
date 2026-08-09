"use client";

import { FEZ_ENDPOINTS } from "@/lib/fez/endpoints";
import { useFezCrud } from "@/lib/fez/use-fez-crud";

export const useManifestUrl = (orderNo: string) =>
  useFezCrud<never, FezManifestUrlResponse>(
    `${FEZ_ENDPOINTS.manifestUrl.path}/${orderNo}/manifest-url`,
    {
      queryKey: [...FEZ_ENDPOINTS.manifestUrl.queryKey, orderNo],
      enabled: !!orderNo,
    },
  );
