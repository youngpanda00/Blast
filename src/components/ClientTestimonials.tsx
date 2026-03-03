import React, { useState, useRef, useEffect } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const testimonials = [
  { 
    name: "Michelle Quackenbush",
    content:
      "“The ad stats help me present to my sellers, <span class='special-text-color'>building trust</span>. I've sold homes through Listing Blast. If you haven't tried it, I suggest it!”",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2026228/8/original_c6cbb731cf114c52.jpg",
    videoUrl: 'https://cdn.lofty.com/doc/fs/servicetool/202632/2/2728df00c1694026/michelle_video.mov'
  },
  {
    name: "Scott Connors",
    content:
      "“In 3 clicks, I create ads - and in <span class='special-text-color'>just a few days</span>, I generate 25 leads with Listing Blast!”",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2026228/8/original_602564aa973b43ae.jpg",
    videoUrl: 'https://cdn.lofty.com/doc/fs/servicetool/202632/2/b5083fae75384164/scott_video.mov'
  },
  {
    name: "Molly Armando",
    content:
      "“Listing Blast has really become <span class='special-text-color'>one of the easiest ways</span> for me to stay consistent with my marketing while still keeping my business moving forward.”",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2026228/6/original_75dce805e5344ea8.jpg",
    videoUrl: 'https://static.chimeroi.com/servicetool-temp/2026-3-2/2/9e5576d0085045e1_f2f869d7821740ea_MollyArmando_video.mov'
  }
];

export const ClientTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(7); // Start at the second set (original)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const cardWidth = isMobile ? 340 : 410; // Mobile: 330px card + 10px gap, Desktop: 390px card + 20px gap
  const totalCards = testimonials.length;
  const showNavigation = isMobile || totalCards > 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Create extended array with duplicates for infinite scrolling
  const extendedTestimonials = [
    ...testimonials, // First set of duplicates
    ...testimonials, // Original set
    ...testimonials, // Second set of duplicates
  ];

  const handlePrevious = () => {
    setCurrentIndex((prev) => prev - 1);
    setIsTransitioning(true);
    setIsPaused(true); // Pause autoplay when user interacts
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
    setIsPaused(true); // Pause autoplay when user interacts
  };

  const autoNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setIsTransitioning(true);
  };

  // Handle infinite loop transitions
  useEffect(() => {
    if (!showNavigation) return;
    if (currentIndex <= 0) {
      // If we've gone before the first duplicate set, jump to the last set
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalCards * 2 + currentIndex);
      }, 300);
    } else if (currentIndex >= totalCards * 2) {
      // If we've gone past the second duplicate set, jump to the first set
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(currentIndex - totalCards);
      }, 300);
    }
  }, [currentIndex, totalCards, showNavigation]);

  // Re-enable transitions after jumping
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused && showNavigation && !isMobile) {
      autoplayTimerRef.current = setInterval(() => {
        autoNext();
      }, 4000); // Auto-advance every 4 seconds
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
        autoplayTimerRef.current = null;
      }
    };
  }, [currentIndex, isPaused, showNavigation]);

  // Resume autoplay after user interaction pause
  useEffect(() => {
    if (isPaused) {
      const resumeTimer = setTimeout(() => {
        setIsPaused(false);
      }, 8000); // Resume after 8 seconds of no interaction

      return () => clearTimeout(resumeTimer);
    }
  }, [isPaused]);

  return (
    <section className="bg-white flex w-full flex-col items-center justify-center py-20 px-25 max-md:py-12" style={{padding: isMobile ? '40px 0 40px 15px' : '120px 0' }}>
      <div className="flex w-full max-w-[1240px] flex-col items-center max-md:max-w-full">
        <h2 className="text-[34px] leading-none text-center text-gray-900 font-medium mb-5 max-md:text-[24px]" style={{marginBottom: isMobile ? '10px': '14px' }}>
          What Our Clients Say
        </h2>

        <p className="text-center font-normal leading-[23px] max-w-full max-md:text-sm max-md:leading-[20px]" style={{paddingRight: '15px', color: isMobile ? 'rgba(0, 0, 0, 1)' : 'rgba(81, 86, 102, 1)', fontSize: isMobile ? '14px': '16px'}}>
          With our constant innovations,
          LoftyBlast listen to what our users say.
        </p>

        {/* User testimonials section with navigation */}
        <div
          className="relative w-full mt-10 xl:flex xl:items-center xl:gap-8"
          style={{marginTop: isMobile ? '20px' : '40px'}}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation buttons */}
          {showNavigation && (
            <button
              onClick={handlePrevious}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-40 hover:opacity-100 hover:bg-gray-50 transition-all xl:relative xl:left-auto xl:top-auto xl:transform-none xl:opacity-100 max-md:hidden"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>
          )}

          {/* Testimonials container */}
          <div className="overflow-hidden xl:flex-1 relative">
            {showNavigation && (
              <button
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-40 hover:opacity-100 hover:bg-gray-50 transition-all xl:hidden max-md:hidden"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-600" />
              </button>
            )}
            <div
              ref={containerRef}
              className={`flex gap-[20px] max-md:gap-[10px] ${!showNavigation ? "justify-center" : ""} ${showNavigation && isTransitioning ? "transition-transform duration-300 ease-in-out" : ""}`}
              style={
                showNavigation
                  ? { transform: `translateX(-${currentIndex * cardWidth}px)` }
                  : undefined
              }
              onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
              onTouchMove={(e) => { touchEndX.current = e.touches[0].clientX; }}
              onTouchEnd={() => {
                const delta = touchStartX.current - touchEndX.current;
                if (Math.abs(delta) > 50) {
                  if (delta > 0) { handleNext(); } else { handlePrevious(); }
                }
              }}
            >
              {(showNavigation ? extendedTestimonials : testimonials).map((testimonial, index) => (
                <div
                  key={`${index}-${testimonial.name}`}
                  className="flex-shrink-0 w-[400px] md:w-[400px] max-md:w-[330px]"
                  style={{ height: isMobile ? "206px" : "250px" }}
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          {showNavigation && (
            <button
              onClick={handleNext}
              className="hidden xl:block bg-white shadow-lg rounded-full p-2 opacity-100 hover:bg-gray-50 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
