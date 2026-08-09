export interface ProductFilters {
  categories: string[];
  priceMin: number;
  priceMax: number;
  ingredients: string[];
  rating: number | "all";
}

export const MIN_PRICE = 0;
export const MAX_PRICE = 400250;

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  categories: [],
  priceMin: MIN_PRICE,
  priceMax: MAX_PRICE,
  ingredients: [],
  rating: "all",
};

export function parsePrice(price: string) {
  return parseInt(price.replace(/[₦,]/g, ""), 10);
}

export function filterProducts(list: Product[], filters: ProductFilters): Product[] {
  return list.filter((p) => {
    if (filters.categories.length > 0) {
      const productCategories = p.categories ?? (p.category ? [p.category] : []);
      if (!filters.categories.some((c) => productCategories.includes(c))) return false;
    }

    const price = parsePrice(p.price);
    if (price < filters.priceMin || price > filters.priceMax) return false;

    if (filters.ingredients.length > 0) {
      const productIngredients = p.ingredients ?? [];
      if (!filters.ingredients.some((i) => productIngredients.includes(i))) return false;
    }

    if (filters.rating !== "all" && p.rating < filters.rating) return false;

    return true;
  });
}
