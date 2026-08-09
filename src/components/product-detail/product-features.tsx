"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { benefits, coreIngredients, allIngredients, howToUse } from "@/data/product-features.json";
import { TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface FeatureSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FeatureSection({ title, icon, children, defaultOpen = false }: FeatureSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="text-grey-950 size-4 shrink-0">{icon}</span>
          <span className="text-body-base text-grey-950 font-normal tracking-wider uppercase">
            {title}
          </span>
        </span>
        <ChevronDownIcon
          className={cn(
            "text-grey-400 size-5 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ProductFeatures() {
  const [showAllIngredients, setShowAllIngredients] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <FeatureSection
        title="Benefits"
        icon={<Image src="/icons/lightbulb.svg" alt="Lightbulb icon" width={16} height={16} />}
      >
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {benefits.map((b) => (
            <li key={b} className="text-body-base text-grey-700 leading-[1.4]">
              {b}
            </li>
          ))}
        </ul>
      </FeatureSection>

      <div className="bg-grey-100 h-px w-full" />

      <FeatureSection
        title="Core Ingredients"
        icon={<Image src="/icons/basket.svg" alt="Basket icon" width={16} height={16} />}
      >
        <div className="flex flex-wrap gap-6">
          {coreIngredients.map((ing) => (
            <div key={ing.name} className="flex min-w-28 flex-col gap-1">
              <p className="text-grey-950 text-2xl leading-[1.35] font-normal">{ing.percent}</p>
              <p className="text-body-base text-grey-700 font-normal">{ing.name}</p>
            </div>
          ))}

          <div className="flex w-full flex-1 flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowAllIngredients((v) => !v)}
              className="text-body-base text-primary-900 flex items-center gap-1 self-start"
            >
              <span>{showAllIngredients ? "Close all ingredients" : "See all ingredients"}</span>
              <ChevronDownIcon
                className={cn(
                  "size-5 transition-transform duration-200",
                  showAllIngredients && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {showAllIngredients && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={TRANSITION}
                  style={{ overflow: "hidden" }}
                >
                  <p className="text-body-base text-grey-600 leading-[1.4]">{allIngredients}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FeatureSection>

      <div className="bg-grey-100 h-px w-full" />

      <FeatureSection
        title="How to Use"
        icon={<Image src="/icons/notebook.svg" alt="Notebook icon" width={16} height={16} />}
      >
        <div className="flex flex-col gap-4">
          {howToUse.map((step) => (
            <div key={step.num} className="flex gap-3">
              <p className="text-body-base text-grey-950 shrink-0 font-medium">{step.num}</p>
              <p className="text-body-base text-grey-600 leading-[1.4] font-normal">{step.text}</p>
            </div>
          ))}
        </div>
      </FeatureSection>
    </div>
  );
}
