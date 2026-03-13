import React, { useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  percent: number; // e.g. 20
  expiresAt?: number;
  onSubmitEmail?: (email: string) => void;
}

export const PromoPop: React.FC<Props> = ({ open, onOpenChange, percent }) => {
  const pieces = useMemo(() => Array.from({ length: 60 }).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 1.2,
    color: [
      '#7C3AED', '#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#F472B6'
    ][i % 6]
  })), []);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    }
  }, [open]);

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
            @media (min-width: 1500px) and (max-width: 1999px) {
              .promo-pop-content { transform: translate(-50%, -50%) scale(1.2); }
            }
            @media (min-width: 2000px) and (max-width: 2399px) {
              .promo-pop-content { transform: translate(-50%, -50%) scale(1.4); }
            }
            @media (min-width: 2400px) {
              .promo-pop-content { transform: translate(-50%, -50%) scale(1.6); }
            }
          `}</style>
        </>,
        document.body
      )}

      <DialogContent className="promo-pop-content max-md:max-w-[340px] md:max-w-[600px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="relative bg-white">
          {/* Header background */}
          <div
            className="w-full bg-cover"
            style={{
              paddingTop: '28.762541806020064%',
              backgroundImage: 'url(https://cdn.lofty.com/image/fs/servicetool/2025129/11/original_d53ac8ce372d41ed.png)'
            }}
          />

          {/* Gift icon */}
          <div className="flex items-center justify-center -mt-[86px]">
            <img
              style={{ height: 124 }}
              src="https://cdn.lofty.com/image/fs/servicetool/2025129/11/original_f988dd8b41a34ea0.png"
              alt=""
            />
          </div>

          <h3 className="text-center text-transparent bg-clip-text bg-gradient-to-l from-[#853ce2] to-[#4f6ce1] text-[34px] max-md:text-[18px] font-bold">
            HOT DEAL ALERT!
          </h3>
          <div className="text-center text-transparent bg-clip-text bg-gradient-to-l from-[#853ce2] to-[#4f6ce1] text-[44px] max-md:text-[24px] font-bold mt-5">
            <span>{percent}% OFF</span> YOUR TOTAL
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={() => onOpenChange(false)}
              className="text-[18px] leading-5 mt-[30px] mb-[70px] py-3 px-3 rounded-full text-white font-bold bg-gradient-to-r from-[#4f80ee] to-[#853ce2] hover:opacity-90 w-[400px] max-md:w-[220px] outline-none"
            >
              Redeem My Discount
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PromoPop;
