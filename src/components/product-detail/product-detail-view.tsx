"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  ProductImageGallery,
  GALLERY_IMAGES,
} from "@/components/product-detail/product-image-gallery";
import { ProductInfoPanel } from "@/components/product-detail/product-info-panel";
import { ProductFeatures } from "@/components/product-detail/product-features";
import { RelatedProducts } from "@/components/product-detail/related-products";
import { ProductReviews } from "@/components/product-detail/product-reviews";
import { ProductImageLightbox } from "@/components/product-detail/product-image-lightbox";
import { AddToBagButton } from "@/components/ui/add-to-bag-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { HeartIcon } from "@/components/icons/heart-icon";
import { ShareIcon } from "@/components/icons/share-icon";
import { ShareModal } from "@/components/product-detail/share-modal";
import { StarRating } from "@/components/product/star-rating";
import { TRANSITION } from "@/lib/motion";
import { useCartStore } from "@/store/cart-store";
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

const SIZES = ["25ml", "50ml", "75ml"];

interface MobileImageCarouselProps {
  image: string;
  name: string;
  isSaved: boolean;
  onSavedChange: (saved: boolean) => void;
  onShare: () => void;
}

function MobileImageCarousel({
  image,
  name,
  isSaved,
  onSavedChange,
  onShare,
}: MobileImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const images = [image, ...GALLERY_IMAGES.filter((img) => img !== image)].slice(0, 6);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    setActiveIndex(Math.round(scrollLeft / clientWidth));
  };

  return (
    <>
      <div className="relative h-87.5">
        {/* Swipeable image strip */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex h-full snap-x snap-mandatory overflow-x-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`View image ${i + 1} fullscreen`}
              onClick={() => setLightboxOpen(true)}
              className="bg-grey-50 relative h-full w-full shrink-0 cursor-zoom-in snap-center"
            >
              <Image
                src={src}
                alt={`${name} view ${i + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
                priority={i === 0}
              />
            </button>
          ))}
        </div>

        {/* Red progress bar — moves across the bottom as you swipe */}
        <div
          className="bg-primary-900 absolute bottom-0 left-0 h-px transition-transform duration-150 ease-in-out"
          style={{
            width: `${100 / images.length}%`,
            transform: `translateX(${activeIndex * 100}%)`,
          }}
        />

        {/* Save / Share overlay */}
        <div className="absolute right-4 bottom-4 flex gap-2">
          <motion.button
            type="button"
            aria-label="Share product"
            onClick={onShare}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-grey-700 flex items-center justify-center rounded-full border-[0.5px] border-white bg-white p-2 backdrop-blur-[1px]"
          >
            <ShareIcon className="size-4" />
          </motion.button>
          <motion.button
            type="button"
            aria-label={isSaved ? "Remove from wishlist" : "Save to wishlist"}
            aria-pressed={isSaved}
            onClick={() => onSavedChange(!isSaved)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-grey-700 flex items-center justify-center rounded-full border-[0.5px] border-white bg-white p-2 backdrop-blur-[1px]"
          >
            <motion.span
              key={isSaved ? "saved" : "unsaved"}
              initial={{ scale: 0.6 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
              className="block"
            >
              <HeartIcon filled={isSaved} className="size-4" />
            </motion.span>
          </motion.button>
        </div>
      </div>

      {lightboxOpen && (
        <ProductImageLightbox
          images={images}
          initialIndex={activeIndex}
          name={name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

export function ProductDetailView({ slug }: ProductDetailViewProps) {
  const product = products.find((p) => p.slug === slug) ?? products[0];
  const [selectedSize, setSelectedSize] = useState(SIZES[2]);
  const [quantity, setQuantity] = useState(1);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { addItem, open } = useCartStore();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: product.name },
  ];

  const handleAddToCart = () => {
    addItem({
      slug,
      name: product.name,
      image: product.image,
      price: product.price,
      originalPrice: product.originalPrice,
      size: selectedSize,
      sizes: SIZES,
      quantity,
    });
    open();
  };

  return (
    <>
      <main className="flex flex-1 flex-col pb-40 lg:pb-0">
        {/* ── Mobile layout (< lg) ── */}
        <div className="flex flex-col lg:hidden">
          <div className="pt-13">
            {/* Breadcrumb */}
            <div className="px-4 py-6">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Swipeable image carousel */}
            <MobileImageCarousel
              image={product.image}
              name={product.name}
              isSaved={isSaved}
              onSavedChange={setIsSaved}
              onShare={() => setShareOpen(true)}
            />

            {/* Product info */}
            <div className="flex flex-col gap-6 px-4 pt-6 pb-8">
              <p className="text-grey-950 text-2xl font-normal">{product.name}</p>

              {/* Price + Rating on same row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-grey-950 text-2xl font-semibold">{product.price}</p>
                  {product.originalPrice && (
                    <p className="text-grey-500 text-sm font-normal line-through">
                      {product.originalPrice}
                    </p>
                  )}
                </div>
                <StarRating rating={product.rating} reviewCount={product.reviewCount} />
              </div>

              <p className="text-grey-700 text-sm leading-[1.4]">{product.description}</p>

              {/* Size selector */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-grey-950">Size</span>
                  <span className="text-grey-400">• {selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {SIZES.map((size) => (
                    <Badge
                      key={size}
                      render={<button type="button" onClick={() => setSelectedSize(size)} />}
                      variant={selectedSize === size ? "filter-active" : "filter"}
                      className="py-2"
                    >
                      {size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-grey-100 h-px" />

              <ProductFeatures />
            </div>
          </div>
        </div>

        {/* ── Desktop layout (lg+) ── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="hidden flex-col pt-24 pb-20 lg:flex lg:px-20"
        >
          <div className="2xl:mx-auto 2xl:max-w-384">
            <motion.div variants={item} className="pt-8">
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
                  onShare={() => setShareOpen(true)}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <RelatedProducts currentSlug={slug} />
        <ProductReviews />

        {/* ── Mobile sticky CTA ── */}
        <div className="border-grey-100 fixed inset-x-0 bottom-0 z-40 border-t bg-white lg:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            <div className="flex gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <AddToBagButton
                price={product.price}
                fillColor="secondary"
                className="border-grey-800 flex-1 rounded-[1px] border px-5 py-3 sm:px-6"
                onClick={handleAddToCart}
              />
            </div>
            <Button variant="primary" size="pill" className="w-full" onClick={handleAddToCart}>
              Buy now
            </Button>
          </div>
        </div>
      </main>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
}
