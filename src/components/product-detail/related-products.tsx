import { ProductCarousel } from "@/components/product/product-carousel";
import { getProducts } from "@/queries/products";

interface RelatedProductsProps {
  currentSlug: string;
  currentCategories: string[];
}

export async function RelatedProducts({ currentSlug, currentCategories }: RelatedProductsProps) {
  const products = await getProducts();
  const others = products.filter((p) => p.slug !== currentSlug);
  const sameCategory = others.filter((p) =>
    (p.categories ?? []).some((c) => currentCategories.includes(c)),
  );
  const rest = others.filter((p) => !sameCategory.includes(p));
  const related = [...sameCategory, ...rest].slice(0, 10);

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
