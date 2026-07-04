import { ProductCarousel } from "@/components/product/product-carousel";
import products from "@/data/products.json";

const HOME_PRODUCT_COUNT = 8;

export function TopEssentials() {
  return (
    <ProductCarousel
      title="Top essentials"
      badge={{ icon: "/icons/trophy.svg", label: "Featured" }}
      products={products.slice(0, HOME_PRODUCT_COUNT)}
      ctaLabel="View all products"
      ctaHref="/products"
    />
  );
}
