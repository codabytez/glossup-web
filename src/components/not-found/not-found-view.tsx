import Image from "next/image";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export function NotFoundView() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-12 bg-white px-4 pt-24 pb-16 sm:gap-18 sm:px-8 sm:pb-20">
        <Image
          src="/not-found/page-not-found.svg"
          alt=""
          width={422}
          height={280}
          className="h-auto w-full max-w-105.5"
        />

        <div className="flex w-full max-w-107 flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-grey-950 text-header-h1 leading-[1.13] font-light tracking-[-0.64px] sm:text-5xl sm:tracking-[-1.28px] md:text-[64px] lg:text-[64px] lg:tracking-[-1.28px]">
              Aww, we can’t find that page
            </h1>
            <p className="text-body-large leading-6 font-normal text-[#343332]">
              The page may have moved or no longer exists.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row">
            <Button
              href="/"
              variant="ghost"
              size="pill"
              fillOnHover
              fillVariant="secondary"
              className="bg-grey-100 w-full font-normal sm:flex-1"
            >
              Take me home
            </Button>
            <Button href="/products" variant="primary" size="pill" className="w-full sm:flex-1">
              Go shopping
            </Button>
          </div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
