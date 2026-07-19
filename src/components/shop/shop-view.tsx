"use client";

import { useState } from "react";

import { motion } from "motion/react";

import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { ShopFilterBar, type SortOption } from "@/components/shop/shop-filter-bar";
import { ShopHeader } from "@/components/shop/shop-header";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { FilterIcon } from "@/components/icons/filter-icon";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { gridContainer, gridItem } from "@/lib/motion";
import categories from "@/data/categories.json";
import products from "@/data/products.json";

const PRODUCTS_PER_PAGE = 21;

function parsePrice(price: string) {
  return parseInt(price.replace(/[₦,]/g, ""), 10);
}

function sortProducts(list: typeof products, sort: SortOption | undefined) {
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

export function ShopView() {
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [sortOption, setSortOption] = useState<SortOption | undefined>();
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const filtered = activeCategory
    ? products.filter((p) => p.slug.startsWith(activeCategory))
    : products;
  const sorted = sortProducts(filtered, sortOption);
  const totalPages = Math.ceil(sorted.length / PRODUCTS_PER_PAGE);
  const paged = sorted.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  return (
    <main className="flex flex-1 flex-col pt-24">
      <ShopHeader
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={(slug) => {
          setActiveCategory((prev) => (prev === slug ? undefined : slug));
          setCurrentPage(1);
        }}
      />

      <div className="px-4 pt-8 pb-14 sm:px-8 sm:pt-10 lg:px-10 lg:pt-10 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <ShopFilterBar
            onFilterClick={() => setFilterOpen(true)}
            onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
            onSort={(v) => {
              setSortOption(v);
              setCurrentPage(1);
            }}
            onSortOpenChange={setSortOpen}
          />

          {/* Mobile filter drawer */}
          <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
            <SheetContent side="left" className="p-0 lg:hidden" showCloseButton={false}>
              <SheetHeader className="border-grey-100 flex-row items-center justify-between border-b px-4 py-4">
                <div className="flex items-center gap-2">
                  <FilterIcon className="text-primary-900 size-4" />
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
                <FilterSidebar />
              </div>
            </SheetContent>
          </Sheet>

          <div className="mt-11 flex items-start gap-8">
            {/* Filter sidebar — desktop only */}
            <aside
              className={`hidden w-74 shrink-0 lg:sticky lg:top-28 lg:max-h-[calc(100vh-7rem)] lg:scrollbar-none lg:overflow-x-hidden lg:overflow-y-auto ${sidebarOpen ? "lg:block" : "lg:hidden"}`}
            >
              <FilterSidebar />
            </aside>

            {/* Product grid */}
            <div className="flex min-w-0 flex-1 flex-col">
              {paged.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex flex-col items-center gap-5 py-24 text-center"
                >
                  <span className="text-5xl">🛍️</span>
                  <div className="flex flex-col gap-2">
                    <p className="text-grey-950 text-xl font-medium">No products found</p>
                    <p className="text-grey-500 text-body-base max-w-xs">
                      Try a different category or browse everything we have.
                    </p>
                  </div>
                  <Button
                    variant="pill"
                    size="pill"
                    fillOnHover
                    onClick={() => setActiveCategory(undefined)}
                    className="border-grey-950 text-grey-950 mt-2"
                  >
                    Browse all products
                  </Button>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    key={`${currentPage}-${activeCategory}-${sortOption}`}
                    variants={gridContainer}
                    initial="hidden"
                    animate="visible"
                    className={`grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]${sortOpen ? "pointer-events-none" : ""}`}
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
