import { redirect } from "next/navigation";

import { getSession } from "@/actions/auth";
import { OrdersListView } from "@/components/account/orders-list-view";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const customer = await getSession();
  if (!customer) redirect("/account");
  return <OrdersListView />;
}
