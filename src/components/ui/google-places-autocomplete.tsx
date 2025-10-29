import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useMemo } from "react";
import { cn } from "@/lib/utils";
import { useGoogleMapsApi } from '@/hooks/use-google';

interface GooglePlacesAutocompleteProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onPlaceSelect?: (place: any, address: string) => void;
  className?: string;
  types?: string[]; // New prop for place types
}

interface GooglePlacesAutocompleteRef {
  onFocus: () => void;
}

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
  const googleApi = useGoogleMapsApi();
  const [inputValue, setInputValue] = useState(value);

  // Generate random name to prevent autofill
  const randomName = useMemo(() => {
    return `address_${Math.random().toString(36).substring(2, 15)}`;
  }, []);

  const onFocus = useCallback(() => {
    inputRef.current?.focus()
  }, [inputRef])

  // Expose methods to parent components
  useImperativeHandle(ref, () => ({
    onFocus,
  }), [onFocus]);

  useEffect(() => {
    if (googleApi && inputRef.current) {
      const autocomplete = new googleApi.maps.places.Autocomplete(inputRef.current, {
        types: types,
        componentRestrictions: { country: 'us' },
        fields: ['formatted_address', 'address_components', 'geometry', 'place_id'],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log('place_changed ===>>', place)
        if (place.formatted_address) {
          const address = place.formatted_address;
          setInputValue(address);
          onChange?.(address);
          onPlaceSelect?.(place, address);
        }
      });
      autocompleteRef.current = autocomplete;
    }
  }, [googleApi]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
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
      required
    />
  );
});

GooglePlacesAutocomplete.displayName = "GooglePlacesAutocomplete";
