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
      className="relative flex h-192 overflow-hidden"
    >
      <motion.div variants={fadeUpItem} className="relative w-[52%]">
        <Image
          src="/testimonial/portrait.png"
          alt="Gloss Up customer"
          fill
          sizes="56vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-l from-black/70 via-black/30 to-transparent" />
      </motion.div>
      <div className="bg-grey-800 flex w-[48%] items-center">
        <motion.div
          variants={fadeUpItem}
          className="relative z-10 -ml-46.5 flex w-156 flex-col items-start gap-4"
        >
          <div className="flex items-center gap-2">
            <Image src="/icons/home.svg" alt="" width={16} height={16} />
            <span className="text-header-h4 text-secondary-50 font-medium tracking-wide uppercase">
              We make glow possible
            </span>
          </div>
          <p className="text-secondary-25 text-5xl leading-[1.28] font-light tracking-[-0.96px]">
            &ldquo;Gloss Up makes skincare feel simple, clear, and kind to my skin and less like a
            science project.&rdquo;
          </p>
          <Button
            variant="pill"
            size="pill"
            className="border-secondary-200/60 relative overflow-hidden bg-white/20 text-white backdrop-blur-[2px] hover:bg-white/20 hover:text-white"
          >
            <span className="bg-secondary-200 absolute -inset-px -bottom-px h-0" />
            <span>Talk to us</span>
          </Button>
        </motion.div>
      </div>
    </motion.section>
  );
}
