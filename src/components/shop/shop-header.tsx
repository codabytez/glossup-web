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
    <div className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
      <div className="flex flex-col gap-6 lg:gap-8 2xl:mx-auto 2xl:max-w-384">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col gap-6 lg:gap-8">
          <h1 className="text-grey-950 text-4xl font-light tracking-[-0.96px] sm:text-5xl sm:tracking-[-1.2px] lg:text-[64px] lg:leading-[1.13] lg:tracking-[-1.28px]">
            Shop all products
          </h1>

          <div className="-mx-4 flex scrollbar-none gap-3 overflow-x-auto px-4 pb-1 sm:-mx-8 sm:px-8 lg:-mx-10 lg:gap-4 lg:px-10 xl:-mx-20 xl:px-20">
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
