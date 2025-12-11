import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { usePromoCode } from "@/hooks/use-promo-code";
import PromoDefaultModal from "@/components/PromoModal";
import Promo_ThanksGiving_Modal from "@/components/Promo_ThanksGiving_Modal";
import Promo_Christmas_Modal from "@/components/Promo_Christmas_Modal";
import PromoBanner from "@/components/PromoBanner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useTheme } from "./hooks/use-theme";
import { useCallback, useRef } from "react";

const PromoModals = {
  ThansGiving: Promo_ThanksGiving_Modal,
  Christmas: Promo_Christmas_Modal,
  Default: PromoDefaultModal,
};

const queryClient = new QueryClient();

const App = ({ page }: { page?: "listing" }) => {
  const theme = useTheme()
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
          discountRate={promo?.discountRate ?? 0}
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
