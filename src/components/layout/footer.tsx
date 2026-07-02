"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUpContainer, fadeUpItem } from "@/lib/motion";

const footerLinks = [
  { label: "ALL PRODUCTS", href: "/products" },
  { label: "OUR COLLECTION", href: "/collection" },
  { label: "TOP ESSENTIALS", href: "/collection/top-essentials" },
  { label: "NEW ARRIVALS", href: "/collection/new-arrivals" },
  { label: "CONTACT US", href: "/contact" },
];

const socials = [
  { href: "#", icon: "/icons/x.svg", alt: "X", width: 16, height: 14.46 },
  { href: "#", icon: "/icons/instagram.svg", alt: "Instagram", width: 16, height: 16 },
  { href: "#", icon: "/icons/whatsapp.svg", alt: "WhatsApp", width: 16, height: 16 },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpContainer}
      className="flex flex-col gap-16 bg-[#3e1111] px-4 py-14 sm:px-8 sm:py-20 lg:px-20 lg:py-30"
    >
      <div className="flex w-full flex-col gap-16 2xl:mx-auto 2xl:max-w-384">
        <motion.div variants={fadeUpItem} className="flex flex-col gap-8 sm:flex-row">
          <div className="flex w-full flex-col gap-12 sm:w-1/2 lg:w-182.25">
            <div className="flex flex-col gap-4 sm:gap-8 lg:gap-8">
              <h2 className="text-secondary-100 text-header-h1 leading-none font-light tracking-[-0.64px] sm:text-[64px] sm:tracking-[-1.28px] lg:text-[64px] lg:tracking-[-1.28px]">
                Be in the know
              </h2>
              <p className="text-secondary-200 text-base leading-6">
                Subscribe to get expert tips and the latest products for your skin
              </p>
            </div>
            <div className="flex w-full items-center gap-2">
              <Input
                type="email"
                placeholder="Enter your email address"
                className="border-secondary-50/80 text-secondary-200 placeholder:text-secondary-200 h-auto flex-1 rounded-full border bg-white/5 px-6 py-2.5 text-sm backdrop-blur-[1px] focus-visible:ring-0 lg:w-92 lg:flex-none"
              />
              <Button
                size="pill"
                className="bg-secondary-200 text-secondary-950 hover:bg-secondary-200 border-transparent px-6 py-2.5 text-sm"
              >
                Subscribe
              </Button>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-12 sm:flex-1 sm:items-end sm:justify-between sm:gap-0 sm:self-stretch lg:flex-1 lg:items-end lg:justify-between lg:gap-0">
            <ul className="text-secondary-200 flex flex-wrap items-center gap-2 text-xl leading-[1.2] sm:justify-end lg:justify-end">
              {footerLinks.map((link, index) => (
                <li key={link.href} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden>/</span>}
                  <Link href={link.href} className="group relative inline-block">
                    {link.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.alt}
                  href={social.href}
                  aria-label={social.alt}
                  className="flex size-8 items-center justify-center rounded-full border border-white/20 transition-[background-color,border-color,transform] hover:border-white/40 hover:bg-white/10 active:scale-90"
                >
                  <Image src={social.icon} alt="" width={social.width} height={social.height} />
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUpItem}
          className="text-secondary-100 flex flex-col items-start gap-2 border-t border-white/5 py-4 text-sm font-medium sm:flex-row sm:items-center sm:justify-between lg:flex-row lg:items-center lg:justify-between"
        >
          <span>©{year} Gloss Up</span>
          <Link href="/privacy" className="group relative inline-block">
            Privacy Policy
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
          </Link>
          <span>All rights reserved.</span>
        </motion.div>

        <motion.div variants={fadeUpItem}>
          <Image
            src="/footer/wordmark.svg"
            alt="Gloss Up"
            width={1280}
            height={193}
            className="h-auto w-full"
            unoptimized
          />
        </motion.div>
      </div>
    </motion.footer>
  );
}
