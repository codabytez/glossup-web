import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toNaira(amount: string | number) {
  return `₦${Math.round(Number(amount)).toLocaleString("en-NG")}`;
}
