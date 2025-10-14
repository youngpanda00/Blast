import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { usePromoCode } from "@/hooks/use-promo-code";
import PromoModal from "@/components/PromoModal";
import PromoBanner from "@/components/PromoBanner";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import React from "react";

const queryClient = new QueryClient();

const App = ({ page }: { page?: "listing" }) => {
  const { promo, clearPromo, reloadPromo, modalOpen, setModalOpen, percent, dismiss, submittedEmail, submitEmail } = usePromoCode();
  const bannerVisible = Boolean(promo?.valid);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {promo && (
          <>
            {promo.popup && <PromoModal
              open={modalOpen && bannerVisible}
              onOpenChange={(v) => (v ? setModalOpen(true) : dismiss())}
              percent={percent}
              expiresAt={promo.expiresAt}
              onSubmitEmail={submitEmail}
            />}
            <PromoBanner
              visible={bannerVisible}
              percent={percent}
              expiresAt={promo.expiresAt}
              clearPromo={clearPromo}
            />
          </>
        )}
        <Index
          page={page}
          promoEmail={submittedEmail || ''}
          promoCode={promo?.code || ''}
          discountRate={promo?.discountRate ?? 0}
          promoActive={!!promo}
          reloadPromo={reloadPromo}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
