export const TRANSITION = { duration: 0.4, ease: [0.32, 0.72, 0, 1] } as const;
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
