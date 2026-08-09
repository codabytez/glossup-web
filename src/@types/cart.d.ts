interface CartLine {
  id: string;
  variantId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  price: string;
  compareAtPrice?: string;
  quantity: number;
  /** Sibling variants of the same product, for the size-swap dropdown. */
  productVariants: { id: string; size: string }[];
}

interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartLine[];
}
