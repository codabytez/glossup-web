import Image from "next/image";
import Link from "next/link";

import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right-icon";
import { Button } from "@/components/ui/button";
import { WordmarkLogo } from "../icons/wordmark";

export function CheckoutSuccessView() {
  return (
    <div className="flex min-h-full flex-col">
      <nav className="border-grey-100 sticky top-0 z-50 border-b bg-white px-4 py-6 sm:px-8 lg:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <Link href="/" className="relative block h-6 w-40">
            <WordmarkLogo className="h-6 w-40" color="#990B33" />
          </Link>
        </div>
      </nav>

      <main className="relative mx-auto flex w-full max-w-384 flex-1 items-center justify-center overflow-hidden px-4 py-16 sm:px-8 sm:py-24 lg:px-20">
        <Image
          src="/checkout/confetti-left.svg"
          alt="Confetti decoration"
          unoptimized
          width={155}
          height={256}
          className="pointer-events-none absolute top-1/2 left-[5%] hidden w-30 -translate-y-1/2 lg:left-[13%] lg:block lg:w-38.75"
        />

        <Image
          src="/checkout/confetti-right.svg"
          alt="Confetti decoration"
          unoptimized
          width={235}
          height={303}
          className="pointer-events-none absolute top-1/2 right-[5%] hidden w-38.75 -translate-y-1/2 rotate-16 lg:right-[13%] lg:block lg:w-58.75"
        />

        <div className="relative flex w-full max-w-100 flex-col items-center gap-18">
          <div
            role="img"
            aria-label="A paper plane flying from a shopping cart with a success checkmark"
            className="relative h-73 w-61 shrink-0"
          >
            <div className="absolute" style={{ inset: "25.98% 18% 24.71% 38.97%" }}>
              <Image
                src="/checkout/paper-plane.svg"
                alt="Paper plane"
                fill
                unoptimized
                aria-hidden="true"
                className="object-fill"
              />
            </div>

            <div className="absolute" style={{ inset: "56.51% 38.27% 0.3% 0" }}>
              <Image
                src="/checkout/cart-illustration.svg"
                alt="Shopping cart"
                fill
                unoptimized
                aria-hidden="true"
                className="object-fill"
              />
            </div>

            <div className="absolute" style={{ inset: "0 0.17% 67.12% 51.23%" }}>
              <Image
                src="/checkout/illustration-top.svg"
                alt="Paper plane path"
                fill
                unoptimized
                aria-hidden="true"
                className="object-fill"
              />
            </div>

            <div className="absolute top-17.75 left-46 size-12">
              <Image
                src="/checkout/success-circle.svg"
                alt="Success circle"
                fill
                unoptimized
                aria-hidden="true"
              />
            </div>

            <div className="absolute top-16.75 left-45 size-14">
              <div className="absolute inset-[8.33%]">
                <Image
                  src="/checkout/check-icon.svg"
                  alt="Checkmark"
                  fill
                  unoptimized
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Text and actions */}
          <div className="flex w-full flex-col gap-6">
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
              <Button
                href="/account/orders"
                variant="ghost"
                size="pill"
                fillOnHover
                fillVariant="secondary"
                className="bg-grey-100 w-full font-normal sm:flex-1"
              >
                <span className="flex items-center gap-3">
                  View order
                  <ArrowUpRightIcon className="size-3" />
                </span>
              </Button>
              <Button href="/products" variant="primary" size="pill" className="w-full sm:w-auto">
                Continue shopping
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
