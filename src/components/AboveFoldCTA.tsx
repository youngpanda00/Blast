import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { ArrowDown, Zap, TrendingUp } from 'lucide-react';

interface AboveFoldCTAProps {
  onGetStarted: () => void;
}

export const AboveFoldCTA: React.FC<AboveFoldCTAProps> = ({ onGetStarted }) => {
  const isMobile = useIsMobile();

  const scrollToPackages = () => {
    const packagesSection = document.querySelector('[data-section="packages"]');
    if (packagesSection) {
      packagesSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8 max-md:py-6">
        <div className="text-center">
          {/* Main headline */}
          <h1 className="text-4xl max-md:text-2xl font-bold text-gray-900 mb-4 max-md:mb-3">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Boost Your Listing
            </span>{' '}
            with AI-Powered Ads
          </h1>
          
          {/* Subheadline */}
          <p className="text-lg max-md:text-base text-gray-600 mb-6 max-md:mb-4 max-w-2xl mx-auto leading-relaxed">
            Turn your property listing into high-performing Facebook ads. Get more views, generate qualified leads, and sell faster.
          </p>

          {/* Stats bar */}
          <div className="flex items-center justify-center gap-8 max-md:gap-4 mb-8 max-md:mb-6 max-md:flex-wrap">
            <div className="flex items-center gap-2 text-sm max-md:text-xs">
              <div className="w-8 h-8 max-md:w-6 max-md:h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 max-md:w-3 max-md:h-3 text-blue-600" />
              </div>
              <span className="font-medium text-gray-700">2K+ avg views</span>
            </div>
            <div className="flex items-center gap-2 text-sm max-md:text-xs">
              <div className="w-8 h-8 max-md:w-6 max-md:h-6 bg-purple-100 rounded-full flex items-center justify-center">
                <Zap className="w-4 h-4 max-md:w-3 max-md:h-3 text-purple-600" />
              </div>
              <span className="font-medium text-gray-700">Live in 24hrs</span>
            </div>
            <div className="flex items-center gap-2 text-sm max-md:text-xs">
              <div className="w-8 h-8 max-md:w-6 max-md:h-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 max-md:w-3 max-md:h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">9+ leads/week</span>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex items-center justify-center gap-4 max-md:flex-col max-md:gap-3">
            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 max-md:px-6 max-md:py-3 rounded-full font-semibold text-lg max-md:text-base shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 flex items-center gap-2 max-md:w-full max-md:justify-center"
            >
              <Zap className="w-5 h-5 max-md:w-4 max-md:h-4" />
              Start Promoting Now
            </button>
            
            <button
              onClick={scrollToPackages}
              className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 px-8 py-4 max-md:px-6 max-md:py-3 rounded-full font-semibold text-lg max-md:text-base bg-white hover:bg-gray-50 transition-all duration-200 flex items-center gap-2 max-md:w-full max-md:justify-center"
            >
              View Packages
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          {/* Trust indicator */}
          <div className="mt-6 max-md:mt-4">
            <p className="text-sm max-md:text-xs text-gray-500">
              ✓ No long-term contracts  ✓ Cancel anytime  ✓ Results guaranteed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
