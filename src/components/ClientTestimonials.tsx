import React, { useState, useRef, useEffect } from "react";
import { TestimonialCard } from "./TestimonialCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "../hooks/use-mobile";

const testimonials = [
  { 
    name: "Alexander Reid",
    date: "Jan 15, 2025 at 08:17 AM",
    content:
      "Listing Blast automates my ad setup in seconds, saving me hours every week. 😎🚀",
    likes: "320",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025712/3/original_4755f70050e7481c.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
  {
    name: "Laurie Deckert",
    date: "Feb 28, 2025 at 02:45 PM",
    content:
      "Listing Blast instantly expands my listings’ reach on Facebook and Instagram, connecting me with more motivated buyers.",
    likes: "277",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025712/3/original_7987ceec89d74490.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
  {
    name: "Daniel Gandee",
    date: "Mar 08, 2025 at 11:22 AM",
    content:
      "Listing Blast effortlessly drove high-quality leads and saved me time—it was a breeze to set up.",
    likes: "189",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025712/3/original_ad6e788d40a04fdf.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
  {
    name: "Jeff McIntyre",
    date: "Apr 22, 2025 at 07:30 PM",
    content:
      "Listing Blast expanded my reach instantly 😊—I’m connecting with more buyers every day.",
    likes: "143",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025714/7/original_2249eef0c7434aac.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
  {
    name: "Kerri Kilgore & Owen Davies",
    date: "May 05, 2025 at 10:05 AM",
    content:
      "Listing Blast provides cost-effective marketing with impressive engagement and no budget strain.",
    likes: "95",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025712/3/original_d7c5938cd53a4118.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
  {
    name: "Josh Cotton",
    date: "May 30, 2025 at 03:50 PM",
    content:
      "Listing Blast was easy to set up and immediately generated a surge of leads and buyers. 🔥",
    likes: "210",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025714/7/original_7d2729e6da0f437a.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
  {
    name: "Blaine Cruse",
    date: "June 24 at 10:01 PM",
    content:
      "Facebook ads are tricky to manage, so I’ve stuck with Lofty—and this time, it really paid off. My latest ad hit a $3.97 CPL, the best I’ve ever seen! 🔥🔥",
    likes: "334",
    avatar:
      "https://cdn.lofty.com/image/fs/servicetool/2025714/7/original_b5a1d0ca4ee74031.png",
    hasLikeButton: true,
    hasCommentButton: false,
  },
];

export const ClientTestimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(7); // Start at the second set (original)
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const cardWidth = isMobile ? 280 : 410; // Mobile: 260px card + 20px gap, Desktop: 390px card + 20px gap
  const totalCards = testimonials.length;
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
  }, [currentIndex, totalCards]);

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
    if (!isPaused) {
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
  }, [currentIndex, isPaused]);

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
          <button
            onClick={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-40 hover:opacity-100 hover:bg-gray-50 transition-all xl:relative xl:left-auto xl:top-auto xl:transform-none xl:opacity-100 max-md:hidden"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* Testimonials container */}
          <div className="overflow-hidden xl:flex-1 relative">
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 opacity-40 hover:opacity-100 hover:bg-gray-50 transition-all xl:hidden max-md:hidden"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
            <div
              ref={containerRef}
              className={`flex gap-[20px] ${isTransitioning ? "transition-transform duration-300 ease-in-out" : ""}`}
              style={{
                transform: `translateX(-${currentIndex * cardWidth}px)`,
              }}
            >
              {extendedTestimonials.map((testimonial, index) => (
                <div
                  key={`${index}-${testimonial.name}`}
                  className="flex-shrink-0 w-[240px] md:w-[390px]"
                  style={{ height: "210px" }}
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleNext}
            className="hidden xl:block bg-white shadow-lg rounded-full p-2 opacity-100 hover:bg-gray-50 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </section>
  );
};
