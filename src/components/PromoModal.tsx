import React, { useEffect, useMemo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (v:boolean)=>void;
  percent: number; // e.g. 20
  expiresAt: number; // ms
}

export const PromoModal: React.FC<Props> = ({ open, onOpenChange, percent, expiresAt }) => {
  // build confetti pieces positions (static per mount)
  const pieces = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    color: [
      '#7C3AED', '#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#F472B6'
    ][i % 6]
  })), []);

  useEffect(() => {
    if (!open) return;
    // disable background scroll while open
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    }
  }, [open]);

  const deadline = new Date(expiresAt);
  const rangeText = !isNaN(deadline.getTime()) ? `valid for ${Math.max(1, Math.round((expiresAt - Date.now())/86400000))} day(s)!` : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[560px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="relative p-8 bg-white">
          {/* confetti */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {pieces.map((p, i) => (
              <span
                key={i}
                style={{
                  left: `${p.left}%`,
                  animationDelay: `${p.delay}s`,
                  backgroundColor: p.color
                }}
                className="absolute top-0 w-1.5 h-2 rounded-[2px] animate-confetti"
              />
            ))}
          </div>

          {/* Icon circle */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🎉</span>
          </div>

          <h3 className="text-center text-[#6A41F5] text-sm font-semibold tracking-wide">HOT DEAL ALERT!</h3>
          <div className="text-center text-3xl md:text-[40px] font-extrabold text-[#5B21B6] leading-tight mt-1">
            {percent}% OFF YOUR TOTAL
          </div>
          <p className="text-center text-gray-600 mt-3">Celebrate with your exclusive discount!</p>
          <p className="text-center text-gray-600 mt-1">Enter your email to redeem <span className="inline-block align-baseline px-2 py-0.5 text-white bg-[#F59E0B] rounded-md text-sm font-bold">{percent}% OFF</span> - {rangeText}</p>

          <div className="mt-5">
            <input type="email" placeholder="Your email address" className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            <button className="mt-4 w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#547AF2] to-[#8B5CF6] hover:opacity-90">
              Redeem My Discount
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 mt-3">
            Your email is safe with us
          </div>
          <div className="text-center text-sm mt-2">
            <button onClick={() => onOpenChange(false)} className="text-[#536DF6] hover:underline">Not now? (Don't miss out!)</button>
          </div>
        </div>

        <style jsx>{`
          @keyframes confetti {
            0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
            10% { opacity: 1; }
            100% { transform: translateY(400px) rotate(360deg); opacity: 0; }
          }
          .animate-confetti { animation: confetti 1.8s ease-in forwards; }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default PromoModal;
