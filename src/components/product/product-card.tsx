"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, type MotionProps } from "motion/react";
import { useRef, useState } from "react";

import { useFlyToCart } from "@/components/cart/fly-to-cart";
import { useCartStore } from "@/store/cart-store";
import { HeartIcon } from "@/components/icons/heart-icon";
import { StarRating } from "@/components/product/star-rating";
import { AddToBagButton } from "@/components/ui/add-to-bag-button";
import { Button } from "@/components/ui/button";
import { IMAGE_TRANSITION, TRANSITION } from "@/lib/motion";

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.5 },
};

const detailsVariants = {
  rest: { height: "auto", opacity: 1, marginBottom: 16 },
  hover: { height: 0, opacity: 0, marginBottom: 0 },
};

const panelVariants = {
  rest: { paddingLeft: 0, paddingRight: 0, paddingBottom: 0, backgroundColor: "#FFFFFF" },
  hover: {
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 16,
    backgroundColor: "rgba(255,255,255,0)",
  },
};

const buttonVariants = {
  rest: { borderColor: "#E4E4E7", boxShadow: "0 0px 0px rgba(0,0,0,0)" },
  hover: { borderColor: "rgba(228,228,231,0)", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" },
};

const MotionAddToBagButton = motion.create(AddToBagButton);
const MotionButton = motion.create(Button);

const badgeVariants = {
  rest: { opacity: 0, scale: 0.85, y: -8 },
  hover: { opacity: 1, scale: 1, y: 0 },
};

const saveVariants = {
  rest: { opacity: 0, scale: 0.85, y: 24 },
  hover: { opacity: 1, scale: 1, y: 0 },
};

export function ProductCard({
  slug,
  image,
  name,
  description,
  price,
  rating,
  reviewCount,
}: Product) {
  const [isSaved, setIsSaved] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const fly = useFlyToCart();
  const addItem = useCartStore((s) => s.addItem);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="group/product-card relative h-108 w-74 shrink-0 overflow-hidden"
    >
      <Link href={`/products/${slug}`} aria-label={name} className="absolute inset-0 z-10" />

      <div ref={imageRef} className="absolute inset-0 overflow-hidden bg-gray-50">
        <motion.div
          variants={imageVariants}
          transition={IMAGE_TRANSITION}
          className="absolute inset-0 origin-top"
        >
          <Image src={image} alt={name} fill sizes="296px" className="object-contain object-top" />
        </motion.div>
      </div>

      <motion.div
        variants={badgeVariants}
        transition={TRANSITION}
        className="absolute top-2 right-2"
      >
        <StarRating rating={rating} reviewCount={reviewCount} />
      </motion.div>

      <motion.div
        variants={saveVariants}
        transition={TRANSITION}
        className="absolute right-4 bottom-20 z-20"
      >
        <MotionButton
          variant="outline"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={isSaved}
          onClick={() => setIsSaved((prev) => !prev)}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          className="hover:bg-secondary-100 h-auto w-auto rounded-full! border-0 bg-white p-2 backdrop-blur-[1px]"
        >
          <motion.span
            key={isSaved ? "saved" : "unsaved"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
            className="block"
          >
            <HeartIcon filled={isSaved} className="size-4" />
          </motion.span>
        </MotionButton>
      </motion.div>

      <motion.div
        variants={panelVariants}
        transition={TRANSITION}
        className="absolute inset-x-0 bottom-0 z-20 flex flex-col"
      >
        <motion.div
          variants={detailsVariants}
          transition={TRANSITION}
          className="flex flex-col gap-1 overflow-hidden pt-6"
        >
          <p className="text-grey-950 text-base font-medium">{name}</p>
          <p className="text-grey-700 text-sm">{description}</p>
        </motion.div>
        <MotionAddToBagButton
          price={price}
          fillColor="primary"
          variants={buttonVariants as MotionProps["variants"]}
          transition={TRANSITION}
          onClick={() => {
            addItem({ slug, name, image, price, size: "Default" });
            if (imageRef.current) fly(image, imageRef.current.getBoundingClientRect());
          }}
          className="border-grey-200 h-13.25 w-full shrink-0 border px-6 py-3 group-hover/product-card:border-0 group-hover/product-card:bg-white"
        />
      </motion.div>
    </motion.div>
  );
}
