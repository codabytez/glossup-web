export const TRANSITION = { duration: 0.4, ease: [0.32, 0.72, 0, 1] } as const;

import type { Transition } from "motion/react";

// Typed as Transition so ease literals are narrowed correctly (not widened to string)
export const BACKDROP_TRANSITION: Transition = { duration: 0.2, ease: "easeOut" };
export const BACKDROP_EXIT_TRANSITION: Transition = { duration: 0.15, ease: "easeIn" };
export const MODAL_PANEL_ENTER_TRANSITION: Transition = { duration: 0.25, ease: [0.16, 1, 0.3, 1] };
export const MODAL_PANEL_EXIT_TRANSITION: Transition = { duration: 0.18, ease: [0.4, 0, 1, 1] };

// Pure keyframe values — no embedded transition so TypeScript stays happy.
// Per-state transition timing is applied separately in modal.tsx.
export const modalAnimations = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  zoom: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  "slide-up": {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  "slide-down": {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
};
export const SLOW_TRANSITION = { duration: 0.6, ease: [0.32, 0.72, 0, 1] } as const;
export const IMAGE_TRANSITION = { duration: 0.7, ease: [0.32, 0.72, 0, 1] } as const;

export const fadeUpContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: SLOW_TRANSITION },
};

export const gridContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

export const gridItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
};
