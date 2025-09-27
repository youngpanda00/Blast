import React, { useCallback, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (v:boolean)=>void;
  percent: number; // e.g. 20
  expiresAt: number; // ms
  onSubmitEmail: (email:string)=>void;
}

export const PromoModal: React.FC<Props> = ({ open, onOpenChange, percent, expiresAt, onSubmitEmail }) => {
  // build confetti pieces positions (static per mount)
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
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    }
  }, [open]);

  const deadline = new Date(expiresAt);
  const dayCount = Math.max(1, Math.round((expiresAt - Date.now())/86400000))
  const rangeText = !isNaN(deadline.getTime()) ? `valid for ${dayCount} ${dayCount <= 1 ? 'day' : 'days'} only!` : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Full-screen confetti overlay via portal */}
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

      <DialogContent className="max-w-[560px] p-0 overflow-hidden border-0 shadow-2xl rounded-2xl">
        <div className="relative p-8 bg-white">
          {/* Icon circle */}
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center mb-4">
            <span className="text-2xl">🎉</span>
          </div>

          <h3 className="text-center text-[#853cE2] text-[28px] font-semibold tracking-wide">HOT DEAL ALERT!</h3>
          <div className="text-center text-[36px] font-extrabold text-[#853cE2] leading-tight mt-1">
            {percent}% OFF YOUR TOTAL
          </div>
          <p className="text-center text-gray-600 mt-5 text-[22px]">Celebrate with your exclusive discount!</p>
          <p className="text-center text-gray-600 mt-1 text-[16px]">Enter your email to redeem <span className="inline-block align-baseline px-2 py-0.5 text-white bg-[#F59E0B] rounded-md text-sm font-bold transform -rotate-6">{percent}% OFF</span> - {rangeText}</p>

          <FormSection onSubmitEmail={onSubmitEmail} onClose={() => onOpenChange(false)} />

          <div className="mt-0 text-sm text-gray-500 w-full flex flex-col items-center justify-center gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <span className="text-center md:text-left">Your email is safe with us</span>
            <button onClick={() => onOpenChange(false)} className="text-[#536DF6] hover:underline whitespace-nowrap text-center md:text-right">Not now? (Don't miss out!)</button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FormSection: React.FC<{ onSubmitEmail:(email:string)=>void; onClose:()=>void }>=({ onSubmitEmail, onClose })=>{
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email) {
      onClose()
      return
    }
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    try {
      const u = `/api-blast/email-submission?email=${encodeURIComponent(email)}&source=2`;
      await fetch(u, { method: 'GET' });
    } catch (_) {
      // swallow network errors; redemption UI shouldn't block on this
    }
    onSubmitEmail(email);
    onClose();
  };

  const onChange = useCallback((e)=>{
    setEmail(e.target.value)
    setError(null)
  }, [])

  return (
    <div className="mt-[44px]">
      <input
        type="email"
        value={email}
        onChange={onChange}
        placeholder="Your email address"
        className="w-full border rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400"
      />
      {error && (<div className="mt-2 text-red-600 text-sm">{error}</div>)}
      <button onClick={handleSubmit} className="text-[16px] mt-5 mb-5 w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-[#547AF2] to-[#8B5CF6] hover:opacity-90">
        Redeem My Discount
      </button>
    </div>
  );
};

export default PromoModal;
