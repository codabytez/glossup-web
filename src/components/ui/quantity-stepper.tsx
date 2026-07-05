"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  className?: string;
}

export function QuantityStepper({ value, onChange, min = 1, className }: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "border-grey-100 bg-grey-50 flex shrink-0 items-center gap-4 rounded-[1px] border px-4 py-3",
        className,
      )}
    >
      <motion.button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        aria-label="Decrease quantity"
        whileTap={{ scale: 0.75 }}
        className="text-grey-950 hover:text-primary-900 flex size-5 items-center justify-center transition-colors"
      >
        <svg viewBox="0 0 20 20" fill="none" className="size-full">
          <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </motion.button>
      <span className="text-grey-950 w-4 text-center text-base font-medium tabular-nums">
        {value}
      </span>
      <motion.button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
        whileTap={{ scale: 0.75 }}
        className="text-grey-950 hover:text-primary-900 flex size-6 items-center justify-center transition-colors"
      >
        <svg viewBox="0 0 24 24" fill="none" className="size-full">
          <path
            d="M12 5v14M5 12h14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.button>
    </div>
  );
}
