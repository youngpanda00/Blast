import * as React from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { cn, trackMixPanel, trackFBEvent } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type AddressSuggestion = string;

interface AddressSearchSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  onAddressSelect?: (addressData: any) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const AddressSearchSelect = React.forwardRef<
  HTMLButtonElement,
  AddressSearchSelectProps
>(
  (
    {
      className,
      value,
      onValueChange,
      onAddressSelect,
      placeholder = "搜索地址...",
      disabled,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState(value || "");
    const isMobile = useIsMobile();

    // Debounced search function
    const searchTimeoutRef = React.useRef<NodeJS.Timeout>();

    const fetchSuggestions = React.useCallback(async (key: string) => {
      if (!key.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/listing-crm/listing/blast/suggestAddress?key=${encodeURIComponent(key)}`,
          {
            method: "GET"
          },
        );

        if (response.ok) {
          const { data } = await response.json();
          console.log("suggestAddress", data);
          setSuggestions(Array.isArray(data) ? data : []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Failed to fetch address suggestions:", error);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, []);

    const handleSearch = React.useCallback(
      (value: string) => {
        setSearchTerm(value);

        // Clear previous timeout
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }

        // Debounce the search
        searchTimeoutRef.current = setTimeout(() => {
          fetchSuggestions(value);
        }, 800);
      },
      [fetchSuggestions],
    );

    const handleSelectAddress = React.useCallback(
      async (address: string) => {
        setSelectedValue(address);
        setSearchTerm("");
        setOpen(false);
        onValueChange?.(address);

        // Call the searchByAddress API
        try {
          const response = await fetch(
            `/listing-crm/listing/blast/searchByAddress?address=${encodeURIComponent(address)}`,
            {
              method: "GET"
            },
          );

          if (response.ok) {
            const data = await response.json();
            onAddressSelect?.(data);
          }
        } catch (error) {
          console.error("Failed to search by address:", error);
        }
      },
      [onValueChange, onAddressSelect],
    );

    // Update selected value when prop changes
    React.useEffect(() => {
      setSelectedValue(value || "");
    }, [value]);

    // Clear timeout on unmount
    React.useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) {
          clearTimeout(searchTimeoutRef.current);
        }
      };
    }, []);

    // Get displayed suggestions based on mobile/desktop
    const displayedSuggestions = React.useMemo(() => {
      if (isMobile && suggestions.length > 5) {
        return suggestions.slice(0, 5);
      }
      return suggestions;
    }, [suggestions, isMobile]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild onClick={()=>{
          trackMixPanel("click", {
            page_name: "ListingBlastSP",
            feature_name: "ListingBlast",
            click_item: "Enter the property address",
            click_action: "property"
          });
          trackFBEvent('Search Address');
        }}>
          <Button
            ref={ref}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "flex h-10 w-full justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className,
            )}
            disabled={disabled}
            {...props}
          >
            <span
              className={cn(
                "truncate",
                !selectedValue && "text-muted-foreground",
              )}
            >
              {selectedValue || placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <Command shouldFilter={false}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Enter the property address"
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <CommandList className={cn(
              "min-h-[170px] max-h-[300px] overflow-y-auto",
              isMobile && "max-h-[250px]"
            )}>
              {loading ? (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Searching...
                </div>
              ) : displayedSuggestions.length === 0 ? (
                searchTerm ? (
                  <CommandEmpty>Not Found</CommandEmpty>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Please enter the property address
                  </div>
                )
              ) : (
                <CommandGroup>
                  {displayedSuggestions.map((address, index) => (
                    <CommandItem
                      key={index}
                      value={address}
                      onSelect={() => handleSelectAddress(address)}
                      className="cursor-pointer"
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === address
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      <span className="truncate">{address}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

AddressSearchSelect.displayName = "AddressSearchSelect";

export {
  AddressSearchSelect,
  type AddressSuggestion,
  type AddressSearchSelectProps,
};
