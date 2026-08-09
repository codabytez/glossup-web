import Image from "next/image";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface NoProductsFoundProps {
  description?: string;
  clearAction: EmptyStateAction;
  continueAction: EmptyStateAction;
}

export function NoProductsFound({
  description = "Try adjusting your search or filters or searching for something else.",
  clearAction,
  continueAction,
}: NoProductsFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col items-center gap-18 py-24"
    >
      <Image
        src="/shop/no-products-found.svg"
        alt=""
        width={220}
        height={227}
        className="h-auto w-full max-w-55"
      />

      <div className="flex w-full max-w-100 flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-grey-950 text-header-h2 font-medium">No products found</p>
          <p className="text-body-large leading-6 font-normal text-[#343332]">{description}</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Button
            variant="pill"
            size="pill"
            fillOnHover
            fillVariant="secondary"
            href={clearAction.href}
            onClick={clearAction.onClick}
            className="border-grey-400 text-grey-800 font-normal"
          >
            {clearAction.label}
          </Button>
          <Button
            variant="primary"
            size="pill"
            href={continueAction.href}
            onClick={continueAction.onClick}
          >
            {continueAction.label}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
