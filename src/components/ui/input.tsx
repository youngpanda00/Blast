import * as React from "react";

import { cn } from "@/lib/utils";
import {
  AddressSearchSelect,
  type AddressSearchSelectProps,
} from "./address-search-select";

interface InputProps extends React.ComponentProps<"input"> {
  isAddressSearch?: boolean;
  onAddressSelect?: AddressSearchSelectProps["onAddressSelect"];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, isAddressSearch, onAddressSelect, ...props }, ref) => {
    if (isAddressSearch) {
      return (
        <AddressSearchSelect
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
