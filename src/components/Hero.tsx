import React, { useState } from "react";

export const Hero: React.FC = () => {
  return (
    <>
      <header className="flex w-full flex-col items-stretch px-[22px] pt-[30px] pb-[50px] max-md:max-w-full max-md:px-5 max-md:pb-[30px]">
        <div className="w-full h-full flex flex-col">
          {/* Logo positioned at top left */}
          <div className="mb-[27px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/413dc641e0fcb15ee6fb4e31ee9f16be41c5456d?placeholderIfAbsent=true"
              className="aspect-[2.72] object-contain w-[87px]"
              alt="Blast Logo"
            />
          </div>

          {/* Text content with horizontal layout */}
          <div className="flex w-full max-w-[1210px] mx-auto max-md:max-w-full flex-1 justify-center items-center max-md:flex-col">
            {/* Left Column - Main Headline */}
            <div className="flex-1 max-md:text-center max-md:mb-8">
              <h1 className="text-[50px] font-medium text-[#FFB700] tracking-[-1.5px] max-md:text-[40px] leading-tight">
                AI-Powered Blast:<br />
                1 - Click Listing To Leads,<br />
                Zero Work, Instant Results!
              </h1>
            </div>

            {/* Right Column - Description and Features */}
            <div className="flex-1 max-md:text-center">
              <div className="text-[18px] font-normal text-[#D8DEF8] max-md:max-w-fit max-md:mx-auto">
                <p className="mb-6 text-[20px] font-medium">
                  Blast By Lofty: AI-Powered Lead Generation On Autopilot!
                </p>
                <div className="text-[15px] mb-[10px] flex items-center max-md:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  1-Click Launch – No setup, no hassle.
                </div>
                <div className="text-[15px] mb-[10px] flex items-center max-md:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Floods Your Pipeline – AI optimizes advertising to attract buyers 24/7.
                </div>
                <div className="text-[15px] flex items-center max-md:justify-start">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Smart & Affordable – Auto-updates creatives, no extra fees.
                </div>
              </div>
            </div>


          </div>
        </div>
      </header>
    </>
  );
};
