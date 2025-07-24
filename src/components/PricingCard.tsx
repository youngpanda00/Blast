import React from 'react';

interface PricingCardProps {
  title: string;
  originalPrice?: string;
  currentPrice: string;
  paymentType: string;
  duration: string;
  views: string;
  leads?: string;
  isSelected?: boolean;
  isPopular?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  originalPrice,
  currentPrice,
  paymentType,
  duration,
  views,
  leads,
  isSelected = false,
  isPopular = false,
}) => {
  if (isSelected) {
    return (
      <div className="shadow-[0px_4px_15px_rgba(59,92,222,0.15)] flex flex-col items-stretch pt-8 pb-1 rounded-3xl">
        <div className="self-center flex w-[247px] max-w-full items-stretch gap-1">
          <div className="flex flex-col items-stretch">
            <div className="flex items-stretch gap-2.5 text-base text-white font-medium leading-none">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/f224e053c2c1d819a171ba2ab42af74612f76ad2?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-2.5 shrink-0 my-auto"
                alt="Star"
              />
              <div className="text-white">{title}</div>
            </div>
            <div className="flex items-stretch gap-2.5 whitespace-nowrap mt-2.5">
              {originalPrice && (
                <div className="text-[#C6C8D1] text-[32px] font-normal leading-none line-through grow">
                  {originalPrice}
                </div>
              )}
              <div className="text-white text-[34px] font-extrabold leading-none">
                {currentPrice}
              </div>
            </div>
          </div>
          <div className="text-[#EBECF1] text-center text-sm font-normal mt-[46px] max-md:mt-10">
            {paymentType}
          </div>
        </div>
        
        <div className="flex flex-col relative aspect-[1.72] w-full mt-[38px] pb-7 px-[30px] max-md:px-5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/acad89ea6fee17a993d058926fb89d68b72fbc6a?placeholderIfAbsent=true"
            className="absolute h-full w-full object-cover inset-0 rounded-b-3xl"
            alt="Background"
          />
          <div className="relative z-10 mt-[-18px] w-full">
            <button className="justify-center items-center opacity-60 bg-white flex max-w-full w-[260px] gap-2.5 text-sm text-[rgba(59,92,222,1)] font-normal leading-none px-5 py-2 rounded-3xl hover:opacity-80 transition-opacity">
              Current plan
            </button>
            
            <div className="border min-h-px max-w-full w-[260px] mt-[30px] border-[rgba(255,255,255,0.15)] border-dashed" />
            
            <div className="w-full max-w-[260px] text-base leading-none mt-[30px]">
              <div className="flex w-full items-stretch gap-5 justify-between">
                <div className="text-[rgba(246,247,251,1)] font-normal">
                  Ads duration
                </div>
                <div className="text-white font-medium text-right">
                  {duration}
                </div>
              </div>
              <div className="flex w-full items-stretch gap-5 justify-between mt-2.5">
                <div className="text-[rgba(246,247,251,1)] font-normal">
                  Estimated views
                </div>
                <div className="text-white font-medium text-right">
                  {views}
                </div>
              </div>
              {leads && (
                <div className="flex w-full items-stretch gap-5 justify-between mt-2.5">
                  <div className="text-[rgba(246,247,251,1)] font-normal">
                    Estimated leads
                  </div>
                  <div className="text-white font-medium text-right">
                    {leads}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2.5 text-[15px] text-[#202437] font-medium leading-none">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/f224e053c2c1d819a171ba2ab42af74612f76ad2?placeholderIfAbsent=true"
          className="aspect-[1] object-contain w-2.5 shrink-0 my-auto"
          alt="Star"
        />
        <div className="text-[#202437]">{title}</div>
      </div>
      
      <div className="flex items-stretch gap-1.5 mt-2.5">
        <div className="text-[#202437] text-[28px] font-semibold leading-none grow">
          {currentPrice}
        </div>
        <div className="text-[#A0A3AF] text-center text-sm font-normal mt-[15px]">
          {paymentType}
        </div>
      </div>
      
      <div className="text-base font-normal leading-none mt-[30px]">
        <div className="border min-h-px max-w-full w-[233px] bg-[#EBECF1] border-[rgba(235,236,241,1)] border-dashed" />
        <div className="w-full mt-[30px]">
          <div className="flex w-full items-stretch gap-5 justify-between">
            <div className="text-[#797E8B]">Ads duration</div>
            <div className="text-[#515666] text-right">{duration}</div>
          </div>
          <div className="flex w-full items-stretch gap-5 justify-between mt-2.5">
            <div className="text-[#797E8B]">Estimated views</div>
            <div className="text-[#515666] text-right">{views}</div>
          </div>
          {leads && (
            <div className="flex w-full items-stretch gap-5 justify-between mt-2.5">
              <div className="text-[#797E8B]">Estimated leads</div>
              <div className="text-[#515666] text-right">{leads}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
