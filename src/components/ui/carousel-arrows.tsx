import { ArrowLineIcon } from "@/components/icons/arrow-line-icon";
import { Button } from "@/components/ui/button";

type CarouselArrowsProps = {
  onPrev: () => void;
  onNext: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  prevLabel?: string;
  nextLabel?: string;
};

export function CarouselArrows({
  onPrev,
  onNext,
  prevDisabled,
  nextDisabled,
  prevLabel = "Previous",
  nextLabel = "Next",
}: CarouselArrowsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon-circle"
        aria-label={prevLabel}
        className="border-grey-400 relative overflow-hidden"
        disabled={prevDisabled}
        onClick={onPrev}
      >
        <span className="bg-primary-900 absolute inset-x-0 bottom-0 h-0 transition-[height] duration-300 group-hover/button:h-full" />
        <ArrowLineIcon className="text-grey-500 relative size-5 transition-colors duration-300 group-hover/button:text-white" />
      </Button>
      <Button
        variant="outline"
        size="icon-circle"
        aria-label={nextLabel}
        className="border-grey-400 relative overflow-hidden"
        disabled={nextDisabled}
        onClick={onNext}
      >
        <span className="bg-primary-900 absolute inset-x-0 bottom-0 h-0 transition-[height] duration-300 group-hover/button:h-full" />
        <ArrowLineIcon className="text-grey-500 relative size-5 -scale-x-100 transition-colors duration-300 group-hover/button:text-white" />
      </Button>
    </div>
  );
}
