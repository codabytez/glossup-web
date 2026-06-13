"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

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
    <section className="relative isolate flex h-screen min-h-160 flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
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
          className="flex w-full flex-1 flex-col justify-between gap-16 lg:flex-row lg:items-end lg:justify-normal lg:gap-16 2xl:mx-auto 2xl:max-w-384"
        >
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-16 rounded-[24px] lg:flex-1 lg:gap-22"
          >
            <div className="flex flex-col gap-8">
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
                <Button className="h-auto gap-2 rounded-full bg-[#fbf4f7] px-6 py-2.5 text-sm font-medium text-[#43141e] hover:bg-[#fbf4f7]/90">
                  Shop Now
                  <Image src="/hero/arrow-shop-now.svg" alt="" width={20} height={20} />
                </Button>
                <Button
                  variant="outline"
                  className="h-auto gap-2 rounded-full border-white/40 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-[1px] hover:bg-white/20 hover:text-white"
                >
                  Our collection
                </Button>
              </motion.div>
            </div>

            <motion.div variants={itemVariants} className="flex items-center gap-2">
              <div className="flex items-start">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ y: [0, -4, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut",
                      delay: 1 + i * 0.2,
                    }}
                    className="relative -mr-2 size-8 overflow-hidden rounded-full border border-[#f8ebf0] last:mr-0"
                  >
                    <Image
                      src="/hero/avatar.png"
                      alt=""
                      fill
                      sizes="32px"
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-1 flex-col justify-center">
                <div className="flex items-center gap-0.5">
                  <span className="text-sm text-white">Rated 4.1/5.0</span>
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], rotate: [0, 10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <Image src="/hero/star.svg" alt="" width={16} height={16} />
                  </motion.div>
                </div>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs text-white/80">By 1.4k+ glowing customers</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1.5,
                      ease: "easeInOut",
                      delay: 1.2,
                    }}
                  >
                    <Image src="/hero/arrow-right.svg" alt="" width={12} height={12} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={sideVariants} className="flex flex-col gap-2 sm:self-end">
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
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                key={index}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={TRANSITION}
                className="flex w-full items-center gap-2 rounded-lg bg-white p-2 sm:w-auto sm:rounded-2xl lg:w-auto lg:rounded-2xl"
              >
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-white sm:size-20 sm:rounded-xl lg:size-20 lg:rounded-xl">
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-2 sm:w-77.75 sm:flex-none sm:gap-4 sm:px-4 lg:w-77.75 lg:flex-none lg:gap-4 lg:px-4">
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
        </motion.div>
      </div>
    </section>
  );
}
