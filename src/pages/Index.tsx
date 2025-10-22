import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Monitor,
  Smartphone,
  ZoomIn,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Hero } from "@/components/Hero";
import PropertySetup, { ChildMethods } from "@/components/PropertySetup";
import PackageSelection from "@/components/PackageSelection";
import { ClientTestimonials } from "@/components/ClientTestimonials";
import { FrequentlyAskedQuestions } from "@/components/FrequentlyAskedQuestions";
import { ContactFooter } from "@/components/ContactFooter";
import PurchaseNotification from "@/components/PurchaseNotification";
import { CongratulationsModal } from "@/components/CongratulationsModal";
import { InstagramPostComponent } from "@/components/InstagramPostComponent";
import { trackFBEvent } from "@/lib/utils";
import { autoRecordJumpClick } from "@/utils/recordJumpClick";

const Index = ({ page, promoEmail, promoCode, discountRate, promoActive, reloadPromo }: { page?: "listing"; promoEmail?: string; promoCode?: string; discountRate?: number; promoActive?: boolean, reloadPromo:()=>void }) => {
  const isMobile = useIsMobile();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [selectedPreviewPicture, setSelectedPreviewPicture] = useState<
    string | null
  >(null);
  const [listingCity, setListingCity] = useState<string | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [currentListingData, setCurrentListingData] = useState<{
    beds?: number;
    baths?: number;
    address?: string;
    previewPicture?: string;
  } | null>(null);
  const [isCongratulationsModalOpen, setIsCongratulationsModalOpen] =
    useState(false);
  const [congratulationsEmail, setCongratulationsEmail] = useState("");
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isCustomListing, setIsCustomListing] = useState(false);
  const [ addressName, setAddressName] = useState('');

  const [childMethods, setChildMethods] = useState<ChildMethods | null>(null)

  const [isEditingAd, setIsEditingAd] = useState(false)

  const [refreshKey, setRefreshKey] = useState(0)

  const refreshWithKey = () => {
    setRefreshKey(prevKey => prevKey + 1);
    setCurrentListingData(null);
    setSelectedAddressId('');
    setSelectedPreviewPicture('');
    setIsCustomListing(true);
    setIsEditingAd(false);
  }

  // Track ViewContent event state
  const [hasTrackedViewContent, setHasTrackedViewContent] = useState(false);

  // Handle escape key and body scroll for zoom modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomModalOpen) {
        setIsZoomModalOpen(false);
      }
    };

    if (isZoomModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isZoomModalOpen]);
  const searchParams = new URLSearchParams(window.location.search);
  const listingId = searchParams.get("assetKey");

  // Initialize selectedAddressId with URL listingId on first load
  React.useEffect(() => {
    console.log("Initializing with URL params:", { listingId, selectedAddressId });
    if (listingId && !selectedAddressId) {
      console.log("Setting initial selectedAddressId from URL:", listingId);
      setSelectedAddressId(listingId);
    }
  }, [listingId, selectedAddressId]);

  // Callback function to handle address selection from PropertySetup
  const handleAddressSelect = useCallback((addressData) => {
    // console.log("Address selected:", addressData);

    setAddressName(addressData?.addressName);

    setIsCustomListing(!!addressData?.isCustomListing);
    if (addressData?.fullAddress) {
      setIsEditingAd(true);
    } else {
      setIsEditingAd(false);
    }

    if (addressData?.previewPicture) {
      // Handle multiple images separated by "|", take the first one
      const firstImage = addressData.previewPicture.split("|")[0].trim();
      setSelectedPreviewPicture(firstImage);
    }
    // Store the selected address ID to replace listingId when blast now is clicked
    if (addressData?.id) {
      console.log("Setting selectedAddressId to:", addressData.id);
      setSelectedAddressId(addressData.id);
    } else if (addressData?.isCustomListing) {
      setSelectedAddressId(addressData.fullAddress);
    } else {
      setSelectedAddressId('');
      console.warn("No Select property");
    }
    // Store listing data for ad display
    if (addressData) {
      setCurrentListingData({
        beds: addressData.bedrooms || addressData.beds,
        baths: addressData.bathrooms || addressData.baths,
        address: addressData.fullAddress,
        previewPicture: addressData.previewPicture,
      });
    }
  }, []);

  // Add global unhandled promise rejection handler for API fetch errors
  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Check if it's a fetch error related to our API calls
      if (event.reason &&
          (event.reason.message?.includes('Failed to fetch') ||
           event.reason.toString?.().includes('api-blast'))) {
        console.debug('Handled unhandled promise rejection for API call:', event.reason);
        event.preventDefault(); // Prevent the error from bubbling up
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // Callback function to handle city updates from PropertySetup
  const handleCityUpdate = React.useCallback((city: string | null) => {
    setListingCity(city);
  }, []);


  // Generate dynamic ad text based on current listing data
  const getAdText = () => {
    const address =
      currentListingData?.address || "5532 Pearce AVE, Lakewood, CA 90712";

    return `🏠 NEW LISTING - NOW AVAILABLE! Be the first to check out your new dream home! ${address}.`;
  };

  // Call task/start API when page loads
  useEffect(() => {
    const startTask = async () => {
      try {
        const startParams = new URLSearchParams();
        startParams.append("taskType", "ADS_EMAIL_GUIDE");

        const startResponse = await fetch("/api-blast/task/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: startParams,
        });

        if (startResponse.ok) {
          console.log("Task started successfully on page load");
        } else {
          console.debug("Task start API returned non-OK status:", startResponse.status);
        }
      } catch (error) {
        // Silently handle the error - this API may not be available in dev
        console.debug("Task start API not available:", error instanceof Error ? error.message : String(error));
      }
    };

    // Wrap in try-catch to prevent any unhandled promise rejections
    try {
      startTask().catch((error) => {
        console.debug("Unhandled error in startTask:", error instanceof Error ? error.message : String(error));
      });
    } catch (error) {
      console.debug("Error calling startTask:", error instanceof Error ? error.message : String(error));
    }
  }, []);


  // Call promotion/record-jump-click API when page loads
  useEffect(() => {
    autoRecordJumpClick();
  }, []);

   // 监听滚动事件，当main模块距离页面顶部小于100px时触发trackFBEvent
  useEffect(() => {
    const handleScroll = () => {
      if (hasTrackedViewContent) return; // 如果已经执行过，直接返回

      const mainElement = document.getElementById('main-content');
      if (mainElement) {
        const rect = mainElement.getBoundingClientRect();
        const distanceFromTop = rect.top;

        if (distanceFromTop < 100) {
          trackFBEvent('ViewContent');
          setHasTrackedViewContent(true);
        }
      }
    };

    
    window.addEventListener('scroll', handleScroll);
    // 初始检查，以防页面加载时就已经满足条件
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [hasTrackedViewContent]);

  const scrollToAdPreview = () => {
    const adPreviewElement = document.getElementById('ad-preview');
    if (adPreviewElement) {
      adPreviewElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  const adSets = useMemo(()=>[
    {
      platform: "Facebook",
      platformIcon:
        "https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/cff515252f51381638fd2b0c460416d19b699f1c?placeholderIfAbsent=true",
      text: "Facebook Feed",
      image: "/lovable-uploads/498e0b46-26ba-4ff7-b69e-b29799260ca1.png",
      mobileImage: "/lovable-uploads/1260d066-5d52-46d0-a544-79976440beaa.png",
      isCustom: true,
    },
    {
      platform: "Instagram",
      platformIcon:
        "https://cdn.lofty.com/image/fs/servicetool/2025712/9/original_36515aff44c0447f.png",
      text: "Instagram Feed",
      image: "/lovable-uploads/65c1ff62-09c1-4d69-9d3b-d5eaab84aa7e.png",
      mobileImage: "/lovable-uploads/22160aea-926a-4f27-8853-050716218fc5.png",
      isCustom: true,
    },
    {
      platform: "Facebook",
      platformIcon:
        "https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/cff515252f51381638fd2b0c460416d19b699f1c?placeholderIfAbsent=true",
      text: "Facebook Story",
      image: "/lovable-uploads/facebook-story-preview.png",
      mobileImage: "/lovable-uploads/facebook-story-mobile.png",
      isCustom: true,
    },
    {
      platform: "Instagram",
      platformIcon:
        "https://cdn.lofty.com/image/fs/servicetool/2025712/9/original_36515aff44c0447f.png",
      text: "Instagram Post",
      image: "/lovable-uploads/instagram-post-preview.png",
      mobileImage: "/lovable-uploads/instagram-post-mobile.png",
      isCustom: true,
    },
  ], []);

  const FacebookAdComponent = () => {
    if (viewMode === "mobile") {
      return (
        <div className="w-[189px] h-[375px] relative overflow-hidden max-md:w-[160px] max-md:h-[320px]">
          {/* Phone Frame */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/d5eea0ffa4cbe44d79c2b7176315fe8b471c1240?width=378"
            alt=""
            className="w-full h-full object-cover"
          />

          {/* Phone Screen Content */}
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/a700b84e2005edf75eecfbd0eb071ec062bb85f9?width=343"
            alt=""
            className="absolute left-[9px] top-[9px] w-[171px] h-[356px] rounded-[20.671px] object-cover max-md:left-[8px] max-md:top-[8px] max-md:w-[144px] max-md:h-[304px]"
          />

          {/* White Content Background */}
          <div className="absolute left-[9px] top-[44px] w-[171px] h-[301px] bg-white shadow-[0px_2.938px_8.814px_rgba(32,36,55,0.05)] max-md:left-[8px] max-md:top-[38px] max-md:w-[144px] max-md:h-[254px]">
            {/* Facebook Header */}
            <div className="absolute left-[8px] top-[10px] w-[155px] h-[22px]">
              {/* Profile Avatar */}
              <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-300 bg-white flex items-center justify-center">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>

              {/* User Info */}
              <div className="absolute left-[26px] top-0 w-[95px] h-[22px] flex flex-col gap-0.5">
                <div className="text-[8px] font-bold text-[#202437] leading-[12px] tracking-[-0.16px]">
                  LoftyBlast Ads
                </div>
                <div className="flex items-center gap-[2.952px]">
                  <span className="text-[8px] text-[#797E8B] leading-[8px]">
                    Sponsored
                  </span>
                  <svg
                    className="w-[2px] h-[2px]"
                    viewBox="0 0 3 2"
                    fill="none"
                  >
                    <circle cx="1.82422" cy="1" r="1" fill="#797E8B" />
                  </svg>
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/e9d9a7218fe3ee8fe40e61e01dea943e09659c2a?width=12"
                    alt=""
                    className="w-1.5 h-1.5"
                  />
                </div>
              </div>

              {/* Menu Dots */}
              <svg
                className="absolute right-0 top-0 w-[26px] h-[10px]"
                viewBox="0 0 26 10"
                fill="none"
              >
                <circle
                  cx="0.973452"
                  cy="4.79547"
                  r="0.737002"
                  fill="#1D1C1C"
                  fillOpacity="0.62"
                />
                <circle
                  cx="3.91693"
                  cy="4.79639"
                  r="0.737002"
                  fill="#1D1C1C"
                  fillOpacity="0.62"
                />
                <circle
                  cx="6.86041"
                  cy="4.7973"
                  r="0.737002"
                  fill="#1D1C1C"
                  fillOpacity="0.62"
                />
                <path
                  d="M19.1252 6.89203L21.2157 4.79642M23.3062 2.70081L21.2153 4.79642M21.2153 4.79642L19.1252 2.70081M21.2157 4.79642L23.3062 6.89203"
                  stroke="#737272"
                  strokeWidth="0.553427"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Content Text */}
            <div className="absolute left-[8px] top-[30px] w-[155px] h-[48px]">
              <p className="text-[8px] text-[#1C1E21] leading-[12px] mt-2">
                {getAdText()}
              </p>
            </div>

            {/* Property Card */}
            <div className="absolute left-[8px] top-[98px] w-[155px] h-[166px]">
              <div className="w-full h-full bg-[#F8F9FB] border-[0.396px] border-[#E3E3E6] rounded-[6px] overflow-hidden">
                <div className="relative w-full h-[130px] rounded-t-[5.903px] overflow-hidden">
              <img
                src={
                  selectedPreviewPicture ||
                  "https://cdn.builder.io/api/v1/image/assets/TEMP/97b02aa4e5f4ffc99b61c6047b9cca274743cb62?width=310"
                }
                alt=""
                className={`w-full h-full object-cover ${
                  (!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) ? 'filter blur-[2px]' : ''
                }`}
              />
              {(!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) && (
                <div className="absolute inset-0 bg-black bg-opacity-20 rounded-t-[5.903px]"></div>
              )}
            </div>
                <div className="absolute left-[5px] top-[136px] w-[145px] h-[24px]">
                  <div className="w-[102px] h-[24px] flex flex-col gap-[1.107px]">
                    <div className="text-[6px] font-bold text-black leading-[7.379px]">
                      Don't miss out on this new listing in...
                    </div>
                    <div className="text-[6px] text-[#797E8B] uppercase leading-[8px]">
                      FORM ON Facebook
                    </div>
                  </div>
                  <div className="absolute right-[0px] top-[6px] bg-[#DEE1E8] rounded-[2.214px] px-1 py-0.5 w-[38px] h-[12px] flex items-center justify-center">
                    <span className="text-[6px] font-medium text-[#0F1213] leading-[6px] whitespace-nowrap">
                      Learn More
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="absolute left-[18px] top-[283px] w-[135px] h-[10px]">
              {/* Like Button */}
              <div className="absolute left-0 top-0 w-[25px] h-[10px] flex items-center gap-3">
                <div className="w-[9px] h-[9px] relative">
                  <svg
                    className="absolute left-[3px] top-0 w-[6px] h-[8px]"
                    viewBox="0 0 8 10"
                    fill="none"
                  >
                    <path
                      d="M1.84383 2.91998C1.74132 4.56002 1.16048 5.05545 0.690674 5.09816V8.55761C1.30569 9.27513 1.58757 9.32638 2.10008 9.32638H4.66264C5.68766 9.42888 5.81579 8.68574 5.68766 8.0451C6.30268 7.9426 6.37101 7.14821 6.3283 6.76382C6.96894 6.37944 6.84082 5.61067 6.71269 5.22629C7.09707 4.07313 6.15747 3.77417 5.68766 3.81688H4.022C4.15013 1.76683 3.21052 1.12619 2.61259 1.12619C1.69007 1.12619 1.84383 2.27934 1.84383 2.91998Z"
                      stroke="#66676B"
                      strokeWidth="0.619736"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute left-0 top-[3px] w-[3px] h-[6px] border-[0.62px] border-[#66676B] rounded-[0.62px]"></div>
                </div>
                <span className="text-[6px] text-[#66676B] leading-[9.195px]">
                  Like
                </span>
              </div>

              {/* Comment Button */}
              <div className="absolute left-[44px] top-0 w-[43px] h-[10px] flex items-center gap-3">
                <div className="w-[9px] h-[9px] relative">
                  <svg
                    className="absolute left-0 top-0 w-[9px] h-[9px]"
                    viewBox="0 0 9 9"
                    fill="none"
                  >
                    <path
                      d="M1.90942 0.307281H7.31763C8.0589 0.307538 8.66025 0.908758 8.6604 1.65005V5.52017C8.6604 6.2616 8.059 6.86269 7.31763 6.86295H4.89868L4.81958 6.91763L2.68286 8.37955V6.86295H1.90942C1.16797 6.86279 0.56665 6.26166 0.56665 5.52017V1.65005C0.566804 0.908695 1.16806 0.307436 1.90942 0.307281Z"
                      stroke="#66676B"
                      strokeWidth="0.619736"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-[6px] text-[#66676B] leading-[9.195px]">
                  Comment
                </span>
              </div>

              {/* Share Button */}
              <div className="absolute right-0 top-0 w-[30px] h-[10px] flex items-center">
                <div className="w-[10px] h-[9px] relative">
                  <svg
                    className="absolute left-0 top-0 w-[10px] h-[9px]"
                    viewBox="0 0 9 9"
                    fill="none"
                  >
                    <path
                      d="M8.55566 4.09732L4.71973 7.50748V5.5817H4.41016C3.48956 5.5817 2.67476 5.97864 2.01367 6.48209C1.43679 6.92142 0.962725 7.45528 0.613281 7.91568C0.390396 6.09411 1.01299 4.83534 1.83789 4.01431C2.71689 3.13953 3.82662 2.75983 4.41992 2.74185L4.71973 2.73306V0.687164L8.55566 4.09732Z"
                      stroke="#66676B"
                      strokeWidth="0.619736"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span className="text-[6px] text-[#66676B] leading-[9.195px]">
                  Share
                </span>
              </div>
            </div>

            {/* Blue Progress Line */}
            <svg
              className="absolute left-[2px] top-[301px] w-[24px] h-0"
              viewBox="0 0 26 2"
              fill="none"
            >
              <path
                d="M1 1H25"
                stroke="#1679EF"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>

            {/* Border Lines */}
            <div className="absolute left-[15px] top-0 w-[156px] h-0 bg-[#E1E2E6]"></div>
            <div className="absolute left-0 top-[301px] w-full h-0 bg-[#E1E2E6]"></div>
          </div>
        </div>
      );
    }

    // PC端版本
    return (
      <div className="w-[calc(100vw-65px)] max-w-[390px] h-[366px] bg-white rounded-lg shadow-[0px_6px_20px_rgba(32,36,55,0.10)] flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center overflow-hidden">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
                  backgroundSize: "auto 100%",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>
            </div>
            <div className="flex flex-col">
              <h3 className="text-xs font-bold text-[#202437] leading-tight">
                LoftyBlast Ads
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-[#616770] leading-tight">
                <span>Sponsored</span>
                <div className="w-[3px] h-[3px] rounded-full bg-[#616770]"></div>
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/35f4bbd45c4c768682ba2057ae6673a6184a74dc?width=24"
                  alt=""
                  className="w-3 h-3"
                />
              </div>
            </div>
          </div>
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/10a7d5a3b62409ba4fdce1e5142ba2713e1b7840?width=88"
            alt=""
            className="w-11 h-4"
          />
        </div>

        {/* Content Text */}
        <div className="px-4 pb-3">
          <p className="text-[13px] text-[#1C1E21] leading-[16px]">
            {getAdText()}
          </p>
        </div>

        {/* Property Image */}
        <div className="px-4 pb-4 flex-1">
          <div className="w-full h-40 bg-[#F6F7FB] border border-[#EBECF1] rounded overflow-hidden relative">
            <img
              src={
                selectedPreviewPicture ||
                "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
              }
              alt="Modern white house with pool"
              className={`w-full h-full object-cover ${
                (!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) ? 'filter blur-[2px]' : ''
              }`}
            />
            {(!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) && (
              <div className="absolute inset-0 bg-black bg-opacity-20 rounded"></div>
            )}
          </div>

          {/* Content below image */}
          <div className="mt-3 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-bold text-[#202437] leading-tight">
                Don't miss out on this new listing in...
              </div>
              <div className="text-[8px] text-[#797E8B] uppercase leading-tight">
                FORM ON Facebook
              </div>
            </div>
            <button className="bg-[#F6F7FB] border border-[#C6C8D1] rounded px-2 py-1 text-[8px] font-bold text-[#202437] hover:bg-gray-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/0ad8cd6cd1bbad33b2345ef932c4fe63ff690bac?width=30"
                alt=""
                className="w-4 h-4"
              />
              <span className="text-[10px] font-bold text-[#616770]">Like</span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/90d0aa1ab5e7666f11ee52fb4e0e90e7fabbc3fb?width=30"
                alt=""
                className="w-4 h-4"
              />
              <span className="text-[10px] font-bold text-[#616770]">
                Comment
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const InstagramStoryComponent = () => {
    if (viewMode === "mobile") {
      return (
        <div
          className="w-[189px] h-[375px] relative bg-gray-50 rounded-[22px] overflow-hidden"
          style={{
            backgroundImage:
              "url('https://api.builder.io/api/v1/image/assets/TEMP/3b7ff16a914b547e49f39bc5de23af88ca2d7c1c?width=378')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-[9px] bg-white rounded-[20px] overflow-hidden shadow-[0px_2.938px_8.814px_rgba(32,36,55,0.05)]">
            {/* Background blur overlay */}
            <div className="absolute inset-0 rounded-[20px] overflow-hidden">
              <img
                src={
                  selectedPreviewPicture ||
                  "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
                }
                alt=""
                className="w-full h-full object-cover filter blur-[30px]"
              />
            </div>

            {/* Top image */}
            <div className="relative">
              <img
                src={
                  selectedPreviewPicture ||
                  "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
                }
                alt=""
                className="w-full h-[200px] object-cover rounded-t-[20px]"
              />
            </div>

            {/* Header Overlay */}
            <div
              className="absolute top-0 left-0 w-full h-[60px]"
              style={{
                background:
                  "linear-gradient(181deg, rgba(0, 0, 0, 0.70) -52.31%, rgba(255, 255, 255, 0.70) 99.53%)",
              }}
            >
              {/* Progress Bar */}
              <div className="flex px-2.5 pt-2.5">
                <div className="w-[100px] h-0.5 bg-white rounded-[1px]"></div>
                <div className="flex-1 h-0.5 bg-white/40 rounded-[1px]"></div>
              </div>

              <div className="flex items-center justify-between px-2 py-2 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage:
                          "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
                        backgroundSize: "auto 100%",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[8px] font-bold text-white leading-[12px] tracking-[-0.16px]">
                      LoftyBlast Ads
                    </div>
                    <div className="flex items-center gap-[3px]">
                      <div className="text-[6px] text-white">Sponsored</div>
                      <svg width="3" height="3" viewBox="0 0 3 3" fill="none">
                        <circle cx="1.87256" cy="1.5" r="1" fill="white" />
                      </svg>
                      <div className="text-[6px] text-white">Show 4 More</div>
                      <svg
                        width="6"
                        height="6"
                        viewBox="0 0 6 6"
                        fill="none"
                        className="transform -rotate-90"
                      >
                        <path
                          d="M4.08752 3.11249L2.47502 4.83749C2.46582 4.85431 2.45226 4.86834 2.43576 4.87812C2.41927 4.88789 2.40045 4.89305 2.38127 4.89305C2.3621 4.89305 2.34328 4.88789 2.32678 4.87812C2.31029 4.86834 2.29673 4.85431 2.28752 4.83749L1.91252 4.46249C1.89414 4.42784 1.88452 4.38921 1.88452 4.34999C1.88452 4.31077 1.89414 4.27214 1.91252 4.23749L3.07502 2.99999L1.91252 1.76249C1.89414 1.72784 1.88452 1.68922 1.88452 1.64999C1.88452 1.61077 1.89414 1.57214 1.91252 1.53749L2.28752 1.16249C2.31518 1.14371 2.34784 1.13367 2.38127 1.13367C2.4147 1.13367 2.44736 1.14371 2.47502 1.16249L4.08752 2.88749C4.10591 2.92214 4.11552 2.96077 4.11552 2.99999C4.11552 3.03922 4.10591 3.07784 4.08752 3.11249Z"
                          fill="white"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                <svg width="26" height="10" viewBox="0 0 26 10" fill="none">
                  <circle
                    cx="0.973452"
                    cy="4.79547"
                    r="0.737002"
                    fill="white"
                  />
                  <circle cx="3.91693" cy="4.79639" r="0.737002" fill="white" />
                  <circle cx="6.86041" cy="4.7973" r="0.737002" fill="white" />
                  <path
                    d="M19.1252 6.89203L21.2157 4.79642M23.3062 2.70081L21.2153 4.79642M21.2153 4.79642L19.1252 2.70081M21.2157 4.79642L23.3062 6.89203"
                    stroke="white"
                    strokeWidth="0.553427"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            {/* Content Text */}
            <div className="absolute bottom-16 left-2.5 right-2.5">
              <p className="text-[10px] font-bold text-[#1C1E21] leading-[14px] w-[151px]">
                {getAdText()}
              </p>
            </div>

            {/* Learn More Button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  className="absolute left-1/2 top-[-12px] transform -translate-x-1/2"
                >
                  <path
                    d="M6.22498 3.82502L9.67498 7.05002C9.70862 7.06843 9.73668 7.09555 9.75623 7.12854C9.77579 7.16153 9.7861 7.19917 9.7861 7.23752C9.7861 7.27586 9.77579 7.31351 9.75623 7.34649C9.73668 7.37948 9.70862 7.40661 9.67498 7.42502L8.92498 8.17502C8.85568 8.21179 8.77843 8.23102 8.69998 8.23102C8.62153 8.23102 8.54428 8.21179 8.47498 8.17502L5.99998 5.85002L3.52498 8.17502C3.45568 8.21179 3.37843 8.23102 3.29998 8.23102C3.22153 8.23102 3.14428 8.21179 3.07498 8.17502L2.32498 7.42502C2.28742 7.3697 2.26733 7.30438 2.26733 7.23752C2.26733 7.17065 2.28742 7.10533 2.32498 7.05002L5.77498 3.82502C5.84428 3.78824 5.92153 3.76902 5.99998 3.76902C6.07843 3.76902 6.15568 3.78824 6.22498 3.82502Z"
                    fill="white"
                  />
                </svg>
                <div className="bg-white rounded-[4px] px-3 py-1.5 flex items-center gap-2">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M5.58001 7.78118L6.17626 7.19619C6.36101 7.62991 6.41825 8.10733 6.34126 8.57243C6.25792 9.05014 6.02248 9.48814 5.67001 9.82118L4.17001 11.2837C3.94802 11.52 3.67655 11.7044 3.37501 11.8237C2.78506 12.0587 2.12747 12.0587 1.53752 11.8237C1.23281 11.7063 0.958509 11.5217 0.735017 11.2837C0.492476 11.0675 0.301535 10.7997 0.176267 10.4999C0.0586322 10.2014 -0.00117968 9.88327 1.76257e-05 9.56243C0.000845621 9.24907 0.060636 8.93867 0.176267 8.64743C0.297254 8.34353 0.4813 8.06874 0.716267 7.84118L2.19001 6.31494C2.41664 6.08868 2.68564 5.9093 2.98162 5.78705C3.2776 5.6648 3.59477 5.60206 3.91501 5.60244C4.09154 5.60201 4.26758 5.62087 4.44001 5.65869C4.61452 5.69938 4.78421 5.75846 4.94626 5.83494L4.35751 6.41994C4.28729 6.39848 4.21593 6.38095 4.14376 6.36744C4.06762 6.36173 3.99115 6.36173 3.91501 6.36744C3.69299 6.36582 3.47287 6.40843 3.26749 6.49277C3.0621 6.57711 2.87557 6.7015 2.71876 6.85869L1.24127 8.37743C1.08212 8.53042 0.956329 8.71466 0.871791 8.91859C0.787252 9.12251 0.745793 9.34171 0.750016 9.56243C0.746474 9.78472 0.788199 10.0054 0.872652 10.2111C0.957105 10.4167 1.08252 10.603 1.24127 10.7587C1.40149 10.9152 1.58811 11.0421 1.79252 11.1337C2.20571 11.3037 2.66932 11.3037 3.08251 11.1337C3.28692 11.0421 3.47353 10.9152 3.63376 10.7587L5.13376 9.29243C5.33548 9.09867 5.48066 8.85366 5.55376 8.58368C5.61949 8.32022 5.61949 8.04464 5.55376 7.78118H5.58001ZM3.46876 8.57993C3.43157 8.54799 3.40187 8.50824 3.38178 8.46352C3.36169 8.4188 3.35169 8.3702 3.35251 8.32118C3.35271 8.27067 3.3631 8.22071 3.38308 8.17432C3.40305 8.12792 3.4322 8.08604 3.46876 8.05118L8.00251 3.47995C8.03749 3.44365 8.07943 3.41478 8.12582 3.39507C8.17221 3.37535 8.2221 3.36519 8.2725 3.36519C8.32291 3.36519 8.3728 3.37535 8.41919 3.39507C8.46558 3.41478 8.50752 3.44365 8.54251 3.47995C8.57671 3.51365 8.60366 3.55399 8.62172 3.59848C8.63978 3.64297 8.64855 3.69069 8.6475 3.7387C8.64878 3.78841 8.64016 3.83789 8.62213 3.88424C8.6041 3.9306 8.57704 3.9729 8.54251 4.00869L3.99751 8.57993C3.95957 8.61668 3.91505 8.64594 3.86626 8.66618C3.82234 8.68492 3.77525 8.69511 3.72751 8.69618C3.67851 8.69559 3.6301 8.6854 3.58501 8.66618C3.53973 8.64749 3.49978 8.61785 3.46876 8.57993ZM11.2838 0.704955C11.521 0.929109 11.7055 1.20323 11.8238 1.50745C11.9405 1.80361 12.0002 2.11913 12 2.43745C11.9992 2.7508 11.9394 3.06121 11.8238 3.35245C11.7028 3.65634 11.5187 3.93114 11.2838 4.15869L9.78375 5.65869C9.55546 5.8901 9.28241 6.07256 8.98125 6.19494C8.68935 6.3132 8.37745 6.3743 8.06251 6.37494C7.90565 6.37489 7.749 6.36361 7.59376 6.34119C7.43286 6.32224 7.27521 6.28189 7.12501 6.22119L7.72126 5.62494H7.87501H8.04001C8.2626 5.62613 8.48317 5.58278 8.68876 5.49744C8.89432 5.41 9.08044 5.28252 9.23625 5.12244L10.7363 3.59995C10.8967 3.4515 11.025 3.27178 11.1134 3.07185C11.2018 2.87192 11.2482 2.65602 11.25 2.43745C11.2535 2.21516 11.2118 1.99447 11.1274 1.78882C11.0429 1.58317 10.9175 1.39685 10.7588 1.2412C10.5985 1.08471 10.4119 0.957759 10.2075 0.866205C9.79431 0.696181 9.3307 0.696181 8.9175 0.866205C8.7131 0.957759 8.52648 1.08471 8.36625 1.2412L6.86626 2.70745C6.64699 2.92354 6.49465 3.19825 6.42751 3.4987C6.36033 3.79128 6.37067 4.09633 6.45751 4.38369L5.86876 4.96869C5.65099 4.51811 5.57765 4.01128 5.65876 3.51745C5.7337 3.00856 5.97345 2.53828 6.34126 2.1787L7.84126 0.716205C8.06475 0.478153 8.33905 0.293574 8.64375 0.176207C9.23371 -0.0588169 9.8913 -0.0588169 10.4813 0.176207C10.7855 0.294481 11.0596 0.478933 11.2838 0.716205V0.704955Z"
                      fill="#537AB4"
                    />
                  </svg>
                  <span className="text-[12px] font-medium text-[#537AB4] leading-[16px] whitespace-nowrap">
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PC端版本
    return (
      <div className="w-[calc(100vw-65px)] max-w-[390px] h-[366px] bg-white rounded-lg shadow-[0px_6px_20px_rgba(32,36,55,0.10)] relative overflow-hidden">
        {/* Background container */}
        <div className="absolute inset-2 rounded-xl overflow-hidden bg-white">
          {/* Blurred background */}
          <img
            src={
              selectedPreviewPicture ||
              "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
            }
            alt=""
            className="absolute inset-0 w-full h-full object-cover blur-[30px] rounded-xl"
          />

          {/* Main property image */}
          <div className="absolute top-0 left-0 w-full h-[230px] rounded-t-lg overflow-hidden">
            <img
              src={
                selectedPreviewPicture ||
                "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
              }
              alt="Lakefront homes with reflection"
              className={`w-full h-full object-cover ${
                (!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) ? 'filter blur-[2px]' : ''
              }`}
            />
            {(!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) && (
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            )}
          </div>

          {/* Top gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-[90px] bg-gradient-to-b from-black/70 to-white/70 rounded-t-lg">
            {/* Progress bar */}
            <div className="absolute top-[10px] left-[10px] w-[350px] h-[2px]">
              <div className="w-full h-full bg-white/40 rounded-full"></div>
              <div className="absolute top-0 left-[1px] w-[121px] h-full bg-white rounded-full"></div>
            </div>

            {/* Header info */}
            <div className="absolute top-[22px] left-[10px] flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden bg-white flex items-center justify-center">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-white leading-tight">
                  LoftyBlast Ads
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-white leading-tight">
                  <span>Sponsored</span>
                  <div className="w-[1.3px] h-[1.3px] rounded-full bg-white"></div>
                  <span>Show 4 More</span>
                  <svg
                    className="w-2 h-2 rotate-90 fill-white ml-1"
                    viewBox="0 0 9 9"
                  >
                    <path d="M6.17712 4.5458L3.84437 7.0413C3.83105 7.06564 3.81143 7.08594 3.78757 7.10008C3.76371 7.11422 3.73648 7.12168 3.70874 7.12168C3.68101 7.12168 3.65378 7.11422 3.62992 7.10008C3.60606 7.08594 3.58644 7.06564 3.57312 7.0413L3.03062 6.4988C3.00402 6.44868 2.99011 6.3928 2.99011 6.33605C2.99011 6.27931 3.00402 6.22343 3.03062 6.1733L4.71237 4.38305L3.03062 2.5928C3.00402 2.54268 2.99011 2.4868 2.99011 2.43005C2.99011 2.37331 3.00402 2.31743 3.03062 2.2673L3.57312 1.7248C3.61313 1.69763 3.66038 1.68311 3.70874 1.68311C3.75711 1.68311 3.80436 1.69763 3.84437 1.7248L6.17712 4.2203C6.20372 4.27043 6.21763 4.32631 6.21763 4.38305C6.21763 4.4398 6.20372 4.49568 6.17712 4.5458Z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Close and menu buttons */}
            <div className="absolute top-[22px] right-[10px]">
              <svg className="w-8 h-3 fill-white" viewBox="0 0 32 12">
                <path d="M27.2811 5.64702L31.1 1.82467C31.2099 1.69917 31.2678 1.53655 31.2622 1.36984C31.2565 1.20313 31.1876 1.04484 31.0694 0.927111C30.9512 0.809385 30.7927 0.741061 30.6259 0.736018C30.4592 0.730975 30.2968 0.789593 30.1717 0.899961L26.3529 4.71878L22.5341 0.899961C22.409 0.789593 22.2466 0.730975 22.0799 0.736018C21.9131 0.741061 21.7546 0.809385 21.6364 0.927111C21.5182 1.04484 21.4493 1.20313 21.4436 1.36984C21.438 1.53655 21.496 1.69917 21.6058 1.82467L25.4247 5.64702L21.6058 9.46937C21.5385 9.52876 21.4841 9.60133 21.446 9.68258C21.4078 9.76382 21.3867 9.85203 21.384 9.94175C21.3813 10.0315 21.397 10.1208 21.4302 10.2042C21.4634 10.2876 21.5133 10.3633 21.5769 10.4267C21.6405 10.49 21.7164 10.5397 21.7999 10.5725C21.8835 10.6054 21.9728 10.6207 22.0625 10.6177C22.1523 10.6146 22.2404 10.5932 22.3215 10.5548C22.4026 10.5163 22.4749 10.4616 22.5341 10.3941L26.3529 6.57525L30.1717 10.3941C30.2326 10.4557 30.3052 10.5046 30.3852 10.538C30.4651 10.5713 30.551 10.5884 30.6376 10.5882C30.7669 10.5875 30.8931 10.5486 31.0004 10.4764C31.1077 10.4042 31.1913 10.302 31.2406 10.1825C31.29 10.063 31.303 9.93153 31.278 9.80467C31.253 9.67781 31.191 9.56116 31.1 9.46937L27.2811 5.64702Z" />
                <path d="M1.05882 4.58826C0.849409 4.58826 0.644696 4.65036 0.470573 4.7667C0.296451 4.88305 0.160738 5.04841 0.0805986 5.24189C0.000458773 5.43536 -0.0205095 5.64826 0.0203455 5.85365C0.0612004 6.05904 0.162044 6.2477 0.310123 6.39578C0.458202 6.54386 0.646866 6.6447 0.852258 6.68556C1.05765 6.72641 1.27054 6.70545 1.46402 6.62531C1.65749 6.54517 1.82286 6.40945 1.9392 6.23533C2.05555 6.06121 2.11765 5.8565 2.11765 5.64708C2.11765 5.36626 2.00609 5.09695 1.80753 4.89838C1.60896 4.69981 1.33964 4.58826 1.05882 4.58826ZM4.70588 4.58826C4.49647 4.58826 4.29175 4.65036 4.11763 4.7667C3.94351 4.88305 3.8078 5.04841 3.72766 5.24189C3.64752 5.43536 3.62655 5.64826 3.6674 5.85365C3.70826 6.05904 3.8091 6.2477 3.95718 6.39578C4.10526 6.54386 4.29393 6.6447 4.49932 6.68556C4.70471 6.72641 4.9176 6.70545 5.11108 6.62531C5.30455 6.54517 5.46992 6.40945 5.58626 6.23533C5.70261 6.06121 5.76471 5.8565 5.76471 5.64708C5.76471 5.36626 5.65315 5.09695 5.45458 4.89838C5.25602 4.69981 4.9867 4.58826 4.70588 4.58826ZM8.35294 4.58826C8.14353 4.58826 7.93881 4.65036 7.76469 4.7667C7.59057 4.88305 7.45486 5.04841 7.37472 5.24189C7.29458 5.43536 7.27361 5.64826 7.31446 5.85365C7.35532 6.05904 7.45616 6.2477 7.60424 6.39578C7.75232 6.54386 7.94098 6.6447 8.14638 6.68556C8.35177 6.72641 8.56466 6.70545 8.75814 6.62531C8.95161 6.54517 9.11698 6.40945 9.23332 6.23533C9.34967 6.06121 9.41177 5.8565 9.41177 5.64708C9.41177 5.36626 9.30021 5.09695 9.10164 4.89838C8.90308 4.69981 8.63376 4.58826 8.35294 4.58826Z" />
              </svg>
            </div>
          </div>

          {/* Property description text */}
          <div className="absolute bottom-[74px] left-[10px]">
            <p className="text-[11px] font-bold text-[#1C1E21] leading-[14px]">
              {getAdText()}
            </p>
          </div>

          {/* Learn more CTA */}
          <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute -top-[13px] left-1/2 transform -translate-x-1/2">
                <svg className="w-3 h-3 fill-white" viewBox="0 0 12 12">
                  <path d="M6.22498 3.82496L9.67498 7.04996C9.70862 7.06837 9.73668 7.09549 9.75623 7.12848C9.77579 7.16147 9.7861 7.19911 9.7861 7.23746C9.7861 7.2758 9.77579 7.31344 9.75623 7.34643C9.73668 7.37942 9.70862 7.40654 9.67498 7.42496L8.92498 8.17496C8.85568 8.21173 8.77843 8.23096 8.69998 8.23096C8.62153 8.23096 8.54428 8.21173 8.47498 8.17496L5.99998 5.84996L3.52498 8.17496C3.45568 8.21173 3.37843 8.23096 3.29998 8.23096C3.22153 8.23096 3.14428 8.21173 3.07498 8.17496L2.32498 7.42496C2.28742 7.36964 2.26733 7.30432 2.26733 7.23746C2.26733 7.17059 2.28742 7.10527 2.32498 7.04996L5.77498 3.82496C5.84428 3.78818 5.92153 3.76895 5.99998 3.76895C6.07843 3.76895 6.15568 3.78818 6.22498 3.82496Z" />
                </svg>
              </div>

              <div className="bg-white rounded px-3 py-2 flex items-center gap-2">
                <svg
                  className="w-[14px] h-[14px] fill-[#537AB4]"
                  viewBox="0 0 14 14"
                >
                  <path d="M6.51001 9.07812L7.20563 8.39562C7.42118 8.90163 7.48796 9.45862 7.39813 10.0012C7.30091 10.5586 7.02622 11.0696 6.61501 11.4581L4.86501 13.1644C4.60602 13.4401 4.28931 13.6552 3.93751 13.7944C3.24924 14.0685 2.48205 14.0685 1.79377 13.7944C1.43828 13.6574 1.11826 13.4421 0.857519 13.1644C0.574556 12.9122 0.351791 12.5997 0.205645 12.25C0.0684042 11.9017 -0.00137629 11.5306 2.05634e-05 11.1562C0.000986557 10.7907 0.070742 10.4285 0.205645 10.0887C0.346796 9.73419 0.561517 9.4136 0.835644 9.14812L2.55502 7.3675C2.81942 7.10354 3.13324 6.89426 3.47855 6.75163C3.82387 6.609 4.1939 6.53581 4.56751 6.53625C4.77346 6.53574 4.97885 6.55775 5.18001 6.60188C5.3836 6.64935 5.58158 6.71828 5.77064 6.8075L5.08376 7.49C5.00184 7.46497 4.91859 7.44452 4.83439 7.42875C4.74555 7.42209 4.65635 7.42209 4.56751 7.42875C4.30849 7.42686 4.05168 7.47657 3.81207 7.57497C3.57245 7.67337 3.35483 7.81849 3.17189 8.00187L1.44814 9.77374C1.26247 9.95223 1.11572 10.1672 1.01709 10.4051C0.918461 10.643 0.870091 10.8987 0.875019 11.1562C0.870886 11.4156 0.919565 11.673 1.01809 11.913C1.11662 12.1529 1.26294 12.3703 1.44814 12.5519C1.63508 12.7344 1.8528 12.8825 2.09127 12.9894C2.57333 13.1877 3.11421 13.1877 3.59626 12.9894C3.83474 12.8825 4.05246 12.7344 4.23939 12.5519L5.98939 10.8412C6.22472 10.6152 6.39411 10.3293 6.47939 10.0144C6.55608 9.707 6.55608 9.38549 6.47939 9.07812H6.51001ZM4.04689 10.01C4.0035 9.97272 3.96885 9.92635 3.94541 9.87418C3.92197 9.82201 3.91031 9.76531 3.91126 9.70812C3.91149 9.64918 3.92362 9.5909 3.94692 9.53677C3.97023 9.48264 4.00423 9.43378 4.04689 9.39312L9.33626 4.06001C9.37707 4.01767 9.426 3.98399 9.48012 3.96098C9.53424 3.93798 9.59245 3.92612 9.65126 3.92612C9.71006 3.92612 9.76827 3.93798 9.82239 3.96098C9.87651 3.98399 9.92544 4.01767 9.96626 4.06001C10.0062 4.09933 10.0376 4.14639 10.0587 4.1983C10.0797 4.25021 10.09 4.30587 10.0888 4.36188C10.0902 4.41989 10.0802 4.47761 10.0592 4.53169C10.0381 4.58577 10.0065 4.63512 9.96626 4.67688L4.66376 10.01C4.6195 10.0529 4.56755 10.087 4.51064 10.1106C4.4594 10.1325 4.40446 10.1444 4.34876 10.1456C4.29159 10.1449 4.23511 10.133 4.18251 10.1106C4.12968 10.0888 4.08308 10.0542 4.04689 10.01ZM13.1644 0.822519C13.4412 1.08403 13.6564 1.40383 13.7944 1.75877C13.9305 2.10428 14.0003 2.47238 14 2.84376C13.999 3.20934 13.9293 3.57148 13.7944 3.91126C13.6532 4.26581 13.4385 4.5864 13.1644 4.85188L11.4144 6.60188C11.148 6.87186 10.8295 7.08473 10.4781 7.2275C10.1376 7.36547 9.7737 7.43676 9.40626 7.4375C9.22326 7.43745 9.0405 7.42429 8.85938 7.39812C8.67167 7.37602 8.48775 7.32894 8.31251 7.25812L9.00813 6.5625H9.18751H9.38001C9.63969 6.56389 9.89703 6.51332 10.1369 6.41375C10.3767 6.31174 10.5938 6.16302 10.7756 5.97625L12.5256 4.20001C12.7128 4.02682 12.8626 3.81715 12.9656 3.5839C13.0687 3.35065 13.123 3.09877 13.125 2.84376C13.1291 2.58442 13.0805 2.32696 12.9819 2.08703C12.8834 1.8471 12.7371 1.62973 12.5519 1.44814C12.3649 1.26557 12.1472 1.11746 11.9088 1.01064C11.4267 0.812283 10.8858 0.812283 10.4038 1.01064C10.1653 1.11746 9.94756 1.26557 9.76063 1.44814L8.01063 3.15876C7.75482 3.41086 7.5771 3.73137 7.49876 4.08188C7.42038 4.42323 7.43245 4.77912 7.53376 5.11438L6.84688 5.79688C6.59282 5.2712 6.50726 4.6799 6.60189 4.10376C6.68931 3.51005 6.96902 2.9614 7.39813 2.54189L9.14813 0.835644C9.40887 0.557917 9.7289 0.342575 10.0844 0.205646C10.7727 -0.0685486 11.5398 -0.0685486 12.2281 0.205646C12.5831 0.343632 12.9029 0.558827 13.1644 0.835644V0.822519Z" />
                </svg>
                <span className="text-[14px] font-medium text-[#537AB4]">
                  Learn more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DarkStoryComponent = () => {
    if (viewMode === "mobile") {
      return (
        <div
          className="w-[189px] h-[375px] relative bg-gray-50 rounded-[22px] overflow-hidden"
          style={{
            backgroundImage:
              "url('https://api.builder.io/api/v1/image/assets/TEMP/92c92a5357c91843463c4a7d503bbb60964ec875?width=378')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-[9px] bg-white rounded-[20px] overflow-hidden shadow-[0px_2.938px_8.814px_rgba(32,36,55,0.05)]">
            {/* Dark background container */}
            <div className="absolute inset-0 rounded-[20px] overflow-hidden bg-[#4B4D5B]">
              {/* Property image */}
              <img
                src={
                  selectedPreviewPicture ||
                  "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
                }
                alt="Lakefront homes"
                className="absolute left-0 top-[52px] w-full h-[150px] object-cover"
              />

              {/* Header section */}
              <div className="absolute top-[10px] left-[8px] w-[154px] h-[32px]">
                {/* Progress bar */}
                <div className="absolute top-0 left-[2px] w-[151px] h-[2px]">
                  <div className="w-full h-full bg-white/40 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-[100px] h-full bg-white rounded-full"></div>
                </div>

                {/* Profile section */}
                <div className="absolute top-[11px] left-0 flex items-center gap-2">
                  {/* Avatar */}
                  <div className="w-5 h-5 rounded-full bg-white overflow-hidden flex items-center justify-center">
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundImage:
                          "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
                        backgroundSize: "auto 100%",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  </div>

                  {/* Profile info */}
                  <div className="flex flex-col gap-0.5">
                    <div className="text-[8px] font-bold text-white leading-[12px] tracking-[-0.16px]">
                      LoftyBlast Ads
                    </div>
                    <div className="flex items-center gap-[3px]">
                      <div className="text-[6px] text-white">Sponsored</div>
                      <svg width="3" height="3" viewBox="0 0 3 3" fill="none">
                        <circle cx="1.87262" cy="1.5" r="1" fill="white" />
                      </svg>
                      <svg width="5" height="5" viewBox="0 0 5 5" fill="none">
                        <path
                          d="M4.12262 2.5L1.62262 0.5L1.62262 4.5L4.12262 2.5Z"
                          fill="white"
                        />
                      </svg>
                      <div className="text-[6px] text-white">Expand story</div>
                    </div>
                  </div>
                </div>

                {/* Close and menu buttons */}
                <div className="absolute top-0 right-0">
                  <svg
                    width="26"
                    height="10"
                    viewBox="0 0 26 10"
                    fill="none"
                    className="relative top-[13px]"
                  >
                    <circle
                      cx="0.973513"
                      cy="4.79547"
                      r="0.737002"
                      fill="white"
                    />
                    <circle
                      cx="3.91706"
                      cy="4.79639"
                      r="0.737002"
                      fill="white"
                    />
                    <circle
                      cx="6.86051"
                      cy="4.7973"
                      r="0.737002"
                      fill="white"
                    />
                    <path
                      d="M19.1252 6.89203L21.2157 4.79642M23.3062 2.70081L21.2153 4.79642M21.2153 4.79642L19.1252 2.70081M21.2157 4.79642L23.3062 6.89203"
                      stroke="white"
                      strokeWidth="0.553427"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Property description text */}
              <div className="absolute top-[220px] left-[10px] w-[151px]">
                <p className="text-[10px] font-bold text-white leading-[14px]">
                  {getAdText()}
                </p>
              </div>

              {/* Learn more CTA */}
              <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
                <div className="relative">
                  {/* Up arrow */}
                  <div className="absolute -top-[12px] left-1/2 transform -translate-x-1/2">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path
                        d="M5 2.91876L0.715629 7.18751C0.657425 7.24606 0.624756 7.32527 0.624756 7.40782C0.624756 7.49038 0.657425 7.56959 0.715629 7.62814C0.74468 7.65743 0.779242 7.68068 0.817323 7.69654C0.855404 7.71241 0.89625 7.72057 0.937504 7.72057C0.978757 7.72057 1.0196 7.71241 1.05768 7.69654C1.09576 7.68068 1.13033 7.65743 1.15938 7.62814L5 3.80001L8.84063 7.62189C8.90019 7.67028 8.97547 7.69507 9.05213 7.69153C9.12878 7.68798 9.20146 7.65636 9.2563 7.60268C9.31114 7.549 9.34431 7.47701 9.34949 7.40045C9.35467 7.32388 9.33149 7.24809 9.28438 7.18751L5 2.91876Z"
                        fill="white"
                      />
                    </svg>
                  </div>

                  {/* CTA Button */}
                  <div className="bg-white rounded-[24px] px-2 py-1.5 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-[#202437] leading-[16px]">
                      Learn more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // PC端版本
    return (
      <div className="w-[calc(100vw-65px)] max-w-[390px] h-[366px] bg-white rounded-lg shadow-[0px_6px_20px_rgba(32,36,55,0.10)] relative overflow-hidden">
        {/* Dark background container */}
        <div className="absolute inset-2 rounded-xl overflow-hidden bg-[#4B4D5B]">
          {/* Property image */}
          <div className="absolute left-0 top-[60px] w-full h-[180px] overflow-hidden">
            <img
              src={
                selectedPreviewPicture ||
                "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
              }
              alt="Lakefront homes with reflection"
              className={`w-full h-full object-cover ${
                (!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) ? 'filter blur-[2px]' : ''
              }`}
            />
            {(!selectedPreviewPicture || selectedPreviewPicture.indexOf('cdn.builder.io') > -1) && (
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            )}
          </div>

          {/* Header section */}
          <div className="absolute top-[18px] left-[9px] right-[9px] h-[42px]">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 w-[354px] h-[2px]">
              <div className="w-full h-full bg-white/40 rounded-full"></div>
              <div className="absolute top-0 left-[1px] w-[121px] h-full bg-white rounded-full"></div>
            </div>

            {/* Profile section */}
            <div className="absolute top-[12px] left-0 flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-full bg-white overflow-hidden flex items-center justify-center">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage:
                      "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
                    backgroundSize: "auto 100%",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
              </div>

              <div className="flex flex-col">
                <h3 className="text-xs font-bold text-white leading-tight">
                  LoftyBlast Ads
                </h3>
                <div className="flex items-center gap-1 text-[11px] text-white leading-tight">
                  <span>Sponsored</span>
                  <div className="w-[1.3px] h-[1.3px] rounded-full bg-white"></div>
                  <svg className="w-[6px] h-[6px] fill-white" viewBox="0 0 7 7">
                    <path d="M5.15515 3.5L1.40515 0.5L1.40515 6.5L5.15515 3.5Z" />
                  </svg>
                  <span>Expand story</span>
                </div>
              </div>
            </div>

            {/* Close and menu buttons */}
            <div className="absolute top-[12px] right-0">
              <svg className="w-8 h-3 fill-white" viewBox="0 0 32 12">
                <path d="M27.2812 5.64702L31.1 1.82467C31.2099 1.69917 31.2679 1.53655 31.2622 1.36984C31.2565 1.20313 31.1876 1.04484 31.0694 0.927111C30.9512 0.809385 30.7927 0.741061 30.626 0.736018C30.4592 0.730975 30.2968 0.789593 30.1718 0.899961L26.3529 4.71878L22.5341 0.899961C22.409 0.789593 22.2466 0.730975 22.0799 0.736018C21.9132 0.741061 21.7546 0.809385 21.6364 0.927111C21.5183 1.04484 21.4493 1.20313 21.4437 1.36984C21.438 1.53655 21.496 1.69917 21.6059 1.82467L25.4247 5.64702L21.6059 9.46937C21.5386 9.52876 21.4842 9.60133 21.446 9.68258C21.4079 9.76382 21.3868 9.85203 21.3841 9.94175C21.3813 10.0315 21.3971 10.1208 21.4302 10.2042C21.4634 10.2876 21.5133 10.3633 21.5769 10.4267C21.6405 10.49 21.7164 10.5397 21.8 10.5725C21.8835 10.6054 21.9729 10.6207 22.0626 10.6177C22.1523 10.6146 22.2404 10.5932 22.3215 10.5548C22.4026 10.5163 22.475 10.4616 22.5341 10.3941L26.3529 6.57525L30.1718 10.3941C30.2326 10.4557 30.3052 10.5046 30.3852 10.538C30.4652 10.5713 30.551 10.5884 30.6376 10.5882C30.7669 10.5875 30.8932 10.5486 31.0004 10.4764C31.1077 10.4042 31.1913 10.302 31.2407 10.1825C31.2901 10.063 31.3031 9.93153 31.278 9.80467C31.253 9.67781 31.1911 9.56116 31.1 9.46937L27.2812 5.64702Z" />
                <path d="M1.05882 4.58826C0.849409 4.58826 0.644696 4.65036 0.470573 4.7667C0.296451 4.88305 0.160738 5.04841 0.0805986 5.24189C0.000458773 5.43536 -0.0205095 5.64826 0.0203455 5.85365C0.0612004 6.05904 0.162044 6.2477 0.310123 6.39578C0.458202 6.54386 0.646866 6.6447 0.852258 6.68556C1.05765 6.72641 1.27054 6.70545 1.46402 6.62531C1.65749 6.54517 1.82286 6.40945 1.9392 6.23533C2.05555 6.06121 2.11765 5.8565 2.11765 5.64708C2.11765 5.36626 2.00609 5.09695 1.80753 4.89838C1.60896 4.69981 1.33964 4.58826 1.05882 4.58826ZM4.70588 4.58826C4.49647 4.58826 4.29175 4.65036 4.11763 4.7667C3.94351 4.88305 3.8078 5.04841 3.72766 5.24189C3.64752 5.43536 3.62655 5.64826 3.6674 5.85365C3.70826 6.05904 3.8091 6.2477 3.95718 6.39578C4.10526 6.54386 4.29393 6.6447 4.49932 6.68556C4.70471 6.72641 4.9176 6.70545 5.11108 6.62531C5.30455 6.54517 5.46992 6.40945 5.58626 6.23533C5.70261 6.06121 5.76471 5.8565 5.76471 5.64708C5.76471 5.36626 5.65315 5.09695 5.45458 4.89838C5.25602 4.69981 4.9867 4.58826 4.70588 4.58826ZM8.35294 4.58826C8.14353 4.58826 7.93881 4.65036 7.76469 4.7667C7.59057 4.88305 7.45486 5.04841 7.37472 5.24189C7.29458 5.43536 7.27361 5.64826 7.31446 5.85365C7.35532 6.05904 7.45616 6.2477 7.60424 6.39578C7.75232 6.54386 7.94098 6.6447 8.14638 6.68556C8.35177 6.72641 8.56466 6.70545 8.75814 6.62531C8.95161 6.54517 9.11698 6.40945 9.23332 6.23533C9.34967 6.06121 9.41177 5.8565 9.41177 5.64708C9.41177 5.36626 9.30021 5.09695 9.10164 4.89838C8.90308 4.69981 8.63376 4.58826 8.35294 4.58826Z" />
              </svg>
            </div>
          </div>

          {/* Property description text */}
          <div className="absolute bottom-[64px] left-[10px]">
            <p className="text-[11px] font-semibold text-white leading-[14px]">
              {getAdText()}
            </p>
          </div>

          {/* Learn more CTA */}
          <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2">
            <div className="relative">
              <div className="absolute -top-[13px] left-1/2 transform -translate-x-1/2">
                <svg className="w-3 h-3 fill-white" viewBox="0 0 14 13">
                  <path d="M7.00001 3.52136L1.83104 8.67148C1.76082 8.74212 1.72141 8.83767 1.72141 8.93728C1.72141 9.03688 1.76082 9.13244 1.83104 9.20308C1.86609 9.23842 1.90779 9.26646 1.95373 9.2856C1.99968 9.30475 2.04895 9.3146 2.09873 9.3146C2.1485 9.3146 2.19778 9.30475 2.24372 9.2856C2.28966 9.26646 2.33136 9.23842 2.36641 9.20308L7.00001 4.58456L11.6336 9.19554C11.7055 9.25392 11.7963 9.28383 11.8888 9.27956C11.9813 9.27528 12.0689 9.23713 12.1351 9.17236C12.2013 9.1076 12.2413 9.02075 12.2475 8.92838C12.2538 8.836 12.2258 8.74456 12.169 8.67148L7.00001 3.52136Z" />
                </svg>
              </div>

              <div className="bg-white rounded-full px-4 py-1.5 flex items-center justify-center">
                <span className="text-[12px] font-semibold text-[#202437]">
                  Learn more
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handlePrevious = () => {
    setCurrentSetIndex((prev) => (prev === 0 ? adSets.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSetIndex((prev) => (prev === adSets.length - 1 ? 0 : prev + 1));
  };

  const currentSet = adSets[currentSetIndex];

  return (
    <div key={refreshKey} className="flex flex-col overflow-hidden items-stretch bg-[#EBEFFC] max-md:pb-20">
      <PurchaseNotification listingCity={listingCity} />
      <Hero
        page={page}
        listingId={listingId}
        onAddressSelect={handleAddressSelect}
        onScrollToAdPreview={scrollToAdPreview}
        onCityUpdate={handleCityUpdate}
      />

      <main id="main-content" className="border shadow-[0px_0px_5px_0px_rgba(32,36,55,0.05)] bg-white self-center z-10 flex mt-[20px] w-full max-w-[1240px] flex-col items-center py-[45px] border-solid border-[#EBECF1] max-md:max-w-full mb-[20px] max-[1240px]:mt-0 max-[1240px]:pt-0 max-md:mt-[20px] max-md:pb-[20px] max-md:mx-4 max-md:rounded-xl">
        <div className="w-full max-w-[1140px] max-md:max-w-full max-md:px-4">
          <div className="gap-5 flex max-md:flex-col items-stretch max-md:gap-8">
            {!isMobile && (
              <PropertySetup
                listingId={listingId}
                onAddressSelect={handleAddressSelect}
                onScrollToAdPreview={scrollToAdPreview}
                onCityUpdate={handleCityUpdate}
                onMethodsReady={setChildMethods}
              />
            )}

            <section className="w-6/12 ml-5 max-md:w-full max-md:ml-0 flex max-md:hidden">
              <div className="flex flex-col items-center bg-[#F6F7FB] mx-auto px-[30px] py-4 rounded-xl max-md:max-w-full max-md:mt-0 max-md:px-4 max-md:mx-0 flex-1 overflow-hidden relative max-md:bg-gray-50">
                {/* Zoom Icon - Only show on mobile view */}
                {viewMode === "mobile" && (
                  <button
                    onClick={() => setIsZoomModalOpen(true)}
                    className="absolute top-2 right-12 z-20 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
                    aria-label="Zoom preview"
                  >
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                {/* Device Toggle Icons */}
                <div className="flex items-center gap-2 mb-4 mt-2 z-20 max-md:mb-6">
                  <button
                    onClick={() => setViewMode("desktop")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "desktop"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-label="Desktop view"
                  >
                    <Monitor className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setViewMode("mobile")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "mobile"
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                    aria-label="Mobile view"
                  >
                    <Smartphone className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-2 md:top-1/2 md:transform md:-translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-lg transition-all duration-200 max-md:left-1 max-md:top-16"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3B5CDE";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "#6b7280";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = "#3B5CDE";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "#ffffff";
                  }}
                  aria-label="Previous ad theme"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600 transition-colors duration-200" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-2 top-2 md:top-1/2 md:transform md:-translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-lg hover:shadow-lg transition-all duration-200 max-md:right-1 max-md:top-16"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3B5CDE";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "#6b7280";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.backgroundColor = "#3B5CDE";
                    const icon = e.currentTarget.querySelector("svg");
                    if (icon) icon.style.color = "#ffffff";
                  }}
                  aria-label="Next ad theme"
                >
                  <ChevronRight className="w-5 h-5 text-gray-600 transition-colors duration-200" />
                </button>

                <div className="flex-1 flex flex-col items-center justify-center w-full">
                  {currentSet.isCustom && currentSetIndex === 0 ? (
                    <FacebookAdComponent />
                  ) : currentSet.isCustom && currentSetIndex === 1 ? (
                    <InstagramStoryComponent />
                  ) : currentSet.isCustom && currentSetIndex === 2 ? (
                    <DarkStoryComponent />
                  ) : currentSet.isCustom && currentSetIndex === 3 ? (
                    <InstagramPostComponent
                      imageUrl={
                        selectedPreviewPicture ||
                        "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
                      }
                      viewMode={viewMode}
                      isSelectedProperty={!!selectedPreviewPicture && selectedPreviewPicture.indexOf('cdn.builder.io') === -1}
                    />
                  ) : (
                    <img
                      src={
                        viewMode === "mobile"
                          ? currentSet.mobileImage
                          : currentSet.image
                      }
                      className="w-[calc(100vw-65px)] max-w-[390px] h-[366px] object-contain transition-opacity duration-300 max-md:w-full max-md:max-w-[350px] max-md:h-[300px]"
                      alt={`${currentSet.text} Ad Preview`}
                    />
                  )}

                  <div className="flex items-center gap-2 text-sm text-[rgba(81,86,102,1)] font-normal uppercase leading-none mt-4 max-md:text-xs max-md:gap-1">
                    <img
                      src={currentSet.platformIcon}
                      className="aspect-[1] object-contain w-4 shrink-0"
                      alt={currentSet.platform}
                    />
                    <span>{currentSet.text}</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <PackageSelection
          isEditingAd={isEditingAd}
          isCustomListing={isCustomListing}
          customAddress={currentListingData?.address}
          addressName={addressName}
          previewPicture={currentListingData?.previewPicture}
          selectedAddressId={selectedAddressId}
          promoEmail={promoEmail}
          promoCode={promoCode}
          discountRate={discountRate}
          promoActive={promoActive}
          onScrollToAdPreview={scrollToAdPreview}
          updateIsEditingAd={setIsEditingAd}
          onOpenCongratulationsModal={async (email, promise) => {
            setCongratulationsEmail(email);
            setIsCongratulationsModalOpen(true);
            refreshWithKey();
            await promise
            reloadPromo()
          }}
          updateAdInfo={(data) => {
            setIsEditingAd(!data.done);
            setSelectedPreviewPicture(data?.imageUrl)
          }}
        />
      </main>

      <ClientTestimonials />
      {page === 'listing' && <FrequentlyAskedQuestions />}
      <ContactFooter />

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden relative flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-4 right-4 z-30 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
              aria-label="Close zoom view"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Modal content */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 min-h-[550px]">
              {currentSet.isCustom && currentSetIndex === 0 ? (
                <div className="scale-[1.38] origin-center">
                  <FacebookAdComponent />
                </div>
              ) : currentSet.isCustom && currentSetIndex === 1 ? (
                <div className="scale-[1.38] origin-center">
                  <InstagramStoryComponent />
                </div>
              ) : currentSet.isCustom && currentSetIndex === 2 ? (
                <div className="scale-[1.38] origin-center">
                  <DarkStoryComponent />
                </div>
              ) : currentSet.isCustom && currentSetIndex === 3 ? (
                <div className="scale-[1.38] origin-center">
                  <InstagramPostComponent
                    imageUrl={selectedPreviewPicture}
                    viewMode={viewMode}
                    isSelectedProperty={!!selectedPreviewPicture}
                  />
                </div>
              ) : (
                <img
                  src={
                    viewMode === "mobile"
                      ? currentSet.mobileImage
                      : currentSet.image
                  }
                  className="w-[535px] h-[504px] object-contain transition-opacity duration-300"
                  alt={`${currentSet.text} Ad Preview - Enlarged`}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <CongratulationsModal
        open={isCongratulationsModalOpen}
        onOpenChange={setIsCongratulationsModalOpen}
        email={congratulationsEmail}
      />
    </div>
  );
};

export default Index;
