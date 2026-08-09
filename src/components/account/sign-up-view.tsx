"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { WordmarkLogo } from "@/components/icons/wordmark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import reviews from "@/data/reviews.json";
import { useLogIn, useSignUp } from "@/hooks/use-session";
import { TRANSITION } from "@/lib/motion";

const TESTIMONIAL_INTERVAL_MS = 5500;

export function SignUpView() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-up" | "log-in">("sign-up");
  const [showPassword, setShowPassword] = useState(false);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const testimonial = reviews[testimonialIndex];
  const signUp = useSignUp();
  const logIn = useLogIn();
  const pending = signUp.isPending || logIn.isPending;

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((i) => (i + 1) % reviews.length);
    }, TESTIMONIAL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result =
      mode === "sign-up"
        ? await signUp.mutateAsync({ email, password })
        : await logIn.mutateAsync({ email, password });
    if (result.success) {
      router.refresh();
      router.push("/account");
    } else {
      setErrorMessage(result.errors[0]?.message ?? "Something went wrong. Please try again.");
    }
  };

  const inputClassName =
    "border-grey-100 bg-[#fcfcfc] h-12 rounded-[1px] px-4 text-sm placeholder:text-grey-500";

  return (
    <div className="flex min-h-dvh flex-col items-center bg-white">
      <nav className="border-grey-100 sticky top-0 z-10 flex w-full justify-center border-b px-4 py-6 sm:px-8 sm:py-8">
        <Link href="/" className="relative block h-6 w-40">
          <WordmarkLogo className="h-6 w-40" color="#990B33" />
        </Link>
      </nav>

      <div className="flex w-full flex-1 flex-col lg:flex-row">
        {/* Form column */}
        <div className="flex w-full flex-1 flex-col items-center justify-center gap-14 px-4 py-14 sm:px-8 lg:w-176 lg:flex-none lg:px-20">
          <div className="flex w-full max-w-100 flex-col items-center gap-14">
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-grey-950 text-header-h1 leading-[1.24] font-normal">
                {mode === "sign-up" ? "Welcome to Gloss Up" : "Log In"}
              </p>
              <p className="text-body-base flex items-baseline gap-1.5">
                <span className="text-grey-600 font-normal">
                  {mode === "sign-up" ? "Already have an account?" : "New here?"}
                </span>
                <button
                  type="button"
                  onClick={() => setMode((m) => (m === "sign-up" ? "log-in" : "sign-up"))}
                  className="text-primary-900 font-medium hover:underline"
                >
                  {mode === "sign-up" ? "Log In" : "Join Gloss Up"}
                </button>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8">
              <div className="flex flex-col gap-2">
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className={inputClassName}
                />
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "sign-up" ? "Create password" : "Password"}
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
              </div>

              {errorMessage && (
                <p className="text-sm font-medium text-red-600" role="alert">
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col items-center gap-6">
                <Button
                  type="submit"
                  variant="primary"
                  size="pill"
                  className="w-full"
                  disabled={pending}
                >
                  {pending ? "Please wait…" : mode === "sign-up" ? "Sign Up" : "Log In"}
                </Button>

                {mode === "log-in" && (
                  <Link
                    href="/account/forgot-password"
                    className="text-grey-800 text-sm font-medium"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
            </form>
          </div>

          {mode === "sign-up" && (
            <p className="text-grey-500 flex max-w-74 flex-wrap justify-center gap-1 text-center text-sm">
              By joining, you confirm that you accept our
              <Link href="/terms" className="text-grey-800 font-medium underline">
                Terms of Service
              </Link>
              and
              <Link href="/privacy" className="text-grey-800 font-medium underline">
                Privacy Policy
              </Link>
            </p>
          )}
        </div>

        {/* Illustration / testimonial column */}
        <div className="bg-secondary-25 relative hidden flex-1 overflow-hidden lg:block">
          <div className="absolute inset-x-20 top-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIndex}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={TRANSITION}
                className="flex gap-8"
              >
                <div className="border-grey-200 relative size-16 shrink-0 overflow-hidden rounded-[1px] border">
                  <Image src={testimonial.image} alt="" fill className="object-cover" />
                </div>
                <div className="flex max-w-100 flex-col gap-4">
                  <div className="relative">
                    <Image
                      src="/icons/quote.svg"
                      alt=""
                      width={31}
                      height={24}
                      className="absolute -top-1 left-0 h-6 w-7.75"
                    />
                    <p className="text-grey-950 indent-14 text-2xl leading-tight font-light tracking-[-0.48px] italic">
                      {testimonial.quote}
                    </p>
                  </div>
                  <p className="text-grey-900 text-xl">- {testimonial.author}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Image
            src="/account/empty-cart.svg"
            alt=""
            width={700}
            height={586}
            className="absolute top-63 -left-5 w-175 max-w-none"
          />
        </div>
      </div>
    </div>
  );
}
