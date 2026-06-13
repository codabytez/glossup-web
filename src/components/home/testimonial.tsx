"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

export function Testimonial() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpContainer}
      className="relative flex h-160 flex-col overflow-hidden sm:h-192 sm:flex-row lg:h-192 lg:flex-row 2xl:h-225"
    >
      <motion.div
        variants={fadeUpItem}
        className="absolute inset-0 -z-10 sm:relative sm:z-auto sm:w-[56%] lg:relative lg:z-auto lg:w-[52%]"
      >
        <Image
          src="/testimonial/portrait.png"
          alt="Gloss Up customer"
          fill
          sizes="(min-width: 1024px) 56vw, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent sm:bg-linear-to-r sm:from-black/0 sm:via-black/30 sm:to-black/80 lg:bg-linear-to-l lg:from-black/70 lg:via-black/30 lg:to-black/0" />
      </motion.div>
      <div className="lg:bg-grey-800 sm:bg-grey-800 relative z-10 flex flex-1 items-end px-4 pb-14 sm:w-[44%] sm:items-center sm:px-0 sm:pb-0 lg:flex lg:w-[48%] lg:items-center lg:px-0 lg:pb-0">
        <motion.div
          variants={fadeUpItem}
          className="flex w-full flex-col items-start gap-4 px-4 sm:relative sm:-ml-36.5 sm:w-115 lg:relative lg:-ml-46.5 lg:w-156 2xl:w-182"
        >
          <div className="flex items-center gap-2">
            <Image src="/icons/home.svg" alt="" width={16} height={16} />
            <span className="text-header-h4 text-secondary-50 font-medium tracking-wide uppercase">
              We make glow possible
            </span>
          </div>
          <p className="text-secondary-25 text-3xl leading-[1.28] font-light tracking-[-0.48px] sm:text-4xl sm:tracking-[-0.96px] md:text-5xl lg:text-5xl lg:tracking-[-0.96px] 2xl:text-6xl 2xl:tracking-[-1.2px]">
            &ldquo;Gloss Up makes skincare feel simple, clear, and kind to my skin and less like a
            science project.&rdquo;
          </p>
          <Button
            variant="pill"
            size="pill"
            className="border-secondary-200/60 relative overflow-hidden bg-white/20 text-white backdrop-blur-[2px] hover:bg-white/20"
          >
            <span className="bg-primary-900 absolute -inset-px -bottom-px h-0 transition-[height] duration-300 group-hover/button:h-full" />
            <span className="relative text-white transition-colors duration-300">Talk to us</span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
