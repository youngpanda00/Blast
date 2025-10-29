import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Bed, Bath, Square, CheckCircle, Search } from "lucide-react";
import { useListingInfo } from "@/hooks/use-listing-info";
import { useIsMobile } from "../hooks/use-mobile";
import { trackFBEvent, trackMixPanel } from "@/lib/utils";
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
        // Show maximum of 1 properties
        const resultList = propertyData.slice(0, 1).map(it => {
          return {
            ...it,
            previewPicture: 'https://cdn.lofty.com/image/fs/servicetool/20251023/7/original_9e66df796bbf490e.png'
          }
        });
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
    trackMixPanel("click", {
      page_name: "ListingBlastSP",
      feature_name: "ListingBlast",
      click_item: "confirm property address",
      click_action: "property"
    });
    trackFBEvent('confirm property address')
    setTargetId(data.id);
    setIsCustom(false);
    externalOnAddressSelect?.({ ...data, addressName: data?.fullAddress });
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
    if (address === addressPlace) {
      return;
    }
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
      addressName: address
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
        addressName: ''
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
        <div className="text-sm" style={{color: 'white', marginTop: '20px', marginBottom: '20px', textAlign: 'center', fontWeight: '500', lineHeight: '1.5'}}>Confirm Your Property</div>
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
    const price = property.price || 0;
    const bedrooms = property.bedrooms || 1;
    const bathrooms = property.bathrooms || property.baths || 1;
    const sqft = property.sqft || 1;
    const agentName = property.agentName || ''

    const addressArr = address.split(',').map(it => it.trim())
    const addressPrefix = addressArr.slice(0, -2).join(', ')
    const addressSuffix = [addressArr[addressArr.length - 2], addressArr[addressArr.length - 1]].join(', ')

    return (
      <div key={property.id} className="flex" style={{ flexDirection: 'column', padding: isMobile ? '15px' : '30px', background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', height: isMobile ? 'auto': '300px', justifyContent: hideConfirm ? 'center' : 'flex-start'}}>
        <div>
          <div style={{ color: '#ffffff', fontSize: isMobile ? '14px':'28px', fontWeight: '700', marginBottom: '10px', lineHeight: isMobile ? '1' : '1.1', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left' }}>{addressPrefix}</div>
          <div style={{ color: '#ffffff', fontSize: isMobile ? '14px':'20px', fontWeight: '600', marginBottom: '10px', lineHeight: isMobile ? '1' : '1.1', textAlign: 'left' }}>{addressSuffix}</div>
          <div style={{ color: '#ffffff', fontSize: isMobile ? '12px':'16px', marginBottom: '10px', textAlign: 'left'  }}>${ price ? new Intl.NumberFormat('en-US').format(Number(price)) : '--'}</div>
          <div className="flex items-center" style={{color: '#ffffff', marginBottom: '10px'}}>
            <div className="flex items-center">
              <img style={{ width: '12px', height: '12px', marginRight: '6px'}} src="https://cdn.lofty.com/image/fs/servicetool/20251023/7/original_c27ed42e0b534834.png" alt="bedroom" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{bedrooms > -1 ? bedrooms : '--'} bd{ bedrooms > 1 ? 's' : ''}</span>
            </div>
            <div style={{width: '1px', height: '10px', borderRight: '1px solid rgba(255, 255, 255, 0.2)', margin: '0 10px'}}></div>
            <div className="flex items-center">
              <img style={{ width: '12px', height: '12px', marginRight: '6px'}} src="https://cdn.lofty.com/image/fs/servicetool/20251023/7/original_f55e328d4ec8495d.png" alt="bathroom" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{bathrooms > -1 ? bathrooms : '--'} bth{bathrooms > 1 ? 's' : ''}</span>
            </div>
            <div style={{width: '1px', height: '10px', borderRight: '1px solid rgba(255, 255, 255, 0.2)', margin: '0 10px'}}></div>
            <div className="flex items-center">
              {/* <Square className="w-4 h-4" /> */}
              <img style={{ width: '12px', height: '12px', marginRight: '6px'}} src="https://cdn.lofty.com/image/fs/servicetool/20251023/7/original_6737d9cceea949ce.png" alt="sqft" />
              <span className={isMobile ? 'text-xs' : 'text-sm'}>{sqft > -1 ? new Intl.NumberFormat('en-US').format(sqft) : '--'} sqft</span>
            </div>
          </div>
          <div style={{ display: 'flex', color: '#ffffff', fontSize: isMobile ? '12px': '16px', lineHeight: isMobile ? '14px': '24px', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden',  textOverflow: 'ellipsis', textAlign: 'left'}}>Listing Agent: <span style={{ marginLeft: '14px'}}>{agentName || '--'}</span></div>
        </div>
        { !hideConfirm && <div className="flex justify-center items-center" style={{gap: '10px', marginTop: isMobile ? '15px' : '30px'}}>
          <span className="flex justify-center items-center" onClick={() => confirmListing(property)} style={{width: '100%', height: '50px', background: 'linear-gradient(180deg, #FFA600 -43.75%, #F0454C 123.75%)', color: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '700'}}>Confirm Address</span>
        </div> }
      </div>
    )
  }

  return (
    <section className="w-6/12 max-md:w-full max-md:ml-0 px-4 max-md:px-0" data-section="property-setup">
      <div className="self-stretch my-auto max-md:max-w-full">
        <div className="mb-6 max-md:mb-4">
        </div>

        <div className="space-y-4">
          {/* Mobile-first address search section */}
          <div className="max-md:order-first max-md:mb-6">
            <div className="p-4 rounded-xl border-0 max-md:p-4 max-md:pb-4 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 transition-all ease-in-out duration-500" style={{background: 'linear-gradient(176.42deg, #2A7CFD -1.61%, #853CE2 103.23%)', padding: '30px 20px', maxHeight: '511px'}}>
              <Label
                className="text-xl font-bold mb-3 block text-white max-md:text-base max-md:font-medium"
                style={{
                  fontSize: "20px",
                  fontWeight: "700",
                  lineHeight: "28px",
                  marginBottom: '20px',
                  textAlign: 'center'
                }}
              >
                <strong className="max-md:text-base" style={{fontSize: '20px', lineHeight: '1', fontWeight: '900', marginTop: '30px' }}>
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
                    <div className="text-sm" style={{color: 'white', marginTop: '20px', marginBottom: '20px', textAlign: 'center', fontWeight: '500', lineHeight: '1.5'}}>Confirm Your Property</div>
                    { !properties.length && renderEmptyCardInfo()}
                    { !!properties.length && <div className="flex" style={{ flexDirection: 'column' }}>
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
