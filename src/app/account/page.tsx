import { getSession } from "@/actions/auth";
import { AccountView } from "@/components/account/account-view";
import { SignUpView } from "@/components/account/sign-up-view";
import { getProducts } from "@/queries/products";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const customer = await getSession();
  if (!customer) return <SignUpView />;

  const products = await getProducts();
  return <AccountView customer={customer} products={products} />;
}
