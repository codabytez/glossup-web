"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

import { PromptSignInModal } from "@/components/account/prompt-sign-in-modal";
import { useSession } from "@/hooks/use-session";
import { useSignInPromptStore } from "@/store/sign-in-prompt-store";

const IDLE_DELAY_MS = 2 * 60 * 1000;

export function SignInPromptController() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isOpen = useSignInPromptStore((s) => s.isOpen);
  const trigger = useSignInPromptStore((s) => s.trigger);
  const close = useSignInPromptStore((s) => s.close);

  const suppressed = pathname.startsWith("/account") || !!session;

  useEffect(() => {
    if (suppressed) return;
    const timer = setTimeout(trigger, IDLE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [trigger, suppressed]);

  return (
    <PromptSignInModal open={isOpen && !suppressed} onOpenChange={(open) => !open && close()} />
  );
}
