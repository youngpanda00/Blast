import React, { useState } from "react";
import { FixedNavigation } from "./FixedNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, TrendingUp } from "lucide-react";
import { PropertySetup } from "./PropertySetup";

interface HeroProps {
  page?: "listing";
  onGetStarted?: () => void;
  listingId?: string | null;
  onAddressSelect?: (addressData: any) => void;
  onCityUpdate?: (city: string | null) => void;
}

export const Hero: React.FC<HeroProps> = ({ page, onGetStarted, listingId, onAddressSelect, onCityUpdate }) => {
  const isMobile = useIsMobile();

  return (
    <>
      { page === 'listing' && <FixedNavigation /> }

      {/* Modern Compact Hero Section */}
      <section className={page !== 'listing' ?
        "flex w-full flex-col items-stretch px-[22px] pt-[30px] pb-[30px] max-md:max-w-full max-md:px-4 max-md:pb-[30px] max-md:pt-[25px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 max-md:bg-gradient-to-br max-md:from-blue-500 max-md:to-purple-600" :
        "flex w-full flex-col items-stretch px-[22px] pt-[90px] pb-[30px] max-md:max-w-full max-md:px-4 max-md:pb-[30px] max-md:pt-[85px] bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 max-md:bg-gradient-to-br max-md:from-blue-500 max-md:to-purple-600"
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
                <h1 className="text-[36px] max-sm:text-[31px] font-bold text-white tracking-[-1px] max-sm:tracking-[0px] leading-[1.1] mb-4">
                  <span className="max-sm:hidden">1-Click Listing to Leads – No Extra Work, Faster Closings</span>
                  <span className="hidden max-sm:block">
                    1-Click Listing to Leads
                    <br />
                    No Extra Work
                    <br />
                    Faster Closings
                  </span>
                </h1>
                <h2 className="text-[18px] max-sm:text-[16px] font-normal text-white/80 leading-[1.4]">
                  Get Serious Buyer Leads and Build Seller Trust Instantly with Targeted Hyper-Local Listing Ads
                </h2>
              </div>

              {/* Desktop: Modern layout */}
              <h1 className="max-md:hidden text-[42px] font-bold text-white tracking-[-1px] leading-[1.1] text-center">
                1-Click Listing to Leads – No Extra Work, Faster Closings
              </h1>
              <h2 className="max-md:hidden text-[20px] font-medium text-white/90 leading-[1.3] text-center mt-4">
                Get Serious Buyer Leads and Build Seller Trust Instantly with Targeted Hyper-Local Listing Ads
              </h2>

              {/* Desktop: Stats and CTA integrated */}
              <div className="max-md:hidden space-y-6">
                {/* Stats bar */}
                <div className="flex items-center justify-center gap-[108px] mt-[10px]">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">
                      <span className="block text-[16px] font-bold leading-8">5X Exposure</span>
                      <span className="block text-sm font-normal">For Listing</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">
                      <span className="block text-[16px] font-bold leading-8">Save 70%</span>
                      <span className="block text-sm font-normal">On Ad Costs</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <span className="font-medium text-white">
                      <span className="block text-[16px] font-bold leading-8">24 Hours</span>
                      <span className="block text-sm font-normal">Go Live</span>
                    </span>
                  </div>
                </div>


                {/* Trust indicator */}
                <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto">
                  <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200">
                    <span className="text-lg">🚫</span>
                    <span className="text-sm font-medium">No long-term contracts</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200">
                    <span className="text-lg">⏰</span>
                    <span className="text-sm font-medium">Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80 hover:text-white transition-colors duration-200">
                    <span className="text-lg">🎯</span>
                    <span className="text-sm font-medium">Results guaranteed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Mobile CTA Section */}
      <section className="md:hidden w-full bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="text-center">
            {/* Stats bar */}
            <div className="flex items-center justify-center gap-8 max-md:gap-4 mb-4 max-md:px-2">
              <div className="flex items-center gap-2 max-md:flex-col max-md:gap-0 text-sm max-md:text-xs max-md:flex-1">
                <div className="w-8 h-8 max-md:hidden bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-700 max-md:text-center max-md:leading-tight max-md:whitespace-normal whitespace-nowrap">
                  <span className="max-md:block max-md:text-[16px] max-md:font-bold max-md:leading-8 max-md:text-[#3b5cde]">5X Exposure</span>
                  <span className="max-md:block max-md:text-sm max-md:font-normal">For Listing</span>
                </span>
              </div>
              <div className="flex items-center gap-2 max-md:flex-col max-md:gap-0 text-sm max-md:text-xs max-md:flex-1">
                <div className="w-8 h-8 max-md:hidden bg-purple-100 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium text-gray-700 max-md:text-center max-md:leading-tight max-md:whitespace-normal whitespace-nowrap">
                  <span className="max-md:block max-md:text-[16px] max-md:font-bold max-md:leading-8 max-md:text-[#3b5cde]">Save 70%</span>
                  <span className="max-md:block max-md:text-sm max-md:font-normal">On Ad Costs</span>
                </span>
              </div>
              <div className="flex items-center gap-2 max-md:flex-col max-md:gap-0 text-sm max-md:text-xs max-md:flex-1">
                <div className="w-8 h-8 max-md:hidden bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="font-medium text-gray-700 max-md:text-center max-md:leading-tight max-md:whitespace-normal whitespace-nowrap">
                  <span className="max-md:block max-md:text-[16px] max-md:font-bold max-md:leading-8 max-md:text-[#3b5cde]">24 Hours</span>
                  <span className="max-md:block max-md:text-sm max-md:font-normal">Go Live</span>
                </span>
              </div>
            </div>

            {/* Property Setup Section */}
            <div className="mb-8 max-md:mb-6">
              <div className="max-w-lg mx-auto">
                <PropertySetup
                  listingId={listingId}
                  onAddressSelect={onAddressSelect}
                  onCityUpdate={onCityUpdate}
                />
              </div>
            </div>

            {/* Trust indicator */}
            <div className="mt-6 max-md:mt-4">
              <div className="space-y-3 max-w-xs mx-auto max-md:flex max-md:flex-col max-md:items-stretch max-md:text-xs max-md:leading-[10px]">
                <div className="flex items-center justify-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  <span className="text-base">🚫</span>
                  <span className="text-sm max-md:text-base font-medium">No long-term contracts</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  <span className="text-base">⏰</span>
                  <span className="text-sm max-md:text-base font-medium">Cancel anytime</span>
                </div>
                <div className="flex items-center justify-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-200">
                  <span className="text-base">🎯</span>
                  <span className="text-sm max-md:text-base font-medium">Results guaranteed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
