"use client";

import { useState } from "react";

import { motion } from "motion/react";
import Image from "next/image";

import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { NoProductsFound } from "@/components/shop/no-products-found";
import { ShopFilterBar, type SortOption } from "@/components/shop/shop-filter-bar";
import { ShopHeader } from "@/components/shop/shop-header";
import { ProductCard } from "@/components/product/product-card";
import { Pagination } from "@/components/ui/pagination";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { gridContainer, gridItem } from "@/lib/motion";
import { DEFAULT_PRODUCT_FILTERS, filterProducts, parsePrice } from "@/lib/product-filters";

const PRODUCTS_PER_PAGE = 21;

function sortProducts(list: Product[], sort: SortOption | undefined) {
  if (!sort) return list;
  const copy = [...list];
  switch (sort) {
    case "Lowest price":
      return copy.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case "Highest price":
      return copy.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    case "Featured first":
      return copy.sort((a, b) => b.rating - a.rating);
    case "Newest first":
      return copy.reverse();
    case "Oldest first":
      return copy;
    case "Product: A - Z":
      return copy.sort((a, b) => a.name.localeCompare(b.name));
    case "Product: Z - A":
      return copy.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return copy;
  }
}

interface ShopViewProps {
  products: Product[];
  categories: Category[];
}

export function ShopView({ products, categories }: ShopViewProps) {
  const [filters, setFilters] = useState(DEFAULT_PRODUCT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption | undefined>();
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = filterProducts(products, filters);
  const sorted = sortProducts(filtered, sortOption);
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
  const paged = sorted.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const updateFilters = (next: typeof filters) => {
    setFilters(next);
    setCurrentPage(1);
  };

  const updateSort = (next: SortOption) => {
    setSortOption(next);
    setCurrentPage(1);
  };

  const toggleCategory = (slug: string) =>
    updateFilters({
      ...filters,
      categories: filters.categories.includes(slug)
        ? filters.categories.filter((c) => c !== slug)
        : [...filters.categories, slug],
    });

  return (
    <main className="flex flex-1 flex-col pt-24">
      <ShopHeader
        categories={categories}
        activeCategories={filters.categories}
        onCategoryToggle={toggleCategory}
      />

      <div className="px-4 pt-8 pb-14 sm:px-8 sm:pt-10 lg:px-10 lg:pt-10 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <ShopFilterBar
            onFilterClick={() => setFilterOpen(true)}
            onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
            onSort={updateSort}
            onSortOpenChange={setSortOpen}
          />

          {/* Mobile filter drawer */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetContent side="left" className="p-0 lg:hidden" showCloseButton={false}>
              <SheetHeader className="border-grey-100 flex-row items-center justify-between border-b px-4 py-4">
                <div className="flex items-center gap-2">
                  <Image src="/icons/filter.svg" alt="" width={16} height={16} />
                  <SheetTitle className="text-grey-500 text-sm font-normal uppercase">
                    Filter by
                  </SheetTitle>
                </div>
                <SheetClose className="text-grey-950 p-1 hover:opacity-70">
                  <XIcon className="size-5" />
                  <span className="sr-only">Close</span>
                </SheetClose>
              </SheetHeader>
              <div className="flex-1 scrollbar-none overflow-y-auto px-6 py-6">
                <FilterSidebar
                  filters={filters}
                  onFiltersChange={updateFilters}
                  products={products}
                  categories={categories}
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className="mt-11 flex items-start gap-8">
            {/* Filter sidebar — desktop only */}
            <aside
              className={`hidden w-74 shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:scrollbar-none lg:overflow-x-hidden lg:overflow-y-auto ${sidebarOpen ? "lg:block" : "lg:hidden"}`}
            >
              <FilterSidebar
                filters={filters}
                onFiltersChange={updateFilters}
                products={products}
                categories={categories}
              />
            </aside>

            {/* Product grid */}
            <div className="flex min-w-0 flex-1 flex-col">
              {paged.length === 0 ? (
                <NoProductsFound
                  clearAction={{
                    label: "Clear filters",
                    onClick: () => updateFilters(DEFAULT_PRODUCT_FILTERS),
                  }}
                  continueAction={{ label: "Continue shopping", href: "/products" }}
                />
              ) : (
                <>
                  <motion.div
                    key={`${currentPage}-${filters.categories.join(",")}-${sortOption}`}
                    variants={gridContainer}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] ${sortOpen ? "pointer-events-none" : ""}`}
                  >
                    {paged.map((product) => (
                      <motion.div key={product.slug} variants={gridItem}>
                        <ProductCard {...product} className="w-full" />
                      </motion.div>
                    ))}
                  </motion.div>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
