import React from 'react';

interface Props {
  visible: boolean;
  percent: number; // 20
  mins: string;
  secs: string;
  onRedeem?: () => void;
  onClose?: () => void;
}

export const PromoBanner: React.FC<Props> = ({ visible, percent, mins, secs, onRedeem, onClose }) => {
  if (!visible) return null;
  return (
    <div className="fixed left-0 right-0 top-[50px] md:top-[60px] z-40">
      <div className="mx-auto max-w-[1210px]">
        <div className="mx-3 md:mx-[22px] rounded-lg shadow-lg bg-gradient-to-r from-[#547AF2] via-[#7A5AF8] to-[#9B5CF6] text-white px-4 py-2 flex items-center gap-3">
          <span className="uppercase tracking-wide text-sm">Special Offer:</span>
          <span className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-0.5 rounded-md">{percent}% OFF</span>
          <span className="hidden md:inline text-sm">on all plans · Offer expires in:</span>
          <div className="ml-auto flex items-center gap-2">
            <div className="bg-white/20 rounded-md px-2 py-1 text-center leading-none">
              <div className="text-sm font-bold">{mins}</div>
              <div className="text-[10px] opacity-90">MIN</div>
            </div>
            <div className="bg-white/20 rounded-md px-2 py-1 text-center leading-none">
              <div className="text-sm font-bold">{secs}</div>
              <div className="text-[10px] opacity-90">SEC</div>
            </div>
            <button onClick={onRedeem} className="ml-2 bg-white text-[#5B21B6] hover:bg-gray-100 text-sm font-semibold px-3 py-1 rounded-md">Redeem Voucher</button>
            <button aria-label="Close" onClick={onClose} className="ml-1/2 opacity-80 hover:opacity-100">✕</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
