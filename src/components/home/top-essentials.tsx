import { ProductCarousel } from "@/components/product/product-carousel";
import { getProducts } from "@/queries/products";

const HOME_PRODUCT_COUNT = 8;

export async function TopEssentials() {
  const products = await getProducts(HOME_PRODUCT_COUNT);

  return (
    <ProductCarousel
      title="Top essentials"
      badge={{ icon: "/icons/trophy.svg", label: "Featured" }}
      products={products}
      ctaLabel="View all products"
      ctaHref="/products"
    />
  );
}
