import { findMockVariant } from "@/data/mock-catalog";
import { toNaira } from "@/lib/utils";

/** Browser-only cart used in mock mode; mirrors the Shopify cart API in `queries/cart.ts`. */

const STORAGE_KEY = "glossup:mock-cart";

interface StoredLine {
  id: string;
  variantId: string;
  quantity: number;
}

interface StoredCart {
  id: string;
  lines: StoredLine[];
}

function read(cartId: string): StoredCart | null {
  try {
    const cart = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null") as StoredCart | null;
    return cart?.id === cartId ? cart : null;
  } catch {
    return null;
  }
}

function write(cart: StoredCart): Cart {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable — the cart still works for this page view
  }
  return toCart(cart);
}

function toCart(cart: StoredCart): Cart {
  const lines = cart.lines.flatMap((line): CartLine[] => {
    const match = findMockVariant(line.variantId);
    if (!match) return [];
    const { product, variant } = match;
    return [
      {
        id: line.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        image: product.image,
        size: variant.size,
        price: toNaira(variant.price),
        compareAtPrice: variant.compareAtPrice ? toNaira(variant.compareAtPrice) : undefined,
        quantity: line.quantity,
        productVariants: product.variants.map((v) => ({ id: v.id, size: v.size })),
      },
    ];
  });
  return {
    id: cart.id,
    checkoutUrl: "#",
    totalQuantity: lines.reduce((sum, l) => sum + l.quantity, 0),
    lines,
  };
}

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function getMockCart(cartId: string): Promise<Cart | null> {
  const cart = read(cartId);
  return cart ? toCart(cart) : null;
}

export async function createMockCart(variantId: string, quantity: number): Promise<Cart | null> {
  return write({ id: newId("mock-cart"), lines: [{ id: newId("line"), variantId, quantity }] });
}

export async function addMockCartLines(
  cartId: string,
  variantId: string,
  quantity: number,
): Promise<Cart | null> {
  const cart = read(cartId);
  if (!cart) return createMockCart(variantId, quantity);
  const existing = cart.lines.find((l) => l.variantId === variantId);
  if (existing) existing.quantity += quantity;
  else cart.lines.push({ id: newId("line"), variantId, quantity });
  return write(cart);
}

export async function updateMockCartLine(
  cartId: string,
  lineId: string,
  patch: { quantity?: number; variantId?: string },
): Promise<Cart | null> {
  const cart = read(cartId);
  if (!cart) return null;
  cart.lines = cart.lines
    .map((l) => (l.id === lineId ? { ...l, ...patch } : l))
    .filter((l) => l.quantity > 0);
  return write(cart);
}

export async function removeMockCartLine(cartId: string, lineId: string): Promise<Cart | null> {
  const cart = read(cartId);
  if (!cart) return null;
  cart.lines = cart.lines.filter((l) => l.id !== lineId);
  return write(cart);
}
