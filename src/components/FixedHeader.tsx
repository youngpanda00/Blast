import React from "react";

export const FixedHeader: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#5A6CF3] border-b border-[#4C5FE4] px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between max-w-[1240px] mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2F8642a4a63e4d46f5beb92430962b063f?format=webp&width=800"
            className="h-10"
            alt="Blast by Lofty Logo"
          />
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a 
            href="#products" 
            className="text-white font-medium text-sm hover:text-blue-200 transition-colors border-b-2 border-white pb-1"
          >
            Products
          </a>
          <a 
            href="#calculator" 
            className="text-white font-medium text-sm hover:text-blue-200 transition-colors"
          >
            Campaign Calculator
          </a>
          <a 
            href="#contact" 
            className="text-white font-medium text-sm hover:text-blue-200 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
};
