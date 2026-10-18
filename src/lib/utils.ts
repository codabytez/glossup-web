import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNaira(amount: string | number) {
  return `₦${Math.round(Number(amount)).toLocaleString("en-NG")}`;
}

export function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatReviewDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function humanizeEnum(value: string): string {
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

type OrderStatusBadgeVariant = "success" | "warning" | "destructive" | "outline";

const ORDER_STATUS_VARIANTS: Record<string, OrderStatusBadgeVariant> = {
  // Fulfillment status (Shopify OrderFulfillmentStatus)
  FULFILLED: "success",
  PARTIALLY_FULFILLED: "warning",
  IN_PROGRESS: "warning",
  ON_HOLD: "warning",
  UNFULFILLED: "outline",
  PENDING_FULFILLMENT: "outline",
  OPEN: "outline",
  SCHEDULED: "outline",
  RESTOCKED: "destructive",
  // Financial status (Shopify OrderFinancialStatus)
  PAID: "success",
  PENDING: "warning",
  AUTHORIZED: "warning",
  PARTIALLY_PAID: "warning",
  PARTIALLY_REFUNDED: "destructive",
  REFUNDED: "destructive",
  VOIDED: "destructive",
};

export function getOrderStatusVariant(status: string): OrderStatusBadgeVariant {
  return ORDER_STATUS_VARIANTS[status.toUpperCase()] ?? "outline";
}
