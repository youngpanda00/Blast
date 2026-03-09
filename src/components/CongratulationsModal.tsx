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
      <DialogContent className="sm:w-[700px] sm:max-w-[700px] p-0 gap-0 bg-white border-0 shadow-2xl">
        {/* Header with close button */}
        <div className="flex justify-end p-4 pb-0">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
            style={{zIndex: '3'}}
          >
            <X className="h-4 w-4 mx-auto" />
            <span className="sr-only">Close</span>
          </button>
        </div>

        <div className="flex relative">
            <div className="flex absolute" style={{ width: '100%', height: '93px', borderRadius: '4px 4px 0 0', top: '-32px', left: 0, right: 0, zIndex: '1' }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'fill'}} src="https://cdn.lofty.com/image/fs/servicetool/202636/10/original_b07c8ce0c0bc4c74.png" alt="logo" />
            </div>
            <img className="absolute" style={{width: '130px', height: '126px', top: '0px', left: '50%', transform: 'translateX(-50%)', zIndex: '2' }} src="https://cdn.lofty.com/image/fs/servicetool/202639/1/original_c9c200f951b648fb.png" alt="gift" />
          </div>

        {/* Content */}
        <div className="px-8" style={{ marginTop: '118px', paddingBottom: '20px'}}>
          {/* Main Title */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold leading-tight text-center" style={{lineHeight: '1.5', color: '#202437', marginBottom: '13px' }}>
              Congrats! One Step Left to Activate Your Listing Promotion!
            </DialogTitle>
          </DialogHeader>

          {/* Subtitle */}
          <p className="text-sm text-center leading-relaxed" style={{color: '#515666', lineHeight: '1.5', marginBottom: '20px'}}>
            This is the final step to get your promotion live and start generating leads!
          </p>

          {/* Account Info Block */}
          <div className="bg-gray-50 rounded-lg mb-6" style={{padding: '30px 21px'}}>
            <p className="text-sm text-center leading-relaxed" style={{marginBottom: '15px'}}>
              Click the button below to check your ad performance by logging into your account with
            </p>
            <div className="flex items-center justify-center text-sm">
                {email || "N/A"}
            </div>
          </div>

          {/* Support Contact */}
          <div className="flex text-sm" style={{'gap': '8px', marginBottom: '20px'}}>
            <span className="font-bold text-sm" style={{color: '#797E8B'}}>Reminder:</span>
            <span style={{color: '#A0A3AF', fontSize: '14px', lineHeight: '1.5'}}>If you don't complete your IDX setup within 72 hours, we'll send you a reminder email and in-app notification to help you finish vour ad activation.</span>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              className="bg-[#3B5CDE] hover:bg-[#3B5CDE]/90 text-white px-8 py-3 text-sm font-medium"
              onClick={() => {
                window.location.href = "/campaign";
              }}
              style={{width: '290px', height: '44px', borderRadius: '4px'}}
            >
              Complete Ad Setup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
