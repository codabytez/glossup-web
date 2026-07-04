import { ArrowLineIcon } from "@/components/icons/arrow-line-icon";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, "...", totalPages - 1, totalPages];
    if (currentPage >= totalPages - 2)
      return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  const pages = getPages();

  return (
    <div className="flex items-center pt-12 pb-6">
      <div className="flex items-stretch overflow-hidden rounded-sm">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="hover:bg-grey-100 flex items-center gap-2 border border-[#e7e9fb] bg-white px-4 py-2 text-sm font-medium text-[#667085] transition-colors disabled:opacity-40"
        >
          <ArrowLineIcon className="size-4" />
          <span>Previous</span>
        </button>

        {/* Pages */}
        {pages.map((page, i) => (
          <div key={i} className="flex items-stretch">
            {i > 0 && <div className="w-px bg-[#e7e9fb]" />}
            {page === "..." ? (
              <span className="flex w-10 flex-col items-center justify-center bg-white text-sm font-medium text-[#515478]">
                <div className="h-px w-full bg-[#e7e9fb]" />
                <span className="px-2 py-1.75">...</span>
                <div className="h-px w-full bg-[#e7e9fb]" />
              </span>
            ) : (
              <button
                type="button"
                onClick={() => onPageChange(page)}
                className={cn(
                  "flex w-10 flex-col items-center justify-center text-sm font-medium transition-colors",
                  page === currentPage
                    ? "bg-grey-200 text-grey-950"
                    : "hover:bg-grey-100 bg-white text-[#515478]",
                )}
              >
                <div className="h-px w-full bg-[#e7e9fb]" />
                <span className="px-2 py-1.75">{page}</span>
                <div className="h-px w-full bg-[#e7e9fb]" />
              </button>
            )}
          </div>
        ))}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="hover:bg-grey-100 flex items-center gap-2 border border-[#e7e9fb] bg-white px-4 py-2 text-sm font-medium text-[#24242e] transition-colors disabled:opacity-40"
        >
          <span>Next</span>
          <ArrowLineIcon className="size-4 -scale-x-100" />
        </button>
      </div>
    </div>
  );
}
