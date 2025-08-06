import React, { useState, useEffect } from "react";

export const FixedNavigation: React.FC = () => {
  const [isAtTop, setIsAtTop] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击外部区域关闭���单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const nav = event.target as Element;
      if (isMobileMenuOpen && !nav?.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isMobileMenuOpen]);

  const handleNavClick = (e: React.MouseEvent) => {
    // Scroll to top or navigate to home
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 bg-white px-[22px] max-md:px-4 h-[60px] max-md:h-[50px] flex items-center border-b border-gray-100 transition-all duration-300 ${
      isAtTop ? 'nav-transparent' : ''
    }`}>
      <div className="w-full max-w-[1210px] mx-auto flex items-center h-full max-md:justify-between">
        {/* Logo */}
        <div className="flex items-center justify-center mr-8 max-md:mr-0 max-md:h-full">
          <a href="https://lofty.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center max-md:h-full">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2F0325b400e1904671b7c00a9f4f5084b6?format=webp&width=800"
              className={`h-8 transition-all duration-300 max-md:h-6 ${
                isAtTop ? 'brightness-0 invert' : ''
              }`}
              alt="Lofty Blast Logo"
            />
          </a>
        </div>

        {/* Navigation Menu - next to logo on left */}
        <div className="flex items-center max-md:hidden h-full max-lg:hidden">
          <a
            href="/home?anchor=Products"
            onClick={handleNavClick}
            className={`relative font-medium text-sm h-full flex items-center group ${
              isAtTop ? 'text-white' : 'text-[#515666]'
            }`}
            style={{
              marginRight: '35px',
              transition: 'background-color 0.5s ease 0s, color 0.5s ease 0s, border-color 0.5s ease 0s'
            }}
          >
            Products
            <span 
              className={`absolute bottom-0 left-0 w-full h-1 bg-[#3b5cde] opacity-0 rounded-t-[2px] ${
                isAtTop ? '' : 'group-hover:opacity-100'
              }`}
              style={{
                transition: 'opacity 0.5s ease 0s'
              }}
            ></span>
          </a>
          <a
            href="/home?anchor=CampaignCalculator"
            onClick={handleNavClick}
            className={`relative font-medium text-sm h-full flex items-center group ${
              isAtTop ? 'text-white' : 'text-[#515666]'
            }`}
            style={{
              marginRight: '35px',
              transition: 'background-color 0.5s ease 0s, color 0.5s ease 0s, border-color 0.5s ease 0s'
            }}
          >
            Campaign Calculator
            <span 
              className={`absolute bottom-0 left-0 w-full h-1 bg-[#3b5cde] opacity-0 rounded-t-[2px] ${
                isAtTop ? '' : 'group-hover:opacity-100'
              }`}
              style={{
                transition: 'opacity 0.5s ease 0s'
              }}
            ></span>
          </a>
          <a
            href="/home?anchor=Contact"
            onClick={handleNavClick}
            className={`relative font-medium text-sm h-full flex items-center group ${
              isAtTop ? 'text-white' : 'text-[#515666]'
            }`}
            style={{
              transition: 'background-color 0.5s ease 0s, color 0.5s ease 0s, border-color 0.5s ease 0s'
            }}
          >
            Contact
            <span 
              className={`absolute bottom-0 left-0 w-full h-1 bg-[#3b5cde] opacity-0 rounded-t-[2px] ${
                isAtTop ? '' : 'group-hover:opacity-100'
              }`}
              style={{
                transition: 'opacity 0.5s ease 0s'
              }}
            ></span>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 ml-auto max-md:p-1 ${
            isAtTop ? 'text-white' : 'text-[#515666]'
          }`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg">
          <div className="px-4 py-2 space-y-1">
            <a
              href="/home?anchor=Products"
              onClick={(e) => {
                handleNavClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-medium text-[#515666] hover:bg-gray-50 rounded-md"
            >
              Products
            </a>
            <a
              href="/home?anchor=CampaignCalculator"
              onClick={(e) => {
                handleNavClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-medium text-[#515666] hover:bg-gray-50 rounded-md"
            >
              Campaign Calculator
            </a>
            <a
              href="/home?anchor=Contact"
              onClick={(e) => {
                handleNavClick(e);
                setIsMobileMenuOpen(false);
              }}
              className="block px-3 py-2 text-sm font-medium text-[#515666] hover:bg-gray-50 rounded-md"
            >
              Contact
            </a>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-transparent {
          background-color: transparent !important;
          border-bottom: none !important;
        }
      `}</style>
    </nav>
  );
};
