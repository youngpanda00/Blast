import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface MobileAdConfigurationProps {
  onConfigurationComplete: (config: {
    duration: number;
    estimatedViews: number;
    price: number;
    leads: number;
    packageType: string;
  }) => void;
  selectedPlan: "one-time" | "monthly";
  shouldHighlight?: boolean;
}

export const MobileAdConfiguration: React.FC<MobileAdConfigurationProps> = ({
  onConfigurationComplete,
  selectedPlan,
  shouldHighlight = false,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [selectedViews, setSelectedViews] = useState<string>("");
  const [results, setResults] = useState<{
    price: number;
    discountPrice: number;
    leads: number;
    packageType: string;
  } | null>(null);

  // Duration options (in weeks)
  const durationOptions = [
    { value: "1", label: "1 Week" },
    { value: "2", label: "2 Weeks" },
    { value: "3", label: "3 Weeks" },
    { value: "4", label: "4 Weeks" },
  ];

  // Views options
  const viewsOptions = [
    { value: "2000", label: "2,000+ Views" },
    { value: "4000", label: "4,000+ Views" },
    { value: "6000", label: "6,000+ Views" },
    { value: "8000", label: "8,000+ Views" },
  ];

  // Package mapping based on duration and views
  const getPackageDetails = (duration: number, views: number) => {
    const packages = {
      "1": { name: "Starter Pack", basePrice: 79, originalPrice: 109 },
      "2": { name: "Boost Pack", basePrice: 158, originalPrice: null },
      "3": { name: "Growth Pack", basePrice: 237, originalPrice: null },
      "4": { name: "Mastery Pack", basePrice: 316, originalPrice: null },
    };

    const pkg = packages[duration as keyof typeof packages];
    if (!pkg) return null;

    // Calculate price based on views multiplier
    const viewsMultiplier = views / 2000;
    const calculatedPrice = Math.round(pkg.basePrice * viewsMultiplier);

    // Calculate discount price (show higher price crossed out)
    const discountPrice = Math.round(calculatedPrice * 1.14); // About 14% higher for discount effect

    // Calculate estimated leads (assuming $9 per lead)
    const estimatedLeads = Math.ceil(calculatedPrice / 9);

    return {
      name: pkg.name,
      price: calculatedPrice,
      discountPrice: discountPrice,
      originalPrice: pkg.originalPrice ? Math.round(pkg.originalPrice * viewsMultiplier) : null,
      leads: estimatedLeads,
    };
  };

  // Update results when duration or views change
  useEffect(() => {
    if (selectedDuration && selectedViews) {
      const duration = parseInt(selectedDuration);
      const views = parseInt(selectedViews);
      const packageDetails = getPackageDetails(duration, views);
      
      if (packageDetails) {
        const config = {
          price: packageDetails.price,
          discountPrice: packageDetails.discountPrice,
          leads: packageDetails.leads,
          packageType: packageDetails.name,
        };
        setResults(config);
        
        // Notify parent component
        onConfigurationComplete({
          duration,
          estimatedViews: views,
          discountPrice: packageDetails.discountPrice,
          ...config,
        });
      }
    } else {
      setResults(null);
    }
  }, [selectedDuration, selectedViews, onConfigurationComplete]);

  const selectedDurationObj = durationOptions.find(d => d.value === selectedDuration);
  const selectedViewsObj = viewsOptions.find(v => v.value === selectedViews);

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Combined Selection Box */}
      <div className={`bg-white rounded-xl p-4 border transition-all duration-500 max-md:flex max-md:flex-col max-md:gap-[10px] ${
        shouldHighlight
          ? "border-red-400 shadow-lg ring-2 ring-red-200 bg-red-50"
          : "border-gray-100"
      }`}>
        <div className="space-y-4">
          {/* Target Views - First */}
          <div>
            <Label className={`text-sm text-gray-600 mb-2 block max-md:text-base max-md:text-black transition-colors duration-300 ${
              shouldHighlight ? "text-red-600 font-semibold" : ""
            }`}>Target Views</Label>
            <Select value={selectedViews} onValueChange={setSelectedViews}>
              <SelectTrigger className={`w-full h-11 bg-gray-50 border transition-all duration-300 ${
                shouldHighlight
                  ? "border-red-400 ring-2 ring-red-200 bg-red-50"
                  : "border-gray-200"
              }`}>
                <SelectValue placeholder="Choose views" />
              </SelectTrigger>
              <SelectContent>
                {viewsOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Ad Duration - Second */}
          <div>
            <Label className={`text-sm text-gray-600 mb-2 block max-md:text-base max-md:text-black transition-colors duration-300 ${
              shouldHighlight ? "text-red-600 font-semibold" : ""
            }`}>Ad Duration</Label>
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
              <SelectTrigger className={`w-full h-11 bg-gray-50 border transition-all duration-300 ${
                shouldHighlight
                  ? "border-red-400 ring-2 ring-red-200 bg-red-50"
                  : "border-gray-200"
              }`}>
                <SelectValue placeholder="Choose duration" />
              </SelectTrigger>
              <SelectContent>
                {durationOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        {results && selectedDurationObj && selectedViewsObj && (
          <div className="bg-white max-md:bg-gradient-to-r max-md:from-blue-500 max-md:to-purple-600 rounded-xl p-4 max-md:py-[14px] border border-gray-100 max-md:border-0 mt-4 max-md:pt-[10px] max-md:mt-[10px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 max-md:text-white max-md:text-left max-md:mb-[10px] max-md:pb-2 max-md:border-b max-md:border-white/20">{results.packageType}</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 max-md:border-white/20">
                <span className="text-gray-600 max-md:text-white max-md:font-semibold">Estimate Leads</span>
                <span className="text-lg font-semibold text-gray-900 max-md:text-[22px] max-md:text-white max-md:font-bold">{results.leads}</span>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600 max-md:text-white">Price</span>
                <div className="text-right">
                  {/* Mobile: Show discount price crossed out + final price */}
                  <div className="max-md:block hidden">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="text-sm line-through text-white/70">${results.discountPrice}</span>
                      <span className="text-xl font-bold text-white">${results.price}</span>
                    </div>
                  </div>
                  {/* Desktop: Show normal price */}
                  <span className="text-xl font-bold text-gray-900 max-md:hidden">
                    ${results.price}
                  </span>
                  <div className="text-xs text-gray-500 max-md:hidden">
                    {selectedPlan === "one-time" ? "One-time" : "Monthly"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
