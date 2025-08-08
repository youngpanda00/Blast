import React, { useState } from "react";
import { FixedNavigation } from "./FixedNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, TrendingUp } from "lucide-react";

interface HeroProps {
  page?: "listing";
  onGetStarted?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ page, onGetStarted }) => {
  const isMobile = useIsMobile();

  return (
    <>
      { page === 'listing' && <FixedNavigation /> }

      {/* Modern Compact Hero Section */}
      <section className={page !== 'listing' ?
        "flex w-full flex-col items-stretch px-[22px] pt-[30px] pb-[30px] max-md:max-w-full max-md:px-4 max-md:pb-[40px] max-md:pt-[25px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 max-md:bg-gradient-to-br max-md:from-blue-500 max-md:to-purple-600" :
        "flex w-full flex-col items-stretch px-[22px] pt-[90px] pb-[30px] max-md:max-w-full max-md:px-4 max-md:pb-[40px] max-md:pt-[85px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 max-md:bg-gradient-to-br max-md:from-blue-500 max-md:to-purple-600"
      }>
        <div className="w-full h-full flex flex-col">
          {/* Logo positioned at top left */}
          {page !== 'listing' && <div className="mb-[20px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/413dc641e0fcb15ee6fb4e31ee9f16be41c5456d?placeholderIfAbsent=true"
              className="aspect-[2.72] object-contain w-[87px]"
              alt="Blast Logo"
            />
          </div>}

          {/* Centered content layout */}
          <div className="flex w-full max-w-[900px] mx-auto max-md:max-w-full flex-1 justify-center items-center max-md:flex-col">
            {/* Main Content - Centered */}
            <div className="w-full text-center max-md:text-center">
              {/* Mobile: Restructured typography */}
              <div className="hidden max-md:block">
                <h1 className="text-[36px] font-bold text-white tracking-[-1px] leading-[1.1] mb-4">
                  AI-Powered Blast
                </h1>
                <h2 className="text-[20px] font-medium text-white/90 leading-[1.3] mb-2">
                  1-Click Listing To Leads
                </h2>
                <h3 className="text-[18px] font-normal text-white/80 leading-[1.4]">
                  Zero Work, Instant Results!
                </h3>
              </div>

              {/* Desktop: Modern layout */}
              <h1 className="max-md:hidden text-[42px] font-bold text-white tracking-[-1px] leading-[1.1] text-center">
                AI-Powered Blast
              </h1>
              <h2 className="max-md:hidden text-[24px] font-medium text-white/90 leading-[1.3] text-center mt-4">
                1-Click Listing To Leads, Zero Work, Instant Results!
              </h2>
              <p className="max-md:hidden text-[18px] font-normal text-white/80 text-center mt-6 mb-8 max-w-2xl mx-auto">
                AI-powered lead generation on autopilot. Launch targeted ads in minutes and watch qualified leads pour in 24/7.
              </p>

              {/* Desktop: Stats and CTA integrated */}
              <div className="max-md:hidden space-y-6">
                {/* Stats bar */}
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">2K+ avg views</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">Live in 24hrs</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="font-medium text-white">9+ leads/week</span>
                  </div>
                </div>

                {/* CTA button */}
                <button
                  onClick={onGetStarted}
                  className="bg-white hover:bg-gray-50 text-blue-600 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2 mx-auto"
                >
                  <Zap className="w-5 h-5" />
                  Start Promoting Now
                </button>

                {/* Trust indicator */}
                <p className="text-sm text-white/70">
                  ✓ No long-term contracts  ✓ Cancel anytime  ✓ Results guaranteed
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Mobile CTA Section */}
      <section className="md:hidden w-full bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-8 max-md:py-6">
          <div className="text-center">
            {/* Stats bar */}
            <div className="flex items-center justify-center gap-8 max-md:gap-2 mb-8 max-md:mb-6">
              <div className="flex items-center gap-2 max-md:gap-1 text-sm max-md:text-xs">
                <div className="w-8 h-8 max-md:w-5 max-md:h-5 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 max-md:w-2.5 max-md:h-2.5 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 max-md:text-[10px] whitespace-nowrap">2K+ views</span>
              </div>
              <div className="flex items-center gap-2 max-md:gap-1 text-sm max-md:text-xs">
                <div className="w-8 h-8 max-md:w-5 max-md:h-5 bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 max-md:w-2.5 max-md:h-2.5 text-purple-600" />
                </div>
                <span className="font-medium text-gray-700 max-md:text-[10px] whitespace-nowrap">Live 24hrs</span>
              </div>
              <div className="flex items-center gap-2 max-md:gap-1 text-sm max-md:text-xs">
                <div className="w-8 h-8 max-md:w-5 max-md:h-5 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 max-md:w-2.5 max-md:h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 max-md:text-[10px] whitespace-nowrap">9+ leads</span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex items-center justify-center gap-4 max-md:flex-col max-md:gap-3">
              <button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 max-md:px-6 max-md:py-3 rounded-full font-semibold text-lg max-md:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2 max-md:w-full max-md:justify-center"
              >
                <Zap className="w-5 h-5 max-md:w-4 max-md:h-4" />
                Start Promoting Now
              </button>
            </div>

            {/* Trust indicator */}
            <div className="mt-6 max-md:mt-4">
              <p className="text-sm max-md:text-xs text-gray-500">
                ✓ No long-term contracts  ✓ Cancel anytime  ✓ Results guaranteed
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
