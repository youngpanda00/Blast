import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";

export interface PromoState {
  valid: boolean;
  discountRate: number; // 0-1
  expiresAt: number; // ms epoch
  code: string | null;
}

export const usePromoCode = () => {
  const [promo, setPromo] = useState<PromoState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    const params = new URLSearchParams(window.location.search);
    const code = params.get("promo_code");
    if (!code) return;


    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api-blast/promo-code/validate?code=${encodeURIComponent(code)}`, { method: 'GET' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const data = json?.data ?? {};
        const isValid = Boolean(data.valid);
        const discountRate = Number(data.discountRate ?? 0) / 100;
        // expirationTime might be seconds; convert to ms if looks like seconds
        let exp = Number(data.expirationTime ?? 0);
        if (exp && exp < 10_000_000_000) exp = exp * 1000; // seconds -> ms

        const now = Date.now();
        const valid = isValid && discountRate > 0 && exp > now;
        if (valid) {
          const state: PromoState = { valid, discountRate, expiresAt: exp, code };
          setPromo(state);
        } else if (code) {
          toast({
            variant: "destructive",
            title: "Invalid Promo Code",
            description: (
              <span>
                The promo code <b>{String(code).toUpperCase()}</b> is invalid or has expired. You may proceed at the standard price. <br />Contact <a className="underline" style={{color:'#3B5CDE'}} href="mailto:marketing@blast.lofty.com">marketing@blast.lofty.com</a> for available promotions.
              </span>
            ),
          });
        }
        if (valid && !dismissed) setModalOpen(true);
      } catch (e) {
        setError(e?.message || 'validate failed');
      } finally {
        setLoading(false);
      }
    };

    run().catch(() => {});
  }, [dismissed]);

  const percent = useMemo(() => Math.round(((promo?.discountRate ?? 0) * 100)), [promo?.discountRate]);

  const submitEmail = (email: string) => {
    const trimmed = String(email || '').trim();
    if (!trimmed) return;
    setSubmittedEmail(trimmed);
  };

  const dismiss = () => {
    setModalOpen(false);
    setDismissed(true);
  };

  return { promo, loading, error, modalOpen, setModalOpen, percent, dismiss, submittedEmail, submitEmail };
};
