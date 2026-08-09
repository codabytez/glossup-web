"use client";

import Image from "next/image";
import Link from "next/link";

import { WordmarkLogo } from "@/components/icons/wordmark";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface PromptSignInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PromptSignInModal({ open, onOpenChange }: PromptSignInModalProps) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="2xl"
      className="h-fit w-full overflow-hidden p-0 sm:h-125.25 sm:max-w-173.5"
    >
      <div className="flex flex-col sm:h-full sm:flex-row">
        {/* Brand panel */}
        <div className="bg-secondary-25 relative flex flex-1 flex-col gap-4 overflow-hidden p-6">
          <div className="flex flex-col gap-2">
            <p className="text-grey-950 text-header-h1 leading-[1.24] font-light tracking-[-0.32px]">
              Join
            </p>
            <WordmarkLogo className="h-6 w-40" color="#990B33" />
          </div>
          <p className="text-grey-600 text-body-base font-normal">
            Get glowing skin with targeted formulas for everyday skincare.
          </p>
          <Image
            src="/account/add-to-cart.svg"
            alt=""
            width={325}
            height={240}
            className="pointer-events-none absolute top-57.25 -left-5.25 w-81 max-w-none"
          />
        </div>

        {/* Actions panel */}
        <div className="flex flex-1 flex-col items-center justify-between gap-6 p-6">
          <p className="text-grey-950 text-header-h2 font-normal">Create an account</p>

          <div className="flex w-full flex-col gap-4">
            <Button
              href="/account"
              variant="primary"
              size="pill"
              onClick={() => onOpenChange(false)}
              startIcon={<Image src="/icons/shield.svg" alt="" width={16} height={16} />}
            >
              Sign Up
            </Button>
            <Button
              href="/account"
              variant="ghost"
              size="pill"
              fillOnHover
              fillVariant="secondary"
              onClick={() => onOpenChange(false)}
              className="bg-grey-100 w-full font-normal"
            >
              Already have an account?
            </Button>
          </div>

          <p className="text-grey-500 flex max-w-74 flex-wrap justify-center gap-1 text-center text-sm">
            By joining, you confirm that you accept our
            <Link href="/terms" className="text-grey-800 font-medium underline">
              Terms of Service
            </Link>
            and
            <Link href="/privacy" className="text-grey-800 font-medium underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </Modal>
  );
}
