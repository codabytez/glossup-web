"use client";

import Link from "next/link";

import { OrderCard, OrderCardSkeleton } from "@/components/account/order-card";
import { WordmarkLogo } from "@/components/icons/wordmark";
import { Button } from "@/components/ui/button";
import { useOrdersList } from "@/hooks/use-orders";

export function OrdersListView() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useOrdersList();
  const orders = data?.pages.flatMap((page) => page.orders) ?? [];

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <nav className="border-grey-100 sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-6 sm:px-8 sm:py-8">
        <Link href="/" className="relative block h-6 w-40">
          <WordmarkLogo className="h-6 w-40" color="#990B33" />
        </Link>
        <Link href="/account" className="text-grey-600 hover:text-grey-950 text-sm font-medium">
          Back to account
        </Link>
      </nav>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-8 lg:px-20">
        <p className="text-header-h1 text-grey-950 font-normal">Order History</p>

        {isLoading ? (
          <div className="flex flex-col">
            {Array.from({ length: 5 }, (_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <p className="text-grey-600 text-sm">
            No orders yet — your past orders will show up here.
          </p>
        ) : (
          <>
            <div className="flex flex-col">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
            {hasNextPage && (
              <Button
                variant="ghost"
                size="pill"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-grey-100 text-grey-950 self-center"
              >
                {isFetchingNextPage ? "Loading…" : "Load more"}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
