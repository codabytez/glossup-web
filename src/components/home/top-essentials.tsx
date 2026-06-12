"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { CarouselArrows } from "@/components/ui/carousel-arrows";
import products from "@/data/products.json";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

const SCROLL_AMOUNT = 296 + 32; // card width + gap

export function TopEssentials() {
  const { scrollRef, canScrollPrev, canScrollNext, onScroll, scrollPrev, scrollNext } =
    useScrollCarousel(SCROLL_AMOUNT);

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpContainer}
      className="px-20 py-30"
    >
      <motion.div variants={fadeUpItem} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image src="/icons/trophy.svg" alt="" width={16} height={16} />
          <span className="text-grey-500 text-sm font-medium">Featured</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h2 className="text-grey-950 flex-1 text-[64px] leading-[1.13] font-light tracking-[-1.28px]">
            Top essentials
          </h2>
          <div className="flex items-center gap-6">
            <CarouselArrows
              onPrev={scrollPrev}
              onNext={scrollNext}
              prevDisabled={!canScrollPrev}
              nextDisabled={!canScrollNext}
            />
            <Button variant="pill" size="pill" className="relative overflow-hidden">
              <span className="bg-secondary-200 absolute -inset-x-px -bottom-px h-0" />
              <span>View all products</span>
              <Image src="/icons/arrow-up-right.svg" alt="" width={10} height={10} />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        variants={fadeUpItem}
        onScroll={onScroll}
        className="-mx-20 mt-9 flex snap-x snap-mandatory scroll-pr-20 scroll-pl-20 scrollbar-none gap-8 overflow-x-auto scroll-smooth pr-20 pb-2 pl-20"
      >
        {products.map((product) => (
          <div key={product.slug} className="snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}
