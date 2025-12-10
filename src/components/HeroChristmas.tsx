import React, { useState } from "react";
import { FixedNavigation } from "./FixedNavigation";
import { useIsMobile } from "@/hooks/use-mobile";
import PropertySetup from "./PropertySetup";

interface HeroProps {
  discountRate: number;
  listingId?: string | null;
  onAddressSelect?: (addressData: any) => void;
  onScrollToAdPreview?: () => void;
  onCityUpdate?: (city: string | null) => void;
}

export const HeroChristmas: React.FC<HeroProps> = ({
  discountRate,
  listingId,
  onAddressSelect,
  onCityUpdate,
  onScrollToAdPreview,
}) => {
  const isMobile = useIsMobile();

  return (
    <>
      <FixedNavigation transparent={false} />
      <section className="flex w-full flex-col items-stretch pt-[200px] max-md:max-w-full max-md:pt-[115px] bg-[#b6432c] relative overflow-hidden">
        <div
          className="christmas-bg fixed z-[50] pointer-events-none top-[125px] h-[134px] max-md:hidden"
          style={{
            backgroundImage:
              "url(https://cdn.lofty.com/image/fs/servicetool/2025125/5/original_a3801fe44af7402e.png)",
          }}
        ></div>
        <div
          className="christmas-bg fixed z-[50] pointer-events-none top-[115px] h-[59px] md:hidden"
          style={{
            backgroundImage:
              "url(https://cdn.lofty.com/image/fs/servicetool/2025125/8/original_208909809652498e.png)",
          }}
        ></div>
        <div className="flex w-full max-w-[900px] mx-auto max-md:max-w-full flex-1 justify-center items-center flex-col">
          <div
            className="max-md:block text-white py-2 px-4 inline-block max-md:mt-[55px]"
            style={{
              borderRadius: "40px",
              marginBottom: "30px",
              background: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <span className="text-sm font-medium">AI-Powered Blast</span>
          </div>
          {/* Main Content - Centered */}
          <div className="w-full text-center max-md:text-center">
            <div>
              <h1 className="text-[36px] max-sm:text-[28px] font-bold text-white tracking-[-1px] max-sm:tracking-[0px] leading-[1.1] mb-4">
                <span>1-Click Leads - Zero Extra Work, Faster Closings</span>
              </h1>
              <h2 className="text-[18px] max-sm:text-[14px] font-normal text-white leading-[1.4]">
                Listing Blast Ads: Local Leads, Trusted Sellers.
              </h2>
            </div>
          </div>
          <div className="christmas-middle h-[173px] max-md:h-[117px]">
            <img
              className="absolute w-[60px] ml-[-100px] md:w-[90px] md:ml-[-142px]"
              style={{ top: 10, left: "50%" }}
              src="https://cdn.lofty.com/image/fs/servicetool/2025125/5/original_e3f1928e1db7446d.png"
            ></img>
            <div className="text-center font-bold pt-[23px] text-[18px] md:pt-[32px] md:text-[26px]">
              <span
                style={{
                  background:
                    "linear-gradient(180deg, #E84B2C 0%, #CB6C23 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                Save{" "}
              </span>
              <span
                className="text-[28px] md:text-[40px]"
                style={{
                  fontStyle: "italic",
                  background:
                    "linear-gradient(180deg, #E10505 0%, #CB6C23 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {discountRate * 100}%
              </span>
            </div>
          </div>
          <div
            className="md:hidden h-[28px] christmas-bg"
            style={{
              backgroundImage: `url(https://cdn.lofty.com/image/fs/servicetool/2025125/9/original_4d99efd856d346d6.png)`,
            }}
          ></div>
          <div className="w-full flex items-center justify-center gap-[108px] mb-[40px] max-md:gap-[40px] max-md:mb-[0px] max-md:py-[20px] max-md:bg-white max-md:mt-[-1px]">
            <div className="flex items-center gap-4 text-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center max-md:hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #F4DA76 0%, #F5B35D 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M15.9001 7.70093C15.1781 6.22333 14.0536 4.97957 12.656 4.11272C11.2585 3.24588 9.64459 2.79118 8.00006 2.80093C6.35552 2.79118 4.74164 3.24588 3.34408 4.11272C1.94652 4.97957 0.822057 6.22333 0.100059 7.70093C0.051028 7.79333 0.0253906 7.89634 0.0253906 8.00094C0.0253906 8.10553 0.051028 8.20854 0.100059 8.30094C0.830318 9.77187 1.95674 11.0097 3.35248 11.8751C4.74822 12.7404 6.35783 13.1989 8.00006 13.1989C9.64229 13.1989 11.2519 12.7404 12.6476 11.8751C14.0434 11.0097 15.1698 9.77187 15.9001 8.30094C15.9491 8.20854 15.9747 8.10553 15.9747 8.00094C15.9747 7.89634 15.9491 7.79333 15.9001 7.70093V7.70093ZM8.00006 11.4009C7.3276 11.4009 6.67025 11.2015 6.11112 10.8279C5.55199 10.4543 5.11621 9.92333 4.85887 9.30206C4.60153 8.68079 4.5342 7.99716 4.66539 7.33763C4.79658 6.67809 5.1204 6.07227 5.5959 5.59677C6.07139 5.12127 6.67722 4.79745 7.33675 4.66626C7.99629 4.53508 8.67991 4.60241 9.30118 4.85974C9.92245 5.11708 10.4535 5.55287 10.8271 6.112C11.2007 6.67112 11.4001 7.32848 11.4001 8.00094C11.4041 8.44854 11.3189 8.89246 11.1494 9.30678C10.98 9.72109 10.7297 10.0975 10.4131 10.414C10.0966 10.7305 9.72022 10.9808 9.3059 11.1503C8.89159 11.3197 8.44767 11.4049 8.00006 11.4009V11.4009ZM8.00006 5.90094C7.44391 5.90356 6.9113 6.12566 6.51804 6.51892C6.12478 6.91217 5.90269 7.44479 5.90006 8.00094C5.91992 8.55156 6.14754 9.07424 6.53715 9.46384C6.92675 9.85345 7.44943 10.0811 8.00006 10.1009C8.55068 10.0811 9.07336 9.85345 9.46297 9.46384C9.85257 9.07424 10.0802 8.55156 10.1001 8.00094C10.0974 7.44479 9.87534 6.91217 9.48208 6.51892C9.08882 6.12566 8.5562 5.90356 8.00006 5.90094V5.90094Z"
                    fill="#C25D0E"
                  />
                </svg>
              </div>
              <span className="font-medium text-white max-md:text-[#fb501c]">
                <span className="block text-[14px] md:text-[20px] font-bold leading-5 mb-[10px]">
                  5X Exposure
                </span>
                <span
                  className="block text-[12px] md:text-[14px] font-normal text-center max-md:text-[#515666]"
                  style={{ opacity: 0.5, lineHeight: "14px" }}
                >
                  For Listing
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center max-md:hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #F4DA76 0%, #F5B35D 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 0C6.41775 0 4.87103 0.469192 3.55544 1.34824C2.23985 2.22729 1.21447 3.47672 0.608967 4.93853C0.00346625 6.40034 -0.15496 8.00887 0.153721 9.56072C0.462403 11.1126 1.22433 12.538 2.34315 13.6569C3.46197 14.7757 4.88743 15.5376 6.43928 15.8463C7.99113 16.155 9.59966 15.9965 11.0615 15.391C12.5233 14.7855 13.7727 13.7602 14.6518 12.4446C15.5308 11.129 16 9.58225 16 8C16 5.87827 15.1571 3.84344 13.6569 2.34315C12.1566 0.842855 10.1217 0 8 0V0ZM10.465 11.91C9.95868 12.2664 9.36689 12.482 8.75 12.535V14H7.25V12.5C6.67402 12.4119 6.12538 12.1948 5.645 11.865C5.30618 11.6288 5.03543 11.3077 4.85991 10.9338C4.68439 10.56 4.61027 10.1465 4.645 9.735V9.7H6.37C6.35237 9.91616 6.38519 10.1335 6.46588 10.3348C6.54658 10.5361 6.67294 10.7159 6.835 10.86C7.1974 11.1263 7.64089 11.2589 8.09 11.235C8.47688 11.2619 8.86136 11.1561 9.18 10.935C9.30139 10.8409 9.39868 10.7193 9.46387 10.5802C9.52907 10.4411 9.5603 10.2885 9.555 10.135C9.5616 9.97965 9.53311 9.82481 9.47165 9.68198C9.41019 9.53916 9.31734 9.41201 9.2 9.31C8.82366 9.0353 8.39738 8.83659 7.945 8.725C7.1065 8.50518 6.31519 8.13409 5.61 7.63C5.35022 7.42835 5.14249 7.16743 5.00418 6.86907C4.86587 6.5707 4.801 6.24356 4.815 5.915C4.81037 5.56755 4.88924 5.22406 5.04499 4.91344C5.20074 4.60281 5.4288 4.33413 5.71 4.13C6.16186 3.79326 6.69169 3.57651 7.25 3.5V2H8.75V3.5C9.35186 3.57583 9.9211 3.81633 10.395 4.195C10.6853 4.42688 10.9157 4.72494 11.0671 5.06422C11.2185 5.40349 11.2863 5.7741 11.265 6.145V6.185H9.525C9.53704 5.99488 9.50699 5.80444 9.43698 5.62726C9.36698 5.45009 9.25875 5.29054 9.12 5.16C8.8062 4.90024 8.40695 4.76656 8 4.785C7.63963 4.76629 7.28459 4.87813 7 5.1C6.88309 5.20046 6.7901 5.32578 6.72782 5.46678C6.66553 5.60778 6.63553 5.76092 6.64 5.915C6.63516 6.05834 6.66543 6.2007 6.72817 6.32967C6.79092 6.45865 6.88423 6.57033 7 6.655C7.4186 6.91962 7.87103 7.12649 8.345 7.27C9.15975 7.46298 9.92252 7.83157 10.58 8.35C10.8322 8.56674 11.0324 8.83749 11.1657 9.14218C11.299 9.44686 11.362 9.77765 11.35 10.11C11.363 10.4598 11.2889 10.8074 11.1345 11.1216C10.98 11.4357 10.75 11.7066 10.465 11.91Z"
                    fill="#C25D0E"
                  />
                </svg>
              </div>
              <span className="font-medium text-white max-md:text-[#fb501c]">
                <span className="block text-[14px] md:text-[20px] font-bold leading-5 mb-[10px]">
                  Save 70%
                </span>
                <span
                  className="block text-[12px] md:text-[14px] font-normal text-center max-md:text-[#515666]"
                  style={{ opacity: 0.5, lineHeight: "14px" }}
                >
                  On Ad Costs
                </span>
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center max-md:hidden"
                style={{
                  background:
                    "linear-gradient(180deg, #F4DA76 0%, #F5B35D 100%)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.35549 0H9.40549C9.67603 0.00413646 9.9343 0.113518 10.1255 0.304927C10.2189 0.394685 10.2928 0.502684 10.3427 0.622215C10.3926 0.741745 10.4174 0.870254 10.4155 0.99976C10.4182 1.0397 10.4182 1.07979 10.4155 1.11973C10.4155 1.15472 10.4155 1.19471 10.3905 1.2347L9.44049 5.94857H12.4655C12.6574 5.94807 12.8459 5.99991 13.0105 6.09853C13.1752 6.18896 13.3093 6.32646 13.3955 6.49344C13.4794 6.65857 13.5157 6.84374 13.5005 7.02831C13.482 7.20787 13.4184 7.37984 13.3155 7.52819L7.44549 15.5913C7.34695 15.7158 7.22457 15.8195 7.08549 15.8962C6.94879 15.9638 6.798 15.9981 6.64549 15.9962C6.57225 16.0013 6.49873 16.0013 6.42549 15.9962C6.35387 15.9867 6.28448 15.9647 6.22049 15.9312C6.00765 15.8447 5.83109 15.6876 5.72049 15.4863C5.60122 15.292 5.56012 15.0598 5.60549 14.8364L6.57049 9.46772H3.54549C3.35068 9.45925 3.16203 9.39695 3.00049 9.28777C2.83442 9.19677 2.7001 9.05725 2.61549 8.88786C2.52728 8.72586 2.48737 8.54197 2.50049 8.35799C2.51811 8.17823 2.58183 8.00605 2.68549 7.85811L8.55549 0.424898L8.58049 0.389906L8.60549 0.359914C8.63523 0.318572 8.67057 0.28156 8.71049 0.24994L8.83549 0.169959C8.89573 0.121417 8.96322 0.0826217 9.03549 0.0549868C9.11324 0.0279343 9.19372 0.00949493 9.27549 0L9.35549 0Z"
                    fill="#C25D0E"
                  />
                </svg>
              </div>
              <span className="font-medium text-white max-md:text-[#fb501c]">
                <span className="block text-[14px] md:text-[20px] font-bold leading-5 mb-[10px]">
                  24 Hours
                </span>
                <span
                  className="block text-[12px] md:text-[14px] font-normal text-center max-md:text-[#515666]"
                  style={{ opacity: 0.5, lineHeight: "14px" }}
                >
                  Go Live
                </span>
              </span>
            </div>
          </div>
        </div>
        <div
          className="christmas-bg relative max-md:hidden h-[56px] z-[1]"
          style={{
            backgroundImage:
              "url(https://cdn.lofty.com/image/fs/servicetool/2025125/6/original_403cb61744034f1f.png)",
          }}
        ></div>
        <img
          className="absolute max-md:hidden"
          style={{ left: 0, top: 150, height: 377 }}
          src="https://cdn.lofty.com/image/fs/servicetool/20251210/11/original_76f41d8af5b4415f.png"
        />
        <img
          className="absolute max-md:hidden"
          style={{ right: 0, top: 150, height: 377 }}
          src="https://cdn.lofty.com/image/fs/servicetool/20251210/11/original_796765fa7ad841bc.png"
        />
        <img
          className="absolute max-md:hidden"
          style={{ left: 0, bottom: 0, height: 273 }}
          src="https://cdn.lofty.com/image/fs/servicetool/2025125/5/original_fd218713f9cd420a.png"
        />
        <img
          className="absolute max-md:hidden"
          style={{ right: 0, bottom: 0, height: 163 }}
          src="https://cdn.lofty.com/image/fs/servicetool/2025125/5/original_650d559ec7ad4b2a.png"
        />
        <div className="text-center bg-white mt-[-1px] px-[15px] md:hidden max-md:pb-6">
          <PropertySetup
            listingId={listingId}
            onAddressSelect={onAddressSelect}
            onScrollToAdPreview={onScrollToAdPreview}
            onCityUpdate={onCityUpdate}
            onMethodsReady={() => {}}
            theme={'christmas'}
          />

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
      </section>
      <style jsx>{`
        .christmas-bg {
          width: 100%;
          background-size: auto 100%;
          background-position: center;
          background-repeat: repeat;
        }
        .christmas-middle {
          position: relative;
          width: 100%;
          background-image: url(https://cdn.lofty.com/image/fs/servicetool/2025125/5/original_01686c4c94d94df5.png);
          background-size: auto 100%;
          background-position: center;
          background-repeat: no-repeat;
        }
        .bg-gradient-to-r {
          background: linear-gradient(150.22deg, #ea6122 7.91%, #fba936 92.15%);
        }
        .bg-gradient-to-br {
          background: linear-gradient(150.22deg, #ea6122 7.91%, #fba936 92.15%);
        }
      `}</style>
    </>
  );
};
