"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

interface ProductImageLightboxProps {
  images: string[];
  initialIndex: number;
  name: string;
  onClose: () => void;
}

export function ProductImageLightbox({
  images,
  initialIndex,
  name,
  onClose,
}: ProductImageLightboxProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setActiveIndex((i) => (i - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") setActiveIndex((i) => (i + 1) % images.length);
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIndex((i) => (i + 1) % images.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[60] flex flex-col gap-6 bg-[#27272A] p-4 lg:gap-14 lg:p-14"
    >
      {/* Close */}
      <div className="flex shrink-0 justify-end">
        <button
          type="button"
          aria-label="Close lightbox"
          onClick={onClose}
          className="flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70"
        >
          <X className="size-6" />
        </button>
      </div>

      {/* Image + arrows */}
      <div className="relative flex min-h-0 flex-1 items-center lg:gap-8">
        {/* Desktop prev */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={prev}
          className="border-grey-200 hidden shrink-0 items-center justify-center rounded-full border p-3 text-white transition-colors hover:bg-white/10 lg:flex"
        >
          <ArrowLeft className="size-5" />
        </button>

        {/* Mobile prev — sits in left padding area */}
        <button
          type="button"
          aria-label="Previous image"
          onClick={prev}
          className="border-grey-200 absolute top-1/2 left-[-16px] z-10 flex -translate-y-1/2 items-center justify-center rounded-full border bg-white/5 p-2 text-white lg:hidden"
        >
          <ArrowLeft className="size-4" />
        </button>

        {/* Main image */}
        <div className="bg-grey-50 relative min-h-0 flex-1 self-stretch overflow-hidden rounded-lg">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIndex]}
                alt={`${name} — view ${activeIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-contain"
                priority
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop next */}
        <button
          type="button"
          aria-label="Next image"
          onClick={next}
          className="border-grey-400 hidden shrink-0 items-center justify-center rounded-full border p-3 text-white transition-colors hover:bg-white/10 lg:flex"
        >
          <ArrowRight className="size-5" />
        </button>

        {/* Mobile next — sits in right padding area */}
        <button
          type="button"
          aria-label="Next image"
          onClick={next}
          className="border-grey-400 absolute top-1/2 right-[-16px] z-10 flex -translate-y-1/2 items-center justify-center rounded-full border bg-white/5 p-2 text-white lg:hidden"
        >
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex shrink-0 items-center justify-center gap-4">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            aria-label={`View image ${i + 1}`}
            onClick={() => setActiveIndex(i)}
            className={cn(
              "bg-grey-100 relative shrink-0 overflow-hidden rounded-lg",
              "size-12 lg:size-20",
              i === activeIndex && "outline-primary-900 outline outline-1 outline-offset-2",
            )}
          >
            <Image
              src={src}
              alt={`${name} thumbnail ${i + 1}`}
              fill
              sizes="80px"
              className="pointer-events-none object-contain"
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
