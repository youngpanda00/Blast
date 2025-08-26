import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import { cn } from "@/lib/utils";

interface GooglePlacesAutocompleteProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (place: any, address: string) => void;
  className?: string;
  types?: string[]; // New prop for place types
}

interface GooglePlacesAutocompleteRef {
  getSelectedAddress: () => string;
  onFocus: () => void;
}

// Extend the Window interface to include Google Maps
declare global {
  interface Window {
    google?: any;
    initGooglePlaces?: () => void;
  }
}

const GOOGLE_MAPS_API_KEY = "AIzaSyC4rNb_nZBSOCmtXVJoFHWbG8seYSQbOl0";

export const GooglePlacesAutocomplete = forwardRef<GooglePlacesAutocompleteRef, GooglePlacesAutocompleteProps>(({
  placeholder = "Enter address",
  value = "",
  onChange,
  onPlaceSelect,
  className,
  types = ['address'], // Default to address for backward compatibility
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const selectedPlaceRef = useRef<any>(null);

  // Generate random name to prevent autofill
  const randomName = useMemo(() => {
    return `address_${Math.random().toString(36).substring(2, 15)}`;
  }, []);

  // Get the selected address or current input value
  const getSelectedAddress = useCallback(() => {
    console.log('address', autocompleteRef.current.getPlace(), selectedPlaceRef.current)
    return selectedPlaceRef.current?.formatted_address || inputValue;
  }, [inputValue]);

  const onFocus = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    getSelectedAddress,
    onFocus,
  }), [getSelectedAddress, onFocus]);

  // Initialize Google Places Autocomplete
  const initializeAutocomplete = useCallback(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: types,
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'address_components', 'geometry', 'place_id']
    });

    const onPlaceChanged = () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        const address = place.formatted_address;
        selectedPlaceRef.current = place;
        setInputValue(address);
        onChange?.(address);
        onPlaceSelect?.(place, address);
      }
    }

    autocomplete.addListener('place_changed', onPlaceChanged);

    // 额外监听输入框变化
    inputRef.current.addEventListener('change', function() {
      // 延迟检查以确保Autocomplete有机会处理
      setTimeout(function() {
        if (autocomplete.getPlace()) {
          onPlaceChanged();
        }
      }, 300);
    });

    autocompleteRef.current = autocomplete;
  }, [onChange, onPlaceSelect, setInputValue, types]);

  // Load Google Maps script
  const loadGoogleMapsScript = useCallback(() => {
    if (window.google) {
      initializeAutocomplete();
      return;
    }

    setIsLoading(true);

    // Create callback function for when script loads
    window.initGooglePlaces = () => {
      setIsLoading(false);
      initializeAutocomplete();
    };

    if(isLoading){
      return ;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initGooglePlaces`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setIsLoading(false);
      console.error('Failed to load Google Maps script');
    };

    document.head.appendChild(script);
  }, [initializeAutocomplete]);

  // Load script on component mount
  useEffect(() => {
    loadGoogleMapsScript();
    
    // Cleanup function
    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners?.(autocompleteRef.current);
      }
    };
  }, [loadGoogleMapsScript]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Clear selected place if user types manually
    if (selectedPlaceRef.current && newValue !== selectedPlaceRef.current.formatted_address) {
      selectedPlaceRef.current = null
    }
    onChange?.(newValue);
  };

  return (
    <input
      id="address-search-input"
      ref={inputRef}
      type="text"
      name={randomName}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputChange}
      className={cn(
        "w-full bg-transparent text-[#202437] text-sm font-normal leading-[22.5px] placeholder:text-[#C6C8D1] border-none outline-none",
        className
      )}
      disabled={isLoading}
      required
    />
  );
});

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
