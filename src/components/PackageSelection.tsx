import React, { useState, useEffect } from "react";
import { PricingCard } from "./PricingCard";
import { AdPreview } from "./AdPreview";
import { Info, Diamond, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { LoadingOverlay } from "./ui/loading-overlay";
import { useIsMobile } from "../hooks/use-mobile";
import { trackMixPanel } from "@/lib/utils";
import { StickyCTA } from "./StickyCTA";

interface PackageSelectionProps {
  previewPicture?: string | null
  selectedAddressId?: string | null;
  onOpenCongratulationsModal: (email: string) => void;
}

export const PackageSelection: React.FC<PackageSelectionProps> = ({
  previewPicture,
  selectedAddressId,
  onOpenCongratulationsModal,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<"one-time" | "monthly">(
    "monthly",
  );
  const [selectedPackage, setSelectedPackage] = useState<
    "starter" | "boost" | "growth" | "mastery"
  >("starter");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useIsMobile();
  
  // Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: false
  });

  // Carousel dots for mobile
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchParams = new URLSearchParams(window.location.search);

  // Get listingId from URL
  const listingId = searchParams.get("assetKey");

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log("PackageSelection Debug:", {
      selectedAddressId,
      listingId,
      urlParams: Object.fromEntries(searchParams.entries())
    });
  }

  // Map package names to duration values
  const packageToDuration = {
    starter: 1,
    boost: 2,
    growth: 3,
    mastery: 4,
  };

  const savePackageSelection = async (duration: number) => {
    // Use selectedAddressId if available, otherwise fall back to URL listingId
    const currentListingId = selectedAddressId || listingId;
    if (!currentListingId) {
      console.error(
        "No listing ID available (neither from address selection nor URL)",
      );
      return;
    }

    const paymentMode =
      selectedPlan === "one-time" ? "ONE_TIME_CHARGE" : "RECURRING_CHARGE";
  };

  const handleCheckoutWithPackage = async (packageType: "starter" | "boost" | "growth" | "mastery") => {
    // Use selectedAddressId if available, otherwise fall back to URL listingId
    const currentListingId = selectedAddressId || listingId;
    if (!currentListingId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn("Checkout attempted without listing ID:", {
          selectedAddressId,
          listingId,
          urlParams: Object.fromEntries(searchParams.entries())
        });
      }

      // 如果没有选房源，滚动到PropertySetup模块并对输入框添加突出动画
      const propertySetupSection = document.querySelector('[data-section="property-setup"]');

      if (propertySetupSection) {
        // 平滑滚动到PropertySetup模块
        propertySetupSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // 延迟动画，等待滚动完成
        setTimeout(() => {
          // 查找地址输入框 - 优先使用ID，备用placeholder定位
          const addressInput = (document.querySelector('#address-search-input') ||
                               document.querySelector('input[placeholder="Enter the property address"]')) as HTMLInputElement;
          // 查找包含输入框的容器（带渐变背景的div）
          const addressContainer = addressInput?.closest('.p-4.rounded-xl') as HTMLElement;

          if (addressInput && addressContainer) {
            // 聚焦到输入框
            addressInput.focus();

            // 对容器添加突出动画效果
            const originalTransform = addressContainer.style.transform;
            const originalBoxShadow = addressContainer.style.boxShadow;
            const originalTransition = addressContainer.style.transition;

            // 应用突出效果
            addressContainer.style.transition = 'all 0.5s ease';
            addressContainer.style.transform = 'scale(1.08)';
            addressContainer.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.8)';
            addressContainer.style.zIndex = '50';

            // 给输入框添加脉冲效果
            addressInput.style.transition = 'all 0.5s ease';
            addressInput.style.boxShadow = '0 0 0 3px rgba(59, 92, 222, 0.3)';

            // 添加轻微的晃动动画
            addressContainer.style.animation = 'gentle-shake 0.5s ease-in-out';

            // 创建晃动动画的CSS keyframes（如果不存在）
            if (!document.querySelector('#gentle-shake-style')) {
              const style = document.createElement('style');
              style.id = 'gentle-shake-style';
              style.textContent = `
                @keyframes gentle-shake {
                  0%, 100% { transform: scale(1.08) translateX(0); }
                  25% { transform: scale(1.08) translateX(-2px); }
                  75% { transform: scale(1.08) translateX(2px); }
                }
              `;
              document.head.appendChild(style);
            }

            // 3.5秒后恢复原状
            setTimeout(() => {
              addressContainer.style.transform = originalTransform || '';
              addressContainer.style.boxShadow = originalBoxShadow || '0 10px 25px rgba(102, 126, 234, 0.3)';
              addressContainer.style.transition = originalTransition || '';
              addressContainer.style.zIndex = '';
              addressContainer.style.animation = '';

              addressInput.style.boxShadow = '';
              addressInput.style.transition = '';
            }, 3500);
          }
        }, 900); // 稍微延长等待时间确保滚动完成
      }

      // Show toast notification for missing address
      const showToastNotification = () => {
        // Remove any existing notifications
        const existingToast = document.querySelector('#address-required-toast');
        if (existingToast) {
          existingToast.remove();
        }

        // Create toast notification
        const toast = document.createElement('div');
        toast.id = 'address-required-toast';
        toast.innerHTML = `
          <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f87171;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
          ">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
            Please select a property address first
          </div>
          <style>
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          </style>
        `;

        document.body.appendChild(toast);

        // Auto remove after 4 seconds
        setTimeout(() => {
          if (toast && toast.parentNode) {
            toast.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => toast.remove(), 300);
          }
        }, 4000);
      };

      showToastNotification();

      console.error(
        "No listing ID available (neither from address selection nor URL)",
      );
      return;
    }

    window.trackBlastNow?.();

    const duration = packageToDuration[packageType];
    
    const paymentMode =
      selectedPlan === "one-time" ? "ONE_TIME_CHARGE" : "RECURRING_CHARGE";

    setIsLoading(true);

    try {
      // Save step data
      const response = await fetch("/api-blast/task/save-step", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stepName: "ORDER",
          data: {
            dataList: [
              {
                data: currentListingId,
                packageType: "LISTING",
              },
            ],
            duration: duration,
            paymentMode: paymentMode,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save step data");
      }

      console.log("Step data saved successfully");

      // Call the external checkoutPop function
      if (typeof (window as any).checkoutPop === "function") {
        (window as any)
          .checkoutPop()
          .then(async (res) => {
            setIsLoading(false);
            console.log("res", res);
            const email = res?.email || "";

            // Call /api-blast/task/start before opening CongratulationsModal
            try {
              const startResponse = await fetch("/api-blast/task/start", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
              });

              if (startResponse.ok) {
                console.log("Task started successfully");
              } else {
                console.error("Failed to start task");
              }
            } catch (error) {
              console.error("Error starting task:", error);
            }

            onOpenCongratulationsModal(email);
          })
          .catch(() => {
            setIsLoading(false);
            console.log("error");
          });
      } else {
        setIsLoading(false);
        console.error("checkoutPop function not available");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during checkout:", error);
    }
  };

  const handleCheckout = async () => {
    await handleCheckoutWithPackage(selectedPackage);
  };

  const handlePackageSelect = async (
    packageType: "starter" | "boost" | "growth" | "mastery",
  ) => {
    setSelectedPackage(packageType);
    const duration = packageToDuration[packageType];
    await savePackageSelection(duration);
  };

  const handleTooltipClick = () => {
    setIsTooltipOpen(!isTooltipOpen);
  };

  const handleCardClick = async (
    packageType: "starter" | "boost" | "growth" | "mastery",
  ) => {
    trackMixPanel("click", {
      page_name: "ListingBlastSP",
      feature_name: "ListingBlast",
      click_item: packageType,
      click_action: "package"
    });
    if (isMobile) {
      // On mobile, select package and trigger checkout
      await handlePackageSelect(packageType);
      // Use packageType directly instead of selectedPackage state
      await handleCheckoutWithPackage(packageType);
    } else {
      // On desktop, just select the package
      await handlePackageSelect(packageType);
    }
  };

  const paymentText = selectedPlan === "one-time" ? "Pay one-time" : "Monthly";

  // Package data
  const packages = [
    {
      id: "starter",
      name: "Starter Pack",
      originalPrice: "$109",
      price: "$79",
      duration: "1 Week",
      isPopular: true,
      estimatedViews: (2000 * packageToDuration.starter).toLocaleString(),
      estimatedLeads: Math.ceil(79 / 9)
    },
    {
      id: "boost",
      name: "Boost Pack",
      price: "$158",
      duration: "2 Weeks",
      isPopular: false,
      estimatedViews: (2000 * packageToDuration.boost).toLocaleString(),
      estimatedLeads: Math.ceil(158 / 9)
    },
    {
      id: "growth",
      name: "Growth Pack",
      price: "$237",
      duration: "3 Weeks",
      isPopular: false,
      estimatedViews: (2000 * packageToDuration.growth).toLocaleString(),
      estimatedLeads: Math.ceil(237 / 9)
    },
    {
      id: "mastery",
      name: "Mastery Pack",
      price: "$316",
      duration: "4 Weeks",
      isPopular: false,
      estimatedViews: (2000 * packageToDuration.mastery).toLocaleString(),
      estimatedLeads: Math.ceil(316 / 9)
    }
  ];

  // Embla carousel functions
  const scrollTo = (index: number) => {
    if (emblaApi) {
      emblaApi.scrollTo(index);
    }
  };

  // Update selected index
  const updateSelectedIndex = () => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  };


  useEffect(() => {
    if (!emblaApi) return;

    updateSelectedIndex();
    emblaApi.on('select', updateSelectedIndex);
    emblaApi.on('reInit', updateSelectedIndex);

    // Set starter pack as default visible on mobile
    if (isMobile) {
      const starterIndex = packages.findIndex(pkg => pkg.id === 'starter');
      if (starterIndex !== -1) {
        emblaApi.scrollTo(starterIndex, true);
      }
    }

    return () => {
      emblaApi.off('select', updateSelectedIndex);
      emblaApi.off('reInit', updateSelectedIndex);
    };
  }, [emblaApi, isMobile]);


  // Render package card
  const renderPackageCard = (pkg: any, isMobile = false) => (
    <div
      key={pkg.id}
      className={isMobile ? "flex-[0_0_85%] min-w-0 px-3" : ""}
    >
      <div
        onClick={() => handleCardClick(pkg.id as "starter" | "boost" | "growth" | "mastery")}
        className={`relative rounded-[24px] p-6 h-[330px] overflow-hidden cursor-pointer transition-all hover:shadow-lg border border-gray-100 ${
          selectedPackage === pkg.id
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            : "bg-white"
        }`}
      >
        {/* Popular badge */}
        {pkg.isPopular && (
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[90px] border-l-transparent border-t-[90px] border-t-[#FFA600]">
            <div className="absolute -top-[75px] -right-[30px] rotate-45 text-white text-[10px] font-bold leading-tight flex flex-col items-center justify-center w-[120px]">
              <div>MOST</div>
              <div>POPULAR</div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <Diamond
            className="w-[10px] h-[10px]"
            style={{ color: "#FFA600" }}
            fill="#FFA600"
          />
          <h3
            className={`text-xl font-bold ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
          >
            {pkg.name}
          </h3>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            {pkg.originalPrice && (
              <span
                className={`text-2xl line-through ${selectedPackage === pkg.id ? "text-white/70" : "text-gray-400"}`}
              >
                {pkg.originalPrice}
              </span>
            )}
            <span
              className={`text-4xl font-bold ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
            >
              {pkg.price}
            </span>
          </div>
          <div>
            <span
              className={`text-sm ${selectedPackage === pkg.id ? "text-white/80" : "text-gray-500"}`}
            >
              {paymentText}
            </span>
          </div>
        </div>

        {/* Select button */}
        <div
          className={`w-full font-normal px-4 rounded-full mb-6 h-9 flex items-center justify-center ${
            selectedPackage === pkg.id
              ? "bg-white/20 text-white opacity-60"
              : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
          }`}
        >
          {selectedPackage === pkg.id ? "Current plan" : "Select plan"}
        </div>

        {/* Package details */}
        <div
          className={`border-t pt-4 ${selectedPackage === pkg.id ? "border-white/20" : "border-gray-200"}`}
        >
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-gray-500"
                }
              >
                Ads duration
              </span>
              <span
                className={`font-medium ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
              >
                {pkg.duration}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-gray-500"
                }
              >
                Estimated views
              </span>
              <span
                className={`font-medium ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
              >
                {pkg.estimatedViews}
              </span>
            </div>
            {selectedPackage === pkg.id && (
              <div className="flex justify-between text-sm">
                <span className="text-white/80">Estimated leads</span>
                <span className="font-medium text-white">
                  {pkg.estimatedLeads}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <LoadingOverlay isVisible={isLoading} />

      {/* Ad Preview Section */}
      <AdPreview
        initialImage={previewPicture??"https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg"}
        initialHeadline="Beautiful Home in Prime Location"
        initialAdCopy="Discover your dream home in this stunning property featuring modern amenities and a perfect location. Contact us today for a private showing!"
        onAdUpdate={(data) => {
          console.log("Ad updated:", data);
          // Here you can handle the ad update, save to state, API, etc.
        }}
      />

      <section className="w-full flex flex-col items-center" data-section="packages">
        <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-[#EBECF1] mt-[29px]" />

        <div className="flex w-full max-w-[1140px] items-stretch gap-5 flex-wrap justify-between mt-10 max-md:max-w-full max-md:px-6">
          <h2 className="text-black text-xl font-bold my-auto max-md:max-w-full">
            Select Your Package: Boost Views, Get Leads
          </h2>

          <div className="flex items-center gap-3 max-md:flex-col max-md:items-start max-md:gap-3">
            <div className="bg-[rgba(246,247,251,1)] border flex min-h-10 flex-col items-stretch text-sm leading-6 justify-center p-[5px] rounded-[20px] border-[rgba(235,236,241,1)] border-solid">
              <div className="flex min-h-[30px] w-full max-w-[310px] gap-[5px]">
                <button
                  onClick={() => {
                    setSelectedPlan("one-time");
                    if (selectedPackage) {
                      const duration = packageToDuration[selectedPackage];
                      savePackageSelection(duration);
                    }
                    trackMixPanel("click", {
                      page_name: "ListingBlastSP",
                      feature_name: "ListingBlast",
                      click_item: "one-time",
                      click_action: "charge"
                    });
                  }}
                  className={`justify-center items-center flex min-h-[30px] font-bold w-[152px] px-2.5 rounded-[15px] transition-all ${
                    selectedPlan === "one-time"
                      ? "shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] text-[#3B5CDE] bg-white"
                      : "text-[#797E8B] font-[510]"
                  }`}
                >
                  One-time
                </button>
                <button
                  onClick={() => {
                    setSelectedPlan("monthly");
                    if (selectedPackage) {
                      const duration = packageToDuration[selectedPackage];
                      savePackageSelection(duration);
                    }
                    trackMixPanel("click", {
                     page_name: "ListingBlastSP",
                     feature_name: "ListingBlast",
                     click_item: "monthly",
                     click_action: "charge"
                   });
                  }}
                  className={`flex min-h-[30px] items-center whitespace-nowrap justify-center w-[152px] px-2.5 rounded-[15px] transition-all ${
                    selectedPlan === "monthly"
                      ? "shadow-[0px_2px_5px_0px_rgba(0,0,0,0.05)] text-[#3B5CDE] bg-white font-bold"
                      : "text-[#797E8B] font-[510]"
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <TooltipProvider>
              <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
                <TooltipTrigger asChild>
                  <button
                    className="focus:outline-none hover:bg-gray-100 rounded-full p-1 transition-all duration-200"
                    onClick={handleTooltipClick}
                  >
                    <Info className="w-5 h-5 text-gray-400 hover:text-blue-600 cursor-pointer transition-colors duration-200" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-3 max-md:mb-4" side={isMobile ? "bottom" : "top"}>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-semibold">One-time Charge:</span>{" "}
                      You will be billed for this time ONLY;
                    </div>
                    <div>
                      <span className="font-semibold">Monthly Charge:</span> You
                      will be billed monthly and every month we will run the
                      campaign for you based on the package you select.
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Package cards layout - Desktop: Grid, Mobile: Carousel */}
        {/* Desktop layout */}
        <div className="hidden md:grid grid-cols-4 gap-4 w-full max-w-[1140px] mt-5 items-center">
          {packages.map((pkg) => renderPackageCard(pkg))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden w-full mt-5">
          <div className="relative">
            {/* Carousel container */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {packages.map((pkg) => renderPackageCard(pkg, true))}
              </div>
            </div>

            {/* Polished dots indicator */}
            <div className="flex justify-center mt-4 gap-1.5">
              {packages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className="w-11 h-11 flex items-center justify-center group"
                  aria-label={`Go to package ${index + 1}`}
                >
                  <div
                    className={`transition-all duration-300 ease-out ${
                      index === selectedIndex
                        ? 'w-4 h-1 bg-[#0A3D91] rounded-full transform scale-100 opacity-100'
                        : 'w-2 h-2 bg-gray-400 rounded-full transform scale-100 opacity-30 group-hover:opacity-50 group-hover:scale-110'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Edge fade indicators */}
            {selectedIndex > 0 && (
              <div className="absolute left-0 top-0 bottom-8 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none" />
            )}
            {selectedIndex < packages.length - 1 && (
              <div className="absolute right-0 top-0 bottom-8 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none" />
            )}
          </div>
        </div>

        <div className="flex w-[782px] max-w-full flex-col items-stretch font-bold text-center mt-[70px] max-md:mt-10 max-md:px-6">
          <h3 className="text-black text-xl max-md:max-w-full">
            Ready to Checkout? Proceed to payment and your promoted listing will
            go live
          </h3>
          <button
            onClick={handleCheckout}
            id="btn-blast-now"
            className="self-center flex h-[44px] w-[320px] max-w-full items-center justify-center text-[16px] text-white font-medium transition-all mt-[30px] px-5 py-4 rounded-[75px] max-md:px-5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            style={{
              fontWeight: 500,
            }}
          >
            <span>Blast Now!</span>
          </button>
        </div>
      </section>

      {/* Sticky CTA */}
      <StickyCTA
        onCtaClick={handleCheckout}
        selectedPackage={selectedPackage}
        selectedPlan={selectedPlan}
        isVisible={!isLoading}
      />
    </>
  );
};
