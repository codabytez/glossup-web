import Link from "next/link";

import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-baseline gap-1", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-baseline gap-1">
            {isLast ? (
              <span
                aria-current="page"
                className="text-header-h4 text-grey-950 font-normal tracking-wide uppercase"
              >
                {item.label}
              </span>
            ) : (
              <>
                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-header-h4 text-grey-400 hover:text-grey-600 font-normal tracking-wide uppercase transition-colors"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-header-h4 text-grey-400 font-normal tracking-wide uppercase">
                    {item.label}
                  </span>
                )}
                <span className="text-header-h4 text-grey-400 select-none">/</span>
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}
