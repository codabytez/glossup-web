import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right-icon";
import { CartSuccessIcon } from "@/components/icons/cart-success-icon";

import { Confetti } from "./confetti";

export function CheckoutSuccessView() {
  return (
    <div className="flex min-h-full flex-col">
      <nav className="border-grey-100 sticky top-0 z-50 border-b bg-white px-4 py-6 sm:px-8 lg:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <Link href="/" className="relative block h-6 w-40">
            <Image
              src="/logos/primary-logo-black.png"
              alt="Gloss Up"
              fill
              sizes="160px"
              priority
              className="object-contain object-left"
            />
          </Link>
        </div>
      </nav>

      <main className="relative flex flex-1 items-center justify-center px-4 py-14 sm:px-8 sm:py-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Confetti className="h-full w-full" />
        </div>

        <div className="relative flex w-full max-w-100 flex-col items-center gap-6">
          <div className="flex size-30 shrink-0 items-center justify-center rounded-full bg-[#faeee1]">
            <CartSuccessIcon className="size-15" />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-header-h2 text-grey-950 font-medium">
              Your order is on its way to you
            </h1>
            <p className="text-body-large text-grey-700 leading-6 font-normal">
              Your payment was successful and your order has been placed. You&apos;ll be contacted
              for delivery soon.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <Link
              href="/account/orders"
              className="bg-grey-100 flex flex-1 items-center justify-center gap-2 rounded-full px-6 py-3 transition-opacity hover:opacity-90"
            >
              <span className="text-body-large text-grey-950 font-normal">View order</span>
              <ArrowUpRightIcon className="text-grey-950 size-4" />
            </Link>
            <Link
              href="/products"
              className="bg-primary-900 flex shrink-0 items-center justify-center gap-2 rounded-full px-6 py-3 transition-opacity hover:opacity-90"
            >
              <span className="text-body-large text-secondary-50 font-medium">
                Continue shopping
              </span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
