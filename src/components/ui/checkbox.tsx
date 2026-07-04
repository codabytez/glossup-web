import { cn } from "@/lib/utils";

interface CheckboxProps {
  checked: boolean;
  className?: string;
}

export function Checkbox({ checked, className }: CheckboxProps) {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
        checked ? "border-primary-900 bg-secondary-100" : "border-grey-300 bg-white",
        className,
      )}
    >
      {checked && <span className="bg-primary-900 size-2.5 rounded-full" />}
    </span>
  );
}
