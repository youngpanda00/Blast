
import React, { useEffect, useState } from 'react';

interface NotificationProps {
  name: string;
  location: string;
  avatar?: string;
}

const notifications: NotificationProps[] = [
  { name: "Micha*l G.", location: "Miami" },
  { name: "Chri*s R.", location: "Austin" },
  { name: "Sara* J.", location: "Austin" },
  { name: "John* D.", location: "Dallas" },
  { name: "Emma* K.", location: "Phoenix" },
  { name: "Mike* T.", location: "Seattle" },
];

export const SocialProof: React.FC = () => {
  return (
    <div className="relative w-full bg-orange-100 py-4 mt-[50px] max-md:mt-10 overflow-hidden">
      {/* Fade out effects */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
      
      {/* Scrolling container */}
      <div className="flex animate-scroll-x">
        {/* First set of notifications */}
        {notifications.map((notification, index) => (
          <div
            key={`first-${index}`}
            className="bg-white shadow-[0px_0px_10px_rgba(32,36,55,0.08)] flex min-w-80 min-h-10 flex-col items-center text-[#202437] justify-center pl-2.5 pr-[15px] py-2 rounded-[50px] mx-2 flex-shrink-0"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/1f8cb6f48fd403b9763226e3bbcebb09f1bc980f?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-6 shrink-0 rounded-full"
                alt={`${notification.name} avatar`}
              />
              <span className="text-sm font-semibold leading-none whitespace-nowrap">
                <span className="font-medium">{notification.name} in</span>{" "}
                <span className="text-[rgba(47,74,178,1)]">{notification.location}</span>{" "}
                <span className="font-medium">just purchased Lofty Blast Ads</span>
              </span>
            </div>
          </div>
        ))}
        
        {/* Duplicate set for seamless loop */}
        {notifications.map((notification, index) => (
          <div
            key={`second-${index}`}
            className="bg-white shadow-[0px_0px_10px_rgba(32,36,55,0.08)] flex min-w-80 min-h-10 flex-col items-center text-[#202437] justify-center pl-2.5 pr-[15px] py-2 rounded-[50px] mx-2 flex-shrink-0"
          >
            <div className="flex items-center gap-2.5">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/1f8cb6f48fd403b9763226e3bbcebb09f1bc980f?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-6 shrink-0 rounded-full"
                alt={`${notification.name} avatar`}
              />
              <span className="text-sm font-semibold leading-none whitespace-nowrap">
                <span className="font-medium">{notification.name} in</span>{" "}
                <span className="text-[rgba(47,74,178,1)]">{notification.location}</span>{" "}
                <span className="font-medium">just purchased Lofty Blast Ads</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
