"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ProductImageGallery } from "@/components/product-detail/product-image-gallery";
import { ProductInfoPanel } from "@/components/product-detail/product-info-panel";
import { ProductFeatures } from "@/components/product-detail/product-features";
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
import { useAddToCart } from "@/hooks/use-cart";
import { useSession } from "@/hooks/use-session";
import { useToggleWishlist, useWishlist } from "@/hooks/use-wishlist";
import { useSignInPromptStore } from "@/store/sign-in-prompt-store";

interface ProductDetailViewProps {
  product: ProductDetail;
  relatedProducts: React.ReactNode;
}

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
};

interface MobileImageCarouselProps {
  images: string[];
  name: string;
  isSaved: boolean;
  onToggleSaved: () => void;
  onShare: () => void;
}

function MobileImageCarousel({
  images,
  name,
  isSaved,
  onToggleSaved,
  onShare,
}: MobileImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
            onClick={onToggleSaved}
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

export function ProductDetailView({ product, relatedProducts }: ProductDetailViewProps) {
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants[2] ?? product.variants[0],
  );
  const [quantity, setQuantity] = useState(1);
  const [shareOpen, setShareOpen] = useState(false);
  const addToCart = useAddToCart();
  const { data: session } = useSession();
  const { data: wishlistHandles = [] } = useWishlist();
  const toggleWishlist = useToggleWishlist();
  const triggerSignInPrompt = useSignInPromptStore((s) => s.trigger);
  const isSaved = wishlistHandles.includes(product.slug);

  const toggleSaved = () => {
    if (!session) {
      triggerSignInPrompt();
      return;
    }
    toggleWishlist.mutate(product.slug);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/products" },
    { label: product.name },
  ];

  const handleAddToCart = () => {
    addToCart.mutate({ variantId: selectedVariant.id, quantity });
  };

  const handleBuyNow = async () => {
    const cart = await addToCart.mutateAsync({ variantId: selectedVariant.id, quantity });
    if (cart) window.location.href = cart.checkoutUrl;
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
              images={product.images}
              name={product.name}
              isSaved={isSaved}
              onToggleSaved={toggleSaved}
              onShare={() => setShareOpen(true)}
            />

            {/* Product info */}
            <div className="flex flex-col gap-6 px-4 pt-6 pb-8">
              <p className="text-grey-950 text-2xl font-normal">{product.name}</p>

              {/* Price + Rating on same row */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <p className="text-grey-950 text-2xl font-semibold">{selectedVariant.price}</p>
                  {selectedVariant.compareAtPrice && (
                    <p className="text-grey-500 text-sm font-normal line-through">
                      {selectedVariant.compareAtPrice}
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
                  <span className="text-grey-400">• {selectedVariant.size}</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant) => (
                    <Badge
                      key={variant.id}
                      render={<button type="button" onClick={() => setSelectedVariant(variant)} />}
                      variant={selectedVariant.id === variant.id ? "filter-active" : "filter"}
                      className="py-2"
                    >
                      {variant.size}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="bg-grey-100 h-px" />

              <ProductFeatures {...product.features} />
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
                <ProductImageGallery images={product.images} name={product.name} />
              </motion.div>

              <motion.div variants={item} className="lg:sticky lg:top-28 lg:self-start">
                <ProductInfoPanel
                  slug={product.slug}
                  name={product.name}
                  description={product.description}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  features={product.features}
                  variants={product.variants}
                  onShare={() => setShareOpen(true)}
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {relatedProducts}
        <ProductReviews />

        {/* ── Mobile sticky CTA ── */}
        <div className="border-grey-100 fixed inset-x-0 bottom-0 z-40 border-t bg-white lg:hidden">
          <div className="flex flex-col gap-4 px-4 py-6">
            <div className="flex gap-4">
              <QuantityStepper value={quantity} onChange={setQuantity} />
              <AddToBagButton
                price={selectedVariant.price}
                fillColor="secondary"
                className="border-grey-800 flex-1 rounded-[1px] border px-5 py-3 sm:px-6"
                onClick={handleAddToCart}
              />
            </div>
            <Button variant="primary" size="pill" className="w-full" onClick={handleBuyNow}>
              Buy now
            </Button>
          </div>
        </div>
      </main>

      <ShareModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
}
