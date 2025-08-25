import React, { useState, useEffect } from "react";
import { PricingCard } from "./PricingCard";
import AdPreview, { ChildMethods } from "./AdPreview";
import { MobileAdConfiguration } from "./MobileAdConfiguration";
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
import { StickyCTA } from "./StickyCTA";
import { trackFBEvent, trackMixPanel } from "@/lib/utils";
import { saveStepWithRetry, showErrorNotification, getUserFriendlyErrorMessage } from "@/utils/checkoutApi";

interface PackageSelectionProps {
  previewPicture?: string | null;
  selectedAddressId?: string | null;
  onOpenCongratulationsModal: (email: string) => void;
  isCustomListing?: boolean;
  customAddress?: string | null;
  onMethodsReady: (methods: SonMethods) => void;
}

interface AdData {
    imageUrl?: string | null,
    headline?: string | null,
    mainText? : string | null,
    file?: object
}

export interface SonMethods {
  handleEdit: () => void;
  handleCancel: () => void;
}

const PackageSelection: React.FC<PackageSelectionProps> = ({
  previewPicture,
  selectedAddressId,
  onOpenCongratulationsModal,
  isCustomListing,
  customAddress,
  onMethodsReady
}) => {
  const [selectedPlan, setSelectedPlan] = useState<"one-time" | "monthly">(
    "one-time",
  );
  const [selectedPackage, setSelectedPackage] = useState<
    "starter" | "boost" | "growth" | "mastery"
  >("boost");
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mobileConfiguration, setMobileConfiguration] = useState<{
    duration: number;
    estimatedViews: number;
    price: number;
    discountPrice: number;
    leads: number;
    packageType: string;
  } | null>(null);
  const [shouldHighlightMobileConfig, setShouldHighlightMobileConfig] = useState(false);
  const isMobile = useIsMobile();

  const [childMethods, setChildMethods] = useState<ChildMethods | null>(null);

  const [adPreviewData, setAdPreviewData] = useState<AdData | null>(null);

  useEffect(()=>{
    onMethodsReady({
      handleEdit: childMethods?.handleEdit,
      handleCancel: childMethods?.handleCancel
    })
  }, [onMethodsReady, childMethods])
  
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
      urlParams: Object.fromEntries(searchParams.entries()),
      currentUrl: window.location.href
    });
  }

  // Check if we have a valid listing ID from either source
  const hasValidListingId = selectedAddressId || listingId;

  // Development fallback - use a sample listing ID if none available
  const getEffectiveListingId = () => {
    if (selectedAddressId) return selectedAddressId;
    if (listingId) return listingId;
    if (isCustomListing && customAddress) {
      return customAddress
    }

    // In development, provide a fallback to allow testing
    if (process.env.NODE_ENV === 'development') {
      console.warn("No listing ID available - using development fallback");
      return "dev-sample-listing-id";
    }

    return null;
  };

  // Map package names to duration values
  const packageToDuration = {
    starter: 1,
    boost: 2,
    growth: 3,
    mastery: 4,
  };

  const savePackageSelection = async (duration: number) => {
    // Use selectedAddressId if available, otherwise fall back to URL listingId or dev fallback
    const currentListingId = getEffectiveListingId();
    if (!currentListingId) {
      console.error(
        "No listing ID available (neither from address selection nor URL)",
      );
      return;
    }

    const paymentMode =
      selectedPlan === "one-time" ? "ONE_TIME_CHARGE" : "RECURRING_CHARGE";
  };

  const handleCheckoutWithPackage = async (packageType: "starter" | "boost" | "growth" | "mastery", adPreviewData: AdData) => {
    // Use selectedAddressId if available, otherwise fall back to URL listingId or dev fallback
    const currentListingId = getEffectiveListingId();
    console.log('isCustomListing ===>>>', isCustomListing, customAddress)
    if (!currentListingId) {
      console.warn("Checkout attempted without listing ID:", {
        selectedAddressId,
        listingId,
        urlParams: Object.fromEntries(searchParams.entries()),
        currentUrl: window.location.href
      });

      // 如果没有选房源，滚动到PropertySetup模块并对输入框添加突出动画
      const propertySetupSection = document.querySelector('[data-section="property-setup"]');

      if (propertySetupSection) {
        // 平滑滚动到PropertySetup模块
        propertySetupSection.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // 延迟动画，等���滚动完成
        setTimeout(() => {
          // 查找地址输入框 - 优��使用ID，备用placeholder定位
          const addressInput = (document.querySelector('#address-search-input') ||
                               document.querySelector('input[placeholder="Enter the property address"]')) as HTMLInputElement;
          // 查��包含输入框的容器（带渐变背景的div）
          const addressContainer = addressInput?.closest('.p-4.rounded-xl') as HTMLElement;

          if (addressInput && addressContainer) {
            // 聚焦到输入框
            addressInput.focus();

            // 对容器添加突出动画效果
            const originalTransform = addressContainer.style.transform;
            const originalBoxShadow = addressContainer.style.boxShadow;
            const originalTransition = addressContainer.style.transition;

            // 应���突出效果
            addressContainer.style.transition = 'all 0.5s ease';
            addressContainer.style.transform = 'scale(1.08)';
            addressContainer.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.6), 0 0 0 3px rgba(255, 255, 255, 0.8)';
            addressContainer.style.zIndex = '50';

            // 给输入框添加脉冲效果
            addressInput.style.transition = 'all 0.5s ease';
            addressInput.style.boxShadow = '0 0 0 3px rgba(59, 92, 222, 0.3)';

            // 添加轻微的晃���动画
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

    const startParams = new URLSearchParams();
    const taskType = isCustomListing ? 'NORMAL' : 'ADS_EMAIL_GUIDE'
    startParams.append("taskType", taskType);

    await fetch("/api-blast/task/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: startParams,
    });

    try {
      // Save step data with improved error handling
      const saveResult = await saveStepWithRetry({
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
      });

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save step data");
      }

      console.log('checkoutPop ===>>>', adPreviewData)

      // Call the external checkoutPop function
      if (typeof (window as any).checkoutPop === "function") {
        (window as any)
          .checkoutPop(adPreviewData)
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

      // Show user-friendly error message
      const userMessage = getUserFriendlyErrorMessage(error as Error);
      showErrorNotification(userMessage, "Checkout Error");
    }
  };

  const handleCheckout = async () => {
    await handleCheckoutWithPackage(selectedPackage, adPreviewData);
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
    trackFBEvent('Choose Package', { package: packageType })
    if (isMobile) {
      // On mobile, select package and trigger checkout
      await handlePackageSelect(packageType);
      // Use packageType directly instead of selectedPackage state
      await handleCheckoutWithPackage(packageType, adPreviewData);
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
      isPopular: false,
      estimatedViews: (2000 * packageToDuration.starter).toLocaleString(),
      estimatedLeads: Math.ceil(79 / 9)
    },
    {
      id: "boost",
      name: "Boost Pack",
      price: "$158",
      duration: "2 Weeks",
      isPopular: true,
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
  const renderPackageCard = (pkg: any) => (
    <div
      key={pkg.id}
      className="w-full relative"
    >
      {/* Popular badge - positioned outside the card */}
      {pkg.isPopular && (
        <>
          {/* Mobile popular badge - positioned outside card */}
          <div className="md:hidden absolute -top-[7px] right-[18px] bg-[#FFA600] text-white text-[8px] font-bold px-2 py-1 rounded-full z-10">
            POPULAR
          </div>
          {/* Desktop popular badge - original triangle design with rounded corner */}
          <div className="hidden md:block absolute top-0 right-0 w-0 h-0 border-l-[90px] border-l-transparent border-t-[90px] border-t-[#FFA600] rounded-tr-[20px] z-10">
            <div className="absolute -top-[75px] -right-[30px] rotate-45 text-white text-[10px] font-bold leading-tight flex flex-col items-center justify-center w-[120px]">
              <div>MOST</div>
              <div>POPULAR</div>
            </div>
          </div>
        </>
      )}

      <div
        onClick={() => handleCardClick(pkg.id as "starter" | "boost" | "growth" | "mastery")}
        className={`relative rounded-[24px] p-4 md:p-6 h-[230px] md:h-[290px] overflow-hidden cursor-pointer transition-all hover:shadow-lg border border-gray-100 flex flex-col justify-between ${
          selectedPackage === pkg.id
            ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
            : "bg-white"
        }`}
      >

        {/* Header */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <h3
              className={`text-base md:text-lg lg:text-xl font-bold ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
            >
              {pkg.name}
            </h3>
          </div>
        </div>

        {/* Mobile: Package details first, Desktop: Price first */}
        <div className="md:hidden flex-shrink-0">
          {/* Package details for mobile */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-black"
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
            <div className="flex justify-between text-xs">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-black"
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
            <div className="flex justify-between text-xs">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-black"
                }
              >
                Estimated leads
              </span>
              <span
                className={`font-medium ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
              >
                {pkg.estimatedLeads}
              </span>
            </div>
          </div>

          {/* Price section for mobile */}
          <div className={`border-t pt-3 ${selectedPackage === pkg.id ? "border-white/20" : "border-gray-200"}`}>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={`text-xl font-bold ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
              >
                {pkg.price}
              </span>
            </div>
            <div className="mt-1">
              <span
                className={`text-sm ${selectedPackage === pkg.id ? "text-white/80" : "text-gray-500"}`}
              >
                {paymentText}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop: Package details first, then Price below separator */}
        <div className="hidden md:block flex-shrink-0">
          {/* Package details for desktop */}
          <div className="space-y-2 md:space-y-3 mb-3">
            <div className="flex justify-between text-xs md:text-sm">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-black"
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
            <div className="flex justify-between text-xs md:text-sm">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-black"
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
            <div className="flex justify-between text-xs md:text-sm">
              <span
                className={
                  selectedPackage === pkg.id
                    ? "text-white/80"
                    : "text-black"
                }
              >
                Estimated leads
              </span>
              <span
                className={`font-medium ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
              >
                {pkg.estimatedLeads}
              </span>
            </div>
          </div>

          {/* Price section for desktop */}
          <div
            className={`border-t pt-3 md:pt-4 flex-shrink-0 ${selectedPackage === pkg.id ? "border-white/20" : "border-gray-200"}`}
          >
            <div className="flex items-baseline gap-2 flex-wrap">
              <span
                className={`text-2xl md:text-3xl font-bold ${selectedPackage === pkg.id ? "text-white" : "text-gray-900"}`}
              >
                {pkg.price}
              </span>
            </div>
            <div className="mt-1">
              <span
                className={`text-sm ${selectedPackage === pkg.id ? "text-white/80" : "text-gray-500"}`}
              >
                {paymentText}
              </span>
            </div>
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
        initialImage={previewPicture??"https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"}
        initialHeadline="Don't miss out on this new listing"
        initialAdCopy="✨ NEW LISTING - NOW AVAILABLE! Be the first to check out your new dream home🏡

🗓️ Schedule a private viewing today."
        onMethodsReady={setChildMethods}
        onAdUpdate={(data) => {
          console.log("Ad updated:", data);
          setAdPreviewData({
            imageUrl: data.image,
            headline: data.headline,
            mainText: data.adCopy,
            file: data.selectedFile
          })
          // Here you can handle the ad update, save to state, API, etc.
        }}
      />

      <section className="w-full flex flex-col items-center max-md:bg-white" data-section="packages">
        <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-[#EBECF1] mt-[29px] max-md:hidden" />

        <div className="flex w-full max-w-[1140px] items-stretch gap-5 flex-wrap justify-between mt-10 max-md:max-w-full max-md:px-6 max-md:justify-center max-md:items-center">
          <div className="flex flex-col">
            <h2 className="text-black text-xl font-bold my-auto max-md:max-w-full max-md:flex max-md:flex-col max-md:justify-start max-md:items-center">
              <span className="max-md:hidden">Step 3 - Select Your Package & Luanch Ad</span>
              <span className="hidden max-md:block">Step 3 - Publish Your Ad Now</span>
            </h2>
            {!hasValidListingId && process.env.NODE_ENV === 'production' && (
              <p className="text-sm text-orange-600 mt-1">
                ⚠️ Please select a property address above to continue
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 max-md:flex-row max-md:items-center max-md:gap-3">
            <div className="bg-[rgba(246,247,251,1)] border flex min-h-10 flex-col items-stretch text-sm leading-6 justify-center p-[5px] rounded-[20px] border-[rgba(235,236,241,1)] border-solid">
              <div className="flex min-h-[30px] w-full max-w-[310px] max-md:max-w-[240px] gap-[5px]">
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
                    trackFBEvent('Change billing Type', { item: 'one-time' })
                  }}
                  className={`justify-center items-center flex min-h-[30px] font-bold w-[152px] max-md:w-[115px] px-2.5 rounded-[15px] transition-all ${
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
                    trackFBEvent('Change billing Type', { item: 'monthly' })
                  }}
                  className={`flex min-h-[30px] items-center whitespace-nowrap justify-center w-[152px] max-md:w-[115px] px-2.5 rounded-[15px] transition-all ${
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
                    className="focus:outline-none hover:bg-gray-100 rounded-full p-2 w-9 h-9 flex items-center justify-center transition-all duration-200"
                    onClick={handleTooltipClick}
                  >
                    <Info className="w-5 h-5 text-gray-400 hover:text-blue-600 transition-colors duration-200" />
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

        {/* Package cards layout - 2x2 Grid for mobile, 1x4 for web */}
        <div className="w-full max-w-[1140px] mt-5 px-4 md:px-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 max-w-[800px] md:max-w-full mx-auto">
            {packages.map((pkg) => renderPackageCard(pkg))}
          </div>
        </div>

        <div className="flex w-[782px] max-md:w-full max-w-full flex-col items-stretch font-bold text-center mt-[70px] max-md:mt-[25px] max-md:mb-[35px] max-md:px-6">
          <button
            onClick={handleCheckout}
            id="btn-blast-now"
            className="self-center flex h-[44px] w-[320px] max-w-full items-center justify-center text-[16px] text-white font-medium transition-all px-5 py-4 rounded-[75px] max-md:px-5 max-md:pl-5 max-md:pb-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 animate-pulse-scale"
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

export default PackageSelection;
