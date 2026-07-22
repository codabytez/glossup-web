"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  modalAnimations,
  BACKDROP_TRANSITION,
  BACKDROP_EXIT_TRANSITION,
  MODAL_PANEL_ENTER_TRANSITION,
  MODAL_PANEL_EXIT_TRANSITION,
} from "@/lib/motion";

// ── Size presets ──────────────────────────────────────────────────────────────

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  // full overrides the default inset-4/h-fit/rounded-2xl from the base classes
  full: "inset-0 h-full max-w-none rounded-none",
} satisfies Record<string, string>;

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

// ── Types ─────────────────────────────────────────────────────────────────────

export type ModalAnimation = keyof typeof modalAnimations;
export type ModalSize = keyof typeof SIZES;

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  /** @default "zoom" */
  animation?: ModalAnimation;
  /** @default "md" */
  size?: ModalSize;
  /** Show built-in close button @default true */
  showCloseButton?: boolean;
  /** Close when clicking the backdrop @default true */
  closeOnBackdrop?: boolean;
  /** Close on Escape key @default true */
  closeOnEsc?: boolean;
  /** Blur the backdrop @default true */
  backdropBlur?: boolean;
  /** id of the heading element inside the modal for aria-labelledby */
  labelId?: string;
  className?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Modal({
  open,
  onOpenChange,
  children,
  animation = "zoom",
  size = "md",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEsc = true,
  backdropBlur = true,
  labelId,
  className,
}: ModalProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Focus management: save trigger, move initial focus, trap Tab, restore on close
  useEffect(() => {
    if (!open) {
      previousFocusRef.current?.focus();
      return;
    }

    previousFocusRef.current = document.activeElement as HTMLElement;

    const panel = panelRef.current;
    if (!panel) return;

    const getFocusable = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));

    const raf = requestAnimationFrame(() => {
      const focusable = getFocusable();
      (focusable[0] ?? panel).focus();
    });

    const trapTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (!focusable.length) {
        e.preventDefault();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", trapTab);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", trapTab);
    };
  }, [open]);

  // Escape key — capture phase so nothing in the tree can swallow it
  useEffect(() => {
    if (!closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) onOpenChange(false);
    };
    document.addEventListener("keydown", onKey, { capture: true });
    return () => document.removeEventListener("keydown", onKey, { capture: true });
  }, [open, closeOnEsc, onOpenChange]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted) return null;

  const anim = modalAnimations[animation];

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop — direct fragment child so AnimatePresence drives its exit */}
          <motion.div
            key="modal-backdrop"
            className={cn("fixed inset-0 z-50 bg-black/20", backdropBlur && "backdrop-blur-xs")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: BACKDROP_TRANSITION }}
            exit={{ opacity: 0, transition: BACKDROP_EXIT_TRANSITION }}
            aria-hidden="true"
            onClick={closeOnBackdrop ? () => onOpenChange(false) : undefined}
          />

          {/* Panel — direct fragment child so AnimatePresence drives its exit.
              Uses fixed + inset-4 + m-auto + h-fit for viewport-centering without
              a wrapper div, which was previously blocking AnimatePresence from
              reaching this element for exit animations. */}
          <motion.div
            ref={panelRef}
            key="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelId}
            tabIndex={-1}
            className={cn(
              "fixed inset-4 z-50 m-auto h-fit w-full rounded-2xl bg-white outline-none",
              "shadow-[0px_20px_13px_0px_rgba(0,0,0,0.03),0px_8px_5px_0px_rgba(0,0,0,0.08)]",
              SIZES[size],
              className,
            )}
            initial={anim.initial}
            animate={{ ...anim.animate, transition: MODAL_PANEL_ENTER_TRANSITION }}
            exit={{ ...anim.exit, transition: MODAL_PANEL_EXIT_TRANSITION }}
          >
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close"
                onClick={() => onOpenChange(false)}
                className="text-grey-700 hover:text-grey-950 hover:bg-grey-100 absolute top-4 right-4 z-10 rounded-full"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M12 4 4 12M4 4l8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </Button>
            )}

            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}
