import { StarIcon } from "@/components/icons/star-icon";

type StarRatingProps = {
  rating: number;
  reviewCount: string;
  className?: string;
};

export function StarRating({ rating, reviewCount, className }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className ?? ""}`}>
      <div className="flex items-center gap-[1.5px]">
        {Array.from({ length: 5 }, (_, i) => {
          const fillPercent = Math.max(0, Math.min(1, rating - i)) * 100;
          return (
            <span key={i} className="text-grey-300 relative inline-block size-2.25">
              <StarIcon className="size-full" />
              <span
                className="text-grey-500 absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <StarIcon className="size-2.25" />
              </span>
            </span>
          );
        })}
      </div>
      <span className="text-grey-500 text-xs">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
