"use client";

import { useState } from "react";
import { motion } from "motion/react";

import { ShareIcon } from "@/components/icons/share-icon";
import { HeartIcon } from "@/components/icons/heart-icon";
import { StarRating } from "@/components/product/star-rating";
import { ProductFeatures } from "@/components/product-detail/product-features";
import { AddToBagButton } from "@/components/ui/add-to-bag-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { useAddToCart } from "@/hooks/use-cart";
import { useSession } from "@/hooks/use-session";
import { useToggleWishlist, useWishlist } from "@/hooks/use-wishlist";
import { useSignInPromptStore } from "@/store/sign-in-prompt-store";

interface ProductInfoPanelProps {
  slug: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: string;
  features: ProductFeatureContent;
  variants: ProductVariant[];
  onShare: () => void;
}

export function ProductInfoPanel({
  slug,
  name,
  description,
  rating,
  reviewCount,
  features,
  variants,
  onShare,
}: ProductInfoPanelProps) {
  const [selectedVariant, setSelectedVariant] = useState(variants[2] ?? variants[0]);
  const [quantity, setQuantity] = useState(2);
  const addToCart = useAddToCart();
  const { data: session } = useSession();
  const { data: wishlistHandles = [] } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const triggerSignInPrompt = useSignInPromptStore((s) => s.trigger);
  const isSaved = wishlistHandles.includes(slug);

  const toggleSaved = () => {
    if (!session) {
      triggerSignInPrompt();
      return;
    }
    toggleWishlist.mutate(slug);
  };

  return (
    <div className="mx-auto flex w-full max-w-100 flex-col gap-14 2xl:w-100">
      {/* Product specs */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          {/* Title + icons */}
          <div className="flex w-full items-center justify-between">
            <p className="text-header-h1 text-grey-950 leading-[1.24] font-normal whitespace-nowrap">
              {name}
            </p>
            <div className="flex shrink-0 items-start gap-4">
              <motion.button
                type="button"
                aria-label="Share product"
                onClick={onShare}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="text-grey-700 hover:bg-secondary-100 hover:text-grey-950 rounded-full p-2 transition-colors"
              >
                <ShareIcon className="size-5" />
              </motion.button>
              <motion.button
                type="button"
                aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={isSaved}
                onClick={toggleSaved}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                className="text-grey-700 hover:bg-secondary-100 hover:text-grey-950 rounded-full p-2 transition-colors"
              >
                <motion.span
                  key={isSaved ? "saved" : "unsaved"}
                  initial={{ scale: 0.6 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="block"
                >
                  <HeartIcon filled={isSaved} className="size-5" />
                </motion.span>
              </motion.button>
            </div>
          </div>

          {/* Rating */}
          <StarRating rating={rating} reviewCount={reviewCount} />
        </div>

        {/* Price */}
        <div className="flex h-6 items-baseline gap-2">
          <p className="text-header-h3 text-grey-950 leading-[1.2] font-semibold whitespace-nowrap">
            {selectedVariant.price}
          </p>
          {selectedVariant.compareAtPrice && (
            <p className="text-body-base text-grey-500 leading-[1.4] font-normal line-through">
              {selectedVariant.compareAtPrice}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-body-base text-grey-700 leading-[1.4] font-normal">{description}</p>

        {/* Size selector */}
        <div className="flex flex-col gap-2">
          <div className="text-body-base flex items-center gap-2">
            <span className="text-grey-950">Size</span>
            <span className="text-grey-400">• {selectedVariant.size}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {variants.map((variant) => (
              <Badge
                key={variant.id}
                render={<button type="button" onClick={() => setSelectedVariant(variant)} />}
                variant={selectedVariant.id === variant.id ? "filter-active" : "filter"}
                className="py-2"
              >
                {variant.size}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="bg-grey-100 h-px w-full" />

      {/* Quantity + CTA */}
      <div className="flex flex-col gap-6">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center">
          <QuantityStepper value={quantity} onChange={setQuantity} className="w-fit" />
          <AddToBagButton
            price={selectedVariant.price}
            fillColor="secondary"
            className="border-grey-800 w-full rounded-[1px] border px-6 py-3.5 sm:flex-1"
            onClick={() => addToCart.mutate({ variantId: selectedVariant.id, quantity })}
          />
        </div>

        <Button
          variant="primary"
          size="pill"
          className="w-full"
          onClick={async () => {
            const cart = await addToCart.mutateAsync({
              variantId: selectedVariant.id,
              quantity,
            });
            if (cart) window.location.href = cart.checkoutUrl;
          }}
        >
          Buy now
        </Button>
      </div>

      {/* Divider */}
      <div className="bg-grey-100 h-px w-full" />

      {/* Feature sections */}
      <ProductFeatures {...features} />
    </div>
  );
}
