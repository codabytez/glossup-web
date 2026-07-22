"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

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
      className="px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-30 xl:px-20"
    >
      <motion.div variants={fadeUpItem} className="flex flex-col gap-4 2xl:mx-auto 2xl:max-w-384">
        <div className="flex items-center gap-2">
          <Image src="/icons/tag.svg" alt="Tag icon" width={16} height={16} />
          <span className="text-grey-500 text-sm font-medium uppercase">Shop by category</span>
        </div>
        <div className="flex items-baseline gap-4">
          <h2 className="text-grey-950 text-header-h1 flex-1 leading-[1.13] font-light tracking-[-0.64px] sm:text-5xl sm:tracking-[-1.28px] md:text-[64px] lg:text-[64px] lg:tracking-[-1.28px] 2xl:text-[80px] 2xl:tracking-[-1.6px]">
            Curated for your routine
          </h2>
          <div className="hidden sm:flex">
            <CarouselArrows
              onPrev={scrollPrev}
              onNext={scrollNext}
              prevDisabled={!canScrollPrev}
              nextDisabled={!canScrollNext}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        variants={fadeUpItem}
        onScroll={onScroll}
        className="-mx-4 mt-9 flex snap-x snap-mandatory scroll-pr-4 scroll-pl-4 scrollbar-none gap-4 overflow-x-auto scroll-smooth pr-4 pb-2 pl-4 sm:-mx-8 sm:scroll-pr-8 sm:scroll-pl-8 sm:pr-8 sm:pl-8 lg:-mx-10 lg:scroll-pr-10 lg:scroll-pl-10 lg:pr-10 lg:pl-10 xl:-mx-20 xl:scroll-pr-20 xl:scroll-pl-20 xl:pr-20 xl:pl-20 2xl:scroll-pl-[max(5rem,calc(50vw-48rem))] 2xl:pl-[max(5rem,calc(50vw-48rem))]"
      >
        {categories.map((category) => (
          <Link key={category.slug} href={`/collection/${category.slug}`} className="snap-start">
            <CategoryCard {...category} />
          </Link>
        ))}
      </motion.div>

      <motion.div variants={fadeUpItem} className="mt-9 flex sm:hidden">
        <CarouselArrows
          onPrev={scrollPrev}
          onNext={scrollNext}
          prevDisabled={!canScrollPrev}
          nextDisabled={!canScrollNext}
        />
      </motion.div>
    </motion.section>
  );
}
