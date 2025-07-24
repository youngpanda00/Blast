import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";

export const Hero: React.FC = () => {
  return (
    <>
      <header className="relative bg-[rgba(0,28,188,1)] flex w-full flex-col items-stretch px-[22px] pt-[30px] pb-[50px] max-md:max-w-full max-md:px-5 max-md:pb-[30px]">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: `url('/lovable-uploads/bed1e00c-5b9a-4161-ab64-92c708d251cf.png')`,
          }}
        />

        {/* Content wrapper with relative positioning */}

        <div className="relative z-10 w-full h-full flex flex-col">
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
                <div className="text-[15px] mb-[10px] flex items-center max-md:justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  1-Click Launch – No setup, no hassle.
                </div>
                <div className="text-[15px] mb-[10px] flex items-center max-md:justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Floods Your Pipeline – AI optimizes advertising to attract buyers 24/7.
                </div>
                <div className="text-[15px] flex items-center max-md:justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center mr-[10px] flex-shrink-0">
                    <div className="w-2 h-1 border-l-2 border-b-2 border-white transform rotate-[-45deg] translate-y-[-1px]"></div>
                  </div>
                  Smart & Affordable – Auto-updates creatives, no extra fees.
                </div>
              </div>
            </div>

            {/* Trusted by section with reduced spacing */}
            <div style={{ marginTop: "40px" }} className="max-md:mt-8">
              <div className="flex flex-col items-center justify-center overflow-hidden gap-6">
                {/* First row - 6 logos */}
                <div className="flex justify-center items-center gap-6 max-md:gap-4 max-md:flex-wrap">
                  <img
                    src="/lovable-uploads/ac09241f-cdd8-44fd-9a0e-a6c6ee1d7c08.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 1"
                  />
                  <img
                    src="/lovable-uploads/81ea2aaf-e875-4d09-bec8-fa0d1e41cebf.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 2"
                  />
                  <img
                    src="/lovable-uploads/694f6e60-2e94-45e8-9f94-7a76053c321b.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 3"
                  />
                  <img
                    src="/lovable-uploads/7c6ac3b8-9cd6-417c-bea8-a14003b643f1.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 4"
                  />
                  <img
                    src="/lovable-uploads/f6db4b23-3e95-4440-8f68-ada92a69bb77.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 5"
                  />
                  <img
                    src="/lovable-uploads/856eede5-4d84-4fa8-b7c3-d035d351d73a.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 6"
                  />
                </div>

                {/* Second row - 6 logos */}
                <div className="flex justify-center items-center gap-6 max-md:gap-4 max-md:flex-wrap">
                  <img
                    src="/lovable-uploads/557e5e14-fda5-46db-9158-60830cc48982.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 7"
                  />
                  <img
                    src="/lovable-uploads/893a4e60-aaac-48df-8bcc-6aea700af8ea.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 8"
                  />
                  <img
                    src="/lovable-uploads/4d4455ae-6bb3-43d8-96bd-7197ea336a42.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 9"
                  />
                  <img
                    src="/lovable-uploads/53c8450d-1671-4a74-90b9-3bf7c6316bf6.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 10"
                  />
                  <img
                    src="/lovable-uploads/628f2910-f954-4b25-ba86-edb7a9173144.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 11"
                  />
                  <img
                    src="/lovable-uploads/afebac12-6eea-421e-9eb0-4c045639ebaa.png"
                    className="object-contain opacity-70"
                    style={{ width: "120px", height: "48px" }}
                    alt="Partner Logo 12"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
