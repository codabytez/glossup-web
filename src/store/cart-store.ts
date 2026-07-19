import { create } from "zustand";

export interface CartItem {
  slug: string;
  name: string;
  image: string;
  price: string;
  originalPrice?: string;
  size: string;
  sizes?: string[];
  quantity: number;
}

function parsePrice(price: string): number {
  return parseInt(price.replace(/[₦,\s]/g, ""), 10) || 0;
}

export function formatCartTotal(items: CartItem[]): string {
  const sum = items.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);
  return `₦${sum.toLocaleString("en-NG")}`;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (slug: string, size: string) => void;
  updateQuantity: (slug: string, size: string, quantity: number) => void;
  changeSize: (slug: string, oldSize: string, newSize: string) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  addItem: (item) => {
    const qty = item.quantity ?? 1;
    const items = get().items;
    const idx = items.findIndex((i) => i.slug === item.slug && i.size === item.size);
    if (idx >= 0) {
      set({
        items: items.map((i, index) => (index === idx ? { ...i, quantity: i.quantity + qty } : i)),
      });
    } else {
      set({ items: [...items, { ...item, quantity: qty }] });
    }
  },
  removeItem: (slug, size) =>
    set({ items: get().items.filter((i) => !(i.slug === slug && i.size === size)) }),
  updateQuantity: (slug, size, quantity) => {
    if (quantity < 1) {
      get().removeItem(slug, size);
      return;
    }
    set({
      items: get().items.map((i) => (i.slug === slug && i.size === size ? { ...i, quantity } : i)),
    });
  },
  changeSize: (slug, oldSize, newSize) => {
    if (oldSize === newSize) return;
    const items = get().items;
    const source = items.find((i) => i.slug === slug && i.size === oldSize);
    if (!source) return;
    const targetIdx = items.findIndex((i) => i.slug === slug && i.size === newSize);
    if (targetIdx >= 0) {
      // Merge quantities into the existing new-size item
      set({
        items: items
          .map((i, idx) =>
            idx === targetIdx ? { ...i, quantity: i.quantity + source.quantity } : i,
          )
          .filter((i) => !(i.slug === slug && i.size === oldSize)),
      });
    } else {
      set({
        items: items.map((i) =>
          i.slug === slug && i.size === oldSize ? { ...i, size: newSize } : i,
        ),
      });
    }
  },
}));
