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
    align: 'center',
    containScroll: 'trimSnaps',
    dragFree: false,
    loop: true // 启用循环播放以支持自动播放
  });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // 自动播放相关状态
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [autoPlayInterval, setAutoPlayInterval] = useState<NodeJS.Timeout | null>(null);
  const searchParams = new URLSearchParams(window.location.search);

  // Get listingId from URL
  const listingId = searchParams.get("assetKey");

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

  const handleCheckout = async () => {
    // Use selectedAddressId if available, otherwise fall back to URL listingId
    const currentListingId = selectedAddressId || listingId;
    if (!currentListingId) {
      // 如果没有选房源，滚动到PropertySetup模块并对form元素添加动画
      const propertySetupSection = document.querySelector('[data-section="property-setup"]');
      const addressForm = document.querySelector('#address-form');
      const addressInput = document.querySelector('#address-search-input');

      if (propertySetupSection) {
        // 平滑滚动到PropertySetup模块
        propertySetupSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // 延迟动画，等待滚动完成
        setTimeout(() => {
          if (addressForm && addressInput) {
            // 聚焦到输入框
            addressInput.focus();
            
            // 对form元素添加缩放动画和黑色边框
            addressForm.style.transformOrigin = 'center';
            addressForm.style.transform = 'scale(1.05)';
            addressForm.style.transition = 'all 0.3s ease-in-out';
            addressForm.style.border = '2px solid black';
            addressForm.style.borderRadius = '8px';

            // 3秒后恢复原状
            setTimeout(() => {
              addressForm.style.transform = 'scale(1)';
              addressForm.style.border = '';
              addressForm.style.borderRadius = '';
            }, 3000);
          }
        }, 800); // 等待滚动动画完成
      }
      
      console.error(
        "No listing ID available (neither from address selection nor URL)",
      );
      return;
    }

    window.trackBlastNow();

    const duration = packageToDuration[selectedPackage];
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
      await handleCheckout();
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
  const scrollPrev = () => {
    if (emblaApi) {
      emblaApi.scrollPrev();
      pauseAutoPlay(); // 用户操作时暂停自动播放
    }
  };

  const scrollNext = () => {
    if (emblaApi) {
      emblaApi.scrollNext();
      pauseAutoPlay(); // 用户操作时暂停自动播放
    }
  };

  // Update button states
  const updateScrollButtons = () => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  };

  // 自动播放控制函数
  const startAutoPlay = () => {
    if (!isMobile || !emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000); // 3秒切换一次

    setAutoPlayInterval(interval);
    setIsAutoPlaying(true);
  };

  const pauseAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setIsAutoPlaying(false);

    // 5秒后重新启动自动播放
    setTimeout(() => {
      if (isMobile) {
        startAutoPlay();
      }
    }, 5000);
  };

  const stopAutoPlay = () => {
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    setIsAutoPlaying(false);
  };

  useEffect(() => {
    if (!emblaApi) return;

    updateScrollButtons();
    emblaApi.on('select', updateScrollButtons);
    emblaApi.on('reInit', updateScrollButtons);

    // 监听用户交互事件
    emblaApi.on('pointerDown', pauseAutoPlay);
    emblaApi.on('dragStart', pauseAutoPlay);

    // 在移动端启动自动播放
    if (isMobile) {
      startAutoPlay();
    }

    return () => {
      emblaApi.off('select', updateScrollButtons);
      emblaApi.off('reInit', updateScrollButtons);
      emblaApi.off('pointerDown', pauseAutoPlay);
      emblaApi.off('dragStart', pauseAutoPlay);
      stopAutoPlay();
    };
  }, [emblaApi, isMobile]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
      }
    };
  }, [autoPlayInterval]);

  // Render package card
  const renderPackageCard = (pkg: any, isMobile = false) => (
    <div 
      key={pkg.id}
      className={isMobile ? "flex-[0_0_80%] min-w-0 px-2" : ""}
    >
      <div
        onClick={() => handleCardClick(pkg.id as "starter" | "boost" | "growth" | "mastery")}
        className={`relative rounded-[24px] p-6 h-[330px] overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
          selectedPackage === pkg.id
            ? "bg-[#3B5CDE] text-white border border-gray-100"
            : "bg-white border border-gray-100"
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

      <section className="w-full flex flex-col items-center">
        <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-[#EBECF1] mt-[29px]" />

        <div className="flex w-full max-w-[1140px] items-stretch gap-5 flex-wrap justify-between mt-10 max-md:max-w-full max-md:px-6">
          <h2 className="text-black text-xl font-bold my-auto max-md:max-w-full">
            Select Your Package: Boost Views, Get Leads
          </h2>

          <div className="flex items-center gap-3">
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
                <TooltipContent className="max-w-xs p-3">
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
          <div
            className="relative"
            onMouseEnter={stopAutoPlay}
            onMouseLeave={() => isMobile && startAutoPlay()}
            onTouchStart={pauseAutoPlay}
          >
            {/* Carousel container */}
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex">
                {packages.map((pkg) => renderPackageCard(pkg, true))}
              </div>
            </div>
            
            {/* Navigation arrows */}
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg transition-all ${
                canScrollPrev 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg transition-all ${
                canScrollNext 
                  ? 'hover:bg-gray-50 text-gray-700' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
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
            className="self-center flex h-[44px] w-[320px] max-w-full items-center justify-center text-[16px] text-white font-medium transition-all mt-[30px] px-5 py-4 rounded-[75px] max-md:px-5"
            style={{
              background: "linear-gradient(to bottom, #5073FF, #3B5CDE)",
              fontWeight: 500,
            }}
          >
            <span>Blast Now!</span>
          </button>
        </div>
      </section>
    </>
  );
};
