export const TRANSITION = { duration: 0.4, ease: [0.32, 0.72, 0, 1] } as const;
export const IMAGE_TRANSITION = { duration: 0.7, ease: [0.32, 0.72, 0, 1] } as const;

export const fadeUpContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

export const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: TRANSITION },
};
