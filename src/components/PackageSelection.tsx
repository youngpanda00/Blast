import React, { useState, useEffect, useRef } from "react";
import { PricingCard } from "./PricingCard";
import { AdPreview } from "./AdPreview";
import { Info, Diamond } from "lucide-react";
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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
      const addressForm = propertySetupSection.querySelector('form');

      if (propertySetupSection) {
        // 平滑滚动到PropertySetup模块
        propertySetupSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

        // 延迟动画，等待滚动完成
        if (addressForm) {
          // 对form元素添加缩放动画和黑色边框
          addressForm.style.transformOrigin = 'center';
          addressForm.style.transform = 'scale(1.02)';
          addressForm.style.transition = 'all 0.3s ease-in-out';
          addressForm.querySelector('button').focus()

          // 3秒后恢复原状
          setTimeout(() => {
            addressForm.style.transform = '';
          }, 3000);
        }
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

        <div className="flex w-full max-w-[1140px] items-stretch gap-5 flex-wrap justify-between mt-10 max-md:max-w-full max-md:px-4 max-md:flex-col max-md:gap-4">
          <h2 className="text-black text-xl font-bold my-auto max-md:max-w-full max-md:text-lg max-md:text-center">
            Select Your Package: Boost Views, Get Leads
          </h2>

          <div className="flex items-center gap-3 max-md:justify-center max-md:flex-wrap">
            <div className="bg-[rgba(246,247,251,1)] border flex min-h-10 flex-col items-stretch text-sm leading-6 justify-center p-[5px] rounded-[20px] border-[rgba(235,236,241,1)] border-solid max-md:w-full max-md:max-w-[280px]">
              <div className="flex min-h-[30px] w-full max-w-[310px] gap-[5px] max-md:max-w-full">
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
                  className={`justify-center items-center flex min-h-[30px] font-bold w-[152px] px-2.5 rounded-[15px] transition-all max-md:flex-1 max-md:w-auto ${
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
                  className={`flex min-h-[30px] items-center whitespace-nowrap justify-center w-[152px] px-2.5 rounded-[15px] transition-all max-md:flex-1 max-md:w-auto ${
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

        {/* Package cards layout - Desktop: Grid, Mobile: Horizontal scroll */}
        <div className="w-full max-w-[1140px] mt-5">
          {/* Desktop layout */}
          <div className="hidden md:grid grid-cols-4 gap-4 items-center">
            {/* Desktop cards will go here */}
          </div>

          {/* Mobile horizontal scroll */}
          <div className="md:hidden px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {/* Mobile cards will go here */}
            </div>
          </div>
        </div>

        {/* Desktop Package Cards */}
        <div className="hidden md:grid grid-cols-4 gap-4 w-full max-w-[1140px] items-center">
          {/* Desktop Starter Pack */}
          <div>
            <div
              onClick={() => handleCardClick("starter")}
              className={`relative rounded-[24px] p-6 text-white h-[330px] overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedPackage === "starter"
                  ? "bg-[#3B5CDE] border border-gray-100"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="absolute top-0 right-0 w-0 h-0 border-l-[90px] border-l-transparent border-t-[90px] border-t-[#FFA600]">
                <div className="absolute -top-[75px] -right-[30px] rotate-45 text-white text-[10px] font-bold leading-tight flex flex-col items-center justify-center w-[120px]">
                  <div>MOST</div>
                  <div>POPULAR</div>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Diamond
                  className="w-[10px] h-[10px]"
                  style={{ color: "#FFA600" }}
                  fill="#FFA600"
                />
                <h3
                  className={`text-xl font-bold ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}
                >
                  Starter Pack
                </h3>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-2xl line-through ${selectedPackage === "starter" ? "text-white/70" : "text-gray-400"}`}
                  >
                    $109
                  </span>
                  <span
                    className={`text-4xl font-bold ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}
                  >
                    $79
                  </span>
                </div>
                <div>
                  <span
                    className={`text-sm ${selectedPackage === "starter" ? "text-white/80" : "text-gray-500"}`}
                  >
                    {paymentText}
                  </span>
                </div>
              </div>

              <div
                className={`w-full font-normal px-4 rounded-full mb-6 h-9 flex items-center justify-center ${
                  selectedPackage === "starter"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}
              >
                {selectedPackage === "starter" ? "Current plan" : "Select plan"}
              </div>

              <div
                className={`border-t pt-4 ${selectedPackage === "starter" ? "border-white/20" : "border-gray-200"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "starter"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Ads duration
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}
                    >
                      1 Week
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "starter"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Estimated views
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}
                    >
                      {(2000 * packageToDuration.starter).toLocaleString()}
                    </span>
                  </div>
                  {selectedPackage === "starter" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Estimated leads</span>
                      <span className="font-medium text-white">
                        {Math.ceil(79 / 9)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Desktop Boost Pack */}
          <div>
            <div
              onClick={() => handleCardClick("boost")}
              className={`relative rounded-[24px] p-6 h-[330px] overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedPackage === "boost"
                  ? "bg-[#3B5CDE] text-white border border-gray-100"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Diamond
                  className="w-[10px] h-[10px]"
                  style={{ color: "#FFA600" }}
                  fill="#FFA600"
                />
                <h3
                  className={`text-xl font-bold ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}
                >
                  Boost Pack
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}
                  >
                    $158
                  </span>
                  <span
                    className={`text-sm ${selectedPackage === "boost" ? "text-white/80" : "text-gray-500"}`}
                  >
                    {paymentText}
                  </span>
                </div>
              </div>

              <div
                className={`w-full font-normal px-4 rounded-full mb-6 h-9 flex items-center justify-center ${
                  selectedPackage === "boost"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}
              >
                {selectedPackage === "boost" ? "Current plan" : "Select plan"}
              </div>

              <div
                className={`border-t pt-4 ${selectedPackage === "boost" ? "border-white/20" : "border-gray-200"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "boost"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Ads duration
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}
                    >
                      2 Weeks
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "boost"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Estimated views
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}
                    >
                      {(2000 * packageToDuration.boost).toLocaleString()}
                    </span>
                  </div>
                  {selectedPackage === "boost" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Estimated leads</span>
                      <span className="font-medium text-white">
                        {Math.ceil(158 / 9)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Desktop Growth Pack */}
          <div>
            <div
              onClick={() => handleCardClick("growth")}
              className={`relative rounded-[24px] p-6 h-[330px] overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedPackage === "growth"
                  ? "bg-[#3B5CDE] text-white border border-gray-100"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Diamond
                  className="w-[10px] h-[10px]"
                  style={{ color: "#FFA600" }}
                  fill="#FFA600"
                />
                <h3
                  className={`text-xl font-bold ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}
                >
                  Growth Pack
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}
                  >
                    $237
                  </span>
                  <span
                    className={`text-sm ${selectedPackage === "growth" ? "text-white/80" : "text-gray-500"}`}
                  >
                    {paymentText}
                  </span>
                </div>
              </div>

              <div
                className={`w-full font-normal px-4 rounded-full mb-6 h-9 flex items-center justify-center ${
                  selectedPackage === "growth"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}
              >
                {selectedPackage === "growth" ? "Current plan" : "Select plan"}
              </div>

              <div
                className={`border-t pt-4 ${selectedPackage === "growth" ? "border-white/20" : "border-gray-200"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "growth"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Ads duration
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}
                    >
                      3 Weeks
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "growth"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Estimated views
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}
                    >
                      {(2000 * packageToDuration.growth).toLocaleString()}
                    </span>
                  </div>
                  {selectedPackage === "growth" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Estimated leads</span>
                      <span className="font-medium text-white">
                        {Math.ceil(237 / 9)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Mastery Pack */}
          <div>
            <div
              onClick={() => handleCardClick("mastery")}
              className={`relative rounded-[24px] p-6 h-[330px] overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
                selectedPackage === "mastery"
                  ? "bg-[#3B5CDE] text-white border border-gray-100"
                  : "bg-white border border-gray-100"
              }`}
            >
              <div className="flex items-center gap-2 mb-6">
                <Diamond
                  className="w-[10px] h-[10px]"
                  style={{ color: "#FFA600" }}
                  fill="#FFA600"
                />
                <h3
                  className={`text-xl font-bold ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}
                >
                  Mastery Pack
                </h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-4xl font-bold ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}
                  >
                    $316
                  </span>
                  <span
                    className={`text-sm ${selectedPackage === "mastery" ? "text-white/80" : "text-gray-500"}`}
                  >
                    {paymentText}
                  </span>
                </div>
              </div>

              <div
                className={`w-full font-normal px-4 rounded-full mb-6 h-9 flex items-center justify-center ${
                  selectedPackage === "mastery"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}
              >
                {selectedPackage === "mastery" ? "Current plan" : "Select plan"}
              </div>

              <div
                className={`border-t pt-4 ${selectedPackage === "mastery" ? "border-white/20" : "border-gray-200"}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "mastery"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Ads duration
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}
                    >
                      4 Weeks
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        selectedPackage === "mastery"
                          ? "text-white/80"
                          : "text-gray-500"
                      }
                    >
                      Estimated views
                    </span>
                    <span
                      className={`font-medium ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}
                    >
                      {(2000 * packageToDuration.mastery).toLocaleString()}
                    </span>
                  </div>
                  {selectedPackage === "mastery" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">Estimated leads</span>
                      <span className="font-medium text-white">
                        {Math.ceil(316 / 9)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scroll Cards */}
        <div className="md:hidden mt-5">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide px-4" style={{
            touchAction: 'pan-x',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: '1rem'
          }}>
            {/* Mobile Starter Pack */}
            <div className="flex-shrink-0 w-[260px] snap-start first:ml-0">
              <div
                onClick={() => handleCardClick("starter")}
                className={`relative rounded-[20px] p-4 text-white h-[240px] overflow-hidden cursor-pointer transition-all ${
                  selectedPackage === "starter"
                    ? "bg-[#3B5CDE] border border-gray-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="absolute top-0 right-0 w-0 h-0 border-l-[60px] border-l-transparent border-t-[60px] border-t-[#FFA600]">
                  <div className="absolute -top-[50px] -right-[20px] rotate-45 text-white text-[8px] font-bold leading-tight flex flex-col items-center justify-center w-[80px]">
                    <div>MOST</div>
                    <div>POPULAR</div>
                  </div>
                </div>

                <div className="flex items-center gap-1 mb-3">
                  <Diamond className="w-[8px] h-[8px]" style={{ color: "#FFA600" }} fill="#FFA600" />
                  <h3 className={`text-lg font-bold ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}>
                    Starter Pack
                  </h3>
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-xl line-through ${selectedPackage === "starter" ? "text-white/70" : "text-gray-400"}`}>
                      $109
                    </span>
                    <span className={`text-3xl font-bold ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}>
                      $79
                    </span>
                  </div>
                  <div>
                    <span className={`text-sm ${selectedPackage === "starter" ? "text-white/80" : "text-gray-500"}`}>
                      {paymentText}
                    </span>
                  </div>
                </div>

                <div className={`w-full font-normal px-3 rounded-full mb-4 h-8 flex items-center justify-center text-sm ${
                  selectedPackage === "starter"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}>
                  {selectedPackage === "starter" ? "Current plan" : "Select plan"}
                </div>

                <div className={`border-t pt-3 ${selectedPackage === "starter" ? "border-white/20" : "border-gray-200"}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "starter" ? "text-white/80" : "text-gray-500"}>
                        Ads duration
                      </span>
                      <span className={`font-medium ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}>
                        1 Week
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "starter" ? "text-white/80" : "text-gray-500"}>
                        Estimated views
                      </span>
                      <span className={`font-medium ${selectedPackage === "starter" ? "text-white" : "text-gray-900"}`}>
                        {(2000 * packageToDuration.starter).toLocaleString()}
                      </span>
                    </div>
                    {selectedPackage === "starter" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Estimated leads</span>
                        <span className="font-medium text-white">{Math.ceil(79 / 9)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Boost Pack */}
            <div className="flex-shrink-0 w-[260px] snap-center">
              <div
                onClick={() => handleCardClick("boost")}
                className={`relative rounded-[20px] p-4 h-[240px] overflow-hidden cursor-pointer transition-all ${
                  selectedPackage === "boost"
                    ? "bg-[#3B5CDE] text-white border border-gray-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  <Diamond className="w-[8px] h-[8px]" style={{ color: "#FFA600" }} fill="#FFA600" />
                  <h3 className={`text-lg font-bold ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}>
                    Boost Pack
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}>
                      $158
                    </span>
                    <span className={`text-sm ${selectedPackage === "boost" ? "text-white/80" : "text-gray-500"}`}>
                      {paymentText}
                    </span>
                  </div>
                </div>

                <div className={`w-full font-normal px-3 rounded-full mb-4 h-8 flex items-center justify-center text-sm ${
                  selectedPackage === "boost"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}>
                  {selectedPackage === "boost" ? "Current plan" : "Select plan"}
                </div>

                <div className={`border-t pt-3 ${selectedPackage === "boost" ? "border-white/20" : "border-gray-200"}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "boost" ? "text-white/80" : "text-gray-500"}>
                        Ads duration
                      </span>
                      <span className={`font-medium ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}>
                        2 Weeks
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "boost" ? "text-white/80" : "text-gray-500"}>
                        Estimated views
                      </span>
                      <span className={`font-medium ${selectedPackage === "boost" ? "text-white" : "text-gray-900"}`}>
                        {(2000 * packageToDuration.boost).toLocaleString()}
                      </span>
                    </div>
                    {selectedPackage === "boost" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Estimated leads</span>
                        <span className="font-medium text-white">{Math.ceil(158 / 9)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Growth Pack */}
            <div className="flex-shrink-0 w-[260px] snap-center">
              <div
                onClick={() => handleCardClick("growth")}
                className={`relative rounded-[20px] p-4 h-[240px] overflow-hidden cursor-pointer transition-all ${
                  selectedPackage === "growth"
                    ? "bg-[#3B5CDE] text-white border border-gray-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  <Diamond className="w-[8px] h-[8px]" style={{ color: "#FFA600" }} fill="#FFA600" />
                  <h3 className={`text-lg font-bold ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}>
                    Growth Pack
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}>
                      $237
                    </span>
                    <span className={`text-sm ${selectedPackage === "growth" ? "text-white/80" : "text-gray-500"}`}>
                      {paymentText}
                    </span>
                  </div>
                </div>

                <div className={`w-full font-normal px-3 rounded-full mb-4 h-8 flex items-center justify-center text-sm ${
                  selectedPackage === "growth"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}>
                  {selectedPackage === "growth" ? "Current plan" : "Select plan"}
                </div>

                <div className={`border-t pt-3 ${selectedPackage === "growth" ? "border-white/20" : "border-gray-200"}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "growth" ? "text-white/80" : "text-gray-500"}>
                        Ads duration
                      </span>
                      <span className={`font-medium ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}>
                        3 Weeks
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "growth" ? "text-white/80" : "text-gray-500"}>
                        Estimated views
                      </span>
                      <span className={`font-medium ${selectedPackage === "growth" ? "text-white" : "text-gray-900"}`}>
                        {(2000 * packageToDuration.growth).toLocaleString()}
                      </span>
                    </div>
                    {selectedPackage === "growth" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Estimated leads</span>
                        <span className="font-medium text-white">{Math.ceil(237 / 9)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Mastery Pack */}
            <div className="flex-shrink-0 w-[260px] snap-center">
              <div
                onClick={() => handleCardClick("mastery")}
                className={`relative rounded-[20px] p-4 h-[240px] overflow-hidden cursor-pointer transition-all ${
                  selectedPackage === "mastery"
                    ? "bg-[#3B5CDE] text-white border border-gray-100"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className="flex items-center gap-1 mb-4">
                  <Diamond className="w-[8px] h-[8px]" style={{ color: "#FFA600" }} fill="#FFA600" />
                  <h3 className={`text-lg font-bold ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}>
                    Mastery Pack
                  </h3>
                </div>

                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}>
                      $316
                    </span>
                    <span className={`text-sm ${selectedPackage === "mastery" ? "text-white/80" : "text-gray-500"}`}>
                      {paymentText}
                    </span>
                  </div>
                </div>

                <div className={`w-full font-normal px-3 rounded-full mb-4 h-8 flex items-center justify-center text-sm ${
                  selectedPackage === "mastery"
                    ? "bg-white/20 text-white opacity-60"
                    : "bg-white text-[#3B5CDE] border border-[#3B5CDE]"
                }`}>
                  {selectedPackage === "mastery" ? "Current plan" : "Select plan"}
                </div>

                <div className={`border-t pt-3 ${selectedPackage === "mastery" ? "border-white/20" : "border-gray-200"}`}>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "mastery" ? "text-white/80" : "text-gray-500"}>
                        Ads duration
                      </span>
                      <span className={`font-medium ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}>
                        4 Weeks
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className={selectedPackage === "mastery" ? "text-white/80" : "text-gray-500"}>
                        Estimated views
                      </span>
                      <span className={`font-medium ${selectedPackage === "mastery" ? "text-white" : "text-gray-900"}`}>
                        {(2000 * packageToDuration.mastery).toLocaleString()}
                      </span>
                    </div>
                    {selectedPackage === "mastery" && (
                      <div className="flex justify-between text-xs">
                        <span className="text-white/80">Estimated leads</span>
                        <span className="font-medium text-white">{Math.ceil(316 / 9)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-[782px] max-w-full flex-col items-stretch font-bold text-center mt-[70px] max-md:mt-10 max-md:px-4">
          <h3 className="text-black text-xl max-md:max-w-full max-md:text-lg max-md:leading-tight">
            Ready to Checkout? Proceed to payment and your promoted listing will
            go live
          </h3>
          <button
            onClick={handleCheckout}
            id="btn-blast-now"
            className="self-center flex h-[44px] w-[320px] max-w-full items-center justify-center text-[16px] text-white font-medium transition-all mt-[30px] px-5 py-4 rounded-[75px] max-md:px-5 max-md:w-full max-md:max-w-[280px] max-md:h-12"
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
