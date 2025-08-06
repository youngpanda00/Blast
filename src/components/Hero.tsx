import React, { useState } from "react";
import { FixedNavigation } from "./FixedNavigation";

export const Hero: React.FC<{ page?: "listing" }> = ({ page }) => {
  return (
    <>
      { page === 'listing' && <FixedNavigation /> }
      <section className={page !== 'listing' ? "flex w-full flex-col items-stretch px-[22px] pt-[30px] pb-[50px] max-md:max-w-full max-md:px-4 max-md:pb-[40px] max-md:pt-[20px] bg-[rgba(0,28,188,1)]" :
"flex w-full flex-col items-stretch px-[22px] pt-[90px] pb-[50px] max-md:max-w-full max-md:px-4 max-md:pb-[40px] max-md:pt-[80px] bg-[rgba(0,28,188,1)]" }>
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
          <div className="flex w-full max-w-[1210px] mx-auto max-md:max-w-full flex-1 justify-center items-center max-md:flex-col max-md:gap-6">
            {/* Left Column - Main Headline */}
            <div className="flex-1 max-md:text-center max-md:mb-6">
              <h1 className="text-[50px] font-medium text-[#FFB700] tracking-[-1.5px] max-md:text-[28px] max-sm:text-[24px] leading-tight max-md:leading-[1.2]">
                AI-Powered Blast:<br />
                1 - Click Listing To Leads,<br />
                Zero Work, Instant Results!
              </h1>
            </div>

            {/* Right Column - Description and Features */}
            <div className="flex-1 max-md:text-center max-md:max-w-[350px] max-md:mx-auto">
              <div className="text-[18px] font-normal text-[#D8DEF8] max-md:max-w-full max-md:mx-auto max-md:text-[16px]">
                <div className="text-[15px] mb-[10px] flex items-center max-md:justify-start max-md:text-[14px] max-md:mb-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  1-Click Launch – No setup, no hassle.
                </div>
                <div className="text-[15px] mb-[10px] flex items-center max-md:justify-start max-md:text-[14px] max-md:mb-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Floods Your Pipeline – AI optimizes advertising to attract buyers 24/7.
                </div>
                <div className="text-[15px] flex items-center max-md:justify-start max-md:text-[14px]">
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
    </>
  );
};
