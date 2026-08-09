"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getWishlist, toggleWishlistItem } from "@/actions/wishlist";
import { useSession } from "@/hooks/use-session";

export function useWishlist() {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: () => getWishlist(),
    enabled: !!session,
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productHandle: string) => toggleWishlistItem(productHandle),
    onSuccess: (handles) => {
      queryClient.setQueryData(["wishlist"], handles);
    },
  });
}
