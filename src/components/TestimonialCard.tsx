import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { trackFBEvent, trackMixPanel } from "@/lib/utils";
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
  const [showVideo, setShowVideo] = useState(false);
  const isMobile = useIsMobile();
  const handleVideoClick = () => {
    if (videoUrl) {
      setShowVideo(true)
      trackMixPanel("click", {
        page_name: "ListingBlastSP",
        feature_name: "ListingBlast",
        click_item: 'agent review',
        click_action: "video_play"
      });
      trackFBEvent('agent review')
    }
  }
  return (
    <>
      <div
        className="flex flex-col relative"
        style={{ width: '100%', height: '100%',  background: "linear-gradient(90deg, rgba(59, 92, 222, 1) 0%, rgba(115, 64, 216, 0.8) 100%)" }}
      >
        <img style={{ width: '100%', height: '100%', objectFit: 'cover', zIndex: 10, opacity: 0.2 }} src="https://cdn.lofty.com/image/fs/servicetool/2026228/5/original_8bc2b13de4a44b74.png" alt="Testimonial bg" className="w-full h-full object-cover absolute top-0 left-0" />
        <div className="w-full h-full object-cover absolute flex items-center justify-center cursor-pointer transition-colors" style={{ width: isMobile ? '46px' : '54px', height: isMobile ? '46px' : '54px', background: isHovered ? 'rgba(81,96,102,1)' : 'rgba(81,96,102,0.6)', zIndex: 11, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%' }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={() => handleVideoClick()}>
          <img style={{ width: isMobile ? '20px' : '23px', height: isMobile ? '22px' :'26px', marginLeft: isMobile ? '4px' : '5px' }} src="https://cdn.lofty.com/image/fs/servicetool/2026228/8/original_1ad23a454eac4482.png" alt="Testimonial video" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col relative" style={{ height: '100%' }}>
          <img style={{ width: isMobile ? '86px' : '117px', height: isMobile ? '16px' : '22px', margin: '16px auto 10px 20px' }} src="https://cdn.lofty.com/image/fs/servicetool/2026228/6/original_2e5a571ff4de47cc.png" alt="lofty blast logo" className="w-full h-full object-contain" />
          <div className="flex flex-row justify-center items-center" style={{ padding: isMobile ? '0 20px 0 20px' : '0 30px 0 24px', gap: '23px', height: '100%' }}>
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center items-center" style={{ background: 'linear-gradient(90deg, #F55B00 16.98%, #FCBF5C 80.74%, #FFCF4C 98.09%)', borderRadius: '50%', width: isMobile ? '90px' : '120px', height: isMobile ? '90px' : '120px' }}>
                <img style={{ minWidth: isMobile ? '82px' : '110px', minHeight: isMobile ? '82px' : '110px', width: isMobile ? '82px' : '110px', height: isMobile ? '82px' : '110px', borderRadius: '50%', zIndex: '10' }} src={avatar} alt="user avatar" className="w-full h-full object-contain" />
              </div>
              <div className="text-white font-bold text-center" style={{ lineHeight: '1.5', marginTop: '10px', whiteSpace: 'nowrap', fontSize : isMobile? '10px': '12px' }}>{name}</div>
            </div>
            <div className="text-white text-sm font-normal" style={{ fontSize: isMobile ? '14px':'16px', lineHeight: '1.4', marginBottom: '20px', display: '-webkit-box', WebkitLineClamp: 8, WebkitBoxOrient: 'vertical', overflow: 'hidden', fontWeight: 'bold' }} dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
      {showVideo && videoUrl && ReactDOM.createPortal(
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowVideo(false)}
        >
          <div style={{ position: 'relative', maxWidth: '80vw', maxHeight: '80vh' }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              style={{ position: 'absolute', top: '-40px', right: '0', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', lineHeight: 1 }}
            >
              ✕
            </button>
            <video
              src={videoUrl}
              controls
              autoPlay
              style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: '8px' }}
              onEnded={(e) => { e.currentTarget.currentTime = 0; }}
            />
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
