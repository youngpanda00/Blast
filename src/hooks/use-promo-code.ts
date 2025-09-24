import { useEffect, useMemo, useRef, useState } from "react";

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
        const isValid = Boolean(data.isValid ?? data.isVaild);
        const discountRate = Number(data.discountRate ?? 0);
        // expirationTime might be seconds; convert to ms if looks like seconds
        let exp = Number(data.expirationTime ?? 0);
        if (exp && exp < 10_000_000_000) exp = exp * 1000; // seconds -> ms

        const now = Date.now();
        const valid = isValid && discountRate > 0 && exp > now;
        const state: PromoState = { valid, discountRate, expiresAt: exp, code };
        setPromo(state);
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

  const timeLeft = usePromoCountdown(promo?.expiresAt);

  const submitEmail = (email: string) => {
    const trimmed = String(email || '').trim();
    if (!trimmed) return;
    setSubmittedEmail(trimmed);
  };

  const dismiss = () => {
    setModalOpen(false);
    setDismissed(true);
  };

  return { promo, loading, error, modalOpen, setModalOpen, percent, timeLeft, dismiss, submittedEmail, submitEmail };
};

function usePromoCountdown(expiresAt?: number) {
  const [now, setNow] = useState<number>(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return useMemo(() => {
    if (!expiresAt) return { ms: 0, mins: '00', secs: '00', expired: true };
    const ms = Math.max(0, expiresAt - now);
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const pad = (n:number) => String(n).padStart(2, '0');
    return { ms, mins: pad(mins), secs: pad(secs), expired: ms === 0 };
  }, [expiresAt, now]);
}
