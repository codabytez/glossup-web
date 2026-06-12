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
        className="border-grey-400"
        disabled={prevDisabled}
        onClick={onPrev}
      >
        <ArrowLineIcon className="text-grey-400 size-5" />
      </Button>
      <Button
        variant="outline"
        size="icon-circle"
        aria-label={nextLabel}
        className="border-grey-400 relative overflow-hidden"
        disabled={nextDisabled}
        onClick={onNext}
      >
        <span className="bg-secondary-200 absolute -inset-px -bottom-px h-0" />
        <ArrowLineIcon className="text-grey-500 size-5 -scale-x-100" />
      </Button>
    </div>
  );
}
