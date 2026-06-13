"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { useState } from "react";

import { HeartIcon } from "@/components/icons/heart-icon";
import { StarRating } from "@/components/product/star-rating";
import { Button } from "@/components/ui/button";
import { IMAGE_TRANSITION, TRANSITION } from "@/lib/motion";
import type { Product } from "@/types/product";

type ProductCardProps = Product;

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

const badgeVariants = {
  rest: { opacity: 0, scale: 0.85, y: -8 },
  hover: { opacity: 1, scale: 1, y: 0 },
};

const saveVariants = {
  rest: { opacity: 0, scale: 0.85, y: 24 },
  hover: { opacity: 1, scale: 1, y: 0 },
};

export function ProductCard({
  image,
  name,
  description,
  price,
  rating,
  reviewCount,
}: ProductCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="relative h-108 w-74 shrink-0 overflow-hidden"
    >
      <div className="bg-grey-100 absolute inset-0 overflow-hidden">
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
        className="absolute right-4 bottom-20"
      >
        <Button
          variant="outline"
          aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={isSaved}
          onClick={() => setIsSaved((prev) => !prev)}
          className="h-auto w-auto rounded-full border-[0.5px] border-white bg-white p-2 backdrop-blur-[1px] hover:bg-white"
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
        </Button>
      </motion.div>

      <motion.div
        variants={panelVariants}
        transition={TRANSITION}
        className="absolute inset-x-0 bottom-0 flex flex-col"
      >
        <motion.div
          variants={detailsVariants}
          transition={TRANSITION}
          className="flex flex-col gap-1 overflow-hidden"
        >
          <p className="text-grey-950 text-base font-medium">{name}</p>
          <p className="text-grey-700 text-sm">{description}</p>
        </motion.div>
        <motion.button
          type="button"
          variants={buttonVariants}
          transition={TRANSITION}
          className="group/add-to-bag border-grey-200 relative flex h-13.25 w-full shrink-0 items-center justify-between overflow-hidden border bg-white px-6 py-3"
        >
          <span className="bg-primary-900 absolute -inset-x-px -bottom-px h-0 transition-[height] duration-300 group-hover/add-to-bag:h-full" />
          <span className="text-grey-900 relative text-base transition-colors duration-300 group-hover/add-to-bag:text-white">
            Add to bag
          </span>
          <span className="text-primary-900 relative text-base font-medium transition-colors duration-300 group-hover/add-to-bag:text-white">
            {price}
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
