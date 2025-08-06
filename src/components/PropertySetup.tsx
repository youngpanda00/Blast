import React, { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Bed, Bath, Square, CheckCircle, Search } from "lucide-react";
import { useListingInfo } from "@/hooks/use-listing-info";

interface PropertySetupProps {
  listingId?: string | null;
  onAddressSelect?: (addressData: any) => void;
  onCityUpdate?: (city: string | null) => void;
}

export const PropertySetup: React.FC<PropertySetupProps> = ({
  listingId,
  onAddressSelect: externalOnAddressSelect,
  onCityUpdate,
}) => {
  const [addressInput, setAddressInput] = useState("");
  const [autoFilledData, setAutoFilledData] = useState<{
    baths?: number;
    beds?: number;
    previewPicture?: string;
    sqft?: number;
  } | null>(null);

  // Track if user has manually selected an address to prevent overriding
  const [hasUserSelectedAddress, setHasUserSelectedAddress] = useState(false);

  const [parsedAddress, setParsedAddress] = useState<{
    streetAddress?: string;
    cityStateZip?: string;
  } | null>(null);

  const [listingLabels, setListingLabels] = useState<string[]>([
    "School District",
    "Water View",
    "Brand New Home"
  ]);

  const searchParams = new URLSearchParams(window.location.search);
  const { data: listingInfo, isLoading, error } = useListingInfo(listingId);

  // Function to fetch listing labels
  const fetchListingLabels = async (currentListingId: string) => {
    try {
      const response = await fetch("/api-blast/listing/labels", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([currentListingId]),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.data && result.data[0] && result.data[0].labels) {
          const keywords = result.data[0].labels.map(
            (label: any) => label.keyword || label,
          );
          console.log("keywords", keywords);
          setListingLabels(keywords);
        }
      }
    } catch (error) {
      console.error("Error fetching listing labels:", error);
    }
  };

  // Get address information from URL parameters
  const addressFromUrl = searchParams.get("address");
  const cityFromUrl = searchParams.get("city") || "San Jose";
  const stateFromUrl = searchParams.get("state") || "CA";
  const zipFromUrl = searchParams.get("zip") || "95125";

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Address submitted:", addressInput);
  };

  const handleAddressSelect = (addressData: any) => {
    console.log("Address selected, API response:", addressData);

    // Extract data from addressData.data and auto-fill property information
    if (addressData?.data) {
      const data = addressData.data;
      setAutoFilledData({
        baths: data.baths,
        beds: data.bedrooms,
        previewPicture: data.previewPicture,
        sqft: data.sqft,
      });

      // Mark that user has manually selected an address
      setHasUserSelectedAddress(true);

      // Parse fullAddress by splitting on first comma
      if (data.fullAddress) {
        const firstCommaIndex = data.fullAddress.indexOf(",");
        if (firstCommaIndex !== -1) {
          const streetAddress = data.fullAddress
            .substring(0, firstCommaIndex)
            .trim();
          const cityStateZip = data.fullAddress
            .substring(firstCommaIndex + 1)
            .trim();
          setParsedAddress({
            streetAddress,
            cityStateZip,
          });
        } else {
          // If no comma found, use the whole address as street address
          setParsedAddress({
            streetAddress: data.fullAddress,
            cityStateZip: "",
          });
        }
      }

      // Fetch listing labels for the selected property if id is available
      if (data.id) {
        fetchListingLabels(data.id);
      }
    }

    // Call external callback if provided
    externalOnAddressSelect?.(addressData);
  };

  // Fetch listing labels when listingId is available
  useEffect(() => {
    if (listingId) {
      fetchListingLabels(listingId);
    }
  }, [listingId]);

  // Handle listingInfo changes from URL listingId
  React.useEffect(() => {
    if (listingInfo?.data && !hasUserSelectedAddress) {
      const data = listingInfo.data;
      // Update city for notifications
      onCityUpdate?.(data.city || null);

      // Always update auto-filled data from listing info when user hasn't selected a different address
      setAutoFilledData({
        baths: data.bathrooms,
        beds: data.bedrooms,
        previewPicture: data.listingPictures.split("|")[0].trim(),
        sqft: data.sqft,
      });

      // Parse address from listing info
      if (data.streetAddress) {
        setParsedAddress({
          streetAddress: data.streetAddress,
          cityStateZip:
            `${data.city || ""} ${data.state || ""} ${data.zipCode || ""}`.trim(),
        });
      }

      // Call external callback if provided
      if (externalOnAddressSelect) {
        // Create a mock addressData structure similar to search API response
        const mockAddressData = {
          data: {
            previewPicture: data.listingPictures,
            baths: data.bathrooms,
            bedrooms: data.bedrooms,
            sqft: data.sqft,
            fullAddress: data.streetAddress
              ? `${data.streetAddress}, ${data.city || ""} ${data.state || ""} ${data.zipCode || ""}`.trim()
              : null,
          },
        };

        // Call external callback to update preview pictures
        externalOnAddressSelect(mockAddressData);
      }
    } else if (listingInfo?.data && hasUserSelectedAddress) {
      // Still update city for notifications even if user selected a different address
      onCityUpdate?.(listingInfo.data.city || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingInfo, hasUserSelectedAddress]);

  return (
    <section className="w-6/12 max-md:w-full max-md:ml-0 px-4 max-md:px-0" data-section="property-setup">
      <div className="self-stretch my-auto max-md:max-w-full max-md:mt-10">
        <div className="mb-6 max-md:mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2 md:max-[1240px]:mt-8 max-md:text-lg max-md:mb-3">
            Let's Set Up Your Property & Budget
          </h2>
        </div>

        <div className="space-y-4">
          {/* Mobile-first address search section */}
          <div className="max-md:order-first max-md:mb-6">
            <div className="p-4 rounded-xl border-0 max-md:p-4 shadow-lg"
                 style={{
                   background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                   boxShadow: "0 10px 25px rgba(102, 126, 234, 0.3)"
                 }}>
              <Label
                className="text-base font-medium mb-3 block text-white"
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  lineHeight: "24px",
                }}
              >
                <strong className="max-md:text-base flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  Promote your new listing online!
                </strong>
                <br />
                <span className="text-sm opacity-90 max-md:text-sm mt-1 block">
                  Turn views into inquiries with AI-powered advertising
                </span>
              </Label>

              <form onSubmit={handleAddressSubmit} className="relative">
                <div className="relative">
                  <Input
                    isAddressSearch={true}
                    value={addressInput}
                    onChange={(e) => setAddressInput(e.target.value)}
                    onAddressSelect={handleAddressSelect}
                    placeholder="Enter the property address"
                    className="h-12 text-base border-0 focus:ring-2 focus:ring-white/30 transition-all bg-white/95 backdrop-blur-sm max-md:h-11 max-md:text-sm placeholder:text-gray-500 font-medium"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                    }}
                  />
                </div>
              </form>
            </div>
          </div>

          <div>
            <Label
              className="text-base font-normal text-gray-900 block mb-[10px]"
              style={{
                fontSize: "16px",
                fontWeight: "400",
                lineHeight: "30px",
              }}
            >
              Confirm your listing address
            </Label>

            <Card
              className="shadow-sm transition-none"
              style={{ border: "1px solid #EBECF1" }}
            >
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-6 max-md:gap-3 max-md:mb-4">
                  <div className="relative overflow-hidden rounded-xl h-[120px] md:h-24 w-full md:w-32 mb-4 md:mb-0 flex-shrink-0 max-md:h-[100px]">
                    <img
                      src={
                        autoFilledData?.previewPicture ||
                        (listingInfo?.data?.listingPictures
                          ? listingInfo.data.listingPictures
                              .split("|")[0]
                              .trim()
                          : null) ||
                        "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg"
                      }
                      className="w-full h-full object-cover"
                      alt="Property"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start gap-2 mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight max-md:text-lg">
                          {isLoading
                            ? "Loading..."
                            : error
                              ? "Error loading address"
                              : parsedAddress?.streetAddress ||
                                listingInfo?.data?.streetAddress ||
                                addressFromUrl ||
                                ""}
                        </h3>
                        <p className="text-gray-600 font-medium max-md:text-sm">
                          {isLoading
                            ? ""
                            : error
                              ? ""
                              : parsedAddress?.cityStateZip ||
                                (listingInfo?.data
                                  ? `${listingInfo.data.city || cityFromUrl}, ${listingInfo.data.state || stateFromUrl} ${listingInfo.data.zipCode || zipFromUrl}`
                                  : `${cityFromUrl}, ${stateFromUrl} ${zipFromUrl}`)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-sm text-gray-500 max-md:flex-wrap max-md:gap-1 max-md:text-xs">
                      <div className="flex items-center gap-1.5">
                        <Bed className="w-4 h-4" />
                        <span className="font-medium max-md:text-xs">
                          {isLoading
                            ? "- beds"
                            : error
                              ? "- beds"
                              : `${Math.max(0, autoFilledData?.beds || listingInfo?.data?.bedrooms || 3)} beds`}
                        </span>
                      </div>
                      <div
                        className="w-px h-4"
                        style={{ backgroundColor: "#E1E2E6" }}
                      />
                      <div className="flex items-center gap-1.5">
                        <Bath className="w-4 h-4" />
                        <span className="font-medium max-md:text-xs">
                          {isLoading
                            ? "- baths"
                            : error
                              ? "- baths"
                              : `${Math.max(0, autoFilledData?.baths || listingInfo?.data?.bathrooms || 2)} baths`}
                        </span>
                      </div>
                      <div
                        className="w-px h-4"
                        style={{ backgroundColor: "#E1E2E6" }}
                      />
                      <div className="flex items-center gap-1.5">
                        <Square className="w-4 h-4" />
                        <span className="font-medium max-md:text-xs">
                          {isLoading
                            ? "- sqft"
                            : error
                              ? "- sqft"
                              : `${Math.max(0, autoFilledData?.sqft || listingInfo?.data?.sqft || 1472).toLocaleString()} sqft`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {listingLabels.length > 0 && (
                  <>
                    <div className="mt-4 pt-4 border-t border-gray-200 max-md:mt-3 max-md:pt-3">
                      <h4 className="text-sm font-medium text-gray-600 mb-3 max-md:text-xs max-md:mb-2">
                        Listing highlight
                      </h4>

                      <div className="flex flex-wrap gap-4 max-md:gap-2">
                        {listingLabels.map((label, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2"
                          >
                            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                              <svg
                                className="w-2.5 h-2.5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-700 max-md:text-xs">
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>


          <div className="space-y-4">
            <div className="mt-4">
              <div>
                <Card
                  className="shadow-sm transition-none border-0"
                >
                  <CardContent className="p-0">
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
