"use client";

import { useState } from "react";

import { AnimatePresence, motion } from "motion/react";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { StarIcon } from "@/components/icons/star-icon";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { PriceRangeSlider } from "@/components/shop/price-range-slider";
import { cn } from "@/lib/utils";

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-body-base text-grey-500 font-normal">{title}</span>
        <ChevronDownIcon
          className={cn(
            "text-grey-400 size-4 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface CheckboxItemProps {
  label: string;
  count?: string | number;
  checked: boolean;
  onChange: () => void;
}

function CheckboxItem({ label, count, checked, onChange }: CheckboxItemProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between py-1"
    >
      <span className="flex items-center gap-1">
        <span className="text-body-base text-grey-950 leading-[1.4] font-normal">{label}</span>
        {count !== undefined && (
          <span className="text-grey-400 text-[9px] leading-[1.4] font-normal">{count}</span>
        )}
      </span>
      <Checkbox checked={checked} />
    </button>
  );
}

interface RatingItemProps {
  stars: number | "all";
  checked: boolean;
  onChange: () => void;
}

function RatingItem({ stars, checked, onChange }: RatingItemProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex w-full items-center justify-between py-1"
    >
      <span className="flex items-center gap-1">
        {stars === "all" ? (
          <span className="text-body-base text-grey-950 font-normal">All</span>
        ) : (
          <span className="flex items-center gap-1">
            <span className="flex items-center gap-0.75">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={cn("size-3.5", i < stars ? "text-amber-400" : "text-grey-300")}
                />
              ))}
            </span>
            <span className="text-body-caption text-grey-500 leading-[1.35]">& above</span>
          </span>
        )}
      </span>
      <Checkbox checked={checked} />
    </button>
  );
}

const CATEGORY_ITEMS = [
  { label: "Skincare", count: "45" },
  { label: "Haircare", count: "30" },
  { label: "Makeup", count: "60" },
  { label: "Fragrance", count: "25" },
  { label: "Body Care", count: "40" },
  { label: "Essential oils", count: "20" },
];

const INGREDIENT_PILLS = [
  "Hyaluronic Acid",
  "Retinol",
  "Vitamin C",
  "Niacinamide",
  "Salicylic Acid",
  "Glycolic Acid",
  "Peptides",
  "Zinc Oxide",
  "Tea Tree Oil",
  "Ceramides",
  "Lactic Acid",
];
const INGREDIENTS_PREVIEW = 8;

interface IngredientsFilterProps {
  selected: string[];
  onToggle: (pill: string) => void;
}

function IngredientsFilter({ selected, onToggle }: IngredientsFilterProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? INGREDIENT_PILLS : INGREDIENT_PILLS.slice(0, INGREDIENTS_PREVIEW);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {visible.map((pill) => (
          <Badge
            key={pill}
            variant={selected.includes(pill) ? "filter-active" : "filter"}
            render={<button type="button" />}
            onClick={() => onToggle(pill)}
          >
            {pill}
          </Badge>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setShowAll((v) => !v)}
        className="text-body-base text-primary-900 flex items-center gap-1 px-2 py-1 font-medium"
      >
        <span>{showAll ? "Show less" : "Show all"}</span>
        <ChevronDownIcon
          className={cn("size-5 transition-transform duration-200", showAll && "rotate-180")}
        />
      </button>
    </div>
  );
}

interface FilterState {
  categories: string[];
  priceMin: number;
  priceMax: number;
  ingredients: string[];
  rating: number | "all";
}

interface FilterSidebarProps {
  hideCategory?: boolean;
}

export function FilterSidebar({ hideCategory }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceMin: 0,
    priceMax: 400250,
    ingredients: [],
    rating: "all",
  });

  const toggleCategory = (label: string) =>
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(label)
        ? f.categories.filter((c) => c !== label)
        : [...f.categories, label],
    }));

  const toggleIngredient = (label: string) =>
    setFilters((f) => ({
      ...f,
      ingredients: f.ingredients.includes(label)
        ? f.ingredients.filter((i) => i !== label)
        : [...f.ingredients, label],
    }));

  return (
    <div className="flex flex-col gap-8 pb-6">
      {!hideCategory && (
        <>
          <FilterSection title="Category">
            <div className="flex flex-col pl-4">
              {CATEGORY_ITEMS.map((item) => (
                <CheckboxItem
                  key={item.label}
                  label={item.label}
                  count={item.count}
                  checked={filters.categories.includes(item.label)}
                  onChange={() => toggleCategory(item.label)}
                />
              ))}
            </div>
          </FilterSection>
          <div className="bg-grey-200 h-px w-full shrink-0" />
        </>
      )}

      <FilterSection title="Price">
        <PriceRangeSlider
          min={filters.priceMin}
          max={filters.priceMax}
          onMinChange={(v) => setFilters((f) => ({ ...f, priceMin: v }))}
          onMaxChange={(v) => setFilters((f) => ({ ...f, priceMax: v }))}
        />
      </FilterSection>
      <div className="bg-grey-200 h-px w-full shrink-0" />

      <FilterSection title="Ingredients">
        <IngredientsFilter selected={filters.ingredients} onToggle={toggleIngredient} />
      </FilterSection>
      <div className="bg-grey-200 h-px w-full shrink-0" />

      <FilterSection title="Ratings">
        <div className="flex flex-col gap-2 pl-4">
          <RatingItem
            stars="all"
            checked={filters.rating === "all"}
            onChange={() => setFilters((f) => ({ ...f, rating: "all" }))}
          />
          {[4, 3, 2, 1].map((n) => (
            <RatingItem
              key={n}
              stars={n}
              checked={filters.rating === n}
              onChange={() => setFilters((f) => ({ ...f, rating: n }))}
            />
          ))}
        </div>
      </FilterSection>
      <div className="bg-grey-200 h-px w-full shrink-0" />

      <Button
        variant="pill"
        size="pill"
        fillOnHover
        onClick={() => {
          setFilters({
            categories: [],
            priceMin: 0,
            priceMax: 400250,
            ingredients: [],
            rating: "all",
          });
        }}
        className="border-grey-400 text-grey-800 w-fit"
      >
        Clear filters
      </Button>
    </div>
  );
}
