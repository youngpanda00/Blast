import React, { useState } from "react";
import { FixedNavigation } from "./FixedNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import { Zap, TrendingUp } from "lucide-react";
import PropertySetup from "./PropertySetup";
import { Search } from "lucide-react";

interface HeroProps {
  page?: "listing";
  listingId?: string | null;
  onAddressSelect?: (addressData: any) => void;
  onScrollToAdPreview?:() => void;
  onCityUpdate?: (city: string | null) => void;
  onScrollToAddress?:() => void;
}

export const Hero: React.FC<HeroProps> = ({ page, listingId, onAddressSelect, onCityUpdate, onScrollToAdPreview, onScrollToAddress}) => {
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
            <div className="hidden max-md:block bg-[#4C6EF5] text-white py-2 px-4 inline-block self-start md:self-auto" style={{ borderRadius: '40px', marginBottom: '30px' }}>
              <span className="text-sm font-medium">AI-Powered Blast</span>
            </div>
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
              <div className="max-md:hidden bg-[#4C6EF5] text-white py-2 px-4 inline-block self-start md:self-auto" style={{ borderRadius: '40px', marginBottom: '30px' }}>
                <span className="text-sm font-medium">AI-Powered Blast</span>
              </div>
              <h1 className="max-md:hidden text-[42px] font-bold text-white tracking-[-1px] leading-[1.1] text-center">
                1-Click Listing to Leads – No Extra Work, Faster Closings
              </h1>
              <h2 className="max-md:hidden text-[18px] text-white/90 leading-[1.3] text-center mt-4">
                Get Serious Buyer Leads and Build Seller Trust Instantly with Targeted Hyper-Local Listing Ads
              </h2>

              {/* Desktop: Stats and CTA integrated */}
              <div className="max-md:hidden space-y-6">
                {/* Stats bar */}
                <div className="flex items-center justify-center gap-[108px] mt-[50px] mb-[50px]">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <img src='https://cdn.lofty.com/image/fs/servicetool/2025823/5/original_ca374909a31441ab.png' style={{ width: 16, height: 12}} />
                    </div>
                    <span className="font-medium text-white">
                      <span className="block text-[20px] font-bold leading-5 mb-[10px]">5X Exposure</span>
                      <span className="block text-sm font-normal" style={{opacity: 0.5, lineHeight: '14px'}}>For Listing</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <img src='https://cdn.lofty.com/image/fs/servicetool/2025823/5/original_d5e71449e4594d05.png' style={{ width: 16, height: 16}} />
                    </div>
                    <span className="font-medium text-white">
                      <span className="block text-[20px] font-bold leading-5 mb-[10px]">Save 70%</span>
                      <span className="block text-sm font-normal" style={{opacity: 0.5, lineHeight: '14px'}}>On Ad Costs</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium text-white">
                      <span className="block text-[20px] font-bold leading-5 mb-[10px]">24 Hours</span>
                      <span className="block text-sm font-normal" style={{opacity: 0.5, lineHeight: '14px'}}>Go Live</span>
                    </span>
                  </div>
                </div>

                <div 
                  className="flex" 
                  style={{ width: 800, height: 70, background: '#ffffff', borderRadius: '100px', padding: '15px', justifyContent: 'space-between', cursor: 'pointer', marginBottom: '20px', marginTop: '0', marginLeft: 'auto', marginRight: 'auto'}}
                  onClick={onScrollToAddress}
                >
                  <div className="flex items-center">
                    <Search className="text-white" style={{ color: '#C6C8D1', width: '18px', height: '18px', marginRight: '10px'}} />
                    <span className="text-base font-medium " style={{color: '#C6C8D1', lineHeight: '20px'}}>Enter the property address</span>
                  </div>
                  <div className="text-white text-sm flex items-center justify-center" style={{background: 'linear-gradient(90deg, #242FFC 0%, #8A54FF 100%)', width: '100px', height: '40px', borderRadius: '100px'}}>
                    Search
                  </div>
                </div>

                {/* Trust indicator */}
                <div className="flex flex-wrap items-center justify-center gap-6 max-w-4xl mx-auto" style={{marginTop: 0}}>
                  <div className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200">
                    <img src='https://cdn.lofty.com/image/fs/servicetool/2025824/8/original_ea222e03d4ce43dd.png' style={{ width: 12, height: 12}} />
                    <span className="text-xs font-medium">No long-term contracts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200">
                    <img src='https://cdn.lofty.com/image/fs/servicetool/2025824/8/original_4e2cd6d815bb4a4a.png' style={{ width: 12, height: 12}} />
                    <span className="text-xs font-medium">Cancel anytime</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/80 hover:text-white transition-colors duration-200">
                    <img src='https://cdn.lofty.com/image/fs/servicetool/2025824/8/original_d052b32ec1d64abe.png' style={{ width: 12, height: 12}} />
                    <span className="text-xs font-medium">Results guaranteed</span>
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
                  onScrollToAdPreview={onScrollToAdPreview}
                  onCityUpdate={onCityUpdate}
                  onMethodsReady={() => {}}
                />
              </div>
            </div>

            {/* Trust indicator */}
            <div className="mt-6 max-md:mt-4">
              <div className="space-y-3 max-w-xs mx-auto max-md:flex max-md:flex-col max-md:items-stretch max-md:text-xs max-md:leading-[10px]">
                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-200" style={{ width: 220, marginLeft: 'auto', marginRight: 'auto'}}>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center" style={{ background: '#4975f5'}}>
                    <img src='https://cdn.lofty.com/image/fs/servicetool/2025824/8/original_ea222e03d4ce43dd.png' style={{ width: 12, height: 12}} />
                  </div>
                  <span className="text-sm max-md:text-base font-medium">No long-term contracts</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-200" style={{ width: 220, marginLeft: 'auto', marginRight: 'auto'}}>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center" style={{ background: '#4975f5'}}>
                    <img src='https://cdn.lofty.com/image/fs/servicetool/2025824/8/original_4e2cd6d815bb4a4a.png' style={{ width: 12, height: 12}} />
                  </div>
                  <span className="text-sm max-md:text-base font-medium">Cancel anytime</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 hover:text-gray-800 transition-colors duration-200" style={{ width: 220, marginLeft: 'auto', marginRight: 'auto'}}>
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center" style={{ background: '#4975f5'}}>
                    <img src='https://cdn.lofty.com/image/fs/servicetool/2025824/8/original_d052b32ec1d64abe.png' style={{ width: 12, height: 12}} />
                  </div>
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
