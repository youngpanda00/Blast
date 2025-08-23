import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { GooglePlacesAutocomplete } from "./ui/google-places-autocomplete";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Bed, Bath, Square, CheckCircle, Search } from "lucide-react";
import { useListingInfo } from "@/hooks/use-listing-info";

interface PropertySetupProps {
  listingId?: string | null;
  onAddressSelect?: (addressData: any) => void;
  onCityUpdate?: (city: string | null) => void;
}

interface PropertyData {
  id?: string;
  fullAddress?: string;
  address?: string;
  price?: string;
  bedrooms?: number;
  bathrooms?: number;
  baths?: number;
  sqft?: number;
  previewPicture?: string;
  imageUrl?: string;
  agentName?: string
  [key: string]: any;
}

export const PropertySetup: React.FC<PropertySetupProps> = ({
  listingId,
  onAddressSelect: externalOnAddressSelect,
  onCityUpdate,
}) => {

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [showListingsRes, setShowListingsRes] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const [addressInput, setAddressInput] = useState("");
  const [autoFilledData, setAutoFilledData] = useState<{
    baths?: number | string;
    beds?: number | string;
    previewPicture?: string;
    sqft?: number | string;
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
  const { data: listingInfo, error } = useListingInfo(listingId);

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

  const addressInputRef = useRef<HTMLInputElement>(null);

  // Get address information from URL parameters
  const addressFromUrl = searchParams.get("address");
  const cityFromUrl = searchParams.get("city") || "San Jose";
  const stateFromUrl = searchParams.get("state") || "CA";
  const zipFromUrl = searchParams.get("zip") || "95125";

  const fetchPropertyData = async (address: string) => {
    if (!address.trim()) return;
    try {
      const response = await fetch(
        `/listing-crm/listing/blast/searchByAddressV2?address=${encodeURIComponent(address)}`,
        {
          method: "GET"
        },
      );
      const result = await response.json();
      console.log('searchByAddressV2 ===>>', result)
      setLoading(false);

      if (result.data) {
        // Handle both single property and array of properties
        const propertyData = Array.isArray(result.data) ? result.data : [result.data];
        // Show maximum of 2 properties
        setProperties(propertyData.slice(0, 2));
        setShowListingsRes(true);
        
        // const data = propertyData[0];

        // setAutoFilledData({
        //   baths: data.baths.toLocaleString(),
        //   beds: data.bedrooms.toLocaleString(),
        //   previewPicture: data.previewPicture,
        //   sqft: data.sqft.toLocaleString(),
        // });

        // // Mark that user has manually selected an address
        // setHasUserSelectedAddress(true);

        // // Parse fullAddress by splitting on first comma
        // if (data.fullAddress) {
        //   const firstCommaIndex = data.fullAddress.indexOf(",");
        //   if (firstCommaIndex !== -1) {
        //     const streetAddress = data.fullAddress
        //       .substring(0, firstCommaIndex)
        //       .trim();
        //     const cityStateZip = data.fullAddress
        //       .substring(firstCommaIndex + 1)
        //       .trim();
        //     setParsedAddress({
        //       streetAddress,
        //       cityStateZip,
        //     });
        //   } else {
        //     // If no comma found, use the whole address as street address
        //     setParsedAddress({
        //       streetAddress: data.fullAddress,
        //       cityStateZip: "",
        //     });
        //   }
        // }
        // // Fetch listing labels for the selected property if id is available
        // if (data.id) {
        //   fetchListingLabels(data.id);
        // }
        // // Call external callback if provided
        // externalOnAddressSelect?.(data);
      } else {
        setProperties([]);
        setShowListingsRes(true);
      }
    } catch (error) {
      console.error("Error fetching property info:", error);
      setProperties([]);
      setShowListingsRes(true);
    }
  };

  // const handleAddressSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log("Address submitted:", addressInput);
  // };

  // const handleAddressSelect = (addressData: any) => {
  //   console.log("Address selected, API response:", addressData);

  //   // Extract data from addressData.data and auto-fill property information
  //   if (addressData?.data) {
  //     const data = addressData.data;
  //     setAutoFilledData({
  //       baths: data.baths.toLocaleString(),
  //       beds: data.bedrooms.toLocaleString(),
  //       previewPicture: data.previewPicture,
  //       sqft: data.sqft.toLocaleString(),
  //     });

  //     // Mark that user has manually selected an address
  //     setHasUserSelectedAddress(true);

  //     // Parse fullAddress by splitting on first comma
  //     if (data.fullAddress) {
  //       const firstCommaIndex = data.fullAddress.indexOf(",");
  //       if (firstCommaIndex !== -1) {
  //         const streetAddress = data.fullAddress
  //           .substring(0, firstCommaIndex)
  //           .trim();
  //         const cityStateZip = data.fullAddress
  //           .substring(firstCommaIndex + 1)
  //           .trim();
  //         setParsedAddress({
  //           streetAddress,
  //           cityStateZip,
  //         });
  //       } else {
  //         // If no comma found, use the whole address as street address
  //         setParsedAddress({
  //           streetAddress: data.fullAddress,
  //           cityStateZip: "",
  //         });
  //       }
  //     }

  //     // Fetch listing labels for the selected property if id is available
  //     if (data.id) {
  //       fetchListingLabels(data.id);
  //     }
  //   }

  //   // Call external callback if provided
  //   externalOnAddressSelect?.(addressData);
  // };

  // Fetch listing labels when listingId is available
  useEffect(() => {
    if (listingId) {
      fetchListingLabels(listingId);
    }
  }, [listingId]);

  // Handle listingInfo changes from URL listingId
  // React.useEffect(() => {
  //   if (listingInfo?.data && !hasUserSelectedAddress) {
  //     const data = listingInfo.data;
  //     // Update city for notifications
  //     onCityUpdate?.(data.city || null);

  //     // Always update auto-filled data from listing info when user hasn't selected a different address
  //     setAutoFilledData({
  //       baths: data.bathrooms.toLocaleString(),
  //       beds: data.bedrooms.toLocaleString(),
  //       previewPicture: data.listingPictures.split("|")[0].trim(),
  //       sqft: data.sqft.toLocaleString(),
  //     });

  //     // Parse address from listing info
  //     if (data.streetAddress) {
  //       setParsedAddress({
  //         streetAddress: data.streetAddress,
  //         cityStateZip:
  //           `${data.city || ""} ${data.state || ""} ${data.zipCode || ""}`.trim(),
  //       });
  //     }

  //     // Call external callback if provided
  //     if (externalOnAddressSelect) {
  //       // Create a mock addressData structure similar to search API response
  //       const mockAddressData = {
  //         data: {
  //           previewPicture: data.listingPictures,
  //           baths: data.bathrooms,
  //           bedrooms: data.bedrooms,
  //           sqft: data.sqft,
  //           fullAddress: data.streetAddress
  //             ? `${data.streetAddress}, ${data.city || ""} ${data.state || ""} ${data.zipCode || ""}`.trim()
  //             : null,
  //         },
  //       };

  //       // Call external callback to update preview pictures
  //       externalOnAddressSelect(mockAddressData);
  //     }
  //   } else if (listingInfo?.data && hasUserSelectedAddress) {
  //     // Still update city for notifications even if user selected a different address
  //     onCityUpdate?.(listingInfo.data.city || null);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [listingInfo, hasUserSelectedAddress]);

  const renderPropertyCard = (property: PropertyData, index: number) => {
    const address = property.fullAddress || property.address || "";
    const price = property.price || "";
    const bedrooms = property.bedrooms || 1;
    const bathrooms = property.bathrooms || property.baths || 1;
    const sqft = property.sqft || 1;
    const image = property.previewPicture || property.imageUrl || "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg";
    const agentName = property.agentName || ''

    return (
      <div key={property.id} className="flex" style={{ borderRadius: '5px', overflow: 'hidden', background: 'white', marginBottom: '15px', border: '1px solid #ffffff' }}>
        <img src={image} alt={`Property at ${address}`} style={{ width: 133, height: 100}} />
        <div style={{ padding: '15px 20px 15px 15px', width: '100%'}}>
          <div className="text-sm" style={{ color: '#515666', lineHeight: '20px'}}>{address}</div>
          <div className="flex text-xs" style={{lineHeight: '20px', color:'#797E8B'}}>
            <div>{bedrooms > -1 ? bedrooms : '--'} BD</div>
            <div className="text-gray-400" style={{margin:'0 5px'}}>•</div>
            <div>{bathrooms > -1 ? bathrooms : '--'} BA</div>
            <div className="text-gray-400" style={{margin:'0 5px'}}>•</div>
            <div>{sqft > -1 ? new Intl.NumberFormat('en-US').format(sqft) : '--'} Receptions</div>
          </div>
          <div className="flex text-sm" style={{ marginTop: '10px', justifyContent: 'space-between', alignItems: 'center'}}>
            <div className="text-sm" style={{ fontWeight: '700', color: '#202437'}}>${new Intl.NumberFormat('en-US').format(+price)}</div>
            <div className="text-xs" style={{color: '#A0A3AF'}}>Listed by: {agentName}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-6/12 max-md:w-full max-md:ml-0 px-4 max-md:px-0" data-section="property-setup">
      <div className="self-stretch my-auto max-md:max-w-full">
        <div className="mb-6 max-md:mb-4">
        </div>

        <div className="space-y-4">
          {/* Mobile-first address search section */}
          <div className="max-md:order-first max-md:mb-6">
            <div className="p-4 rounded-xl border-0 max-md:p-4 max-md:pb-4 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 transition-all ease-in-out duration-500">
              <Label
                className="text-xl font-bold mb-3 block text-white max-md:text-base max-md:font-medium"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "28px",
                }}
              >
                <strong className="max-md:text-base">
                  Step 1 - Find Your Listing
                </strong>
              </Label>

              <div className="bg-white/90 px-3.5 py-2.5 backdrop-blur-sm rounded-xl border border-white/20">
                <GooglePlacesAutocomplete
                  ref={addressInputRef}
                  placeholder="Enter address"
                  value={addressInput}
                  onChange={(value) => { 
                    setAddressInput(value)
                    if (!value) {
                      setShowListingsRes(false)
                    }
                  }}
                  onPlaceSelect={(place, address) => {
                    console.log('Place selected:', place, address);
                    setLoading(true);
                    fetchPropertyData(address);
                  }}
                />
              </div>

              {/* Property Preview Section */}
              <div className="mt-4">
                {showListingsRes && addressInput ? (
                  <>
                    <div className="text-sm" style={{color: 'white', marginTop: '17px', marginBottom: '10px'}}>Select Your property</div>
                    <div className="flex" style={{ flexDirection: 'column' }}>
                      {/* Property Cards - Show based on API response */}
                      {  properties.map((property, index) => renderPropertyCard(property, index)) }
                    </div>
                    <div className="flex" style={{border: '1px dashed rgba(255,255,255, 0.4)', borderRadius: '6px',padding: '12px 20px', flexDirection: 'column', alignItems: 'center'}}>
                      <div className="text-sm" style={{ color: '#ffffff', lineHeight: '20px'}}>Didn't find your listing?</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255, 0.7)', marginTop: '5px', marginBottom: '5px',lineHeight: '16px'}}>You Can Still Proceed with Your Pocket Listing</div>
                      <div className="text-sm" style={{ width:'178px', background: 'white', borderRadius: '4px', padding: '5px 23px', color: '#3B5CDE' }}>Use My Own Listing</div>
                    </div>
                  </>
                ) : (
                  <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center hidden md:block">
                    {/* Placeholder content when no property is selected - Desktop only */}
                    <div className="mb-4">
                      <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative">
                        <img
                          src="https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800"
                          alt="Property placeholder"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                          <Search className="w-12 h-12 text-white" />
                        </div>
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
