"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "motion/react";

import { ArrowLineIcon } from "@/components/icons/arrow-line-icon";
import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { StarIcon } from "@/components/icons/star-icon";
import {
  reviews as REVIEWS,
  distribution as DISTRIBUTION,
  average as AVERAGE,
  total as TOTAL,
} from "@/data/product-reviews.json";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";
import { cn } from "@/lib/utils";

const MAX_COUNT = Math.max(...DISTRIBUTION.map((d) => d.count));
const PER_PAGE = 9;

function ReviewStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.75">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i)) * 100;
        return (
          <span key={i} className="text-grey-200 relative inline-block size-3.5">
            <StarIcon className="size-full" />
            <span
              className="text-grey-500 absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <StarIcon className="size-3.5" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

function ReviewAvatar({ initials }: { initials: string }) {
  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#eff0fb]">
      <span className="text-[10px] font-medium text-[#6366f1]">{initials}</span>
    </div>
  );
}

function ReviewItem({ review }: { review: Review }) {
  return (
    <div className="flex gap-2 py-8">
      <ReviewAvatar initials={review.initials} />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-baseline justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-grey-950 text-sm font-medium">{review.name}</span>
            <ReviewStars rating={review.rating} />
          </div>
          <span className="text-grey-400 shrink-0 text-sm font-normal">{review.date}</span>
        </div>
        <p className="text-grey-700 text-sm leading-[1.4] font-normal">{review.text}</p>
      </div>
    </div>
  );
}

function RatingChart() {
  return (
    <div className="flex items-stretch gap-2">
      <div className="text-grey-800 flex flex-col justify-between gap-2 text-right text-sm font-normal">
        {DISTRIBUTION.map((d) => (
          <span key={d.stars} className="leading-[1.4]">
            {d.stars}
          </span>
        ))}
      </div>

      <div className="flex flex-1 flex-col justify-between gap-2 px-2 py-px">
        {DISTRIBUTION.map((d) => (
          <div key={d.stars} className="bg-grey-100 relative h-1 overflow-hidden rounded-full">
            <div
              className="bg-grey-600 absolute inset-y-0 left-0 rounded-full"
              style={{ width: `${(d.count / MAX_COUNT) * 100}%` }}
            />
          </div>
        ))}
      </div>

      <div className="text-grey-400 flex flex-col justify-between gap-2 text-sm font-normal">
        {DISTRIBUTION.map((d) => (
          <span key={d.stars} className="leading-[1.4]">
            {d.count}
          </span>
        ))}
      </div>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  const pages = useMemo(() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
    if (page >= totalPages - 3)
      return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "…", page - 1, page, page + 1, "…", totalPages];
  }, [page, totalPages]);

  const btnBase =
    "flex min-w-10 items-center justify-center border-r border-grey-200 px-3 py-2 text-sm font-medium transition-colors last:border-r-0 hover:bg-grey-100";

  return (
    <div className="flex items-center">
      <div className="border-grey-200 flex items-stretch overflow-hidden rounded-sm border">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className={cn(btnBase, "text-grey-800 gap-2 px-4 disabled:opacity-40")}
        >
          <ArrowLineIcon className="text-grey-500 size-3" />
          Previous
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`ellipsis-${i}`}
              className="border-grey-200 text-grey-400 flex min-w-10 items-center justify-center border-r px-3 py-2 text-sm"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p as number)}
              className={cn(
                btnBase,
                page === p ? "bg-grey-200 text-grey-950" : "text-grey-500 bg-white",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className={cn(btnBase, "text-grey-800 gap-2 border-r-0 px-4 disabled:opacity-40")}
        >
          Next
          <ArrowLineIcon className="text-grey-500 size-3 -scale-x-100" />
        </button>
      </div>
    </div>
  );
}

export function ProductReviews() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(REVIEWS.length / PER_PAGE));
  const pageReviews = REVIEWS.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleQuery(val: string) {
    setQuery(val);
    setPage(1);
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUpContainer}
      className="px-4 py-5 sm:px-8 sm:py-10 lg:px-20 lg:py-15"
    >
      <div className="2xl:mx-auto 2xl:max-w-384">
        {/* Header */}
        <motion.div variants={fadeUpItem} className="mb-10 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Image src="/icons/star-feedback.svg" alt="" width={16} height={16} />
            <span className="text-grey-500 text-sm font-medium tracking-wider uppercase">
              Reviews
            </span>
          </div>
          <h2 className="text-grey-950 flex flex-wrap gap-3 text-[40px] leading-[1.13] font-light tracking-[-0.64px] sm:text-[64px] sm:tracking-[-1.28px]">
            <span>{AVERAGE}</span>
            <span>•</span>
            <span>{TOTAL} Reviews</span>
          </h2>
        </motion.div>

        {/* Two-column layout */}
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-[minmax(0,405px)_1fr] lg:items-start lg:gap-0">
          {/* Left: chart */}
          <motion.div variants={fadeUpItem} className="lg:sticky lg:top-28 lg:pr-27.5">
            <RatingChart />
          </motion.div>

          {/* Right: reviews */}
          <motion.div
            variants={fadeUpItem}
            className="lg:border-grey-100 flex flex-col gap-8 lg:border-l lg:pl-27.5"
          >
            {/* Search + Sort */}
            <div className="flex items-center justify-between gap-5">
              <label className="border-grey-200 bg-grey-50 flex w-54.5 items-center gap-1 rounded-full border px-2.5 py-1.5 backdrop-blur-[1px]">
                <SearchIcon className="text-grey-500 size-4 shrink-0" />
                <input
                  type="search"
                  placeholder="Search reviews"
                  value={query}
                  onChange={(e) => handleQuery(e.target.value)}
                  className="text-grey-950 placeholder:text-grey-500 flex-1 bg-transparent text-sm font-normal focus:outline-none"
                />
              </label>

              <button
                type="button"
                className="group/sort border-grey-300 bg-grey-100 relative flex items-center gap-1 overflow-hidden rounded-full border py-1 pr-3 pl-4"
              >
                <span className="text-grey-800 relative text-sm font-normal">Sort</span>
                <ChevronDownIcon className="text-grey-800 relative size-4" />
              </button>
            </div>

            {/* Review list */}
            <div className="divide-grey-100 flex flex-col divide-y">
              {pageReviews.length > 0 ? (
                pageReviews.map((review) => <ReviewItem key={review.name} review={review} />)
              ) : (
                <p className="text-grey-500 py-8 text-sm">No reviews match your search.</p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
