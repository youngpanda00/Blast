import { useQuery } from "@tanstack/react-query";

interface ListingData {
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  listingPictures?: string;
  sqft?: number;
  // Add other fields as needed
}

interface ListingInfo {
  data?: ListingData;
}

const fetchListingInfo = async (listingId: string): Promise<ListingInfo> => {
  const response = await fetch(`/api-blast/listing/info/${listingId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch listing info");
  }
  return response.json();
};

export const useListingInfo = (listingId: string | null) => {
  return useQuery({
    queryKey: ["listingInfo", listingId],
    queryFn: () => fetchListingInfo(listingId!),
    enabled: !!listingId,
  });
};
