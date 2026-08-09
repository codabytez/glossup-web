interface ProductVariant {
  id: string;
  size: string;
  price: string;
  compareAtPrice?: string;
  availableForSale: boolean;
}

interface Product {
  slug: string;
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  image: string;
  rating: number;
  reviewCount: string;
  category?: string;
  categories?: string[];
  ingredients?: string[];
  variants: ProductVariant[];
}

interface ProductFeatureContent {
  benefits: string[];
  coreIngredients: { percent: string; name: string }[];
  allIngredients: string;
  howToUse: { num: string; text: string }[];
}

interface ProductDetail extends Product {
  images: string[];
  features: ProductFeatureContent;
}
