import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-32px)] sm:w-[700px] max-w-[700px] p-0 gap-0 bg-white border-0 shadow-2xl [&>button]:hidden">
        {/* Spacer for top area */}
        <div style={{padding: isMobile ? '0' : '1rem', paddingBottom: 0}} />

        <div className="flex relative">
            <div className="flex absolute" style={{ width: '100%', height: isMobile ? '70px' : '93px', borderRadius: '4px 4px 0 0', top: isMobile ? '0' : '-32px', left: 0, right: 0, zIndex: '1' }}>
              <img style={{ width: '100%', height: '100%', objectFit: 'fill'}} src="https://cdn.lofty.com/image/fs/servicetool/202636/10/original_b07c8ce0c0bc4c74.png" alt="logo" />
            </div>
            <img className="absolute sm:w-[130px] sm:h-[126px] w-[100px] h-[97px]" style={{top: '0px', left: '50%', transform: 'translateX(-50%)', zIndex: '2' }} src="https://cdn.lofty.com/image/fs/servicetool/202639/1/original_c9c200f951b648fb.png" alt="gift" />
          </div>

        {/* Content */}
        <div className="px-4 sm:px-8" style={{ marginTop: isMobile ? '95px' : '110px', paddingBottom: '20px'}}>
          {/* Main Title */}
          <DialogHeader className="text-center">
            <DialogTitle className="text-base sm:text-xl font-bold leading-tight text-center" style={{lineHeight: '1.5', color: '#202437', marginBottom: '13px' }}>
              Congrats! One Step Left to Activate Your Listing Promotion!
            </DialogTitle>
          </DialogHeader>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-center leading-relaxed" style={{color: '#515666', lineHeight: '1.5', marginBottom: '20px'}}>
            This is the final step to get your promotion live and start generating leads!
          </p>

          {/* Account Info Block */}
          <div className="bg-gray-50 rounded-lg mb-6" style={{padding: isMobile ? '15px' : '20px 16px'}}>
            <p className="text-xs sm:text-sm text-center leading-relaxed" style={{marginBottom: '15px'}}>
              Click the button below to check your ad performance by logging into your account with
            </p>
            <div className="flex items-center justify-center text-xs sm:text-sm break-all">
                {email || "N/A"}
            </div>
          </div>

          {/* Support Contact */}
          <div className="flex text-sm" style={{'gap': '8px', marginBottom: '20px'}}>
            <span className="font-bold text-xs sm:text-sm shrink-0" style={{color: '#797E8B'}}>Reminder:</span>
            <span style={{color: '#A0A3AF', fontSize: isMobile ? '12px' : '14px', lineHeight: '1.5'}} className="text-xs sm:text-sm">If you don't complete your IDX setup within 72 hours, we'll send you a reminder email and in-app notification to help you finish vour ad activation.</span>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <Button
              className="bg-[#3B5CDE] hover:bg-[#3B5CDE]/90 text-white px-8 py-3 text-sm font-medium w-full sm:w-[290px] focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() => {
                window.location.href = "/campaign?tab=listing";
              }}
              style={{height: '44px', borderRadius: '4px', outline: 'none'}}
            >
              Complete Ad Setup
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
