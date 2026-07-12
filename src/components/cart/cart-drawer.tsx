"use client";

import Image from "next/image";
import Link from "next/link";

import { CheckIcon } from "@/components/icons/check-icon";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { ShieldIcon } from "@/components/icons/shield-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Sheet, SheetClose, SheetContent } from "@/components/ui/sheet";
import { formatCartTotal, useCartStore, type CartItem } from "@/store/cart-store";

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex gap-4 py-6">
      {/* Product image */}
      <div className="bg-grey-50 relative size-24 shrink-0 sm:size-38">
        <Image src={item.image} alt={item.name} fill sizes="152px" className="object-contain" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between self-stretch">
        {/* Name + price */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-2">
            <p className="text-body-base text-grey-950 font-medium">{item.name}</p>
            {/* Size selector */}
            <div className="flex items-center">
              <span className="text-body-base text-grey-950 font-normal">Size</span>
              <button type="button" className="flex items-center gap-1 rounded-full px-1">
                <span className="text-body-base text-grey-400">• {item.size}</span>
                <ChevronDownIcon className="text-grey-400 size-4" />
              </button>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <p className="text-body-base text-grey-950 font-medium whitespace-nowrap">
              {item.price}
            </p>
            {item.originalPrice && (
              <p className="text-body-caption text-grey-500 font-normal line-through">
                {item.originalPrice}
              </p>
            )}
          </div>
        </div>

        {/* Qty + remove */}
        <div className="flex items-center justify-between">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => updateQuantity(item.slug, item.size, q)}
          />
          <button
            type="button"
            onClick={() => removeItem(item.slug, item.size)}
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

export function CartDrawer() {
  const { items, isOpen, close } = useCartStore();
  const total = formatCartTotal(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && close()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="sm:rounded-tl-4 sm:rounded-bl-4 flex flex-col gap-0 overflow-hidden bg-white p-0"
        style={{ maxWidth: "480px", width: "100%" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between px-4 pt-6 pb-4 sm:px-8 sm:pt-8 sm:pb-6">
          <div className="flex items-center gap-2">
            <CheckIcon className="text-primary-900 size-6" />
            <h2 className="text-header-h2 text-grey-950 font-normal">Added to bag</h2>
          </div>
          <SheetClose
            render={
              <button
                type="button"
                aria-label="Close cart"
                className="text-grey-500 hover:text-grey-950 transition-colors"
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

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8">
          {items.length === 0 ? (
            <p className="text-grey-400 py-12 text-center text-sm">Your bag is empty.</p>
          ) : (
            <div className="divide-grey-100 divide-y">
              {items.map((item) => (
                <CartItemRow key={`${item.slug}-${item.size}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col gap-6 px-4 pt-4 pb-6 sm:px-8 sm:pt-6 sm:pb-8">
          {/* Sign in prompt */}
          <div className="flex items-center gap-2">
            <UserIcon className="text-grey-600 size-5 shrink-0" />
            <p className="text-body-base">
              <Link href="/account" className="text-grey-950 font-medium hover:underline">
                Sign In • Create account
              </Link>
              <span className="text-grey-600 font-normal"> to check out quickly</span>
            </p>
          </div>

          {/* Checkout button */}
          <button
            type="button"
            className="bg-primary-900 flex w-full items-center justify-between rounded-full px-8 py-3 transition-opacity hover:opacity-90"
          >
            <span className="text-secondary-25 flex items-center gap-2 font-medium">
              <ShieldIcon className="size-4 shrink-0" />
              Checkout
            </span>
            <span className="text-secondary-25 font-semibold">{total}</span>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
