"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { CategoryCard } from "@/components/home/category-card";
import { CarouselArrows } from "@/components/ui/carousel-arrows";
import categories from "@/data/categories.json";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

const SCROLL_AMOUNT = 296 + 16; // card width + gap

export function ShopByCategory() {
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
          <Image src="/icons/tag.svg" alt="" width={16} height={16} />
          <span className="text-grey-500 text-sm font-medium">Shop by category</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h2 className="text-grey-950 flex-1 text-[64px] leading-[1.13] font-light tracking-[-1.28px]">
            Curated for your routine
          </h2>
          <CarouselArrows
            onPrev={scrollPrev}
            onNext={scrollNext}
            prevDisabled={!canScrollPrev}
            nextDisabled={!canScrollNext}
          />
        </div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        variants={fadeUpItem}
        onScroll={onScroll}
        className="-mx-20 mt-9 flex snap-x snap-mandatory scroll-pr-20 scroll-pl-20 scrollbar-none gap-4 overflow-x-auto scroll-smooth pr-20 pb-2 pl-20"
      >
        {categories.map((category) => (
          <div key={category.slug} className="snap-start">
            <CategoryCard {...category} />
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
}
