import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getOrderStatusVariant, humanizeEnum } from "@/lib/utils";

function OrderItemThumbnails({ lineItems }: { lineItems: OrderLineItem[] }) {
  return (
    <div className="flex -space-x-3">
      {lineItems.slice(0, 4).map((item, i) => (
        <div
          key={`${item.title}-${i}`}
          className="border-grey-100 bg-grey-50 relative size-12 shrink-0 overflow-hidden rounded-sm border"
        >
          {item.image && (
            <Image src={item.image} alt={item.title} fill className="object-contain" />
          )}
        </div>
      ))}
    </div>
  );
}

export function OrderCard({ order }: { order: CustomerOrder }) {
  const itemCount = order.lineItems.reduce((sum, item) => sum + item.quantity, 0);
  const date = new Date(order.processedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="border-grey-100 flex flex-col gap-4 border-b py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <OrderItemThumbnails lineItems={order.lineItems} />
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-grey-950 text-sm font-medium">{order.name}</span>
            <Badge
              variant={getOrderStatusVariant(order.fulfillmentStatus)}
              className="font-semibold uppercase"
            >
              {humanizeEnum(order.fulfillmentStatus)}
            </Badge>
          </div>
          <p className="text-grey-500 text-xs">
            {date} • {itemCount} {itemCount === 1 ? "item" : "items"} • {order.total}
          </p>
        </div>
      </div>

      <Link
        href={`/account/orders/${encodeURIComponent(order.name)}`}
        className="text-primary-900 shrink-0 text-sm font-medium hover:underline"
      >
        View details
      </Link>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="border-grey-100 flex flex-col gap-4 border-b py-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex -space-x-3">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="border-grey-100 size-12 shrink-0 rounded-sm border" />
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-5 w-20 rounded-4xl" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      <Skeleton className="h-4 w-20 shrink-0" />
    </div>
  );
}
