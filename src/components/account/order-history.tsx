"use client";

import Link from "next/link";

import { OrderCard, OrderCardSkeleton } from "@/components/account/order-card";
import { useRecentOrders } from "@/hooks/use-orders";

const PREVIEW_LIMIT = 5;

export function OrderHistory() {
  const { data, isLoading } = useRecentOrders(PREVIEW_LIMIT);
  const orders = data?.orders ?? [];

  if (isLoading) {
    return (
      <div className="flex flex-col">
        {Array.from({ length: 3 }, (_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <p className="text-grey-600 text-sm">No orders yet — your past orders will show up here.</p>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
      {data?.hasNextPage && (
        <Link
          href="/account/orders"
          className="text-primary-900 self-start pt-4 text-sm font-medium hover:underline"
        >
          View all orders
        </Link>
      )}
    </div>
  );
}
