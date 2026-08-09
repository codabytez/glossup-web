import Image from "next/image";

import { Dropdown } from "@/components/ui/dropdown";

export const SORT_OPTIONS = [
  "Lowest price",
  "Highest price",
  "Featured first",
  "Newest first",
  "Oldest first",
  "Product: A - Z",
  "Product: Z - A",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

interface ShopFilterBarProps {
  onFilterClick?: () => void;
  onSidebarToggle?: () => void;
  onSort?: (value: SortOption) => void;
  onSortOpenChange?: (open: boolean) => void;
}

export function ShopFilterBar({
  onFilterClick,
  onSidebarToggle,
  onSort,
  onSortOpenChange,
}: ShopFilterBarProps) {
  return (
    <div className="flex items-center justify-between">
      {/* Mobile: opens drawer */}
      <button
        type="button"
        onClick={onFilterClick}
        className="text-grey-950 flex items-center gap-2 transition-opacity hover:opacity-70 lg:hidden"
      >
        <Image src="/icons/filter.svg" alt="" width={16} height={16} />
        <span className="text-body-base font-normal">FILTER BY</span>
      </button>

      {/* Desktop: toggles sidebar */}
      <button
        type="button"
        onClick={onSidebarToggle}
        className="text-grey-950 hidden items-center gap-2 transition-opacity hover:opacity-70 lg:flex"
      >
        <Image src="/icons/filter.svg" alt="" width={16} height={16} />
        <span className="text-body-base font-normal">FILTER BY</span>
      </button>

      <Dropdown
        options={[...SORT_OPTIONS]}
        placeholder="Sort"
        onSelect={(v) => onSort?.(v as SortOption)}
        onOpenChange={onSortOpenChange}
      />
    </div>
  );
}
