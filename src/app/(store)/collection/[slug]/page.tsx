import { CollectionDetailView } from "@/components/collection/collection-detail-view";
import { getCollections } from "@/queries/collections";
import { getProducts } from "@/queries/products";

interface CollectionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([getProducts(), getCollections()]);
  return <CollectionDetailView slug={slug} products={products} categories={categories} />;
}
