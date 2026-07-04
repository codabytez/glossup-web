import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductCarousel } from "@/components/product/product-carousel";
import products from "@/data/products.json";

const breadcrumbItems = [{ label: "Home", href: "/" }, { label: "Collections" }];

export function CollectionView() {
  return (
    <main className="flex flex-1 flex-col pt-24">
      <div className="px-4 pt-8 sm:px-8 sm:pt-10 lg:px-10 lg:pt-8 xl:px-20">
        <div className="2xl:mx-auto 2xl:max-w-384">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <ProductCarousel
        title="Top essentials"
        badge={{ icon: "/icons/trophy.svg", label: "Featured" }}
        products={products}
        ctaLabel="View all"
        ctaHref="/collection/top-essentials"
      />

      <ProductCarousel
        title="Skincare"
        products={products}
        ctaLabel="View all"
        ctaHref="/collection/skincare"
      />

      <ProductCarousel
        title="Body care"
        products={products}
        ctaLabel="View all"
        ctaHref="/collection/body-care"
      />

      <ProductCarousel
        title="Targeted care"
        products={products}
        ctaLabel="View all"
        ctaHref="/collection/targeted-care"
      />

      <ProductCarousel
        title="Essential oils"
        products={products}
        ctaLabel="View all"
        ctaHref="/collection/essential-oils"
      />
    </main>
  );
}
