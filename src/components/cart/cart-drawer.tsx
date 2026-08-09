"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import { BagIcon } from "@/components/icons/bag-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import {
  useCart,
  useChangeCartLineSize,
  useRemoveCartLine,
  useUpdateCartLineQuantity,
} from "@/hooks/use-cart";
import { parsePrice } from "@/lib/product-filters";
import { toNaira } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";

function CartItemRow({ line }: { line: CartLine }) {
  const updateQuantity = useUpdateCartLineQuantity();
  const removeLine = useRemoveCartLine();
  const changeSize = useChangeCartLineSize();

  const sizeDropdown = (
    <Dropdown
      key={line.size}
      variant="link"
      options={line.productVariants.map((v) => v.size)}
      placeholder="Size"
      defaultValue={line.size}
      expandedWidth={100}
      onSelect={(newSize) => {
        const newVariantId = line.productVariants.find((v) => v.size === newSize)?.id;
        if (newVariantId) changeSize.mutate({ lineId: line.id, newVariantId });
      }}
    />
  );

  return (
    <div className="flex gap-2 py-4 sm:gap-4 sm:py-6">
      {/* Product image */}
      <div className="bg-grey-50 relative size-14 shrink-0 sm:size-38">
        <Image
          src={line.image}
          alt={line.name}
          fill
          sizes="(max-width: 640px) 56px, 152px"
          className="object-contain"
        />
      </div>

      {/* ── Mobile layout (< sm) ── */}
      <div className="flex min-w-0 flex-1 items-start sm:hidden">
        {/* Left: name / size / remove */}
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-grey-950 truncate text-xs font-normal">{line.name}</p>
          {sizeDropdown}
          <button type="button" onClick={() => removeLine.mutate(line.id)} className="mt-0.5 w-fit">
            <span className="text-grey-800 text-xs font-medium underline">Remove</span>
          </button>
        </div>
        {/* Right: price (top) / qty stepper (bottom) */}
        <div className="flex h-full shrink-0 flex-col items-end justify-between">
          <p className="text-grey-950 text-xs font-medium whitespace-nowrap">{line.price}</p>
          <QuantityStepper
            value={line.quantity}
            onChange={(q) => updateQuantity.mutate({ lineId: line.id, quantity: q })}
          />
        </div>
      </div>

      {/* ── Desktop layout (sm+) ── */}
      <div className="hidden flex-1 flex-col justify-between self-stretch sm:flex">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-5">
          <div className="flex flex-col gap-2">
            <p className="text-body-base text-grey-950 line-clamp-2 font-medium">{line.name}</p>
            {sizeDropdown}
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-body-base text-grey-950 font-medium whitespace-nowrap">
              {line.price}
            </p>
            {line.compareAtPrice && (
              <p className="text-body-caption text-grey-500 font-normal line-through">
                {line.compareAtPrice}
              </p>
            )}
          </div>
        </div>
        {/* Qty + remove */}
        <div className="flex items-center justify-between">
          <QuantityStepper
            value={line.quantity}
            onChange={(q) => updateQuantity.mutate({ lineId: line.id, quantity: q })}
          />
          <button
            type="button"
            onClick={() => removeLine.mutate(line.id)}
            className="group relative py-0.5"
          >
            <span className="text-body-base text-grey-600 font-medium">Remove</span>
            <span className="bg-grey-600 absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-18 px-4 py-12 sm:px-8">
      <Image
        src="/cart/empty-bag.svg"
        alt=""
        width={302}
        height={240}
        className="h-auto w-full max-w-75.5"
      />

      <div className="flex w-full max-w-100 flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-grey-950 text-header-h2 font-medium">Your bag is empty</p>
          <p className="text-body-large leading-6 font-normal text-[#343332]">
            Browse our collection and add items to your bag
          </p>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <Button
            href="/account"
            variant="ghost"
            size="pill"
            fillOnHover
            fillVariant="secondary"
            className="bg-grey-100 w-full font-normal sm:flex-1"
          >
            Sign In
          </Button>
          <Button href="/products" variant="primary" size="pill" className="w-full sm:flex-1">
            Browse products
          </Button>
        </div>
      </div>
    </div>
  );
}

export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const { data: cart } = useCart();
  const lines = cart?.lines ?? [];
  const total = toNaira(
    lines.reduce((sum, line) => sum + parsePrice(line.price) * line.quantity, 0),
  );
  const isEmpty = lines.length === 0;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="sm:rounded-tl-4 sm:rounded-bl-4 flex flex-col gap-0 overflow-hidden bg-white p-0"
        style={{ maxWidth: "595px", width: "100%" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
          <div className="flex items-center gap-2">
            <BagIcon className="text-grey-950 size-5" />
            <h2 className="text-header-h2 text-grey-950 font-normal">
              Your bag{lines.length > 0 ? ` (${lines.length})` : ""}
            </h2>
          </div>
          <SheetClose
            render={
              <button
                type="button"
                aria-label="Close cart"
                className="text-grey-950 transition-opacity hover:opacity-70"
              />
            }
          >
            <svg viewBox="0 0 24 24" fill="none" className="size-6">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </SheetClose>
        </div>

        {isEmpty ? (
          <EmptyCart />
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8">
              <div className="divide-grey-100 divide-y">
                {lines.map((line) => (
                  <CartItemRow key={line.id} line={line} />
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 flex-col gap-6 px-4 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
              {/* Sign in prompt */}
              <div className="flex items-center justify-center gap-2">
                <UserIcon className="text-grey-600 size-5 shrink-0" />
                <p className="text-body-base">
                  <Link href="/account" className="text-grey-950 font-medium hover:underline">
                    Sign In • Create account
                  </Link>
                  <span className="text-grey-600 font-normal"> to check out quickly</span>
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  variant="ghost"
                  size="pill"
                  fillOnHover
                  fillVariant="secondary"
                  onClick={close}
                  className="bg-grey-100 text-grey-950 flex-1"
                >
                  Continue shopping
                </Button>
                <Button
                  variant="primary"
                  size="pill"
                  href={cart?.checkoutUrl}
                  startIcon={
                    <span className="flex items-center gap-1 font-medium">
                      <Image
                        src="/icons/shield.svg"
                        alt=""
                        width={16}
                        height={16}
                        className="shrink-0"
                      />
                      Checkout
                    </span>
                  }
                  endIcon={<span className="font-semibold">{total}</span>}
                  className="text-secondary-25 flex-1 justify-between gap-0 px-8"
                />
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
