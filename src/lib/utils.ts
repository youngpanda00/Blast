import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const trackMixPanel =
  typeof (window as any).trackMixPanel === "function"
    ? (window as any).trackMixPanel
    : () => {};
export { trackMixPanel };
