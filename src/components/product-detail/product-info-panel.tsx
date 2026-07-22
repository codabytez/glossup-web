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
import { useCartStore } from "@/store/cart-store";

const SIZES = ["25ml", "50ml", "75ml"];

interface ProductInfoPanelProps {
  slug: string;
  name: string;
  image: string;
  description: string;
  price: string;
  originalPrice?: string;
  rating: number;
  reviewCount: string;
  onShare: () => void;
}

export function ProductInfoPanel({
  slug,
  name,
  image,
  description,
  price,
  originalPrice,
  rating,
  reviewCount,
  onShare,
}: ProductInfoPanelProps) {
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  const [quantity, setQuantity] = useState(2);
  const [isSaved, setIsSaved] = useState(false);
  const { addItem, open } = useCartStore();

  return (
    <div className="mx-auto flex w-full max-w-100 flex-col gap-14">
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
                onClick={() => setIsSaved((s) => !s)}
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
            {price}
          </p>
          {originalPrice && (
            <p className="text-body-base text-grey-500 leading-[1.4] font-normal line-through">
              {originalPrice}
            </p>
          )}
        </div>

        {/* Description */}
        <p className="text-body-base text-grey-700 leading-[1.4] font-normal">{description}</p>

        {/* Size selector */}
        <div className="flex flex-col gap-2">
          <div className="text-body-base flex items-center gap-2">
            <span className="text-grey-950">Size</span>
            <span className="text-grey-400">• {selectedSize}</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {SIZES.map((size) => (
              <Badge
                key={size}
                render={<button type="button" onClick={() => setSelectedSize(size)} />}
                variant={selectedSize === size ? "filter-active" : "filter"}
                className="py-2"
              >
                {size}
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
            price={price}
            fillColor="primary"
            className="border-grey-800 w-full rounded-[1px] border px-6 py-3.5 sm:flex-1"
            onClick={() => {
              addItem({ slug, name, image, price, originalPrice, size: selectedSize });
              open();
            }}
          />
        </div>

        <Button variant="primary" size="pill" className="w-full">
          Buy now
        </Button>
      </div>

      {/* Divider */}
      <div className="bg-grey-100 h-px w-full" />

      {/* Feature sections */}
      <ProductFeatures />
    </div>
  );
}
