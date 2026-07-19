"use client";

import { useLayoutEffect, useRef, useState } from "react";

import { motion } from "motion/react";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { cn } from "@/lib/utils";

interface DropdownProps {
  options: string[];
  placeholder?: string;
  defaultValue?: string;
  /** When true, collapsed pill shows "{placeholder} • {selected}" instead of just the placeholder */
  showValueInPill?: boolean;
  /**
   * "pill" (default) — grey rounded pill that morphs into an overlay panel.
   * "link" — static label + inline value pill with a pink fill-from-bottom hover effect.
   */
  variant?: "pill" | "link";
  onSelect: (value: string) => void;
  onOpenChange?: (open: boolean) => void;
  /** Background color of the expanded panel (default: pink #FEF2F2) */
  expandedBg?: string;
  /** Border color of the expanded panel (default: red #A90830) */
  expandedBorder?: string;
  /** Width of the expanded panel in px (default: 288) */
  expandedWidth?: number;
  className?: string;
}

function expandedHeight(count: number) {
  return 52 + count * 28;
}

const openTransition = {
  borderRadius: {
    duration: 0.7,
    times: [0, 0.5, 1],
    ease: [[0.16, 1, 0.3, 1], "linear"],
  },
  height: {
    duration: 0.7,
    times: [0, 0.5714, 1],
    ease: "linear",
  },
  width: {
    duration: 0.7,
    times: [0, 0.5714, 1],
    ease: "linear",
  },
  backgroundColor: {
    duration: 0.7,
    times: [0, 0.5714],
    ease: [[0.5, 0, 0.5, 1]],
  },
  borderColor: {
    duration: 0.7,
    times: [0, 0.5714],
    ease: [[0.5, 0, 0.5, 1]],
  },
};

export function Dropdown({
  options,
  placeholder = "Select",
  defaultValue,
  showValueInPill = false,
  variant = "pill",
  onSelect,
  onOpenChange,
  expandedBg = "#FEF2F2",
  expandedBorder = "#A90830",
  expandedWidth = 288,
  className,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string | undefined>(defaultValue);
  const sizerRef = useRef<HTMLDivElement>(null);
  // null = unmeasured; prevents rendering the pill with the wrong initial width
  const [collapsedW, setCollapsedW] = useState<number | null>(null);

  const pillLabel = showValueInPill && selected ? `${placeholder} • ${selected}` : placeholder;
  const linkLabel = selected ?? options[0] ?? placeholder;

  useLayoutEffect(() => {
    const measure = () => {
      if (sizerRef.current) setCollapsedW(sizerRef.current.offsetWidth);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [pillLabel, linkLabel, variant]);

  const setOpen = (value: boolean) => {
    setIsOpen(value);
    onOpenChange?.(value);
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    onSelect(value);
    setOpen(false);
  };

  const h = expandedHeight(options.length);

  // ── Shared expanded-panel content ──────────────────────────────────────────
  const expandedPanel = (
    <motion.div
      className="flex flex-col gap-2 p-4"
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2, delay: isOpen ? 0.25 : 0 }}
    >
      <span className="text-body-base text-grey-500 leading-[1.4] font-normal uppercase">
        {placeholder}
      </span>
      <div className="flex flex-col gap-2">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(option);
            }}
            className={cn(
              "text-body-base hover:text-primary-900 text-left leading-[1.4] font-normal transition-colors",
              selected === option ? "text-primary-900 font-medium" : "text-grey-950",
            )}
          >
            {option}
          </button>
        ))}
      </div>
    </motion.div>
  );

  const backdrop = isOpen && (
    <div className="fixed inset-0 z-9" onMouseDown={() => setOpen(false)} />
  );

  // ── Link variant ───────────────────────────────────────────────────────────
  // Static "[placeholder]" label + an inline pill showing "• {value} ↓"
  // The pill fills pink from the bottom on hover; clicking expands to the same panel.
  if (variant === "link") {
    const closedLinkState =
      collapsedW !== null
        ? {
            borderRadius: 32,
            height: 20,
            width: collapsedW,
            backgroundColor: "transparent",
            borderColor: "transparent",
          }
        : null;

    return (
      <>
        {backdrop}
        <div className={cn("relative flex items-center gap-2", className)}>
          <span className="text-sm font-normal text-[#272625]">{placeholder}</span>

          {/*
            Positioning context for the link-btn. The invisible sizer sets the wrapper
            width; the motion.div overlays content below when expanding.
          */}
          <div className="relative h-5">
            {/* Sizer: mirrors the collapsed link-btn content */}
            <div
              ref={sizerRef}
              className="pointer-events-none invisible flex h-5 items-center gap-1"
              aria-hidden="true"
            >
              <span className="text-sm whitespace-nowrap text-[#9F9FA9]">• {linkLabel}</span>
              <div className="size-5 shrink-0" />
            </div>

            {closedLinkState !== null && (
              <motion.div
                className={cn(
                  "absolute top-0 right-0 z-10 cursor-pointer overflow-hidden border border-solid",
                  !isOpen && "group",
                )}
                initial={closedLinkState}
                animate={
                  isOpen
                    ? {
                        borderRadius: [32, 14, 14],
                        height: [20, h, h],
                        width: [collapsedW!, expandedWidth, expandedWidth],
                        backgroundColor: ["transparent", expandedBg],
                        borderColor: ["transparent", expandedBorder],
                      }
                    : closedLinkState
                }
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                transition={(isOpen ? openTransition : { duration: 0.3, ease: "easeInOut" }) as any}
                onClick={() => !isOpen && setOpen(true)}
              >
                {/* Pink fill bar — rises from bottom on hover (only while closed) */}
                <div className="absolute inset-0 origin-bottom scale-y-0 bg-[#FFD2D2] transition-transform duration-200 group-hover:scale-y-100" />

                {/* Collapsed trigger — fades out when panel opens; absolute so it doesn't push the panel down */}
                <motion.div
                  className="absolute inset-x-0 top-0 flex h-5 items-center gap-1"
                  animate={{ opacity: isOpen ? 0 : 1 }}
                  transition={{ duration: 0.15 }}
                >
                  <span className="text-sm whitespace-nowrap text-[#9F9FA9]">• {linkLabel}</span>
                  <ChevronDownIcon className="size-5 text-[#272625]" />
                </motion.div>

                {expandedPanel}
              </motion.div>
            )}
          </div>
        </div>
      </>
    );
  }

  // ── Pill variant (default) ─────────────────────────────────────────────────
  const closedPillState =
    collapsedW !== null
      ? {
          borderRadius: 32,
          height: 32,
          width: collapsedW,
          backgroundColor: "#F4F4F5",
          borderColor: "#D4D4D8",
        }
      : null;

  return (
    <>
      {backdrop}

      {/*
        No explicit width on the wrapper — the invisible sizer div (same padding + text as
        the collapsed pill) lives in normal flow and sizes the wrapper to match content.
        The interactive motion.div is absolute so expansion overlays content without
        pushing anything down.
      */}
      <div className={cn("relative h-8", className)}>
        {/* Sizer: mirrors collapsed pill styling, invisible and non-interactive */}
        <div
          ref={sizerRef}
          className="pointer-events-none invisible flex h-8 items-center gap-1 pr-3 pl-4"
          aria-hidden="true"
        >
          <span className="text-sm leading-[1.4] font-normal whitespace-nowrap uppercase">
            {pillLabel}
          </span>
          <div className="size-4 shrink-0" />
        </div>

        {/* Only mount after measurement so initial width is always correct */}
        {closedPillState !== null && (
          <motion.div
            className="absolute top-0 right-0 z-10 cursor-pointer overflow-hidden border border-solid"
            initial={closedPillState}
            animate={
              isOpen
                ? {
                    borderRadius: [32, 14, 14],
                    height: [32, h, h],
                    width: [collapsedW!, expandedWidth, expandedWidth],
                    backgroundColor: ["#F4F4F5", expandedBg],
                    borderColor: ["#D4D4D8", expandedBorder],
                  }
                : closedPillState
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            transition={(isOpen ? openTransition : { duration: 0.3, ease: "easeInOut" }) as any}
            onClick={() => !isOpen && setOpen(true)}
          >
            {/* Collapsed pill header — fades out when open */}
            <motion.div
              className="absolute inset-x-0 top-0 flex h-8 items-center gap-1 pr-3 pl-4"
              animate={{ opacity: isOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <span className="text-sm leading-[1.4] font-normal whitespace-nowrap text-[#27272A] uppercase">
                {pillLabel}
              </span>
              <ChevronDownIcon className="size-4 shrink-0 text-[#27272A]" />
            </motion.div>

            {expandedPanel}
          </motion.div>
        )}
      </div>
    </>
  );
}
