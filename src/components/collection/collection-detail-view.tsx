"use client";

import { useState } from "react";

import { motion } from "motion/react";

import Image from "next/image";
import Link from "next/link";

import { CategoryPill } from "@/components/shop/category-pill";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { NoProductsFound } from "@/components/shop/no-products-found";
import { ShopFilterBar } from "@/components/shop/shop-filter-bar";
import { ProductCard } from "@/components/product/product-card";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Pagination } from "@/components/ui/pagination";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { XIcon } from "lucide-react";
import { gridContainer, gridItem } from "@/lib/motion";
import { DEFAULT_PRODUCT_FILTERS, filterProducts } from "@/lib/product-filters";

const PRODUCTS_PER_PAGE = 21;

interface CollectionDetailViewProps {
  slug: string;
  products: Product[];
  categories: Category[];
}

function slugToLabel(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function CollectionDetailView({ slug, products, categories }: CollectionDetailViewProps) {
  const [filters, setFilters] = useState(DEFAULT_PRODUCT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const label = slugToLabel(slug);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Collections", href: "/collection" },
    { label: label },
  ];

  const collectionProducts = filterProducts(
    products.filter((p) => (p.categories ?? []).includes(slug)),
    filters,
  );
  const totalPages = Math.ceil(collectionProducts.length / PRODUCTS_PER_PAGE);
  const paged = collectionProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  const updateFilters = (next: typeof filters) => {
    setFilters(next);
    setCurrentPage(1);
  };

  return (
    <main className="flex flex-1 flex-col pt-24">
      {/* Header */}
      <div className="px-4 pt-6 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
        <div className="flex flex-col gap-6 lg:gap-8 2xl:mx-auto 2xl:max-w-384">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex flex-col gap-4 lg:gap-8">
            <h1 className="text-grey-950 text-[40px] font-light tracking-[-0.8px] sm:text-5xl sm:tracking-[-1.2px] lg:text-[64px] lg:leading-[1.13] lg:tracking-[-1.28px]">
              {label}
            </h1>

            <div className="flex flex-wrap gap-4 lg:-mx-10 lg:scrollbar-none lg:flex-nowrap lg:overflow-x-auto lg:px-10 lg:pb-1 xl:-mx-20 xl:px-20">
              {categories.map((category) => (
                <Link key={category.slug} href={`/collection/${category.slug}`}>
                  <CategoryPill
                    label={category.name}
                    count={category.count}
                    image={category.image}
                    active={slug === category.slug}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-8 pb-14 sm:px-8 sm:pt-10 lg:px-10 lg:pt-10 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <ShopFilterBar
            onFilterClick={() => setFilterOpen(true)}
            onSidebarToggle={() => setSidebarOpen((prev) => !prev)}
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
                  hideCategory
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
                hideCategory
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
                    key={currentPage}
                    variants={gridContainer}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-8 lg:grid-cols-[repeat(auto-fill,minmax(240px,1fr))]"
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
