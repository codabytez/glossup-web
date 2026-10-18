/**
 * Static catalog used when NEXT_PUBLIC_USE_MOCK_DATA=true — lets the storefront
 * run end-to-end (browse, product detail, reviews, cart) without a live Shopify
 * store or Judge.me account. Safe to import from both server and client code.
 */

export interface MockVariant {
  id: string;
  size: string;
  price: number;
  compareAtPrice?: number;
}

export interface MockProduct {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  image: string;
  images: string[];
  categories: string[];
  variants: MockVariant[];
  features: ProductFeatureContent;
}

const SIZES = [
  { size: "25ml", multiplier: 0.6 },
  { size: "50ml", multiplier: 0.8 },
  { size: "75ml", multiplier: 1 },
];

const HOW_TO_USE: ProductFeatureContent["howToUse"] = [
  { num: "01", text: "Wet your skin with warm water to prepare it for cleansing." },
  { num: "02", text: "Apply a small amount, massaging gently in circular motions." },
  { num: "03", text: "Work into a rich lather, focusing on areas that need extra care." },
  { num: "04", text: "Rinse thoroughly with lukewarm water until all residue is removed." },
  { num: "05", text: "Pat dry with a clean towel to help your skin retain moisture." },
  { num: "06", text: "Follow up with your favourite moisturiser to lock in hydration." },
];

interface ProductSeed {
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  image: string;
  categories: string[];
  basePrice: number;
  compareAtPrice?: number;
  benefits: string[];
  coreIngredients: { percent: string; name: string }[];
}

const SEEDS: ProductSeed[] = [
  {
    slug: "the-wash",
    name: "The Wash",
    shortDescription: "Gentle & hydrating body wash",
    description:
      "A gentle, sulphate-free body wash that cleanses without stripping. Niacinamide and ceramides support the skin barrier while tea tree oil keeps skin clear and fresh.",
    image: "/products/the-wash.png",
    categories: ["skincare", "body-care"],
    basePrice: 22900,
    compareAtPrice: 29500,
    benefits: [
      "Gently cleanses skin",
      "Deeply nourishes and hydrates",
      "Supports the skin barrier",
      "Leaves skin soft and smooth",
    ],
    coreIngredients: [
      { percent: "3.5%", name: "Niacinamide" },
      { percent: "1.0%", name: "Tea Tree Oil" },
      { percent: "2.0%", name: "Ceramides" },
    ],
  },
  {
    slug: "the-scrub",
    name: "The Scrub",
    shortDescription: "Exfoliating body scrub",
    description:
      "A polishing body scrub that buffs away dull, rough skin. A blend of AHAs and BHA lifts dead cells and helps fade uneven tone for a smoother, brighter finish.",
    image: "/products/the-scrub.png",
    categories: ["skincare", "body-care", "targeted-care"],
    basePrice: 24500,
    compareAtPrice: 31000,
    benefits: [
      "Buffs away rough, dull skin",
      "Helps fade uneven tone",
      "Unclogs pores",
      "Reveals a brighter, smoother finish",
    ],
    coreIngredients: [
      { percent: "5.0%", name: "Glycolic Acid" },
      { percent: "3.0%", name: "Lactic Acid" },
      { percent: "1.0%", name: "Salicylic Acid" },
    ],
  },
  {
    slug: "the-cream",
    name: "The Cream",
    shortDescription: "Rich body cream",
    description:
      "A rich, fast-absorbing body cream that locks in moisture for 48 hours. Hyaluronic acid and peptides plump and firm while gentle retinol smooths texture over time.",
    image: "/products/the-cream.png",
    categories: ["skincare", "body-care"],
    basePrice: 26900,
    benefits: [
      "48-hour hydration",
      "Plumps and firms skin",
      "Smooths rough texture",
      "Non-greasy, fast-absorbing",
    ],
    coreIngredients: [
      { percent: "2.0%", name: "Hyaluronic Acid" },
      { percent: "0.3%", name: "Retinol" },
      { percent: "3.0%", name: "Peptides" },
    ],
  },
  {
    slug: "gloss-up-hand-cream",
    name: "Gloss Up Hand Cream",
    shortDescription: "Nourishing hand cream",
    description:
      "A nourishing hand cream that softens dry, overworked hands. Vitamin C brightens, zinc soothes, and hyaluronic acid keeps hands supple all day.",
    image: "/products/hand-cream.png",
    categories: ["skincare", "targeted-care"],
    basePrice: 12500,
    compareAtPrice: 15000,
    benefits: [
      "Softens dry hands",
      "Brightens dull skin",
      "Absorbs quickly with no residue",
      "Travel-friendly",
    ],
    coreIngredients: [
      { percent: "2.5%", name: "Vitamin C" },
      { percent: "2.2%", name: "Zinc Oxide" },
      { percent: "1.5%", name: "Hyaluronic Acid" },
    ],
  },
  {
    slug: "glow-bar-soap",
    name: "Glow Bar Soap",
    shortDescription: "Brightening turmeric soap",
    description:
      "A cold-processed bar soap with turmeric and black soap that clarifies and brightens. Shea butter keeps it gentle enough for daily use.",
    image: "/products/the-wash.png",
    categories: ["soap", "body-care"],
    basePrice: 8500,
    benefits: ["Clarifies skin", "Brightens dull tone", "Gentle for daily use", "Long-lasting bar"],
    coreIngredients: [
      { percent: "4.0%", name: "Turmeric" },
      { percent: "10%", name: "African Black Soap" },
      { percent: "5.0%", name: "Shea Butter" },
    ],
  },
  {
    slug: "oud-body-mist",
    name: "Oud Body Mist",
    shortDescription: "Warm oud & amber mist",
    description:
      "A light, long-wearing body mist with warm notes of oud, amber and vanilla. Aloe keeps skin hydrated as the scent settles.",
    image: "/products/the-cream.png",
    categories: ["fragrance"],
    basePrice: 18900,
    compareAtPrice: 22000,
    benefits: [
      "Long-wearing scent",
      "Hydrating aloe base",
      "Layer-friendly",
      "Alcohol-light formula",
    ],
    coreIngredients: [
      { percent: "8.0%", name: "Oud Accord" },
      { percent: "3.0%", name: "Amber" },
      { percent: "2.0%", name: "Aloe Vera" },
    ],
  },
  {
    slug: "calm-essential-oil",
    name: "Calm Essential Oil",
    shortDescription: "Lavender & chamomile blend",
    description:
      "A soothing blend of lavender and chamomile in a jojoba carrier. Use in a diffuser or massage a few drops into pulse points to unwind.",
    image: "/products/hand-cream.png",
    categories: ["essential-oils", "fragrance"],
    basePrice: 14500,
    benefits: ["Calms and soothes", "Supports restful sleep", "Multi-use", "100% natural oils"],
    coreIngredients: [
      { percent: "30%", name: "Lavender Oil" },
      { percent: "20%", name: "Chamomile Oil" },
      { percent: "50%", name: "Jojoba Oil" },
    ],
  },
  {
    slug: "spot-fix-serum",
    name: "Spot Fix Serum",
    shortDescription: "Dark spot corrector",
    description:
      "A targeted serum for dark spots and hyperpigmentation. Alpha arbutin and vitamin C work together to even tone visibly in weeks.",
    image: "/products/the-scrub.png",
    categories: ["targeted-care", "skincare"],
    basePrice: 27500,
    compareAtPrice: 34000,
    benefits: [
      "Fades dark spots",
      "Evens skin tone",
      "Lightweight texture",
      "Suitable for all skin types",
    ],
    coreIngredients: [
      { percent: "2.0%", name: "Alpha Arbutin" },
      { percent: "10%", name: "Vitamin C" },
      { percent: "5.0%", name: "Coenzyme Q10" },
    ],
  },
];

/** Repeat seeds with distinct slugs so listing pages look populated. */
const REPEATS = 3;

function buildProduct(seed: ProductSeed, index: number, repeat: number): MockProduct {
  const id = 1000 + repeat * SEEDS.length + index;
  const slug = repeat === 0 ? seed.slug : `${seed.slug}-${repeat + 1}`;
  return {
    id,
    slug,
    name: seed.name,
    description: seed.description,
    shortDescription: seed.shortDescription,
    image: seed.image,
    images: [seed.image, "/products/gallery-5.png", "/products/gallery-6.png"],
    categories: seed.categories,
    variants: SIZES.map(({ size, multiplier }) => ({
      id: `mock-variant-${id}-${size}`,
      size,
      price: Math.round((seed.basePrice * multiplier) / 100) * 100,
      compareAtPrice: seed.compareAtPrice
        ? Math.round((seed.compareAtPrice * multiplier) / 100) * 100
        : undefined,
    })),
    features: {
      benefits: seed.benefits,
      coreIngredients: seed.coreIngredients,
      allIngredients: [
        ...seed.coreIngredients.map((i) => i.name),
        "Glycerin",
        "Aloe Vera",
        "Squalane",
        "Tocopherol",
      ].join(" • "),
      howToUse: HOW_TO_USE,
    },
  };
}

export const MOCK_PRODUCTS: MockProduct[] = Array.from({ length: REPEATS }, (_, repeat) =>
  SEEDS.map((seed, index) => buildProduct(seed, index, repeat)),
).flat();

const COLLECTION_SEEDS: Omit<Category, "count">[] = [
  {
    slug: "skincare",
    name: "Skincare",
    description: "Everyday essentials for clear, balanced, glowing skin.",
    image: "/categories/skincare.png",
  },
  {
    slug: "body-care",
    name: "Body Care",
    description: "Washes, scrubs and creams that treat your body like your face.",
    image: "/categories/body-care.png",
  },
  {
    slug: "targeted-care",
    name: "Targeted Care",
    description: "Focused formulas for dark spots, texture and uneven tone.",
    image: "/categories/targeted-care.png",
  },
  {
    slug: "soap",
    name: "Soap",
    description: "Cold-processed bars made with African black soap and botanicals.",
    image: "/categories/soap.png",
  },
  {
    slug: "fragrance",
    name: "Fragrance",
    description: "Body mists and scents that last from morning to night.",
    image: "/categories/fragrance.png",
  },
  {
    slug: "essential-oils",
    name: "Essential Oil",
    description: "Pure oil blends for your skin, your space and your sleep.",
    image: "/categories/fragrance.png",
  },
];

export const MOCK_COLLECTIONS: Category[] = COLLECTION_SEEDS.map((c) => ({
  ...c,
  count: String(MOCK_PRODUCTS.filter((p) => p.categories.includes(c.slug)).length),
}));

const REVIEW_SEEDS: { name: string; rating: number; date: string; body: string }[] = [
  {
    name: "Solo Makinde",
    rating: 5,
    date: "2026-09-12",
    body: "My routine went from five random steps to three products that actually work. My dark spots are fading and my skin finally feels calm and consistent.",
  },
  {
    name: "Adaeze Okafor",
    rating: 4,
    date: "2026-08-03",
    body: "Been using this for two months and the difference is real. My skin feels clean without that tight, stripped feeling from my old products.",
  },
  {
    name: "Tunde Bakare",
    rating: 4,
    date: "2026-06-21",
    body: "My hyperpigmentation has visibly reduced since I started. The niacinamide and vitamin C combo is doing serious work on my uneven skin tone.",
  },
  {
    name: "Chiamaka Eze",
    rating: 5,
    date: "2026-05-14",
    body: "Finally found something that doesn't break out my combination skin. The texture is luxurious and my skin is genuinely glowing.",
  },
  {
    name: "Ifeoma Nwosu",
    rating: 4,
    date: "2026-09-28",
    body: "The scent is subtle and clean, not overwhelming at all. My skin tone has evened out noticeably in six weeks of consistent use.",
  },
  {
    name: "Bola Adeyemi",
    rating: 5,
    date: "2026-07-09",
    body: "Switched from a popular drugstore brand and this blows it out of the water. Skin is softer, brighter, and I barely need foundation anymore.",
  },
  {
    name: "Kelechi Obi",
    rating: 3,
    date: "2026-04-02",
    body: "Good product overall. The packaging is beautiful and it works well. I expected more dramatic brightening for the price.",
  },
  {
    name: "Zainab Bello",
    rating: 5,
    date: "2026-10-05",
    body: "I was skeptical but the results after 30 days are undeniable. Skin texture is noticeably smoother and the uneven patches have calmed down.",
  },
];

/** Deterministic per-product review list: each product gets a rotating subset of the seeds. */
export function getMockReviews(product: MockProduct): JudgemeReview[] {
  const count = 4 + (product.id % 5);
  return Array.from({ length: count }, (_, i) => {
    const seed = REVIEW_SEEDS[(product.id + i) % REVIEW_SEEDS.length]!;
    return {
      id: product.id * 100 + i,
      title: null,
      body: seed.body,
      rating: seed.rating,
      product_external_id: product.id,
      product_title: product.name,
      product_handle: product.slug,
      reviewer: { id: product.id * 100 + i, name: seed.name, email: null },
      curated: "ok",
      hidden: false,
      verified: "buyer",
      created_at: `${seed.date}T10:00:00Z`,
    };
  });
}

export function findMockVariant(variantId: string) {
  for (const product of MOCK_PRODUCTS) {
    const variant = product.variants.find((v) => v.id === variantId);
    if (variant) return { product, variant };
  }
  return null;
}
