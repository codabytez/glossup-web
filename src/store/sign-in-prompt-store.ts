import { create } from "zustand";

const STORAGE_KEY = "glossup:sign-in-prompted";

function hasPrompted(): boolean {
  if (typeof window === "undefined") return true;
  return sessionStorage.getItem(STORAGE_KEY) === "1";
}

interface SignInPromptStore {
  isOpen: boolean;
  /** Ambient nudge (idle timer, wishlist, post-purchase) — shows at most once per session. */
  trigger: () => void;
  /** Explicit user action (account icon) — always shows. */
  open: () => void;
  close: () => void;
}

export const useSignInPromptStore = create<SignInPromptStore>((set) => ({
  isOpen: false,
  trigger: () => {
    if (hasPrompted()) return;
    sessionStorage.setItem(STORAGE_KEY, "1");
    set({ isOpen: true });
  },
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
