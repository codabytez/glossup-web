"use client";

import { Menu } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BagIcon } from "@/components/icons/bag-icon";
import { SearchIcon } from "@/components/icons/search-icon";
import { UserIcon } from "@/components/icons/user-icon";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SLOW_TRANSITION } from "@/lib/motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "Collection", href: "/collection" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrollY, setScrollY] = useState(0);
  const scrolled = !isHome || scrollY > 80;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={SLOW_TRANSITION}
      className={cn(
        "fixed inset-x-0 top-0 z-50 px-4 py-6 transition-colors duration-300 lg:px-10 xl:px-20",
        scrolled
          ? "text-grey-950 border-b border-white/40 bg-white/50 shadow-sm backdrop-blur-md"
          : "text-white",
      )}
    >
      <div className="flex w-full items-center justify-between 2xl:mx-auto 2xl:max-w-384">
        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-current hover:bg-current/10 hover:text-current lg:hidden"
              />
            }
          >
            <Menu className="size-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="text-grey-950 gap-0 bg-white p-0 sm:max-w-xs">
            <SheetHeader className="border-grey-100 border-b">
              <SheetTitle>
                <Link href="/" className="relative block h-6 w-40">
                  <Image
                    src="/logos/primary-logo-black.png"
                    alt="Gloss Up"
                    fill
                    sizes="160px"
                    className="object-contain object-left"
                  />
                </Link>
              </SheetTitle>
            </SheetHeader>
            <ul className="flex flex-col gap-1 p-4 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <SheetClose
                      nativeButton={false}
                      render={
                        <Link
                          href={link.href}
                          className={cn(
                            "block rounded-lg px-3 py-2.5 text-sm font-medium tracking-wide uppercase transition-colors",
                            isActive
                              ? "bg-grey-100 text-grey-950"
                              : "text-grey-600 hover:bg-grey-100 hover:text-grey-950",
                          )}
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  </li>
                );
              })}
            </ul>
          </SheetContent>
        </Sheet>

        <Link href="/" className="relative hidden h-6 w-40 lg:block">
          <Image
            src={
              scrolled || !isHome
                ? "/logos/primary-logo-black.png"
                : "/logos/primary-logo-white.png"
            }
            alt="Gloss Up"
            fill
            priority
            sizes="160px"
            className="object-contain object-left"
          />
        </Link>
        <ul className="hidden items-center gap-6 text-sm font-medium lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="group relative inline-block py-1 text-sm font-medium tracking-wide uppercase"
                >
                  {link.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-current transition-transform duration-300 group-hover:scale-x-100",
                      isActive ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-end gap-4 lg:w-60">
          <label
            className={cn(
              "hidden flex-1 items-center gap-1 rounded-full border px-3 py-1.5 backdrop-blur-[1px] lg:flex",
              scrolled
                ? "border-grey-200 text-grey-500 bg-white/40"
                : "border-secondary-50/80 bg-white/10",
            )}
          >
            <SearchIcon className="size-4 shrink-0" />
            <input
              type="search"
              placeholder="Search..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-current"
            />
          </label>
          <button
            type="button"
            aria-label="Search"
            className="hover:text-primary-900 text-current transition-[color,transform] active:scale-90 lg:hidden"
          >
            <SearchIcon className="size-6 shrink-0" />
          </button>
          <Link
            href="/account"
            aria-label="Account"
            className="hover:text-primary-900 text-current transition-[color,transform] active:scale-90"
          >
            <UserIcon className="size-6 shrink-0" />
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className="hover:text-primary-900 text-current transition-[color,transform] active:scale-90"
          >
            <BagIcon className="size-6 shrink-0" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
