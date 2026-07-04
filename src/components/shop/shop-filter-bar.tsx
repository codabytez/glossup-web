import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { FilterIcon } from "@/components/icons/filter-icon";

interface ShopFilterBarProps {
  onFilterClick?: () => void;
  onSortClick?: () => void;
}

export function ShopFilterBar({ onFilterClick, onSortClick }: ShopFilterBarProps) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={onFilterClick}
        className="text-grey-950 flex items-center gap-2 transition-opacity hover:opacity-70 lg:hidden"
      >
        <FilterIcon className="text-primary-900 size-4" />
        <span className="text-body-base font-normal">Filter BY</span>
      </button>

      <button
        type="button"
        onClick={onSortClick}
        className="bg-grey-100 border-grey-300 text-grey-800 hover:bg-grey-200 flex items-center gap-1 rounded-full border py-1 pr-3 pl-4 text-sm transition-colors"
      >
        <span className="text-body-base leading-[1.4] font-normal">Sort</span>
        <ChevronDownIcon className="size-4" />
      </button>
    </div>
  );
}
