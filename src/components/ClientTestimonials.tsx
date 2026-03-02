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
  const cardWidth = isMobile ? 280 : 410; // Mobile: 260px card + 20px gap, Desktop: 390px card + 20px gap
  const cardHeight = 270; // Mobile vertical: 250px card + 20px gap
  const totalCards = testimonials.length;
  const showNavigation = totalCards > 3;
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    if (!isPaused && showNavigation) {
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
    <section className="bg-white max-md:bg-[#121233] flex w-full flex-col items-center justify-center py-20 px-25 max-md:px-4 max-md:py-12">
      <div className="flex w-full max-w-[1240px] flex-col items-center max-md:max-w-full">
        <h2 className="text-[34px] leading-none text-center text-gray-900 max-md:text-white font-medium mb-5 max-md:text-[24px] max-md:mb-4">
          What Our Clients Say
        </h2>

        <p className="text-gray-600 max-md:text-[#bcbec0] text-center font-normal leading-[23px] max-w-full max-md:text-sm max-md:leading-[20px]">
          With our constant innovations, <br className="max-md:block hidden" />
          LoftyBlast listen to what our users say.
        </p>

        {/* User testimonials section with navigation */}
        <div
          className="relative w-full mt-10 xl:flex xl:items-center xl:gap-8 max-md:mt-8"
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
              className={`flex gap-[20px] max-md:flex-col max-md:items-center ${!showNavigation ? "justify-center" : ""} ${showNavigation && isTransitioning ? "transition-transform duration-300 ease-in-out" : ""}`}
              style={
                showNavigation
                  ? { transform: isMobile ? `translateY(-${currentIndex * cardHeight}px)` : `translateX(-${currentIndex * cardWidth}px)` }
                  : undefined
              }
            >
              {(showNavigation ? extendedTestimonials : testimonials).map((testimonial, index) => (
                <div
                  key={`${index}-${testimonial.name}`}
                  className="flex-shrink-0 w-[400px] md:w-[400px] max-md:w-full"
                  style={{ height: "250px" }}
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
