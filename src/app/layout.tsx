import type { Metadata } from "next";
import { Geist_Mono, Work_Sans } from "next/font/google";
import localFont from "next/font/local";

import "./globals.css";

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const zodiak = localFont({
  src: [
    {
      path: "../assets/fonts/Zodiak-Variable.woff2",
      weight: "100 900",
      style: "normal",
    },
    {
      path: "../assets/fonts/Zodiak-VariableItalic.woff2",
      weight: "100 900",
      style: "italic",
    },
  ],
  variable: "--font-zodiak",
});

export const metadata: Metadata = {
  title: "GlossUp | Premium Cosmetics, Delivered Across Nigeria",
  description:
    "GlossUp is a Nigerian cosmetics e-commerce brand delivering a premium shopping experience, with delivery across Lagos, Abuja, and beyond.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${workSans.variable} ${geistMono.variable} ${zodiak.variable} h-full font-sans antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
