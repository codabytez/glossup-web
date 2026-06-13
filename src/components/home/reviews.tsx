"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import { CarouselArrows } from "@/components/ui/carousel-arrows";
import reviews from "@/data/reviews.json";
import { fadeUpContainer, fadeUpItem, TRANSITION } from "@/lib/motion";

export function Reviews() {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);

  const showPrev = () => setSlide(([i]) => [(i - 1 + reviews.length) % reviews.length, -1]);
  const showNext = () => setSlide(([i]) => [(i + 1) % reviews.length, 1]);

  const review = reviews[index];

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpContainer}
      className="flex flex-col gap-16 px-4 py-14 sm:px-8 sm:py-20 lg:px-20 lg:py-30"
    >
      <div className="flex w-full flex-col gap-16 2xl:mx-auto 2xl:max-w-384">
        <motion.div variants={fadeUpItem} className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image src="/icons/star-feedback.svg" alt="" width={16} height={16} />
            <span className="text-grey-500 text-sm font-medium">
              highlights from over 1.5k customers
            </span>
          </div>
          <h2 className="text-grey-950 text-header-h1 leading-[1.13] font-light tracking-[-0.64px] sm:text-5xl sm:tracking-[-1.28px] md:text-[64px] lg:text-[64px] lg:tracking-[-1.28px]">
            Clear skin, honest words
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUpItem}
          className="flex flex-col gap-8 sm:h-149 sm:flex-row sm:items-end lg:h-149 lg:flex-row lg:items-end"
        >
          <div className="relative aspect-square w-full overflow-hidden sm:aspect-auto sm:h-full sm:flex-[1.4] lg:aspect-auto lg:h-full lg:flex-1">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={TRANSITION}
              className="absolute inset-0"
            >
              <Image
                src={review.image}
                alt={`${review.author} from Gloss Up`}
                fill
                sizes="(min-width: 640px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>

          <div className="flex flex-col gap-8 sm:h-full sm:flex-1 lg:h-full lg:flex-1">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={TRANSITION}
              className="flex flex-1 flex-col gap-8 sm:gap-4 lg:gap-4"
            >
              <div className="relative">
                <Image
                  src="/icons/quote.svg"
                  alt=""
                  width={42}
                  height={32}
                  className="absolute -top-1 left-0 h-6 w-7.75 sm:h-7 sm:w-9.25 lg:h-8 lg:w-10.5"
                />
                <p className="text-grey-950 lg:text-header-h1 indent-10 text-base leading-tight font-light tracking-[-0.32px] italic sm:indent-12 sm:text-2xl sm:leading-snug sm:tracking-[-0.48px] lg:indent-16 lg:leading-tight lg:tracking-[-0.64px]">
                  {review.quote}
                </p>
              </div>
              <p className="text-grey-900 text-base sm:text-lg lg:text-xl">- {review.author}</p>
            </motion.div>

            <div className="flex items-center justify-between">
              <div className="flex flex-1 items-center gap-2 text-xl">
                <span className="text-grey-900">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-grey-400">/</span>
                <span className="text-grey-400">{String(reviews.length).padStart(2, "0")}</span>
              </div>
              <CarouselArrows onPrev={showPrev} onNext={showNext} />
            </div>
          </div>

          <div className="relative hidden h-48 w-32 shrink-0 overflow-hidden sm:block lg:h-64 lg:w-46.75">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={TRANSITION}
              className="absolute inset-0"
            >
              <Image
                src={review.cornerImage}
                alt="Gloss Up customer"
                fill
                sizes="187px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
