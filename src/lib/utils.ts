import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names safely using clsx and tailwind-merge (standard shadcn utility).
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
