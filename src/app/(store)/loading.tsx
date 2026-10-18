import { ProductCarouselSkeleton } from "@/components/product/product-carousel";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="relative flex h-screen max-h-225 min-h-160 flex-col overflow-hidden">
        <Skeleton className="absolute inset-0 rounded-none" />
        <div className="relative flex flex-1 flex-col justify-center gap-6 px-4 pb-8 sm:px-8 lg:px-10 lg:py-30 xl:px-20">
          <Skeleton className="h-12 w-full max-w-lg bg-white/20" />
          <Skeleton className="h-4 w-full max-w-sm bg-white/20" />
          <div className="flex gap-4">
            <Skeleton className="h-11 w-32 rounded-full bg-white/20" />
            <Skeleton className="h-11 w-36 rounded-full bg-white/20" />
          </div>
        </div>
      </section>

      {/* Shop by category */}
      <section className="px-4 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-30 xl:px-20">
        <div className="flex flex-col gap-4 2xl:mx-auto 2xl:max-w-384">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-72" />
        </div>
        <div className="mt-9 flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-70 w-74 shrink-0" />
          ))}
        </div>
      </section>

      <ProductCarouselSkeleton />
    </main>
  );
}
