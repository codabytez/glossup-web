"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import { ChevronDownIcon } from "@/components/icons/chevron-down-icon";
import { TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "Gently cleanses skin",
  "Deeply nourishes and hydrates",
  "Enriched with natural moisturizers",
  "Infused with botanical extracts",
  "Leaves skin soft and smooth",
  "Provides a refreshed feeling all day long",
];

const CORE_INGREDIENTS = [
  { percent: "3.5%", name: "Niacinamide" },
  { percent: "2.0%", name: "Hyaluronic Acid" },
  { percent: "1.5%", name: "Alpha Arbutin" },
  { percent: "2.5%", name: "Vitamin C" },
  { percent: "2.2%", name: "Zinc PCA" },
  { percent: "5.0%", name: "Coenzyme Q10" },
];

const ALL_INGREDIENTS =
  "Niacinamide • Hyaluronic Acid • Alpha Arbutin • Vitamin C • Zinc PCA • Coenzyme Q10 • Retinol • Ceramides • Glycerin • Aloe Vera • Peptides • Squalane";

const HOW_TO_USE = [
  { num: "01", text: "Wet your face with warm water to prepare your skin for cleansing." },
  { num: "02", text: "Apply a small amount to your skin, massaging gently in circular motions." },
  {
    num: "04",
    text: "Work the cleanser into a rich lather, focusing on areas that need extra nourishment.",
  },
  { num: "05", text: "Rinse thoroughly with lukewarm water until all residue is removed." },
  { num: "06", text: "Pat dry with a clean towel to help your skin retain its natural moisture." },
  {
    num: "07",
    text: "Follow up with your favorite moisturizer to lock in hydration and softness.",
  },
];

const FAQS = [
  {
    q: "Are your products suitable for all skin types?",
    a: "Yes! The Wash is formulated to be gentle enough for all skin types, including sensitive skin. Its blend of natural moisturizers and botanical extracts nourishes without causing irritation.",
    defaultOpen: true,
  },
  {
    q: "What ingredients are in your formulas?",
    a: "Our formulas are built around proven actives: Niacinamide (3.5%) for brightening and pore refinement, Hyaluronic Acid (2.0%) for deep hydration, Alpha Arbutin (1.5%) for even skin tone, and Vitamin C (2.5%) for radiance.",
    defaultOpen: false,
  },
  {
    q: "How do I choose the right product for my skin?",
    a: "Start with your main concern. If you want to address uneven tone or dullness, reach for The Wash — its brightening actives work from your very first cleanse. If hydration and texture are the priority, The Cream delivers lasting moisture without heaviness. ",
    defaultOpen: false,
  },
];

interface FeatureSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FeatureSection({ title, icon, children, defaultOpen = true }: FeatureSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className="text-grey-950 size-4 shrink-0">{icon}</span>
          <span className="text-body-base text-grey-950 font-normal tracking-wider uppercase">
            {title}
          </span>
        </span>
        <ChevronDownIcon
          className={cn(
            "text-grey-400 size-5 transition-transform duration-200",
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
            transition={TRANSITION}
            style={{ overflow: "hidden" }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FaqItem({ q, a, defaultOpen }: { q: string; a: string | null; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-grey-100 flex flex-col gap-4 border-t border-b py-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6"
      >
        <p className="text-body-base text-grey-950 flex-1 text-left leading-[1.4] font-medium">
          {q}
        </p>
        <span className="text-grey-500 size-6 shrink-0 text-xl leading-none">
          {open ? "−" : "+"}
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && a && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={TRANSITION}
            style={{ overflow: "hidden" }}
          >
            <div className="px-6">
              <p className="text-body-base text-grey-700 leading-[1.4] font-normal">{a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const LightbulbIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-full">
    <path
      d="M4.00016 7.91667C4.00016 5.56946 5.79102 3.66667 8.00016 3.66667C10.2093 3.66667 12.0002 5.56946 12.0002 7.91667C12.0002 9.17504 11.4854 10.3057 10.6675 11.0839C10.0698 11.6525 9.7709 11.9369 9.69039 12.0424C9.43077 12.3828 9.41931 12.4101 9.35381 12.8427C9.3335 12.9768 9.3335 13.179 9.3335 13.5833C9.3335 14.1129 9.3335 14.3778 9.22632 14.575C9.1561 14.7042 9.05511 14.8115 8.9335 14.8861C8.74786 15 8.49862 15 8.00016 15C7.5017 15 7.25247 15 7.06683 14.8861C6.94521 14.8115 6.84422 14.7042 6.77401 14.575C6.66683 14.3778 6.66683 14.1129 6.66683 13.5833C6.66683 13.179 6.66683 12.9768 6.64652 12.8427C6.58102 12.4101 6.56956 12.3828 6.30993 12.0424C6.22943 11.9369 5.93054 11.6525 5.33283 11.0839C4.51489 10.3057 4.00016 9.17504 4.00016 7.91667Z"
      fill="#FFD2D2"
    />
    <path
      d="M8.00016 1V1.66667M2.00016 7.66667H1.3335M3.66683 3.33333L3.26676 2.93327M12.3335 3.33333L12.7337 2.93327M14.6668 7.66667H14.0002"
      stroke="#990B33"
      strokeWidth="0.5"
      strokeLinecap="round"
    />
    <path
      d="M9.3335 13.5833H6.66683M6.30993 12.0424C6.22943 11.9369 5.93054 11.6525 5.33283 11.0839C4.51489 10.3057 4.00016 9.17504 4.00016 7.91667C4.00016 5.56946 5.79102 3.66667 8.00016 3.66667C10.2093 3.66667 12.0002 5.56946 12.0002 7.91667C12.0002 9.17504 11.4854 10.3057 10.6675 11.0839C10.0698 11.6525 9.7709 11.9369 9.69039 12.0424C9.43077 12.3828 9.41931 12.4101 9.35381 12.8427C9.3335 12.9768 9.3335 13.179 9.3335 13.5833C9.3335 14.1129 9.3335 14.3778 9.22632 14.575C9.1561 14.7042 9.05511 14.8115 8.9335 14.8861C8.74786 15 8.49862 15 8.00016 15C7.5017 15 7.25247 15 7.06683 14.8861C6.94521 14.8115 6.84422 14.7042 6.77401 14.575C6.66683 14.3778 6.66683 14.1129 6.66683 13.5833C6.66683 13.179 6.66683 12.9768 6.64652 12.8427C6.58102 12.4101 6.56956 12.3828 6.30993 12.0424Z"
      stroke="#990B33"
      strokeWidth="0.5"
    />
  </svg>
);

const BasketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-full">
    <path
      d="M1.54032 7.49463C1.51582 7.39637 1.51402 7.29382 1.53506 7.19477C1.5561 7.09571 1.59943 7.00275 1.66176 6.92295C1.72409 6.84314 1.80378 6.77858 1.89479 6.73416C1.9858 6.68975 2.08573 6.66665 2.18699 6.66663H13.8137C13.9149 6.66665 14.0149 6.68975 14.1059 6.73416C14.1969 6.77858 14.2766 6.84314 14.3389 6.92295C14.4012 7.00275 14.4445 7.09571 14.4656 7.19477C14.4866 7.29382 14.4848 7.39637 14.4603 7.49463L13.253 12.3233C13.1809 12.6117 13.0144 12.8678 12.7801 13.0508C12.5458 13.2338 12.257 13.3332 11.9597 13.3333H4.04099C3.74366 13.3332 3.45488 13.2338 3.22054 13.0508C2.98621 12.8678 2.81976 12.6117 2.74766 12.3233L1.54032 7.49529V7.49463Z"
      fill="#FFD2D2"
      stroke="#990B33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6 9.33337V10.6667" stroke="#990B33" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 9.33337V10.6667" stroke="#990B33" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M4 6.66663L6.66667 2.66663"
      stroke="#990B33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.0002 6.66663L9.3335 2.66663"
      stroke="#990B33"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NotebookIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="size-full">
    <g clipPath="url(#notebook-clip)">
      <path
        d="M1.3999 0.4375H2.36182V12.6289H1.3999C1.39233 12.6289 1.38483 12.6263 1.37939 12.6211C1.37393 12.6156 1.37061 12.6073 1.37061 12.5996V0.466797C1.37061 0.459061 1.37392 0.451759 1.37939 0.446289C1.38486 0.440819 1.39217 0.4375 1.3999 0.4375Z"
        fill="#990B33"
        stroke="#990B33"
        strokeWidth="0.875"
      />
      <path
        d="M10.7334 0.4375C11.2362 0.4375 11.7187 0.637626 12.0742 0.993164C12.4295 1.34859 12.6288 1.83047 12.6289 2.33301V10.7334C12.6289 11.2362 12.4297 11.7187 12.0742 12.0742C11.7187 12.4297 11.2362 12.6289 10.7334 12.6289H4.22949V13.5625H4.1709V0.4375H10.7334ZM6.0957 5.10449H10.7041V3.2959H6.0957V5.10449Z"
        fill="#FFD2D2"
        stroke="#990B33"
        strokeWidth="0.875"
      />
    </g>
    <defs>
      <clipPath id="notebook-clip">
        <rect width="14" height="14" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const QuestionIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="size-full">
    <path
      d="M1.33325 5.99998C1.33325 3.42265 3.42259 1.33331 5.99992 1.33331H9.99992C12.5772 1.33331 14.6666 3.42265 14.6666 5.99998V9.99998C14.6666 12.5773 12.5772 14.6666 9.99992 14.6666H5.99992C3.42259 14.6666 1.33325 12.5773 1.33325 9.99998V5.99998Z"
      fill="#FFD2D2"
    />
    <path
      d="M6.19492 5.83555C6.10328 6.09604 6.24017 6.3815 6.50066 6.47314C6.76116 6.56477 7.04662 6.42789 7.13825 6.16739L6.66659 6.00147L6.19492 5.83555ZM7.32107 5.20663L7.57442 5.6377V5.6377L7.32107 5.20663ZM8.33393 5.02156L8.41846 4.52875V4.52875L8.33393 5.02156ZM9.22721 5.53358L9.60973 5.21158V5.21158L9.22721 5.53358ZM9.57941 6.5011L9.07941 6.50035V6.5011H9.57941ZM8.08053 7.99998L7.92242 7.52564C7.71825 7.5937 7.58053 7.78476 7.58053 7.99998H8.08053ZM8.09985 9.83331C7.82371 9.83331 7.59985 10.0572 7.59985 10.3333C7.59985 10.6095 7.82371 10.8333 8.09985 10.8333V9.83331ZM8.10652 10.8333C8.38266 10.8333 8.60652 10.6095 8.60652 10.3333C8.60652 10.0572 8.38266 9.83331 8.10652 9.83331V10.8333ZM7.58053 8.59556C7.58053 8.8717 7.80439 9.09556 8.08053 9.09556C8.35667 9.09556 8.58053 8.8717 8.58053 8.59556H7.58053ZM6.66659 6.00147L7.13825 6.16739C7.21653 5.94486 7.37104 5.75722 7.57442 5.6377L7.32107 5.20663L7.06773 4.77556C6.66076 5.01475 6.35157 5.39024 6.19492 5.83555L6.66659 6.00147ZM7.32107 5.20663L7.57442 5.6377C7.77779 5.51817 8.0169 5.47448 8.2494 5.51436L8.33393 5.02156L8.41846 4.52875C7.9532 4.44895 7.47471 4.53638 7.06773 4.77556L7.32107 5.20663ZM8.33393 5.02156L8.2494 5.51436C8.4819 5.55424 8.69279 5.67512 8.8447 5.85558L9.22721 5.53358L9.60973 5.21158C9.30572 4.85045 8.88372 4.60856 8.41846 4.52875L8.33393 5.02156ZM9.22721 5.53358L8.8447 5.85558C8.99662 6.03605 9.07976 6.26446 9.07941 6.50035L9.57941 6.5011L10.0794 6.50184C10.0801 6.02979 9.91373 5.57272 9.60973 5.21158L9.22721 5.53358ZM9.57941 6.5011H9.07941C9.07941 6.73529 8.89714 6.97955 8.55262 7.20923C8.39558 7.31393 8.23497 7.39459 8.11166 7.44939C8.05072 7.47648 8.00062 7.49648 7.96694 7.50932C7.95014 7.51572 7.93754 7.52029 7.92986 7.52302C7.92602 7.52438 7.92342 7.52528 7.92215 7.52572C7.92151 7.52594 7.92121 7.52604 7.92125 7.52603C7.92127 7.52602 7.92138 7.52599 7.92157 7.52592C7.92167 7.52589 7.92179 7.52585 7.92193 7.5258C7.922 7.52578 7.92212 7.52574 7.92216 7.52573C7.92228 7.52568 7.92242 7.52564 8.08053 7.99998C8.23865 8.47432 8.23879 8.47427 8.23894 8.47422C8.239 8.4742 8.23916 8.47415 8.23927 8.47411C8.2395 8.47403 8.23976 8.47395 8.24004 8.47386C8.24059 8.47367 8.24124 8.47345 8.24198 8.4732C8.24347 8.4727 8.24531 8.47207 8.24751 8.47131C8.25191 8.4698 8.25773 8.46777 8.26487 8.46523C8.27914 8.46016 8.29875 8.45302 8.32293 8.4438C8.37122 8.42541 8.43823 8.39857 8.5178 8.36321C8.67553 8.2931 8.88965 8.1864 9.10732 8.04128C9.51224 7.77134 10.0794 7.26616 10.0794 6.5011H9.57941ZM8.09985 10.3333V10.8333H8.10652V9.83331H8.09985V10.3333ZM8.08053 7.99998H7.58053V8.59556H8.58053V7.99998H8.08053ZM5.99992 1.33331V1.83331H9.99992V0.833313H5.99992V1.33331ZM14.6666 5.99998H14.1666V9.99998H15.1666V5.99998H14.6666ZM9.99992 14.6666V14.1666H5.99992V15.1666H9.99992V14.6666ZM1.33325 9.99998H1.83325V5.99998H0.833252V9.99998H1.33325ZM5.99992 14.6666C3.69873 14.1666 1.83325 12.3012 1.83325 9.99998H0.833252C0.833252 12.8535 3.14645 15.1666 5.99992 15.1666V14.6666ZM14.6666 9.99998H14.1666C14.1666 12.3012 12.3011 14.1666 9.99992 14.1666V15.1666C12.8534 15.1666 15.1666 12.8535 15.1666 9.99998H14.6666ZM9.99992 1.33331C12.3011 1.83331 14.1666 3.69879 14.1666 5.99998H15.1666C15.1666 3.14651 12.8534 0.833313 9.99992 0.833313V1.33331ZM5.99992 1.33331V0.833313C3.14645 0.833313 0.833252 3.14651 0.833252 5.99998H1.83325C1.83325 3.69879 3.69873 1.83331 5.99992 1.83331V1.33331Z"
      fill="#990B33"
    />
  </svg>
);

export function ProductFeatures() {
  const [showAllIngredients, setShowAllIngredients] = useState(true);

  return (
    <div className="flex flex-col gap-8">
      <FeatureSection title="Benefits" icon={<LightbulbIcon />}>
        <ul className="flex list-disc flex-col gap-2 pl-5">
          {BENEFITS.map((b) => (
            <li key={b} className="text-body-base text-grey-700 leading-[1.4]">
              {b}
            </li>
          ))}
        </ul>
      </FeatureSection>

      <div className="bg-grey-100 h-px w-full" />

      <FeatureSection title="Core Ingredients" icon={<BasketIcon />}>
        <div className="flex flex-wrap gap-6">
          {CORE_INGREDIENTS.map((ing) => (
            <div key={ing.name} className="flex min-w-28 flex-col gap-1">
              <p className="text-grey-950 text-2xl leading-[1.35] font-normal">{ing.percent}</p>
              <p className="text-body-base text-grey-700 font-normal">{ing.name}</p>
            </div>
          ))}

          <div className="flex w-full flex-1 flex-col gap-2">
            <button
              type="button"
              onClick={() => setShowAllIngredients((v) => !v)}
              className="text-body-base text-primary-900 flex items-center gap-1 self-start"
            >
              <span>{showAllIngredients ? "Close all ingredients" : "See all ingredients"}</span>
              <ChevronDownIcon
                className={cn(
                  "size-5 transition-transform duration-200",
                  showAllIngredients && "rotate-180",
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {showAllIngredients && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={TRANSITION}
                  style={{ overflow: "hidden" }}
                >
                  <p className="text-body-base text-grey-600 leading-[1.4]">{ALL_INGREDIENTS}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FeatureSection>

      <div className="bg-grey-100 h-px w-full" />

      <FeatureSection title="How to Use" icon={<NotebookIcon />}>
        <div className="flex flex-col gap-4">
          {HOW_TO_USE.map((step) => (
            <div key={step.num} className="flex gap-3">
              <p className="text-body-base text-grey-950 shrink-0 font-medium">{step.num}</p>
              <p className="text-body-base text-grey-600 leading-[1.4] font-normal">{step.text}</p>
            </div>
          ))}
        </div>
      </FeatureSection>

      <div className="bg-grey-100 h-px w-full" />

      <FeatureSection title="FAQs" icon={<QuestionIcon />}>
        <div className="flex flex-col">
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} defaultOpen={faq.defaultOpen} />
          ))}
        </div>
      </FeatureSection>
    </div>
  );
}
