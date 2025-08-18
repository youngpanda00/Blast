import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CongratulationsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export const CongratulationsModal: React.FC<CongratulationsModalProps> = ({
  open,
  onOpenChange,
  email,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 bg-white border-0 shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4 mx-auto" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-8 pb-8 pt-2">
          {/* Celebration Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <div className="text-4xl">🎉</div>
            </div>
          </div>

          {/* Main Title */}
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold text-gray-900 leading-tight text-center">
              Congrats! You have finished setting up your ad!
            </DialogTitle>
          </DialogHeader>

          {/* Subtitle */}
          <p className="text-center text-gray-600 mb-8 text-base leading-relaxed">
            Every time you get a new lead, we will send a notification email to&nbsp;
            {email || "N/A"}
          </p>

          {/* Account Info Block */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
            <p className="text-gray-700 mb-4 text-center leading-relaxed">
              Click the button below to check your ad performance by logging
              into your account with
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">Account:</span>
                <span className="text-gray-900 font-mono">
                  {email || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Support Contact */}
          <p className="text-center text-sm text-gray-600 mb-6">
            If you have any questions, feel free to contact{" "}
            <a
              href="mailto:loftyblast@support.com"
              className="text-blue-600 hover:text-blue-700 underline"
            >
              loftyblast@support.com
            </a>
          </p>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              className="bg-[#3B5CDE] hover:bg-[#3B5CDE]/90 text-white px-8 py-3 text-base font-medium rounded-md"
              onClick={() => {
                window.location.href = "/campaign";
              }}
            >
              Check Ad Performance
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
