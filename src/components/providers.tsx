"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { SignInPromptController } from "@/components/account/sign-in-prompt-controller";
import { FlyToCartProvider } from "@/components/cart/fly-to-cart";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <FlyToCartProvider>{children}</FlyToCartProvider>
      <SignInPromptController />
    </QueryClientProvider>
  );
}
