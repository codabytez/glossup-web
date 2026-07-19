import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CategoryPill } from "@/components/shop/category-pill";

interface ShopHeaderProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (slug: string) => void;
}

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Shop" }];

export function ShopHeader({ categories, activeCategory, onCategoryChange }: ShopHeaderProps) {
  return (
    <div className="px-4 pt-6 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
      <div className="flex flex-col gap-6 lg:gap-8 2xl:mx-auto 2xl:max-w-384">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col gap-4 lg:gap-8">
          <h1 className="text-grey-950 text-[40px] font-light tracking-[-0.8px] sm:text-5xl sm:tracking-[-1.2px] lg:text-[64px] lg:leading-[1.13] lg:tracking-[-1.28px]">
            Shop all products
          </h1>

          {/* Mobile/tablet: wrapping pills. Desktop: horizontal scroll with bleed. */}
          <div className="flex flex-wrap gap-4 lg:-mx-10 lg:scrollbar-none lg:flex-nowrap lg:overflow-x-auto lg:px-10 lg:pb-1 xl:-mx-20 xl:px-20">
            {categories.map((category) => (
              <CategoryPill
                key={category.slug}
                label={category.name}
                count={category.count}
                image={category.image}
                active={activeCategory === category.slug}
                onClick={() => onCategoryChange?.(category.slug)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
