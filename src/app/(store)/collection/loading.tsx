import { ProductCarouselSkeleton } from "@/components/product/product-carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionLoading() {
  return (
    <main className="flex flex-1 flex-col pt-24">
      <div className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {Array.from({ length: 5 }, (_, i) => (
        <ProductCarouselSkeleton key={i} />
      ))}
    </main>
  );
}
