import React, { useState, useEffect } from "react";

interface PurchaseNotificationProps {
  listingCity?: string; // City from listing data for 80% probability
}

const PurchaseNotification: React.FC<PurchaseNotificationProps> = ({
  listingCity,
}) => {
  const names = [
    "Micha*l G.*",
    "Jame*s B.*",
    "John* D.*",
    "Rober*t K.*",
    "Davi*d P.*",
    "Willi*m S.*",
    "Richa*d H.*",
    "Josep*h M.*",
    "Thoma*s W.*",
    "Charle*s T.*",
    "Chri*s R.*",
    "Danie*l J.*",
    "Matthe*w L.*",
    "Antho*y C.*",
    "Mark* F.*",
    "Donal*d T.*",
    "Stev*n A.*",
    "Pau*l E.*",
    "Andre*w N.*",
    "Ken* V.*",
    "Sara* J.*",
    "Jenni* M.*",
    "Amand* T.*",
    "Jessic* A.*",
    "Ashle* N.*",
    "Emil* Y.*",
    "Hann* P.*",
    "Samant* L.*",
    "Elizab* R.*",
    "Taylo* S.*",
    "Megan* K.*",
    "Rache* F.*",
    "Kayl* D.*",
    "Laure* G.*",
    "Maddi* H.*",
  ];

  const baseCities = [
    "Miami",
    "Austin",
    "Seattle",
    "Chicago",
    "San Diego",
    "Dallas",
    "Denver",
    "Phoenix",
    "Atlanta",
    "Boston",
    "Nashville",
    "Orlando",
    "Portland",
    "Las Vegas",
    "Charlotte",
  ];

  const avatarImages = [
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_5853b824295548e8.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_3b06d2c2b76e4625.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_cd5ac7f3be324b33.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_b7a0f3d892b64867.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_5300b53ca48948fc.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_cfa0e03bb02647b3.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_c6c9f12e3f6f48be.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_8ad4a459e06e4cb1.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_7caf4c653846404c.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_f4e220804f66454c.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_bc0c1706a86c4638.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_2e70a79a0860465b.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_247e2adbcdd44b95.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_3f030ff4de834c37.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_bd021c02959144c2.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_1f86de610e344ae6.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_ccc8ca61737d4381.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_41635bcefd84481a.png",
    "https://cdn.lofty.com/image/fs/405776816889948/website/13018/cmsbuild/2025710_b3f3e5c6ffb940be.png",
  ];

  const [currentName, setCurrentName] = useState("");
  const [currentCity, setCurrentCity] = useState("");
  const [currentPackage, setCurrentPackage] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const packages = [
    { name: "Starter Pack", price: "$79", probability: 0.6 },
    { name: "Boost Pack", price: "$158", probability: 0.2 },
    { name: "Growth Pack", price: "$237", probability: 0.1 },
    { name: "Mastery Pack", price: "$316", probability: 0.1 },
  ];

  const getRandomName = () => {
    return names[Math.floor(Math.random() * names.length)];
  };

  const getRandomCity = () => {
    if (listingCity) {
      // If we have listing city, use it 80% of the time
      const useListingCity = Math.random() < 0.8;
      if (useListingCity) {
        return listingCity;
      }
    }
    // Otherwise use random city from the list
    return baseCities[Math.floor(Math.random() * baseCities.length)];
  };

  const getRandomPackage = () => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (const pkg of packages) {
      cumulativeProbability += pkg.probability;
      if (random <= cumulativeProbability) {
        return pkg;
      }
    }

    // Fallback to Starter Pack if something goes wrong
    return packages[0];
  };

  const getRandomAvatar = () => {
    return avatarImages[Math.floor(Math.random() * avatarImages.length)];
  };

  const updateAllData = () => {
    // Fade out first
    setIsVisible(false);

    // After fade out completes, update data and fade in
    setTimeout(() => {
      const name = getRandomName();
      const city = getRandomCity();
      const avatar = getRandomAvatar();
      const pkg = getRandomPackage();

      // Update all state in the same render cycle to ensure synchronization
      setCurrentName(name);
      setCurrentCity(city);
      setCurrentAvatar(avatar);
      setCurrentPackage(pkg.name);
      setCurrentPrice(pkg.price);

      // Fade back in
      setTimeout(() => {
        setIsVisible(true);
      }, 50);
    }, 300);
  };

  // Initialize with random data
  useEffect(() => {
    updateAllData();
  }, [listingCity]);

  // Update data every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      updateAllData();
    }, 3000);

    return () => clearInterval(interval);
  }, [listingCity]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300 max-w-[310px] sm:max-w-none hidden sm:block">
      <div className="flex w-full sm:w-[310px] h-[70px] p-2 pr-4 pl-2 items-center gap-2.5 bg-white rounded-[100px] shadow-[0px_2px_15px_0px_rgba(32,36,55,0.15)] hover:shadow-[0px_4px_20px_0px_rgba(32,36,55,0.20)] transition-shadow duration-200 mx-2 sm:mx-0">
        {/* Avatar */}
        <div className="flex w-[59px] h-[58px] justify-center items-center rounded-[60px] flex-shrink-0">
          <img
            className="w-[59px] h-[58px] rounded-[60px] object-cover"
            src={currentAvatar}
            alt="User avatar"
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center items-start gap-0.5 flex-1 min-w-0">
          <div className="self-stretch text-sm font-normal leading-[18px] text-[#202437] font-['SF_Pro_Text',_'-apple-system',_'Roboto',_'Helvetica',_sans-serif]">
            <span className="font-normal">{currentName} in </span>
            <span className="font-bold text-[#2F4AB2]">{currentCity}</span>
            <span className="font-normal">
              {" "}
              just purchased {currentPackage} for{" "}
            </span>
            <span className="font-semibold text-[#FF8515]">{currentPrice}</span>
          </div>
          <div className="text-xs font-normal leading-[14px] text-[#797E8B] font-['SF_Pro_Text',_'-apple-system',_'Roboto',_'Helvetica',_sans-serif]">
            Just now
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseNotification;
