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
  const { promo, modalOpen, setModalOpen, percent, timeLeft, dismiss, submittedEmail, submitEmail } = usePromoCode();
  const visible = Boolean(promo?.valid) && !timeLeft.expired;

  React.useEffect(() => {
    if (visible) {
      const el = document.getElementById('promo-banner');
      if (el) {
        document.documentElement.style.setProperty('--promo-banner-space', `76px`);
        return;
      }
    }
    document.documentElement.style.setProperty('--promo-banner-space', '0px');
  }, [visible]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {promo && (
          <>
            <PromoModal
              open={modalOpen && visible}
              onOpenChange={(v) => (v ? setModalOpen(true) : dismiss())}
              percent={percent}
              expiresAt={promo.expiresAt}
              onSubmitEmail={submitEmail}
            />
            <PromoBanner
              visible={visible}
              percent={percent}
              mins={timeLeft.mins}
              secs={timeLeft.secs}
            />
          </>
        )}
        <Index
          page={page}
          promoEmail={submittedEmail || ''}
          promoCode={promo?.code || ''}
          discountRate={promo?.discountRate ?? 0}
          promoActive={Boolean(promo?.valid) && !timeLeft.expired}
        />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
