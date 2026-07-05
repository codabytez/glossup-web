"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right-icon";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { CarouselArrows } from "@/components/ui/carousel-arrows";
import { useScrollCarousel } from "@/hooks/use-scroll-carousel";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const SCROLL_AMOUNT = 296 + 32;

interface ProductCarouselProps {
  title: string;
  badge?: { icon: string; label: string };
  products: Product[];
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
}

export function ProductCarousel({
  title,
  badge,
  products,
  ctaLabel = "View all products",
  ctaHref,
  className,
}: ProductCarouselProps) {
  const { scrollRef, canScrollPrev, canScrollNext, onScroll, scrollPrev, scrollNext } =
    useScrollCarousel(SCROLL_AMOUNT);

  const actions = (
    <>
      <CarouselArrows
        onPrev={scrollPrev}
        onNext={scrollNext}
        prevDisabled={!canScrollPrev}
        nextDisabled={!canScrollNext}
      />
      <Button
        variant="pill"
        size="pill"
        fillOnHover
        endIcon={<ArrowUpRightIcon className="size-2.5" />}
        href={ctaHref}
      >
        {ctaLabel}
      </Button>
    </>
  );

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpContainer}
      className={cn("px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-20 xl:px-20", className)}
    >
      <motion.div variants={fadeUpItem} className="flex flex-col gap-4 2xl:mx-auto 2xl:max-w-384">
        {badge && (
          <div className="flex items-center gap-2">
            <Image src={badge.icon} alt="" width={16} height={16} />
            <span className="text-grey-500 text-sm font-medium">{badge.label}</span>
          </div>
        )}
        <div className="flex items-baseline gap-4">
          <h2 className="text-grey-950 text-header-h1 flex-1 leading-[1.13] font-light tracking-[-0.64px] sm:text-[64px] sm:tracking-[-1.28px] lg:text-[64px] lg:tracking-[-1.28px] 2xl:text-[80px] 2xl:tracking-[-1.6px]">
            {title}
          </h2>
          <div className="hidden items-center gap-6 sm:flex">{actions}</div>
        </div>
      </motion.div>

      <motion.div
        ref={scrollRef}
        variants={fadeUpItem}
        onScroll={onScroll}
        className="-mx-4 mt-9 flex snap-x snap-mandatory scroll-pr-4 scroll-pl-4 scrollbar-none gap-8 overflow-x-auto scroll-smooth pr-4 pb-2 pl-4 sm:-mx-8 sm:scroll-pr-8 sm:scroll-pl-8 sm:pr-8 sm:pl-8 lg:-mx-10 lg:scroll-pr-10 lg:scroll-pl-10 lg:pr-10 lg:pl-10 xl:-mx-20 xl:scroll-pr-20 xl:scroll-pl-20 xl:pr-20 xl:pl-20 2xl:scroll-pl-[max(5rem,calc(50vw-48rem))] 2xl:pl-[max(5rem,calc(50vw-48rem))]"
      >
        {products.map((product) => (
          <div key={product.slug} className="snap-start">
            <ProductCard {...product} />
          </div>
        ))}
      </motion.div>

      <motion.div variants={fadeUpItem} className="mt-9 flex items-center gap-6 sm:hidden">
        {actions}
      </motion.div>
    </motion.section>
  );
}
