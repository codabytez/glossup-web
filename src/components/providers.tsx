"use client";

import { FlyToCartProvider } from "@/components/cart/fly-to-cart";

export function Providers({ children }: { children: React.ReactNode }) {
  return <FlyToCartProvider>{children}</FlyToCartProvider>;
}
