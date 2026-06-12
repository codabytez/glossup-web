"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import { ArrowLineIcon } from "@/components/ui/arrow-line-icon";
import { Button } from "@/components/ui/button";
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
      className="flex flex-col gap-16 px-20 py-30"
    >
      <motion.div variants={fadeUpItem} className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Image src="/icons/star-feedback.svg" alt="" width={16} height={16} />
          <span className="text-grey-500 text-sm font-medium">
            highlights from over 1.5k customers
          </span>
        </div>
        <h2 className="text-grey-950 text-[64px] leading-[1.13] font-light tracking-[-1.28px]">
          Clear skin, honest words
        </h2>
      </motion.div>

      <motion.div variants={fadeUpItem} className="flex h-149 items-end gap-8">
        <div className="relative h-full flex-1 overflow-hidden">
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
              sizes="40vw"
              className="object-cover"
            />
          </motion.div>
        </div>

        <div className="flex h-full flex-1 flex-col gap-8">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={TRANSITION}
            className="flex flex-1 flex-col gap-4"
          >
            <div className="relative">
              <Image
                src="/icons/quote.svg"
                alt=""
                width={42}
                height={32}
                className="absolute top-0 left-0"
              />
              <p className="text-grey-950 text-header-h1 indent-16 leading-tight font-light tracking-[-0.64px] italic">
                {review.quote}
              </p>
            </div>
            <p className="text-grey-900 text-xl">- {review.author}</p>
          </motion.div>

          <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2 text-xl">
              <span className="text-grey-900">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-grey-400">/</span>
              <span className="text-grey-400">{String(reviews.length).padStart(2, "0")}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon-circle"
                aria-label="Previous"
                className="border-grey-200"
                onClick={showPrev}
              >
                <ArrowLineIcon className="text-grey-400 size-5" />
              </Button>
              <Button
                variant="outline"
                size="icon-circle"
                aria-label="Next"
                className="border-grey-400 relative overflow-hidden"
                onClick={showNext}
              >
                <span className="bg-secondary-200 absolute -inset-px -bottom-px h-0" />
                <ArrowLineIcon className="text-grey-500 size-5 -scale-x-100" />
              </Button>
            </div>
          </div>
        </div>

        <div className="relative h-64 w-46.75 shrink-0 overflow-hidden">
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
    </motion.section>
  );
}
