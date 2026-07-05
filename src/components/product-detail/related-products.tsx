import { ProductCarousel } from "@/components/product/product-carousel";
import products from "@/data/products.json";

interface RelatedProductsProps {
  currentSlug: string;
}

export function RelatedProducts({ currentSlug }: RelatedProductsProps) {
  const related = (products as Product[]).filter((p) => p.slug !== currentSlug).slice(0, 10);

  return (
    <ProductCarousel
      title="Products like this"
      badge={{ icon: "/icons/tag.svg", label: "Related products" }}
      products={related}
      ctaLabel="See more"
      ctaHref="/products"
      className="py-5 sm:py-10 lg:py-15"
    />
  );
}
