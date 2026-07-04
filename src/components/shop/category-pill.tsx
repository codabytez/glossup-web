"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";

interface CategoryPillProps {
  label: string;
  count?: string | number;
  image: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryPill({ label, count, image, active, onClick }: CategoryPillProps) {
  return (
    <button
      onClick={onClick}
      className="group relative shrink-0 cursor-pointer overflow-hidden rounded-xs px-4 py-1 transition-all"
    >
      <Image src={image} alt={label} fill sizes="160px" className="object-cover" />

      {/* default overlays — fade out on hover/active */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity group-hover:opacity-0",
          active && "opacity-0",
        )}
      >
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg viewBox='0 0 83 28' xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none'><rect x='0' y='0' height='100%' width='100%' fill='url(%23grad)' opacity='1'/><defs><radialGradient id='grad' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(2.5411e-16 1.4 -4.15 8.5725e-17 41.5 14)'><stop stop-color='rgba(0,0,0,1)' offset='0'/><stop stop-color='rgba(0,0,0,0.2)' offset='1'/></radialGradient></defs></svg>\")",
          }}
        />
        <div className="bg-primary-900/10 absolute inset-0" />
      </div>

      {/* hover/active overlay — solid primary-900 */}
      <div
        aria-hidden
        className={cn(
          "bg-primary-900 absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100",
          active && "opacity-100",
        )}
      />

      {/* content */}
      <div className="relative flex items-center gap-1 whitespace-nowrap">
        <span className="text-body-base leading-[1.4] font-medium text-white">{label}</span>
        {count !== undefined && (
          <span className="text-grey-200 text-[7.74px] leading-[1.35] font-normal">{count}</span>
        )}
      </div>
    </button>
  );
}
