import { ProductCardSkeleton } from "@/components/product/product-card";
import { FilterSidebarSkeleton } from "@/components/shop/filter-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionDetailLoading() {
  return (
    <main className="flex flex-1 flex-col pt-24">
      <div className="px-4 pt-6 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
        <div className="flex flex-col gap-6 lg:gap-8 2xl:mx-auto 2xl:max-w-384">
          <Skeleton className="h-3 w-40" />
          <div className="flex flex-col gap-4 lg:gap-8">
            <Skeleton className="h-12 w-56 lg:h-16" />
            <div className="flex flex-wrap gap-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Skeleton key={i} className="h-11 w-32 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-8 pb-14 sm:px-8 sm:pt-10 lg:px-10 lg:pt-10 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <div className="mt-11 flex items-start gap-8">
            <aside className="hidden w-74 shrink-0 lg:block">
              <FilterSidebarSkeleton hideCategory />
            </aside>

            <div className="grid min-w-0 flex-1 grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
              {Array.from({ length: 9 }, (_, i) => (
                <ProductCardSkeleton key={i} className="w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
