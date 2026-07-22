"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";

interface AddToBagButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  price: string;
  fillColor?: "primary" | "secondary";
}

const AddToBagButton = forwardRef<HTMLButtonElement, AddToBagButtonProps>(function AddToBagButton(
  { price, fillColor = "secondary", className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "group/add-bag relative flex items-center justify-between overflow-hidden",
        className,
      )}
      {...props}
    >
      <span
        className={cn(
          "absolute inset-x-0 bottom-0 h-0 transition-[height] duration-300 group-hover/add-bag:h-full",
          fillColor === "primary" ? "bg-primary-900" : "bg-secondary-200",
        )}
      />
      <span
        className={cn(
          "text-body-base relative min-w-px flex-1 font-normal whitespace-nowrap transition-colors duration-300",
          fillColor === "primary" && "group-hover/add-bag:text-white",
          "text-grey-900",
        )}
      >
        Add to bag
      </span>
      <span
        className={cn(
          "text-body-base relative font-medium whitespace-nowrap transition-colors duration-300",
          fillColor === "primary"
            ? "text-primary-900 group-hover/add-bag:text-white"
            : "text-primary-900",
        )}
      >
        {price}
      </span>
    </button>
  );
});

export { AddToBagButton };
