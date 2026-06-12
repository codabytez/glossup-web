"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useRef, useState } from "react";

import { CategoryCard } from "@/components/home/category-card";
import { ArrowLineIcon } from "@/components/ui/arrow-line-icon";
import { Button } from "@/components/ui/button";
import categories from "@/data/categories.json";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

const SCROLL_AMOUNT = 296 + 16; // card width + gap

export function ShopByCategory() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(true);

  const handleScroll = (el: HTMLDivElement) => {
    setCanScrollPrev(el.scrollLeft > 0);
    setCanScrollNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scrollByAmount = (amount: number) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-circle"
              aria-label="Previous"
              className="border-grey-400"
              disabled={!canScrollPrev}
              onClick={() => scrollByAmount(-SCROLL_AMOUNT)}
            >
              <ArrowLineIcon className="text-grey-400 size-5" />
            </Button>
            <Button
              variant="outline"
              size="icon-circle"
              aria-label="Next"
              className="border-grey-400 relative overflow-hidden"
              disabled={!canScrollNext}
              onClick={() => scrollByAmount(SCROLL_AMOUNT)}
            >
              <span className="bg-secondary-200 absolute -inset-px -bottom-px h-0" />
              <ArrowLineIcon className="text-grey-500 size-5 -scale-x-100" />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        variants={fadeUpItem}
        onScroll={(e) => handleScroll(e.currentTarget)}
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
