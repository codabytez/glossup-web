"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { BagIcon } from "@/components/ui/bag-icon";
import { SearchIcon } from "@/components/ui/search-icon";
import { UserIcon } from "@/components/ui/user-icon";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "Collection", href: "/collection" },
  { label: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-20 py-6 transition-colors duration-300",
        scrolled
          ? "text-grey-950 border-b border-white/40 bg-white/50 shadow-sm backdrop-blur-md"
          : "text-white",
      )}
    >
      <Link href="/" className="relative h-6 w-40">
        <Image
          src={scrolled ? "/logos/primary-logo-black.png" : "/logos/primary-logo-white.png"}
          alt="Gloss Up"
          fill
          sizes="160px"
          className="object-contain object-left"
        />
      </Link>
      <ul className="flex items-center gap-6 text-sm font-medium">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <li key={link.href}>
              <Link href={link.href} className="group relative inline-block py-1">
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
      <div className="flex w-60 items-center justify-end gap-4">
        <label
          className={cn(
            "flex flex-1 items-center gap-1 rounded-full border px-3 py-1.5 backdrop-blur-[1px]",
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
        <Link
          href="/account"
          aria-label="Account"
          className="hover:text-secondary-200 text-current transition-[color,transform] active:scale-90"
        >
          <UserIcon className="size-6 shrink-0" />
        </Link>
        <Link
          href="/cart"
          aria-label="Cart"
          className="hover:text-secondary-200 text-current transition-[color,transform] active:scale-90"
        >
          <BagIcon className="size-6 shrink-0" />
        </Link>
      </div>
    </nav>
  );
}
