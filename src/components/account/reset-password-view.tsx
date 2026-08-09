"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { WordmarkLogo } from "@/components/icons/wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResetPassword } from "@/hooks/use-session";

const inputClassName =
  "border-grey-100 bg-[#fcfcfc] h-12 rounded-[1px] px-4 text-sm placeholder:text-grey-500";

interface ResetPasswordViewProps {
  id: string;
  token: string;
}

export function ResetPasswordView({ id, token }: ResetPasswordViewProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const resetPassword = useResetPassword();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (password !== confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }
    const result = await resetPassword.mutateAsync({ id, token, password });
    if (result.success) {
      router.push("/account");
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
        <div className="flex w-full max-w-100 flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-header-h1 text-grey-950 leading-[1.24] font-normal">
              Create new password
            </p>
            <p className="text-body-base text-grey-600 font-normal">
              Choose a new password for your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className={`${inputClassName} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-grey-500 absolute top-1/2 right-4 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className={inputClassName}
              />
            </div>

            {errorMessage && (
              <p className="text-sm font-medium text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="pill"
              className="w-full"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? "Please wait…" : "Reset password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
