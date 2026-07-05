"use client";

import { motion } from "motion/react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductImageGallery } from "@/components/product-detail/product-image-gallery";
import { ProductInfoPanel } from "@/components/product-detail/product-info-panel";
import { RelatedProducts } from "@/components/product-detail/related-products";
import { ProductReviews } from "@/components/product-detail/product-reviews";
import { TRANSITION } from "@/lib/motion";
import products from "@/data/products.json";

interface ProductDetailViewProps {
  slug: string;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
};

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const product = products.find((p) => p.slug === slug) ?? products[0];

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: product.name },
  ];

  return (
    <main className="flex flex-1 flex-col pt-24">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={container}
        className="px-4 pt-8 pb-20 sm:px-8 lg:px-20"
      >
        <div className="2xl:mx-auto 2xl:max-w-384">
          <motion.div variants={item}>
            <Breadcrumb items={breadcrumbItems} />
          </motion.div>

          <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-8">
            <motion.div variants={item}>
              <ProductImageGallery image={product.image} name={product.name} />
            </motion.div>

            <motion.div variants={item} className="lg:sticky lg:top-28 lg:self-start">
              <ProductInfoPanel
                slug={product.slug}
                name={product.name}
                image={product.image}
                description={product.description}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>

      <RelatedProducts currentSlug={slug} />
      <ProductReviews />
    </main>
  );
}
