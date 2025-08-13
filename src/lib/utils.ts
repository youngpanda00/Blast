import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MixPanelTrackData {
  page_name?: string;
  feature_name?: string;
  click_item?: string;
  click_action?: string;
  [key: string]: any;
}

interface WindowWithTracking extends Window {
  trackMixPanel?: (event: string, data?: MixPanelTrackData) => void;
  trackFBEvent?: (event: string, data?: { [key: string]: any }) => void;
}

declare global {
  interface Window extends WindowWithTracking {}
}

const trackMixPanel = (event: string, data?: MixPanelTrackData): void => {
  if(typeof (window as WindowWithTracking).trackMixPanel === "function") {
    (window as WindowWithTracking).trackMixPanel(event, data)
  }
}

const trackFBEvent = (event: string, data?: { [key: string]: any }): void => {
  if (typeof (window as WindowWithTracking).trackFBEvent === 'function') {
    (window as WindowWithTracking).trackFBEvent(event, data)
  }
}

export { trackMixPanel, trackFBEvent };
