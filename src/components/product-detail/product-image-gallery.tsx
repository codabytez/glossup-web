"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

const GALLERY_IMAGES = [
  "/products/the-wash.png",
  "/products/the-scrub.png",
  "/products/the-cream.png",
  "/products/hand-cream.png",
  "/products/gallery-5.png",
  "/products/gallery-6.png",
];

interface ProductImageGalleryProps {
  image: string;
  name: string;
}

export function ProductImageGallery({ image, name }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnails = [image, ...GALLERY_IMAGES.filter((img) => img !== image)].slice(0, 6);

  return (
    <div className="flex flex-col gap-1">
      {/* Main image */}
      <button
        type="button"
        onClick={() => setActiveIndex(0)}
        className="bg-grey-50 relative w-full overflow-hidden"
        style={{ aspectRatio: "704 / 900" }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <Image
              src={thumbnails[activeIndex]}
              alt={name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </button>

      {/* 2×3 thumbnail grid */}
      <div className="grid grid-cols-2 grid-rows-3 gap-1">
        {thumbnails.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="bg-grey-50 relative aspect-square w-full"
          >
            <Image
              src={src}
              alt={`${name} view ${i + 1}`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="pointer-events-none object-contain"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
