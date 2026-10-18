"use client";

import Image from "next/image";
import Link from "next/link";

import { WordmarkLogo } from "@/components/icons/wordmark";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrder } from "@/hooks/use-orders";
import { getOrderStatusVariant, humanizeEnum } from "@/lib/utils";

interface OrderDetailViewProps {
  orderName: string;
}

function OrderDetailSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-5 w-20 rounded-4xl" />
        </div>
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="divide-grey-100 flex flex-col divide-y">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex items-center gap-4 py-4">
            <Skeleton className="size-16 shrink-0 rounded-sm" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="border-grey-100 flex flex-col gap-3 border-t pt-6">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-3 w-full max-w-80" />
        <Skeleton className="h-3 w-2/3 max-w-60" />
      </div>
    </>
  );
}

export function OrderDetailView({ orderName }: OrderDetailViewProps) {
  const { data: order, isLoading } = useOrder(orderName);
  const trackingEntries = order?.tracking.filter((t) => t.number) ?? [];

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <nav className="border-grey-100 sticky top-0 z-10 flex w-full items-center justify-between border-b px-4 py-6 sm:px-8 sm:py-8">
        <Link href="/" className="relative block h-6 w-40">
          <WordmarkLogo className="h-6 w-40" color="#990B33" />
        </Link>
        <Link
          href="/account/orders"
          className="text-grey-600 hover:text-grey-950 text-sm font-medium"
        >
          Back to orders
        </Link>
      </nav>

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-10 sm:px-8 lg:px-20">
        {isLoading ? (
          <OrderDetailSkeleton />
        ) : !order ? (
          <div className="flex flex-col gap-2">
            <p className="text-header-h2 text-grey-950 font-normal">Order not found</p>
            <p className="text-grey-600 text-sm">
              We couldn&apos;t find that order on your account.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-header-h1 text-grey-950 font-normal">{order.name}</p>
                <Badge
                  variant={getOrderStatusVariant(order.fulfillmentStatus)}
                  className="font-semibold uppercase"
                >
                  {humanizeEnum(order.fulfillmentStatus)}
                </Badge>
                {order.financialStatus && (
                  <Badge
                    variant={getOrderStatusVariant(order.financialStatus)}
                    className="font-semibold uppercase"
                  >
                    {humanizeEnum(order.financialStatus)}
                  </Badge>
                )}
              </div>
              <p className="text-grey-600 text-sm">
                {new Date(order.processedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            {trackingEntries.length > 0 && (
              <div className="border-grey-100 flex flex-col gap-2 rounded-sm border p-4">
                <p className="text-grey-950 text-sm font-medium">Tracking</p>
                {trackingEntries.map((t, i) => (
                  <p key={i} className="text-grey-600 text-sm">
                    {t.company ?? "Carrier"} —{" "}
                    {t.url ? (
                      <a
                        href={t.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-900 hover:underline"
                      >
                        {t.number}
                      </a>
                    ) : (
                      t.number
                    )}
                  </p>
                ))}
              </div>
            )}

            <div className="divide-grey-100 flex flex-col divide-y">
              {order.lineItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4 py-4">
                  <div className="border-grey-100 bg-grey-50 relative size-16 shrink-0 overflow-hidden rounded-sm border">
                    {item.image && (
                      <Image src={item.image} alt={item.title} fill className="object-contain" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <p className="text-grey-950 text-sm font-medium">{item.title}</p>
                    <p className="text-grey-500 text-xs">
                      {item.variantTitle} • Qty {item.quantity}
                    </p>
                  </div>
                  <p className="text-grey-950 text-sm font-medium">{item.price}</p>
                </div>
              ))}
            </div>

            <div className="border-grey-100 flex flex-col gap-2 border-t pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-grey-600">Subtotal</span>
                <span className="text-grey-950">{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grey-600">Shipping</span>
                <span className="text-grey-950">{order.shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-grey-600">Tax</span>
                <span className="text-grey-950">{order.tax}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-grey-950">Total</span>
                <span className="text-grey-950">{order.total}</span>
              </div>
            </div>

            {order.shippingAddress && (
              <div className="flex flex-col gap-2">
                <p className="text-grey-950 text-sm font-medium">Shipping address</p>
                <p className="text-grey-600 text-sm">
                  {[order.shippingAddress.address1, order.shippingAddress.address2]
                    .filter(Boolean)
                    .join(", ")}
                  <br />
                  {[
                    order.shippingAddress.city,
                    order.shippingAddress.province,
                    order.shippingAddress.zip,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                  <br />
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
