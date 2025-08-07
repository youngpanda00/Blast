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

      {/* Main Hero Section with blue background */}
      <section className={page !== 'listing' ?
        "flex w-full flex-col items-stretch px-[22px] pt-[30px] pb-[50px] max-md:max-w-full max-md:px-4 max-md:pb-[30px] max-md:pt-[25px] bg-[rgba(0,28,188,1)]" :
        "flex w-full flex-col items-stretch px-[22px] pt-[90px] pb-[50px] max-md:max-w-full max-md:px-4 max-md:pb-[30px] max-md:pt-[85px] bg-[rgba(0,28,188,1)]"
      }>
        <div className="w-full h-full flex flex-col">
          {/* Logo positioned at top left */}
          {page !== 'listing' && <div className="mb-[27px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/413dc641e0fcb15ee6fb4e31ee9f16be41c5456d?placeholderIfAbsent=true"
              className="aspect-[2.72] object-contain w-[87px]"
              alt="Blast Logo"
            />
          </div>}

          {/* Text content with horizontal layout */}
          <div className="flex w-full max-w-[1210px] mx-auto max-md:max-w-full flex-1 justify-center items-center max-md:flex-col">
            {/* Left Column - Main Headline */}
            <div className="flex-1 max-md:text-center">
              <h1 className="text-[50px] font-medium text-[#FFB700] tracking-[-1.5px] max-md:text-[28px] max-sm:text-[24px] leading-tight max-md:leading-[1.2]">
                AI-Powered Blast:<br />
                1 - Click Listing To Leads,<br />
                Zero Work, Instant Results!
              </h1>
            </div>

            {/* Right Column - Description and Features */}
            <div className="flex-1 max-md:hidden">
              <div className="text-[18px] font-normal text-[#D8DEF8]">
                <p className="mb-6 text-[20px] font-medium">
                  Blast By Lofty: AI-Powered Lead Generation On Autopilot!
                </p>
                <div className="text-[15px] mb-[10px] flex items-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  1-Click Launch – No setup, no hassle.
                </div>
                <div className="text-[15px] mb-[10px] flex items-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Floods Your Pipeline – AI optimizes advertising to attract buyers 24/7.
                </div>
                <div className="text-[15px] flex items-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Smart & Affordable – Auto-updates creatives, no extra fees.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section with gradient background */}
      <section className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-b border-gray-100">
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
