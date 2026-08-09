"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { WordmarkLogo } from "@/components/icons/wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRecoverPassword } from "@/hooks/use-session";

const inputClassName =
  "border-grey-100 bg-[#fcfcfc] h-12 rounded-[1px] px-4 text-sm placeholder:text-grey-500";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recoverPassword = useRecoverPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = await recoverPassword.mutateAsync(email);
    if (result.success) {
      setSent(true);
    } else {
      setErrorMessage(result.errors[0]?.message ?? "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col items-center bg-white">
      <nav className="border-grey-100 sticky top-0 z-10 flex w-full justify-center border-b px-4 py-6 sm:px-8 sm:py-8">
        <Link href="/" className="relative block h-6 w-40">
          <WordmarkLogo className="h-6 w-40" color="#990B33" />
        </Link>
      </nav>

      <div className="flex w-full flex-1 items-center justify-center px-4 py-14 sm:px-8">
        {sent ? (
          <div className="flex w-full max-w-100 flex-col items-center gap-8 text-center">
            <div className="relative size-14 shrink-0">
              <div className="absolute inset-[8.33%]">
                <Image src="/checkout/check-icon.svg" alt="" fill unoptimized aria-hidden="true" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-header-h1 text-grey-950 leading-[1.24] font-normal">
                Password reset link sent
              </p>
              <p className="text-body-base text-grey-600 font-normal">
                Check your email and use the link sent to recover your password
              </p>
            </div>
          </div>
        ) : (
          <div className="flex w-full max-w-100 flex-col items-center gap-14">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-header-h1 text-grey-950 leading-[1.24] font-normal">
                Recover password
              </p>
              <p className="text-body-base text-grey-600 font-normal">
                We&apos;ll send you a link to reset your password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className={inputClassName}
              />

              {errorMessage && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="pill"
                  className="w-full"
                  disabled={recoverPassword.isPending}
                >
                  {recoverPassword.isPending ? "Please wait…" : "Continue"}
                </Button>

                <p className="text-body-base flex items-baseline gap-1.5">
                  <span className="text-grey-600 font-normal">New here?</span>
                  <Link href="/account" className="text-primary-900 font-medium hover:underline">
                    Join Gloss Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
