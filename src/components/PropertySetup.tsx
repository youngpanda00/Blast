import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
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
  const [targetPropertyInfo, setTargetPropertyInfo]=useState<PropertyData>({})
  const [showListingsRes, setShowListingsRes] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [targteId, setTargetId] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [hideConfirm, setHideConfirm] = useState(false);
  const [isInputHighlighted, setIsInputHighlighted] = useState(false);
  const [isShowTargetCard, setIsShowTargetCard] = useState(false);
  // const [autoOpen, setAutoOpen] = useState(false)

  const [addressInput, setAddressInput] = useState("");

  const [addressPlace, setAddressPlace] = useState('');

  const [parsedAddress, setParsedAddress] = useState<{
    streetAddress?: string;
    cityStateZip?: string;
  } | null>(null);

  const [listingLabels, setListingLabels] = useState<string[]>([
    "School District",
    "Water View",
    "Brand New Home"
  ]);

  useEffect(() => {
    setHideConfirm(false);
  }, [addressPlace])

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
    setLoading(true);
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
        const resultList = propertyData.slice(0, 2);
        setProperties(resultList);
        setShowListingsRes(true);
        if (resultList.length === 1) {
          setIsShowTargetCard(true);
          setTargetPropertyInfo(resultList[0]);
        }
      } else {
        setProperties([]);
        setShowListingsRes(true);
      }
    } catch (error) {
      console.error("Error fetching property info:", error);
      setProperties([]);
      setShowListingsRes(true);
      setLoading(false);
    }
  };

  const handleListingCard = (data?: PropertyData) => {
    setIsShowTargetCard(true);
    setTargetPropertyInfo(data);
  };

  const confirmListing = (data?: PropertyData) => {
    setTargetId(data.id);
    setIsCustom(false);
    externalOnAddressSelect?.({ ...data, addressName: addressPlace });
    onScrollToAdPreview();
    setHideConfirm(true);
  }
  const cancelListing = () => {
    setIsShowTargetCard(false);
    setTargetPropertyInfo({});
  }

  const handleCustomCard = () => {
    setTargetId('');
    setTargetPropertyInfo({})
    setIsShowTargetCard(false);
    setIsCustom(true);
    externalOnAddressSelect?.({
      isCustomListing: true,
      previewPicture: 'https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800',
      fullAddress: addressPlace,
      addressName: addressPlace
    });
    onScrollToAdPreview();
  }

  const handleAddressSelect = (address) => {
    setAddressPlace(address);
    setTargetId('');
    setTargetPropertyInfo({});
    setIsShowTargetCard(false);
    setIsCustom(false);
    setLoading(true);
    // setAutoOpen(false);
    fetchPropertyData(address);
    externalOnAddressSelect?.({
      isCustomListing: true,
      previewPicture: 'https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800',
      fullAddress: '',
      addressName: addressPlace
    });
  }

  const handleAddressChange = (value) => { 
    setAddressInput(value)
    if (!value) {
      setShowListingsRes(false)
      externalOnAddressSelect?.({
        isCustomListing: true,
        previewPicture: 'https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Ffd9b86fe9ff04d7b96f4de286f95e680?format=webp&width=800',
        fullAddress: '',
        addressName: addressPlace
      });
    }
  }

  const scrollToForm = () => {
    const formElement = document.querySelector(
      "#address-search-input"
    ) as HTMLInputElement;
    if (formElement) {
      setIsInputHighlighted(true);
      // setAutoOpen(true);
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

  const renderLoadingCard = () => {
    return (
      <div style={{minHeight: isMobile? '' : '400px'}}>
        <div className="text-sm" style={{color: 'white', marginTop: '17px', marginBottom: '10px'}}>Select Your property</div>
        <div className="flex items-center justify-center" style={{ textAlign: 'center', padding: '0 40px', height: isMobile ? '120px' : '100px', border: '1px dashed rgba(255, 255, 255, 0.4)', borderRadius: '6px' }}>
            <img style={{ width: '36px', height: '36px', marginRight: '10px', animation: 'logo-spin 1.5s linear infinite' }} src="https://cdn.lofty.com/image/fs/servicetool/2025917/5/original_e5f917c66f2342cd.png" alt="" />
            <span style={{ fontSize: '20px', color: '#C6C8D1' }}>Loading</span>
        </div>
      </div>
    )
  }

  const renderEmptyCardInfo = () => {
    return (
      <div 
        className="flex items-center justify-center" style={{ flexDirection: 'column', padding: isMobile ? '22px 25px': '54px 30px', border: '1px dashed rgba(255, 255, 255, 0.4)', borderRadius: '6px'}}
        onClick={handleCustomCard}
      >
        <img style={{ width: isMobile ? '32px' : '60px', height: isMobile ? '32px' : '60px', marginBottom: '5px'}} src="https://cdn.lofty.com/image/fs/servicetool/2025916/13/original_c170f5bbc05a42a3.png" />
        <div style={{ fontSize: isMobile ? '14px' : '22px', lineHeight: '1.5', fontWeight: '500', color: '#ffffff', marginBottom: isMobile ? '15px' : '18px', textAlign: 'center'}}>Didn’t find your listing</div>
        <div style={{ fontSize: isMobile ? '12px' : '18px', fontWeight: '700', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>You were looking for: {addressPlace}</div>
        <div style={{ fontSize: isMobile ? '12px' : '18px', marginBottom: isMobile ? '10px' : '15px', lineHeight: '1.5', color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center'}}>But we can't find the listing, you can still create the ad with simple steps</div>
        <div className="flex items-center justify-center" style={{ height: isMobile ? '30px' : '40px', borderRadius: '4px', padding: isMobile ? '0 20px' : '0 30px', background: '#ffffff', color: '#3B5CDE', fontSize: isMobile ? '14px' : '16px', fontWeight: '500', cursor: 'pointer'}}>Continue With My Own Listing</div>
      </div>
    )
  }

  const renderTargetCardInfo = (property: PropertyData) => {
    const address = property.fullAddress || property.address || "";
    const price = property.price || "";
    const bedrooms = property.bedrooms || 1;
    const bathrooms = property.bathrooms || property.baths || 1;
    const sqft = property.sqft || 1;
    const image = property.previewPicture || property.imageUrl || "https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg";
    const agentName = property.agentName || ''

    return (
      <div key={property.id} className="flex" style={{ flexDirection: 'column', padding: isMobile ? '10px 10px 15px' : '15px 15px 18px', background: '#ffffff', borderRadius: '6px'}}>
        <img src={image} alt={`Property at ${address}`} style={{width: '100%', height: isMobile ? '118px' : '180px', objectFit: 'cover', marginBottom: isMobile ? '15px': '30px', borderRadius: '6px'}} />
        <div style={{ padding: isMobile ? '0 13px' : '0 33px'}}>
          <div className="text-sm font-medium" style={{ color: '#202437', fontSize: isMobile ? '14px':'20px', textAlign: 'center', lineClamp: 2, overflow: 'hidden',  textOverflow: 'ellipsis', whiteSpace: 'normal'}}>{address}</div>
          <div className="text-xs" style={{color: '#A0A3AF', fontSize: isMobile ? '12px': '15px', lineHeight: isMobile ? '12px': '20px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis', textAlign: 'center', marginTop: isMobile ? '5px': '10px'}}>Listed by: {agentName || '--'}</div>
          <div className="flex items-center justify-center gap-6 text-gray-400" style={{ marginTop: isMobile ? '15px' : '25px'}}>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{bedrooms > -1 ? bedrooms : '--'} BD{ bedrooms > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{bathrooms > -1 ? bathrooms : '--'} BA{bathrooms > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{sqft > -1 ? new Intl.NumberFormat('en-US').format(sqft) : '--'} SqFt</span>
            </div>
          </div>
          { !hideConfirm && <div className="flex justify-center items-center" style={{gap: '10px', marginTop: isMobile ? '15px' : '30px'}}>
            <span className="flex justify-center items-center" onClick={() => cancelListing()} style={{ width: '140px', height: '30px',background: '#ffffff', border: '1px solid #3B5CDE', color: '#3B5CDE', borderRadius: '4px', cursor: 'pointer' }}>Back</span>
            <span className="flex justify-center items-center" onClick={() => confirmListing(property)} style={{width: '140px', height: '30px', background: '#3B5CDE', color: '#ffffff', borderRadius: '4px', cursor: 'pointer'}}>Confirm</span>
          </div> }
        </div>
      </div>
    )

  }

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
          <img src={image} alt={`Property at ${address}`} style={{ width: isMobile ? 100 : 133, minHeight: 100, maxHeight: isMobile ? 100 : 120, minWidth: isMobile ? 100 : 133, objectFit: 'cover'}} />
          <div style={{ padding: isMobile ? '0 0 0 10px' : '15px 20px 15px 15px', width: '100%'}}>
            <div className="text-sm font-medium" style={{ color: '#515666', lineHeight: isMobile ? '1.2':'20px', textAlign: 'left', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden',  textOverflow: 'ellipsis', whiteSpace: 'normal'}}>{address}</div>
            <div className="flex text-xs" style={{lineHeight: isMobile ? '12px' : '20px', color:'#797E8B', marginTop: isMobile ? '5px': 0}}>
              <div>{bedrooms > -1 ? bedrooms : '--'} BD{ bedrooms > 1 ? 's' : ''}</div>
              <div className="text-gray-400" style={{margin: isMobile ? '0 3px' : '0 5px'}}>•</div>
              <div>{bathrooms > -1 ? bathrooms : '--'} BA{bathrooms > 1 ? 's' : ''}</div>
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

              {/* <div className={`bg-white/90 px-3.5 py-2.5 backdrop-blur-sm rounded-xl border border-white/20 ${
                isInputHighlighted ? "ring-4 ring-accent/50 border-accent shadow-lg scale-105" : ""}
              `}> */}
                
                <Input
                  id="address-search-input"
                  isAddressSearch={true}
                  value={addressInput}
                  onChange={(e) => handleAddressChange(e.target.value)}
                  onAddressSelect={handleAddressSelect}
                  placeholder="Enter the property address"
                  className={`h-12 text-base border-0 focus:ring-2 focus:ring-white/30 transition-all bg-white/95 backdrop-blur-sm max-md:h-11 max-md:text-sm placeholder:text-gray-500 ${isInputHighlighted ? "ring-4 ring-accent/50 border-accent shadow-lg scale-105" : ""}`}
                  style={{
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
                  }}
                />
              {/* </div> */}

              {/* Property Preview Section */}
              <div className="mt-4">
                {isLoading && renderLoadingCard()}
                {showListingsRes && addressInput && !isLoading ? (
                  <div style={{minHeight: isMobile? '' : '400px'}}>
                    <div className="text-sm" style={{color: 'white', marginTop: '17px', marginBottom: '10px'}}>Select Your property</div>
                    { !properties.length && renderEmptyCardInfo()}
                    { !!properties.length && <div className="flex" style={{ flexDirection: 'column' }}>
                      {/* Property Cards - Show based on API response */}
                      { !isShowTargetCard && properties.map((property, index) => renderPropertyCard(property, index)) }
                      { isShowTargetCard && renderTargetCardInfo(targetPropertyInfo) }
                    </div>}
                    { !isShowTargetCard && !!properties.length && <div 
                      className="flex" style={{border: '1px dashed rgba(255,255,255, 0.4)', borderRadius: '6px', padding: isMobile ? '22px 15px':'12px 20px', flexDirection: 'column', alignItems: 'center'}}
                      onClick={handleCustomCard}
                    >
                      <div className="text-sm" style={{ color: '#ffffff', lineHeight: '20px'}}>Didn't find your listing?</div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255, 0.7)', marginTop: '5px', marginBottom: '5px',lineHeight: '16px'}}>You Can Still Proceed with Your Pocket Listing</div>
                      <div className="text-sm" style={{ width:'178px', background: 'white', borderRadius: '4px', padding: '5px 23px', color: '#3B5CDE', cursor: 'pointer' }}>Use My Own Listing</div>
                    </div>}
                  </div>
                ) : (
                  !isLoading && <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center hidden md:block">
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
