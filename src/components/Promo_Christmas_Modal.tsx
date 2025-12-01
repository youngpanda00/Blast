import React, { useCallback, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const pieces = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 1.2,
        color: [
          '#7C3AED', '#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#F472B6'
        ][i % 6]
      })), []);

  useEffect(() => {
    if (!open) return;
    // disable background scroll while open
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const isMobile = useIsMobile();

  const onClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);
  
  useEffect(()=>{
    setTimeout(onClose, 5000)
  }, [onClose])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && createPortal(
        <>
          <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
            {pieces.map((p, i) => (
              <span
                key={i}
                style={{ left: `${p.left}%`, animationDelay: `${p.delay}s`, backgroundColor: p.color }}
                className="absolute -top-5 w-1.5 h-2 rounded-[2px] animate-confetti-screen"
              />)
            )}
          </div>
          <style>{`
            @keyframes confetti-screen {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 0; }
              10% { opacity: 1; }
              100% { transform: translateY(120vh) rotate(360deg); opacity: 0; }
            }
            .animate-confetti-screen { animation: confetti-screen 2.4s ease-in forwards; }
          `}</style>
        </>,
        document.body
      )}
      <DialogContent className="special-dialog p-0 overflow-hidden border-0 shadow-2xl rounded-2xl" style={{width: isMobile ? 'calc(100% - 30px)': '50%', height: isMobile ? 'auto' : '50%', minWidth: isMobile ? '320px': '560px'}}>
        <div className="relative bg-[#d94223]">
          <div
            className="w-full"
            style={{
              paddingTop: `${1000 / 56}%`,
              backgroundSize: "cover",
              backgroundImage:
                "url(https://cdn.lofty.com/image/fs/servicetool/20251125/12/original_ccfc42c84cce44e1.png)",
            }}
          ></div>
          <div className="flex items-center justify-center">
            <img
              className="h-[150px]"
              src="https://cdn.lofty.com/image/fs/servicetool/20251125/11/original_ec8cdd8d80414510.png"
            />
          </div>

          <h3 className="text-center text-white text-[28px] font-semibold tracking-wide">
            HOT DEAL ALERT!
          </h3>
          <div className="text-center text-[36px] font-extrabold text-white leading-tight mt-1">
            <span className="text-[#ffdc2a]">{percent}% OFF</span> YOUR TOTAL
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={onClose}
              className="text-[16px] mt-8 mb-24 px-12 py-3 rounded-[100px] text-[#F0454C] font-semibold bg-white hover:opacity-90"
              style={{outline: 'none', width: '300px'}}
            >
              Redeem My Discount
            </button>
          </div>

          <div
            className="w-full absolute"
            style={{
              paddingTop: `${3300 / 56}%`,
              bottom: 0,
              pointerEvents: 'none',
              backgroundSize: "cover",
              backgroundImage:
                "url(https://cdn.lofty.com/image/fs/servicetool/20251125/11/original_38a66dbb972c4183.png)",
            }}
          ></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoModal;
