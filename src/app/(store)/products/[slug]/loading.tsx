import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetailLoading() {
  return (
    <main className="flex flex-1 flex-col pb-40 lg:pb-0">
      <div className="hidden flex-col pt-24 pb-20 lg:flex lg:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <div className="pt-8">
            <Skeleton className="h-3 w-48" />
          </div>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-8">
            {/* Image gallery */}
            <div className="flex flex-col gap-1">
              <Skeleton className="w-full" style={{ aspectRatio: "704 / 900" }} />
              <div className="grid grid-cols-2 grid-rows-3 gap-1">
                {Array.from({ length: 6 }, (_, i) => (
                  <Skeleton key={i} className="aspect-square w-full" />
                ))}
              </div>
            </div>

            {/* Info panel */}
            <div className="mx-auto flex w-full max-w-100 flex-col gap-14 2xl:w-100">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-9 w-3/4" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-16 w-full" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-16" />
                  <div className="flex gap-4">
                    {Array.from({ length: 4 }, (_, i) => (
                      <Skeleton key={i} className="h-9 w-16 rounded-lg" />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-grey-100 h-px w-full" />

              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-28" />
                  <Skeleton className="h-12 flex-1" />
                </div>
                <Skeleton className="h-12 w-full rounded-full" />
              </div>

              <div className="bg-grey-100 h-px w-full" />

              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }, (_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-6 pt-13 lg:hidden">
        <div className="px-4 py-6">
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-87.5 w-full rounded-none" />
        <div className="flex flex-col gap-6 px-4 pb-8">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-16 w-full" />
        </div>
      </div>
    </main>
  );
}
