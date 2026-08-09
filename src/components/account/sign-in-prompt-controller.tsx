"use client";

import { useEffect } from "react";

import { PromptSignInModal } from "@/components/account/prompt-sign-in-modal";
import { useSignInPromptStore } from "@/store/sign-in-prompt-store";

const IDLE_DELAY_MS = 2 * 60 * 1000;

export function SignInPromptController() {
  const isOpen = useSignInPromptStore((s) => s.isOpen);
  const trigger = useSignInPromptStore((s) => s.trigger);
  const close = useSignInPromptStore((s) => s.close);

  useEffect(() => {
    const timer = setTimeout(trigger, IDLE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [trigger]);

  return <PromptSignInModal open={isOpen} onOpenChange={(open) => !open && close()} />;
}
