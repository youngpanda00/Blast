import React from 'react';

interface Props {
  theme?: 'christmas'
  visible: boolean;
  percent: number; // 20
  expiresAt: number; // ms epoch
  onRedeem?: () => void;
  onClose?: () => void; // kept for compatibility, but not rendered
  clearPromo: ()=>void
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
            className="inline-flex h-8 w-6 items-center justify-center rounded-md bg-white/20 text-sm font-bold text-white h-[33px] w-[30px]"
          >
            {d}
          </span>
        ))}
      </div>
      <div className="mt-[5px] text-[10px] leading-none opacity-90" style={{color:'rgba(255, 255, 255, 0.5)'}}>{label}</div>
    </div>
  );
}

function usePromoCountdown(expiresAt?: number, clearPromo?: ()=>void) {
  const [now, setNow] = React.useState<number>(() => Date.now());

  React.useEffect(() => {
    if (!expiresAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return React.useMemo(() => {
    if (!expiresAt) return { ms: 0, mins: '00', secs: '00', expired: true } as const;
    const ms = Math.max(0, expiresAt - now);
    if (ms <= 0) {
      clearPromo()
    }
    const totalSeconds = Math.floor(ms / 1000);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const pad = (n:number) => String(n).padStart(2, '0');
    return { ms, mins: pad(mins), secs: pad(secs), expired: ms === 0 } as const;
  }, [expiresAt, now, clearPromo]);
}

export const PromoBanner: React.FC<Props> = ({ theme, visible, percent, expiresAt, clearPromo }) => {
  const timeLeft = usePromoCountdown(expiresAt, clearPromo);
  const actuallyVisible = visible && !timeLeft.expired;

  React.useEffect(() => {
    if (actuallyVisible) {
      document.documentElement.style.setProperty('--promo-banner-space', `76px`);
      return () => {
        document.documentElement.style.setProperty('--promo-banner-space', '0px');
      };
    }
    document.documentElement.style.setProperty('--promo-banner-space', '0px');
  }, [actuallyVisible]);

  if (!actuallyVisible) return null;

  const totalMins = Number(timeLeft.mins) || 0;
  const sec = Number(timeLeft.secs) || 0;
  const totalSeconds = Math.max(0, totalMins * 60 + sec);

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const showPair: 'day-hour' | 'hour-min' | 'min-sec' = days > 0 ? 'day-hour' : hours > 0 ? 'hour-min' : 'min-sec';

  return (
    <div id="promo-banner" data-promo-banner className={`fixed left-0 right-0 top-[50px] md:top-[60px] z-40 shadow-lg ${theme === 'christmas' ? 'bg-[#184e02]' : 'bg-gradient-to-r from-[#547AF2] via-[#7A5AF8] to-[#9B5CF6]'}`}>
      <div className="w-full max-w-[1210px] max-md:px-4 mx-auto text-white pt-[8px] py-[9px] flex items-center gap-3">
        {
          theme === 'christmas' ? <>
          <div className="flex max-md:flex-col items-center gap-[2px] md:gap-[10px]">
          <div className="flex gap-[5px] align-end">
            <img className="w-[52px] md:w-[68px]" src="https://cdn.lofty.com/image/fs/servicetool/2025125/9/original_14ff3d88365f4cd9.png" />
            <span className="text-[20px] md:text-[24px] font-bold text-[#ffe047]">Save {percent}%</span>
          </div>
          <span className="text-[12px] md:text-[16px] text-[#ffffff] opacity-70 md:mr-[40px]">On Your Next Campaign</span>
          </div>
          </>:<>
        <span className="uppercase tracking-wide text-sm font-bold">Special Offer:</span>
        <span className="bg-[#F59E0B] text-white text-xs font-bold px-2 py-0.5 rounded-md">{percent}% OFF</span>
        <span className="hidden md:inline text-sm font-bold">on all plans - Offer expires in:</span>
          </>
        }

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
  );
};

export default PromoBanner;
