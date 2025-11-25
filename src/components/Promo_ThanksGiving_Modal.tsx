import React, { useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  percent: number; // e.g. 20
}

export const PromoModal: React.FC<Props> = ({
  open,
  onOpenChange,
  percent,
}) => {
  useEffect(() => {
    if (!open) return;
    // disable background scroll while open
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const onClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  useEffect(()=>{
    setTimeout(onClose, 5000)
  }, [onClose])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="relative bg-white">
          <div
            className="w-full"
            style={{
              paddingTop: `${900 / 56}%`,
              backgroundSize: "cover",
              backgroundImage:
                "url(https://cdn.lofty.com/image/fs/servicetool/20251125/11/original_26bf0ab487b248ab.png)",
            }}
          ></div>
          <div className="flex items-center justify-center">
            <img
              className="h-[150px]"
              src="https://cdn.lofty.com/image/fs/servicetool/20251125/11/original_2b9fa6c48f2f42c4.png"
            />
          </div>

          <h3 className="text-center text-[#F0454C] text-[28px] font-semibold tracking-wide">
            HOT DEAL ALERT!
          </h3>
          <div className="text-center text-[36px] font-extrabold text-[#F0454C] leading-tight mt-1">
            {percent}% OFF YOUR TOTAL
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={onClose}
              className="text-[16px] mt-8 px-12 py-3 rounded-[100px] text-white font-semibold bg-gradient-to-r from-[#FFA302] to-[#F0464B] hover:opacity-90"
            >
              Redeem My Discount
            </button>
          </div>

          <div
            className="w-full"
            style={{
              marginTop: "-24px",
              paddingTop: `${1100 / 56}%`,
              pointerEvents: 'none',
              backgroundSize: "cover",
              backgroundImage:
                "url(https://cdn.lofty.com/image/fs/servicetool/20251125/11/original_ca01fb9246fa4a1f.png)",
            }}
          ></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoModal;
