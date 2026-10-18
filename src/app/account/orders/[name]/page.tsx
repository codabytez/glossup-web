import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { OrderDetailView } from "@/components/account/order-detail-view";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{ name: string }>;
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const customer = await getSession();
  if (!customer) redirect("/account");
  const { name } = await params;
  return <OrderDetailView orderName={name} />;
}
