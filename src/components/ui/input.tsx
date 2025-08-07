import * as React from "react";

import { cn } from "@/lib/utils";
import {
  AddressSearchSelect,
  type AddressSearchSelectProps,
} from "./address-search-select";
import { useToast } from "@/hooks/use-toast";

interface InputProps extends React.ComponentProps<"input"> {
  isAddressSearch?: boolean;
  onAddressSelect?: AddressSearchSelectProps["onAddressSelect"];
  maxFileSize?: number; // File size limit in bytes, default 20MB
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isAddressSearch, onAddressSelect, maxFileSize = 20 * 1024 * 1024, ...props }, ref) => {
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "file" && event.target.files) {
        const file = event.target.files[0];
        if (file && file.size > maxFileSize) {
          toast({
            variant: "destructive",
            title: "File size error",
            description: `File size cannot exceed ${Math.round(maxFileSize / 1024 / 1024)}MB`,
          });
          event.target.value = "";
          return;
        }
      }
      if (props.onChange) {
        props.onChange(event);
      }
    };

    if (isAddressSearch) {
      return (
        <AddressSearchSelect
          {...props}
          className={className}
          value={props.value as string}
          onValueChange={(value) => {
            if (props.onChange) {
              props.onChange({
                target: { value },
              } as React.ChangeEvent<HTMLInputElement>);
            }
          }}
          onAddressSelect={onAddressSelect}
          placeholder={props.placeholder}
          disabled={props.disabled}
        />
      );
    }

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
        onChange={type === "file" ? handleFileChange : props.onChange}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
export { AddressSearchSelect } from "./address-search-select";
export type {
  AddressSearchSelectProps,
  AddressSuggestion,
} from "./address-search-select";
