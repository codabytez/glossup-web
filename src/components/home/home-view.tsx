import { Faqs } from "@/components/home/faqs";
import { Hero } from "@/components/home/hero";
import { Reviews } from "@/components/home/reviews";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { Testimonial } from "@/components/home/testimonial";
import { TopEssentials } from "@/components/home/top-essentials";
import { getCollections } from "@/queries/collections";

export async function HomeView() {
  const categories = await getCollections();

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <TopEssentials />
      <ShopByCategory categories={categories} />
      <Testimonial />
      <Reviews />
      <Faqs />
    </main>
  );
}
