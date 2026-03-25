import React from "react";

interface PartnerDiscountProps {
  discountRate: number;
}

const PartnerDiscount: React.FC<PartnerDiscountProps> = ({ discountRate }) => {
  const percent = Math.round(discountRate * 100);
  return (
    <div className="relative w-full max-w-[1240px] self-center mx-auto mt-[30px] mb-3 max-md:mx-0 max-md:mt-0 max-md:mb-0 max-md:max-w-full">

      {/* Desktop Banner */}
      <div className="hidden md:flex items-center justify-between bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl px-5 py-3.5 gap-4">
        {/* Left: icon + text */}
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎁</span>
          <div className="flex flex-col">
            <span className="text-[#1B5E20] font-bold text-sm leading-5">
              Partner Referral Discount Applied
            </span>
            <span className="text-[#388E3C] text-xs leading-4">
              You were invited by a partner. Enjoy {percent}% off your
              first Blast purchase.
            </span>
          </div>
        </div>

        {/* Right: discount pill */}
        <div className="flex-shrink-0 bg-[#2E7D32] text-white font-extrabold text-lg px-5 py-2.5 rounded-lg leading-none whitespace-nowrap">
          {percent}% OFF
        </div>
      </div>

      {/* Mobile Banner */}
      <div className="md:hidden bg-white p-[15px]">
      <div className="relative flex items-center bg-[#E8F5E9] border border-[#C8E6C9] rounded-xl px-3 py-2.5 gap-3">
        {/* Left: percent badge */}
        <div className="flex-shrink-0 bg-[#2E7D32] text-white font-extrabold rounded-lg flex flex-col items-center justify-center w-[52px] h-[52px] leading-tight">
          <span className="text-base">{percent}%</span>
          <span className="text-[11px] font-bold">OFF</span>
        </div>

        {/* Right: text */}
        <div className="flex flex-col">
          <span className="text-[#1B5E20] font-bold text-sm leading-5">
            Partner Discount Applied
          </span>
          <span className="text-[#388E3C] text-xs leading-4">
            First purchase exclusive offer
          </span>
        </div>
      </div>
      </div>
    </div>
  );
};

export default PartnerDiscount;
