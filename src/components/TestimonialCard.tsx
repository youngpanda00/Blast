import React, { useState } from "react";

interface TestimonialCardProps {
  name: string;
  content: string;
  avatar?: string;
  videoUrl?: string;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  content,
  avatar,
  videoUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className="flex flex-col relative"
      style={{ width: '400px', height: '250px',  background: "linear-gradient(90deg, #3B5CDE 0%, #7340D8 100%)" }}
    >
      <img style={{ width: '400px', height: '250px', objectFit: 'cover', zIndex: 10, opacity: 0.2 }} src="https://cdn.lofty.com/image/fs/servicetool/2026228/5/original_8bc2b13de4a44b74.png" alt="Testimonial bg" className="w-full h-full object-cover absolute top-0 left-0" />
      <div className="w-full h-full object-cover absolute flex items-center justify-center cursor-pointer transition-colors" style={{ width: '54px', height: '54px', background: isHovered ? 'rgba(81,96,102,1)' : 'rgba(81,96,102,0.6)', zIndex: 11, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <img style={{ width: '23px', height: '26px' }} src="https://cdn.lofty.com/image/fs/servicetool/2026228/8/original_1ad23a454eac4482.png" alt="Testimonial video" className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col relative" style={{ height: '100%' }}>
        <img style={{ width: '117px', height: '22px', margin: '16px auto 10px 20px' }} src="https://cdn.lofty.com/image/fs/servicetool/2026228/6/original_2e5a571ff4de47cc.png" alt="lofty blast logo" className="w-full h-full object-contain" />
        <div className="flex flex-row justify-center items-center" style={{ padding: '0 30px 0 24px', gap: '23px', height: '100%' }}>
          <div className="flex flex-col justify-center items-center">
            <div className="flex justify-center items-center" style={{ background: 'linear-gradient(90deg, #F55B00 16.98%, #FCBF5C 80.74%, #FFCF4C 98.09%)', borderRadius: '50%', width: '120px', height: '120px' }}>
              <img style={{ minWidth: '110px', minHeight: '110px', width: '110px', height: '110px', borderRadius: '50%' }} src={avatar} alt="user avatar" className="w-full h-full object-contain" />
            </div>
            <div className="text-white font-bold text-center" style={{ fontSize: '12px', lineHeight: '1.5', marginTop: '10px', whiteSpace: 'nowrap' }}>{name}</div>
          </div>
          <div className="text-white text-sm font-normal" style={{ fontSize: '16px', lineHeight: '1.4', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical', overflow: 'hidden' }} dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </div>
    </div>
  );
};
