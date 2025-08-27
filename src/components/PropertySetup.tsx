import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { GooglePlacesAutocomplete } from "./ui/google-places-autocomplete";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Bed, Bath, Square, CheckCircle, Search } from "lucide-react";
import { useListingInfo } from "@/hooks/use-listing-info";
import { useIsMobile } from "../hooks/use-mobile";
interface PropertySetupProps {
  listingId?: string | null;
  onAddressSelect?: (addressData: any) => void;
  onCityUpdate?: (city: string | null) => void;
  onScrollToAdPreview?: () => void;
  onEditAdPreview?: () => void;
  onMethodsReady: (methods: ChildMethods) => void;
}

export interface ChildMethods {
  scrollToForm: () => void;
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

const PropertySetup: React.FC<PropertySetupProps> = ({
  listingId,
  onAddressSelect: externalOnAddressSelect,
  onScrollToAdPreview,
  onCityUpdate,
  onMethodsReady
}) => {

  const [properties, setProperties] = useState<PropertyData[]>([]);
  const [showListingsRes, setShowListingsRes] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [targteId, setTargetId] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [isInputHighlighted, setIsInputHighlighted] = useState(false);

  const [addressInput, setAddressInput] = useState("");
  const addressInputRef = useRef<{onFocus:()=> void}>(null);

  const [addressPlace, setAddressPlace] = useState('');

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
      setLoading(false);

      if (result.data) {
        // Handle both single property and array of properties
        const propertyData = Array.isArray(result.data) ? result.data : [result.data];
        // Show maximum of 2 properties
        setProperties(propertyData.slice(0, 2));
        setShowListingsRes(true);
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

  const handleListingCard = (data?: PropertyData) => {
    setTargetId(data.id);
    setIsCustom(false);
    externalOnAddressSelect?.(data);
    // Mark that user has manually selected an address
    setHasUserSelectedAddress(true);
  };

  const handleCustomCard = useCallback(() => {
    setTargetId('');
    setIsCustom(true);
    externalOnAddressSelect?.({
      isCustomListing: true,
      previewPicture: 'https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800',
      fullAddress: addressPlace
    });
    onScrollToAdPreview();
  }, [addressPlace])

  const handlePlaceSelect = useCallback((place, address) => {
    console.log('Place selected:', place, address);
    setAddressPlace(address);
    setTargetId('');
    setIsCustom(false);
    setLoading(true);
    fetchPropertyData(address);
    externalOnAddressSelect?.({
      isCustomListing: true,
      previewPicture: 'https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800',
      fullAddress: ''
    });
  }, [])

  const handleAddressChange = useCallback((value) => { 
    setAddressInput(value)
    if (!value) {
      setShowListingsRes(false)
      externalOnAddressSelect?.({
        isCustomListing: true,
        previewPicture: 'https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800',
        fullAddress: ''
      });
    }
  }, [])

  const scrollToForm = () => {
    const formElement = document.querySelector(
      "input[placeholder*='Enter address']",
    ) as HTMLInputElement;
    if (formElement) {
      setIsInputHighlighted(true);
      addressInputRef.current.onFocus();
      setTimeout(() => {setIsInputHighlighted(false);}, 1500);
      window.scrollTo({
        top: 380,
        behavior: 'smooth'
      });
    }
  };

  useEffect(()=>{
    onMethodsReady({
      scrollToForm
    })
  }, [onMethodsReady])

  // Fetch listing labels when listingId is available
  useEffect(() => {
    if (listingId) {
      fetchListingLabels(listingId);
    }
  }, [listingId]);

  const renderPropertyCard = (property: PropertyData, index: number) => {
    const address = property.fullAddress || property.address || "";
    const price = property.price || "";
    const bedrooms = property.bedrooms || 1;
    const bathrooms = property.bathrooms || property.baths || 1;
    const sqft = property.sqft || 1;
    const image = property.previewPicture || property.imageUrl || "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg";
    const agentName = property.agentName || ''

    return (
        <div key={property.id} 
          className="flex" style={{position: 'relative', padding: isMobile ? '10px': '0', borderRadius: '6px', overflow: 'hidden', background: 'white', marginBottom: '15px', cursor: 'pointer' }}
          onClick={() => handleListingCard(property)}
        >
          { targteId == property.id && (
            <div style={{position: 'absolute', top: 0, right: 0, zIndex: 10 }}>
              <img src="https://cdn.lofty.com/image/fs/servicetool/2025824/13/original_03d678ea004049a5.png" style={{width: '36px', height: '36px'}} alt="" />
            </div>
          )}
          <img src={image} alt={`Property at ${address}`} style={{ width: isMobile ? 100 : 133, height: 100, minWidth: isMobile ? 100 : 133}} />
          <div style={{ padding: isMobile ? '0 0 0 10px' : '15px 20px 15px 15px', width: '100%'}}>
            <div className="text-sm font-medium" style={{ color: '#515666', lineHeight: isMobile ? '1.2':'20px', textAlign: 'left', lineClamp: 2, overflow: 'hidden',  textOverflow: 'ellipsis', whiteSpace: isMobile ? 'normal' : 'nowrap'}}>{address}</div>
            <div className="flex text-xs" style={{lineHeight: isMobile ? '12px' : '20px', color:'#797E8B', marginTop: isMobile ? '5px': 0}}>
              <div>{bedrooms > -1 ? bedrooms : '--'} BD</div>
              <div className="text-gray-400" style={{margin: isMobile ? '0 3px' : '0 5px'}}>•</div>
              <div>{bathrooms > -1 ? bathrooms : '--'} BA</div>
              <div className="text-gray-400" style={{margin: isMobile ? '0 3px' : '0 5px'}}>•</div>
              <div>{sqft > -1 ? new Intl.NumberFormat('en-US').format(sqft) : '--'} SqFt</div>
            </div>
            <div className="flex text-sm" style={{ marginTop: isMobile ? '14px' : '10px', flexDirection: isMobile ? 'column' : 'row', justifyContent: isMobile ? '' :'space-between', alignItems: isMobile ? 'self-start' : 'center'}}>
              <div className="text-sm" style={{ fontWeight: '700', color: '#202437'}}>${new Intl.NumberFormat('en-US').format(+price)}</div>
              <div className="text-xs" style={{color: '#A0A3AF', width: isMobile ? '100%': 'calc(100% - 100px)', whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis', textAlign: isMobile ? 'left':'right'}}>Listed by: {agentName || '--'}</div>
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

              <div className={`bg-white/90 px-3.5 py-2.5 backdrop-blur-sm rounded-xl border border-white/20 ${
                isInputHighlighted ? "ring-4 ring-accent/50 border-accent shadow-lg scale-105" : ""}
              `}>
                <GooglePlacesAutocomplete
                  ref={addressInputRef}
                  placeholder="Enter address"
                  value={addressInput}
                  onChange={handleAddressChange}
                  onPlaceSelect={handlePlaceSelect}
                />
              </div>

              {/* Property Preview Section */}
              <div className="mt-4">
                {showListingsRes && addressInput ? (
                  <div style={{minHeight: isMobile? '' : '400px'}}>
                    <div className="text-sm" style={{color: 'white', marginTop: '17px', marginBottom: '10px'}}>Select Your property</div>
                    <div className="flex" style={{ flexDirection: 'column' }}>
                      {/* Property Cards - Show based on API response */}
                      {  properties.map((property, index) => renderPropertyCard(property, index)) }
                    </div>
                    <div 
                      className="flex" style={{border: '1px dashed rgba(255,255,255, 0.4)', borderRadius: '6px', padding: isMobile ? '22px 15px':'12px 20px', flexDirection: 'column', alignItems: 'center'}}
                      onClick={handleCustomCard}
                    >
                      <div className="text-sm" style={{ color: '#ffffff', lineHeight: '20px'}}>Didn't find your listing?</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255, 0.7)', marginTop: '5px', marginBottom: '5px',lineHeight: '16px'}}>You Can Still Proceed with Your Pocket Listing</div>
                      <div className="text-sm" style={{ width:'178px', background: 'white', borderRadius: '4px', padding: '5px 23px', color: '#3B5CDE', cursor: 'pointer' }}>Use My Own Listing</div>
                    </div>
                  </div>
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

        </div>
      </div>
    </section>
  );
};

export default PropertySetup;
