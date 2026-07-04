import { CollectionDetailView } from "@/components/collection/collection-detail-view";

interface CollectionDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CollectionDetailPage({ params }: CollectionDetailPageProps) {
  const { slug } = await params;
  return <CollectionDetailView slug={slug} />;
}
