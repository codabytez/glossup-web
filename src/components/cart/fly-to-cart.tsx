"use client";

import Image from "next/image";
import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

const emptySubscribe = () => () => {};
import { AnimatePresence, motion } from "motion/react";

interface FlyItem {
  id: string;
  image: string;
  from: { x: number; y: number };
  to: { x: number; y: number };
}

type FlyFn = (image: string, fromRect: DOMRect) => void;

const FlyToCartContext = createContext<FlyFn | null>(null);

const FLY_SIZE = 80;

function FlyingItem({ item }: { item: FlyItem }) {
  return (
    <motion.div
      initial={{
        x: item.from.x - FLY_SIZE / 2,
        y: item.from.y - FLY_SIZE / 2,
        scale: 1,
        opacity: 1,
      }}
      animate={{
        x: item.to.x - FLY_SIZE / 2,
        y: item.to.y - FLY_SIZE / 2,
        scale: 0.1,
        opacity: [1, 1, 0],
      }}
      transition={{
        duration: 1.1,
        x: { ease: [0.2, 0, 0.8, 1] },
        y: { ease: [0.4, 0, 1, 1] },
        scale: { ease: "easeIn", duration: 1.1 },
        opacity: { times: [0, 0.7, 1], duration: 1.1 },
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: FLY_SIZE,
        height: FLY_SIZE,
        zIndex: 9999,
        pointerEvents: "none",
      }}
      className="bg-grey-50 overflow-hidden rounded-full"
    >
      <Image src={item.image} alt="" fill className="object-contain" />
    </motion.div>
  );
}

export function FlyToCartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<FlyItem[]>([]);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const fly = useCallback((image: string, fromRect: DOMRect) => {
    const cartEl = document.querySelector("[data-cart-icon]");
    if (!cartEl) return;
    const toRect = cartEl.getBoundingClientRect();

    const id = crypto.randomUUID();
    setItems((prev) => [
      ...prev,
      {
        id,
        image,
        from: { x: fromRect.left + fromRect.width / 2, y: fromRect.top + fromRect.height / 2 },
        to: { x: toRect.left + toRect.width / 2, y: toRect.top + toRect.height / 2 },
      },
    ]);

    setTimeout(() => setItems((prev) => prev.filter((i) => i.id !== id)), 1200);
  }, []);

  return (
    <FlyToCartContext.Provider value={fly}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {items.map((item) => (
              <FlyingItem key={item.id} item={item} />
            ))}
          </AnimatePresence>,
          document.body,
        )}
    </FlyToCartContext.Provider>
  );
}

export function useFlyToCart() {
  const ctx = useContext(FlyToCartContext);
  if (!ctx) throw new Error("useFlyToCart must be used within FlyToCartProvider");
  return ctx;
}
