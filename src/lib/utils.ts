import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const trackMixPanel = (...args)=>{
  if(typeof (window as any).trackMixPanel === "function") {
    (window as any).trackMixPanel(...args)
  }
}

const trackFBEvent = (...args) => {
  if (typeof (window as any).trackFBEvent === 'function') {
    (window as any).trackFBEvent(...args)
  }
}

export { trackMixPanel, trackFBEvent };
