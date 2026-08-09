"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  addCartLines,
  createCart,
  getCart,
  removeCartLine,
  updateCartLineQuantity,
  updateCartLineVariant,
} from "@/queries/cart";
import { useCartStore } from "@/store/cart-store";

function cartQueryKey(cartId: string | null) {
  return ["cart", cartId] as const;
}

export function useCart() {
  const cartId = useCartStore((s) => s.cartId);
  const setCartId = useCartStore((s) => s.setCartId);

  return useQuery({
    queryKey: cartQueryKey(cartId),
    queryFn: async () => {
      if (!cartId) return null;
      const cart = await getCart(cartId);
      if (!cart) setCartId(null); // persisted cart ID is stale/expired
      return cart;
    },
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  const cartId = useCartStore((s) => s.cartId);
  const setCartId = useCartStore((s) => s.setCartId);
  const openCart = useCartStore((s) => s.open);

  return useMutation({
    mutationFn: ({ variantId, quantity = 1 }: { variantId: string; quantity?: number }) =>
      cartId ? addCartLines(cartId, variantId, quantity) : createCart(variantId, quantity),
    onSuccess: (cart) => {
      if (!cart) return;
      setCartId(cart.id);
      queryClient.setQueryData(cartQueryKey(cart.id), cart);
      openCart();
    },
  });
}

export function useUpdateCartLineQuantity() {
  const queryClient = useQueryClient();
  const cartId = useCartStore((s) => s.cartId);

  return useMutation({
    mutationFn: ({ lineId, quantity }: { lineId: string; quantity: number }) => {
      if (!cartId) throw new Error("No active cart");
      return updateCartLineQuantity(cartId, lineId, quantity);
    },
    onSuccess: (cart) => {
      if (cart) queryClient.setQueryData(cartQueryKey(cart.id), cart);
    },
  });
}

export function useRemoveCartLine() {
  const queryClient = useQueryClient();
  const cartId = useCartStore((s) => s.cartId);

  return useMutation({
    mutationFn: (lineId: string) => {
      if (!cartId) throw new Error("No active cart");
      return removeCartLine(cartId, lineId);
    },
    onSuccess: (cart) => {
      if (cart) queryClient.setQueryData(cartQueryKey(cart.id), cart);
    },
  });
}

/**
 * Swaps a cart line's variant (size change). If the target size is already a
 * separate line in the cart, merges quantities into that line and removes the
 * old one instead of leaving two lines for the same variant.
 */
export function useChangeCartLineSize() {
  const queryClient = useQueryClient();
  const cartId = useCartStore((s) => s.cartId);

  return useMutation({
    mutationFn: async ({ lineId, newVariantId }: { lineId: string; newVariantId: string }) => {
      if (!cartId) throw new Error("No active cart");
      const currentCart = queryClient.getQueryData<Cart | null>(cartQueryKey(cartId));
      const movingLine = currentCart?.lines.find((l) => l.id === lineId);
      const existingLine = currentCart?.lines.find(
        (l) => l.variantId === newVariantId && l.id !== lineId,
      );

      if (existingLine && movingLine) {
        await updateCartLineQuantity(
          cartId,
          existingLine.id,
          existingLine.quantity + movingLine.quantity,
        );
        return removeCartLine(cartId, lineId);
      }
      return updateCartLineVariant(cartId, lineId, newVariantId);
    },
    onSuccess: (cart) => {
      if (cart) queryClient.setQueryData(cartQueryKey(cart.id), cart);
    },
  });
}
