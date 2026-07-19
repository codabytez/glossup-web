"use client";

import { motion } from "motion/react";
import Image from "next/image";

import { IMAGE_TRANSITION } from "@/lib/motion";

const imageVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.08 },
};

export function CategoryCard({ name, count, description, image }: Category) {
  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="bg-grey-50 relative h-108 w-74 shrink-0 overflow-hidden rounded-xs"
    >
      {/* image + overlays */}
      <motion.div
        variants={imageVariants}
        transition={IMAGE_TRANSITION}
        className="absolute inset-0"
      >
        <Image src={image} alt={name} fill sizes="888px" className="object-cover" />
      </motion.div>
      <div aria-hidden className="absolute inset-0">
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 296 432' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(9.0624e-16 21.6 -14.8 1.3226e-15 148 216)'><stop stop-color='rgba(0,0,0,0)' offset='0'/><stop stop-color='rgba(0,0,0,1)' offset='1'/></radialGradient></defs></svg>\")",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 80%, rgba(0,0,0,0.4) 90%)",
          }}
        />
      </div>

      {/* content: title top, description bottom */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="flex items-center gap-1 leading-[1.24] whitespace-nowrap">
          <span className="text-header-h1 font-normal text-white">{name}</span>
          <span className="text-grey-200 text-[20.64px] font-light">{count}</span>
        </div>
        <p className="text-grey-50 text-sm font-medium">{description}</p>
      </div>
    </motion.div>
  );
}
