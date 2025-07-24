
import React from 'react';

export const ContactFooter: React.FC = () => {
  return (
    <footer className="bg-[#1135C5] flex w-full flex-col items-center text-[15px] text-white font-medium justify-center p-20 max-md:max-w-full max-md:px-5">
      <div className="flex w-[905px] max-w-full flex-col items-center">
        <h2 className="text-[34px] leading-none text-center font-medium">
          Contact Us
        </h2>
        
        <p className="text-[#E1E2E6] text-center font-normal leading-[23px] mt-5 max-md:max-w-full">
          Please feel free to reach out to us with any questions or inquiries
          regarding Blastmylisting. Our dedicated team is here to provide
          assistance and support, and we will respond to your request
          promptly.
        </p>
        
        <div className="flex w-[717px] max-w-full items-stretch gap-5 leading-loose flex-wrap justify-between mt-[30px]">
          <a
            href="tel:+11234567890"
            className="flex items-stretch gap-2.5 hover:text-[#E1E2E6] transition-colors"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/83019f4a101cf131ec1c5036d37e6bc2d8b98036?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] shrink-0 my-auto"
              alt="Phone"
            />
            <span>855-981-7557</span>
          </a>
          
          <div className="flex items-stretch gap-2.5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/4bcd0a01334e002e16c114a91516f386c7176a07?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] shrink-0 my-auto"
              alt="Hours"
            />
            <span>Mon-Fri: 8am to 8pm MT</span>
          </div>
          
          <a
            href="mailto:support@loftyblast.com"
            className="flex items-stretch gap-2.5 whitespace-nowrap hover:text-[#E1E2E6] transition-colors"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/76ca853a9ec8b0092d0bf78ff684f6845c84bd76?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] shrink-0 my-auto"
              alt="Email"
            />
            <span>sales@loftyblast.com</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
