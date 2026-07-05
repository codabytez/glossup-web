import { notFound } from "next/navigation";

import { ProductDetailView } from "@/components/product-detail/product-detail-view";
import products from "@/data/products.json";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return <ProductDetailView slug={slug} />;
}
