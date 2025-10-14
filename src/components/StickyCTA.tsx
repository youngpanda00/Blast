import React, { useState, useEffect } from 'react';
import { useScroll } from '@/hooks/use-scroll';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronUp, Zap } from 'lucide-react';

interface StickyCTAProps {
  onCtaClick: () => void;
  selectedPackage?: 'starter' | 'boost' | 'growth' | 'mastery';
  selectedPlan?: string;
  isVisible?: boolean;
  promoActive?: boolean;
  discountRate?: number; // 0-1
}

export const StickyCTA: React.FC<StickyCTAProps> = ({
  onCtaClick,
  selectedPackage = 'starter',
  selectedPlan = 'monthly',
  isVisible = true,
  promoActive = false,
  discountRate = 0,
}) => {
  const { scrollY } = useScroll();
  const isMobile = useIsMobile();
  const [shouldShow, setShouldShow] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  // Package pricing data
  const basePriceMap: Record<'starter' | 'boost' | 'growth' | 'mastery', number> = {
    starter: 79,
    boost: 158,
    growth: 237,
    mastery: 316,
  };

  const formatMoney = (n: number) => `$${n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;

  const base = basePriceMap[selectedPackage];
  const dr = Math.max(0, Math.min(1, Number(discountRate || 0)));
  const finalPrice = promoActive ? Math.max(0, base * (1 - dr)) : base;
  const formattedPrice = formatMoney(finalPrice);

  useEffect(() => {
    // Show sticky CTA after scrolling past 600px (roughly past hero section)
    const showThreshold = 600;
    const hideThreshold = 300;

    if (scrollY > showThreshold && isVisible) {
      if (!shouldShow) {
        setIsAnimating(true);
        setShouldShow(true);

        // Trigger highlight effect after show animation
        setTimeout(() => {
          setIsAnimating(false);
          setShowHighlight(true);
          // Remove highlight after 2 seconds
          setTimeout(() => setShowHighlight(false), 2000);
        }, 300);
      }
    } else if (scrollY < hideThreshold) {
      if (shouldShow) {
        setIsAnimating(true);
        setShouldShow(false);
        setShowHighlight(false);
        setTimeout(() => setIsAnimating(false), 300);
      }
    }
  }, [scrollY, isVisible, shouldShow]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!shouldShow && !isAnimating) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out ${
        shouldShow 
          ? 'translate-y-0 opacity-100' 
          : 'translate-y-full opacity-0'
      } ${
        isMobile 
          ? 'bottom-0 left-0 right-0' 
          : 'bottom-6 right-6'
      }`}
    >
      {isMobile ? (
        // Mobile: Full-width bottom bar
        <div className="bg-white border-t border-gray-200 shadow-lg">
          <div className="flex items-center justify-between p-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="font-medium text-gray-700">
                  {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Pack
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                window.trackBlastNow?.("ListingBlastSP_checkout_bottom_popup");
                onCtaClick();
              }}
              className={`bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-full font-medium shadow-lg active:scale-95 transition-all duration-500 flex items-center gap-2 ${
                showHighlight
                  ? 'scale-110 shadow-2xl shadow-blue-500/50'
                  : 'scale-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              Blast Now!
            </button>
          </div>
        </div>
      ) : (
        // Desktop: Floating button with package info
        <div className="flex flex-col gap-3">
          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className="bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-600 w-12 h-12 rounded-full shadow-lg hover:bg-white hover:shadow-xl transition-all duration-200 flex items-center justify-center ml-auto"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          {/* Main CTA */}
          <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)} Pack Selected
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xl font-bold text-gray-900">
                    {formattedPrice}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {selectedPlan === 'monthly' ? 'Monthly billing' : 'One-time payment'}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => {
                window.trackBlastNow?.("ListingBlastSP_checkout_bottom_popup");
                onCtaClick();
              }}
              className={`w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl active:scale-95 transition-all duration-500 flex items-center justify-center gap-2 ${
                showHighlight
                  ? 'scale-105 shadow-2xl shadow-blue-500/50'
                  : 'scale-100'
              }`}
            >
              <Zap className="w-4 h-4" />
              Blast Now!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
