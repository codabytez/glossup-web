"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

import { ArrowUpRightIcon } from "@/components/icons/arrow-up-right-icon";
import { Button } from "@/components/ui/button";
import { TRANSITION } from "@/lib/motion";

const heroProducts = [
  {
    image: "/hero/product-1.jpg",
    alt: "Gloss Up natural care moisturiser",
    name: "Gloss Up natural care",
    tag: "Moisturiser",
    description: "Oil, face wash and cream",
  },
  {
    image: "/hero/product-2.png",
    alt: "Gloss Up anti-age night cream set",
    name: "Gloss Up anti-age",
    tag: "Night cream",
    description: "Cleanser, cream and mask",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
};

const sideVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: TRANSITION },
};

export function Hero() {
  const [[index, direction], setSlide] = useState<[number, number]>([0, 0]);

  const showPrev = () =>
    setSlide(([i]) => [(i - 1 + heroProducts.length) % heroProducts.length, -1]);
  const showNext = () => setSlide(([i]) => [(i + 1) % heroProducts.length, 1]);

  const product = heroProducts[index];

  return (
    <section className="relative isolate flex h-screen max-h-225 min-h-160 flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 24, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src="/hero/hero-bg.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.4)_0%,rgba(0,0,0,0)_10%),linear-gradient(0deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.5)_65%)] lg:bg-[linear-gradient(to_left,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      <div className="flex flex-1 flex-col px-4 pt-30 pb-8 sm:px-8 lg:px-20 lg:py-30">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex w-full flex-1 flex-col justify-center gap-16 lg:flex-row lg:items-end lg:gap-16 2xl:mx-auto 2xl:max-w-384"
        >
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-16 rounded-[24px] lg:flex-1 lg:gap-0 lg:self-stretch"
          >
            <div className="flex flex-col gap-8 lg:flex-1 lg:justify-center">
              <motion.div variants={itemVariants} className="flex flex-col gap-4">
                <h1 className="text-[40px] leading-[1.28] font-light tracking-[-0.8px] text-white sm:text-[80px] sm:tracking-[-1.6px] lg:text-[80px] lg:tracking-[-1.6px]">
                  <span>Everyday skincare, </span>
                  <br />
                  <span className="font-serif italic">glowing</span>
                  <span> results</span>
                </h1>
                <p className="max-w-full text-sm leading-[1.4] text-white sm:max-w-126 sm:text-base sm:leading-6 lg:max-w-126 lg:text-base lg:leading-6">
                  Take the stress out of skincare with gentle, targeted formulas and a clean,
                  calming experience.
                </p>
              </motion.div>
              <motion.div variants={itemVariants} className="flex items-start gap-4">
                <Button size="pill" endIcon={<ArrowUpRightIcon className="size-3" />}>
                  Shop Now
                </Button>
                <Button variant="glass" size="pill">
                  Our collection
                </Button>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <Image src="/hero/lab-tested-icon.svg" alt="" width={40} height={40} unoptimized />
              <div className="flex flex-col justify-center">
                <span className="text-sm font-semibold text-white">100%</span>
                <span className="text-xs text-white/90">Lab&#8209;tested formulas</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={sideVariants} className="flex flex-col gap-2">
            <div className="flex items-center gap-6">
              <div className="h-px flex-1 bg-white/40" />
              <div className="flex items-center gap-2">
                <button type="button" aria-label="Previous product" onClick={showPrev}>
                  <Image src="/hero/arrow-prev.svg" alt="" width={24} height={24} />
                </button>
                <button type="button" aria-label="Next product" onClick={showNext}>
                  <Image src="/hero/arrow-next.svg" alt="" width={24} height={24} />
                </button>
              </div>
            </div>
            <motion.div
              key={index}
              initial={{ opacity: 0, x: direction * 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={TRANSITION}
              className="flex w-full items-center gap-4 rounded-lg bg-white p-2 sm:w-auto lg:w-auto"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-[4px] border border-white sm:size-20">
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  priority={index === 0}
                  sizes="480px"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 sm:w-77.75 sm:flex-none sm:gap-4 lg:w-77.75 lg:flex-none lg:gap-4">
                <div className="flex flex-col gap-2">
                  <p className="flex items-baseline gap-1 text-sm whitespace-nowrap">
                    <span className="text-grey-950 font-medium">{product.name}</span>
                    <span className="font-serif text-[#8e0e22] italic">• {product.tag}</span>
                  </p>
                  <p className="text-grey-600 text-sm">{product.description}</p>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-grey-950 text-sm font-medium">View</span>
                  <Image src="/hero/arrow-right-2.svg" alt="" width={12} height={12} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
