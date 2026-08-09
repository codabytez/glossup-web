import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartStore {
  isOpen: boolean;
  cartId: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  setCartId: (id: string | null) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      isOpen: false,
      cartId: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      setCartId: (id) => set({ cartId: id }),
    }),
    {
      name: "glossup:cart",
      partialize: (state) => ({ cartId: state.cartId }),
    },
  ),
);
