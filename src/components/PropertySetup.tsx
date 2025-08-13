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
          <h2 className="text-xl font-bold text-gray-900 mb-2 md:max-[1240px]:mt-8 max-md:text-lg max-md:mb-3 max-md:hidden">
            Let's Set Up Your Property & Budget
          </h2>
        </div>

        <div className="space-y-4">
          {/* Mobile-first address search section */}
          <div className="max-md:order-first max-md:mb-6">
            <div className="p-4 rounded-xl border-0 max-md:p-4 max-md:pb-4 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 transition-all ease-in-out duration-500"
                 style={{
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
                <strong className="max-md:text-base">
                  <span className="max-md:hidden">Find Listing</span>
                  <span className="hidden max-md:block">Step 1 - Find your listing</span>
                </strong>
              </Label>

              <form onSubmit={handleAddressSubmit} className="relative">
                <div className="relative">
                  <Input
                    id="address-search-input"
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

              {/* Property Preview Section */}
              <div className="mt-4">
                {(autoFilledData || parsedAddress) ? (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    {/* Property Image */}
                    {autoFilledData?.previewPicture && (
                      <div className="mb-4">
                        <img
                          src={autoFilledData.previewPicture.split("|")[0].trim()}
                          alt="Property preview"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Address */}
                    {parsedAddress && (
                      <div className="text-center mb-4">
                        <h4 className="text-lg font-medium text-gray-800">
                          {parsedAddress.streetAddress}
                        </h4>
                        <p className="text-gray-600">
                          {parsedAddress.cityStateZip}
                        </p>
                      </div>
                    )}

                    {/* Property Details */}
                    {(autoFilledData?.beds || autoFilledData?.baths || autoFilledData?.sqft) && (
                      <div className="flex items-center justify-center gap-6 text-gray-700">
                        {autoFilledData.beds && (
                          <div className="flex items-center gap-2">
                            <Bed className="w-4 h-4" />
                            <span className="text-sm font-medium">{autoFilledData.beds} beds</span>
                          </div>
                        )}
                        {autoFilledData.baths && (
                          <div className="flex items-center gap-2">
                            <Bath className="w-4 h-4" />
                            <span className="text-sm font-medium">{autoFilledData.baths} baths</span>
                          </div>
                        )}
                        {autoFilledData.sqft && (
                          <div className="flex items-center gap-2">
                            <Square className="w-4 h-4" />
                            <span className="text-sm font-medium">{autoFilledData.sqft.toLocaleString()} sqft</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center hidden md:block">
                    {/* Placeholder content when no property is selected - Desktop only */}
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Search className="w-12 h-12 text-gray-400" />
                      </div>
                    </div>

                    <div className="text-center mb-4">
                      <h4 className="text-lg font-medium text-gray-600 mb-2">
                        Search for Your Property
                      </h4>
                      <p className="text-gray-500 text-sm">
                        Enter your property address above to see a preview of your listing
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-6 text-gray-400">
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4" />
                        <span className="text-sm">Bedrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4" />
                        <span className="text-sm">Bathrooms</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Square className="w-4 h-4" />
                        <span className="text-sm">Square Feet</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
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
