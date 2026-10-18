"use client";

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getOrder, getOrders } from "@/actions/orders";

const PAGE_SIZE = 10;

export function useRecentOrders(limit = 5) {
  return useQuery({
    queryKey: ["orders", "recent", limit],
    queryFn: () => getOrders({ first: limit }),
  });
}

export function useOrdersList() {
  return useInfiniteQuery({
    queryKey: ["orders", "list"],
    queryFn: ({ pageParam }: { pageParam: string | undefined }) =>
      getOrders({ first: PAGE_SIZE, after: pageParam }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? (lastPage.endCursor ?? undefined) : undefined,
  });
}

export function useOrder(name: string) {
  return useQuery({
    queryKey: ["orders", "detail", name],
    queryFn: () => getOrder(name),
  });
}
