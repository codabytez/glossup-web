import { Hero } from "@/components/home/hero";
import { Reviews } from "@/components/home/reviews";
import { ShopByCategory } from "@/components/home/shop-by-category";
import { Testimonial } from "@/components/home/testimonial";
import { TopEssentials } from "@/components/home/top-essentials";

export function HomeView() {
  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <TopEssentials />
      <ShopByCategory />
      <Testimonial />
      <Reviews />
    </main>
  );
}
