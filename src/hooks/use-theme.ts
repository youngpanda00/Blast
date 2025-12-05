import { useMemo } from "react";

export const useTheme = () => {
  const theme: "christmas" | undefined = useMemo(() => {
    return new URLSearchParams(window.location.search).get("promo_code") ===
      "CHRISTMAS20"
      ? "christmas"
      : undefined;
  }, []);

  return theme;
};
