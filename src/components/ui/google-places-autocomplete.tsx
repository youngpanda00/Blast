import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { cn } from "@/lib/utils";

interface GooglePlacesAutocompleteProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (place: any, address: string) => void;
  className?: string;
}

interface GooglePlacesAutocompleteRef {
  getSelectedAddress: () => string;
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
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);

  // Get the selected address or current input value
  const getSelectedAddress = useCallback(() => {
    return selectedPlace?.formatted_address || inputValue;
  }, [selectedPlace, inputValue]);

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    getSelectedAddress,
  }), [getSelectedAddress]);

  // Initialize Google Places Autocomplete
  const initializeAutocomplete = useCallback(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'us' },
      fields: ['formatted_address', 'address_components', 'geometry', 'place_id']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        const address = place.formatted_address;
        setInputValue(address);
        setSelectedPlace(place);
        onChange?.(address);
        onPlaceSelect?.(place, address);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [onChange, onPlaceSelect]);

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
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    // Clear selected place if user types manually
    if (selectedPlace && newValue !== selectedPlace.formatted_address) {
      setSelectedPlace(null);
    }
    onChange?.(newValue);
  };

  return (
    <input
      ref={inputRef}
      type="text"
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
