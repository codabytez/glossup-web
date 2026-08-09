import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product-detail/product-detail-view";
import { RelatedProducts } from "@/components/product-detail/related-products";
import { getProductByHandle } from "@/queries/products";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductByHandle(slug);
  if (!product) notFound();
  return (
    <ProductDetailView
      product={product}
      relatedProducts={
        <RelatedProducts currentSlug={slug} currentCategories={product.categories ?? []} />
      }
    />
  );
}
