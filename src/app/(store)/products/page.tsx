import { ShopView } from "@/components/shop/shop-view";
import { getCollections } from "@/queries/collections";
import { getProducts } from "@/queries/products";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCollections()]);
  return <ShopView products={products} categories={categories} />;
}
