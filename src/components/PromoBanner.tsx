import React from 'react';

interface Props {
  visible: boolean;
  percent: number; // 20
  mins: string; // total minutes remaining as a zero-padded string
  secs: string; // seconds remaining as a zero-padded string
  onRedeem?: () => void;
  onClose?: () => void; // kept for compatibility, but not rendered
}

function splitDigits(value: number | string, minLen = 2) {
  const s = String(value).padStart(minLen, '0');
  return s.split('');
}

function TimeBlock({ label, value, minLen = 2 }: { label: string; value: number; minLen?: number }) {
  const digits = splitDigits(value, minLen);
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {digits.map((d, i) => (
          <span
            key={i}
            className="inline-flex h-8 w-6 items-center justify-center rounded-md bg-white/20 text-sm font-bold text-white md:h-9 md:w-7"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-1.5 text-[10px] leading-none opacity-90">{label}</div>
    </div>
  );
}

export const PromoBanner: React.FC<Props> = ({ visible, percent, mins, secs }) => {
  if (!visible) return null;

  const totalMins = Number(mins) || 0;
  const sec = Number(secs) || 0;
  const totalSeconds = Math.max(0, totalMins * 60 + sec);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const showPair: 'day-hour' | 'hour-min' | 'min-sec' = days > 0 ? 'day-hour' : hours > 0 ? 'hour-min' : 'min-sec';

  return (
    <div id="promo-banner" data-promo-banner className="fixed left-0 right-0 top-[50px] md:top-[60px] z-40">
      <div className="w-full">
        <div className="w-full shadow-lg bg-gradient-to-r from-[#547AF2] via-[#7A5AF8] to-[#9B5CF6] text-white px-4 md:px-6 py-2 md:py-3 flex items-center gap-3">
          <span className="uppercase tracking-wide text-sm">Special Offer:</span>
          <span className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-0.5 rounded-md">{percent}% OFF</span>
          <span className="hidden md:inline text-sm">on all plans · Offer expires in:</span>

          <div className="flex items-center gap-2 md:gap-3">
            {showPair === 'day-hour' && (
              <>
                <TimeBlock label="DAY" value={days} minLen={Math.max(2, String(days).length)} />
                <span className="-mt-4 text-lg font-bold opacity-80">:</span>
                <TimeBlock label="HOUR" value={hours} />
              </>
            )}
            {showPair === 'hour-min' && (
              <>
                <TimeBlock label="HOUR" value={hours} />
                <span className="-mt-4 text-lg font-bold opacity-80">:</span>
                <TimeBlock label="MIN" value={minutes} />
              </>
            )}
            {showPair === 'min-sec' && (
              <>
                <TimeBlock label="MIN" value={minutes} />
                <span className="-mt-4 text-lg font-bold opacity-80">:</span>
                <TimeBlock label="SEC" value={seconds} />
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
