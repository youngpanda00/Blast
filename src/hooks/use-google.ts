import { useEffect, useState } from "react";

const GOOGLE_MAPS_API_KEY = "AIzaSyBhcF7Zarimx9v3e2GBtfKmhmLcXJCkjNI";

const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;

let googleMapsPromise: Promise<typeof google> | null = null;

function loadGoogleMapsApi(): Promise<typeof google> {
  if (googleMapsPromise) return googleMapsPromise;

  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve(window.google);
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google));
      existingScript.addEventListener("error", reject);
      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_MAPS_API_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * 通用 React Hook：保证 Google Maps API 只加载一次
 */
export function useGoogleMapsApi(): typeof google | null {
  const [googleApi, setGoogleApi] = useState<typeof google | null>(null);

  useEffect(() => {
    let mounted = true;

    loadGoogleMapsApi()
      .then(api => {
        if (mounted) setGoogleApi(api);
      })
      .catch(err => {
        console.error("Google Maps API 加载失败:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return googleApi;
}
