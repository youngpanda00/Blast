import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import { usePromoCode } from "@/hooks/use-promo-code";
import PromoModal from "@/components/PromoModal";
import PromoBanner from "@/components/PromoBanner";
import React from "react";

const queryClient = new QueryClient();

const PromoUI: React.FC = () => {
  const { promo, modalOpen, setModalOpen, percent, timeLeft, dismiss } = usePromoCode();
  const visible = Boolean(promo?.valid) && !timeLeft.expired;
  if (!promo) return null;
  return (
    <>
      <PromoModal
        open={modalOpen && visible}
        onOpenChange={(v) => (v ? setModalOpen(true) : dismiss())}
        percent={percent}
        expiresAt={promo.expiresAt}
      />
      <PromoBanner
        visible={visible}
        percent={percent}
        mins={timeLeft.mins}
        secs={timeLeft.secs}
        onRedeem={() => setModalOpen(true)}
        onClose={dismiss}
      />
    </>
  );
};

const App = ({ page }:{ page?: 'listing'}) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PromoUI />
      <Index page={page} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
