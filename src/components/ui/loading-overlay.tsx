import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = "",
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl max-w-sm mx-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#3B5CDE]" />
        <p className="text-gray-700 text-center font-medium">{message}</p>
      </div>
    </div>
  );
};
