import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { usePromoCode } from "@/hooks/use-promo-code";
import PromoDefaultModal from "@/components/PromoModal";
import PromoPopScott from "@/components/PromoPop"
import Promo_ThanksGiving_Modal from "@/components/Promo_ThanksGiving_Modal";
import Promo_Christmas_Modal from "@/components/Promo_Christmas_Modal";
import PromoBanner from "@/components/PromoBanner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useTheme } from "./hooks/use-theme";
import { useCallback, useEffect, useRef, useState } from "react";

const PromoModals = {
  ThansGiving: Promo_ThanksGiving_Modal,
  Christmas: Promo_Christmas_Modal,
  Default: PromoDefaultModal,
  Scott: PromoPopScott
};

const queryClient = new QueryClient();

const getCookie = (name: string): string => {
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : "";
};

const usePartnerLink = () => {
  const [partnerDiscountRate, setPartnerDiscountRate] = useState<number>(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const linkId = new URLSearchParams(window.location.search).get("linkId");
    if (!linkId) return;

    const removeLinkIdFromUrl = () => {
      const params = new URLSearchParams(window.location.search);
      params.delete("linkId");
      const newSearch = params.toString();
      history.replaceState(null, "", newSearch ? `?${newSearch}` : window.location.pathname);
    };

    const run = async () => {
      let rate = 0;
      if (getCookie("_UI")) { // log in
        const eligRes = await fetch(`/api-blast/partner/discount/eligibility`, { method: 'GET' });
        const result = await eligRes.json();
        if (result.data?.eligible) {
          rate = result.data?.discountRate;
        } else {
          removeLinkIdFromUrl();
        }
      } else {
        const resolveRes = await fetch(`/api-blast/public/partner/link/resolve?linkId=${encodeURIComponent(linkId)}`, { method: 'GET' });
        const result2 = await resolveRes.json();
        if (result2.data?.valid) {
          rate = result2.data?.discountRate;
        } else {
          removeLinkIdFromUrl();
        }
      }
      setPartnerDiscountRate(rate);
    };

    run().catch((e) => {
      console.debug("Partner link error:", e?.message);
    });
  }, []);

  return partnerDiscountRate;
};

const App = ({ page }: { page?: "listing" }) => {
  const theme = useTheme()
  const partnerDiscountRate = usePartnerLink();
  const {
    promo,
    clearPromo,
    reloadPromo,
    modalOpen,
    setModalOpen,
    percent,
    dismiss,
    submittedEmail,
    submitEmail,
  } = usePromoCode();
  const bannerVisible = Boolean(promo?.valid);

  const PromoModal = PromoModals[promo?.type]

  const linkId = new URLSearchParams(window.location.search).get("linkId");

  const packageSelectionRef = useRef<{ blastNow: ()=>void }>(null)
  const onBlastNow = useCallback(()=>{
    packageSelectionRef.current?.blastNow()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {promo && (
          <>
            {promo.popup && (
              <PromoModal
                open={modalOpen && bannerVisible}
                onOpenChange={(v) => (v ? setModalOpen(true) : dismiss())}
                percent={percent}
                expiresAt={promo.expiresAt}
                onSubmitEmail={submitEmail}
              />
            )}
            <PromoBanner
              theme={theme}
              visible={bannerVisible}
              percent={percent}
              expiresAt={promo.expiresAt}
              clearPromo={clearPromo}
              onBlastNow={onBlastNow}
            />
          </>
        )}
        <Index
          page={page}
          promoEmail={submittedEmail || ""}
          promoCode={promo?.code || ""}
          discountRate={partnerDiscountRate > 0 ? partnerDiscountRate : (!linkId ? promo?.discountRate ?? 0 : 0)}
          promoActive={!!promo}
          reloadPromo={reloadPromo}
          theme={theme}
          packageSelectionRef={packageSelectionRef}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
