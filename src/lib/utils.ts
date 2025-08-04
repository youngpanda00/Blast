import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const trackMixPanel = (...args)=>{
  if(typeof (window as any).trackMixPanel === "function") {
    (window as any).trackMixPanel.apply(this, args)
  }
}
export { trackMixPanel };
