import React from 'react';

export const ContactFooter: React.FC<{ theme: 'christmas' }> = ({ theme }) => {
  return (
    <footer className={`${theme === 'christmas' ? 'bg-[#b6432c]' : 'bg-[#1135C5]'} flex w-full flex-col items-center text-[15px] text-white font-medium justify-center p-20 max-md:max-w-full max-md:px-5 max-md:py-[30px]`}>
      <div className="grid grid-cols-6 grid-rows-2 gap-6 max-w-full p-20 max-md:py-0 max-md:pb-5 max-md:px-0 max-md:gap-4 max-md:grid-cols-3 max-md:grid-rows-4 max-md:justify-center max-md:items-center">
        <img
          src="/lovable-uploads/ac09241f-cdd8-44fd-9a0e-a6c6ee1d7c08.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 1"
        />
        <img
          src="/lovable-uploads/81ea2aaf-e875-4d09-bec8-fa0d1e41cebf.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 2"
        />
        <img
          src="/lovable-uploads/694f6e60-2e94-45e8-9f94-7a76053c321b.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 3"
        />
        <img
          src="/lovable-uploads/7c6ac3b8-9cd6-417c-bea8-a14003b643f1.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 4"
        />
        <img
          src="/lovable-uploads/f6db4b23-3e95-4440-8f68-ada92a69bb77.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 5"
        />
        <img
          src="/lovable-uploads/856eede5-4d84-4fa8-b7c3-d035d351d73a.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 6"
        />
        <img
          src="/lovable-uploads/557e5e14-fda5-46db-9158-60830cc48982.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 8"
        />
        <img
          src="/lovable-uploads/893a4e60-aaac-48df-8bcc-6aea700af8ea.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 10"
        />
        <img
          src="/lovable-uploads/4d4455ae-6bb3-43d8-96bd-7197ea336a42.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 7"
        />
        <img
          src="/lovable-uploads/53c8450d-1671-4a74-90b9-3bf7c6316bf6.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 9"
        />
        <img
          src="/lovable-uploads/628f2910-f954-4b25-ba86-edb7a9173144.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 11"
        />
        <img
          src="/lovable-uploads/afebac12-6eea-421e-9eb0-4c045639ebaa.png"
          className="object-contain opacity-70 max-md:w-[80px] max-md:h-[32px]"
          style={{ width: "120px", height: "48px" }}
          alt="Partner Logo 12"
        />
      </div>
      <div id="contact-us" className="flex w-[905px] max-w-full flex-col items-center max-md:text-left max-md:justify-center max-md:items-start">
        <h2 className="text-[34px] leading-none text-center font-medium max-md:text-2xl max-md:text-left">
          Contact Us
        </h2>
        
        <p className="text-[#E1E2E6] text-center font-normal leading-[23px] mt-5 max-md:max-w-full max-md:text-sm max-md:text-left">
          Please feel free to reach out to us with any questions or inquiries
          regarding Blastmylisting. Our dedicated team is here to provide
          assistance and support, and we will respond to your request
          promptly.
        </p>
        
        <div className="flex w-[717px] max-w-full items-stretch gap-5 leading-loose max-md:leading-[10px] flex-wrap justify-between mt-[30px]">
          <a
            href="tel:8559817557"
            className="flex items-center gap-2.5 hover:text-[#E1E2E6] transition-colors"
          >
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/83019f4a101cf131ec1c5036d37e6bc2d8b98036?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] shrink-0 my-auto"
              alt="Phone"
            />
            <span>855-981-7557</span>
          </a>
          
          <div className="flex items-center gap-2.5">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/4bcd0a01334e002e16c114a91516f386c7176a07?placeholderIfAbsent=true"
              className="aspect-[1] object-contain w-[18px] shrink-0 my-auto"
              alt="Hours"
            />
            <span>Mon-Fri: 8am to 8pm MT</span>
          </div>
          
          <a
            href="mailto:sales@loftyblast.com"
            className="flex items-center gap-2.5 whitespace-nowrap hover:text-[#E1E2E6] transition-colors"
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
      <div className="flex items-center justify-center mt-[30px] gap-[20px]">
        <a href="https://www.facebook.com/profile.php?id=61577095148327" target="_blank">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17" cy="17" r="17" fill="#F4F4F4"/>
            <rect width="18" height="18" transform="translate(8 8)" fill="#F4F4F4"/>
            <path d="M21.6744 8.13296V10.9899H19.9869C19.7604 10.96 19.5302 10.9792 19.3118 11.0461C19.0934 11.1131 18.892 11.2263 18.7212 11.3779C18.478 11.7172 18.3625 12.1315 18.395 12.5477V14.5892H21.5675L21.1456 17.7891H18.395V26H15.0875V17.7891H12.3256V14.5892H15.0875V12.2328C15.0539 11.666 15.1364 11.0984 15.3298 10.5646C15.5233 10.0308 15.8236 9.5421 16.2125 9.12838C16.6102 8.74958 17.0801 8.45475 17.5943 8.26151C18.1084 8.06826 18.6562 7.98055 19.205 8.00361C20.0301 7.99097 20.8551 8.03418 21.6744 8.13296Z" fill={theme === 'christmas'? '#b6432c': "#3B5CDE"}/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/loftyblast" target="_blank">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="17" cy="17" r="17" fill="#F4F4F4"/>
            <rect width="16" height="16" transform="translate(9 9)" fill="#F4F4F4"/>
            <path d="M12.5745 14.32H9.26469V25H12.5745V14.32Z" fill={theme === 'christmas'? '#b6432c': "#3B5CDE"}/>
            <path d="M11.9837 9.32467C11.6695 9.11397 11.3002 9.00101 10.9221 9.00001C10.6682 8.99933 10.4168 9.04916 10.1823 9.1466C9.94784 9.24404 9.73503 9.38715 9.55623 9.56763C9.37742 9.74811 9.23619 9.96236 9.14072 10.198C9.04526 10.4335 8.99746 10.6858 9.0001 10.94C9.00404 11.3187 9.11969 11.6877 9.33249 12.0007C9.54529 12.3137 9.84575 12.5566 10.1961 12.6991C10.5464 12.8415 10.931 12.8769 11.3014 12.801C11.6718 12.7251 12.0115 12.5412 12.2778 12.2724C12.5441 12.0036 12.7251 11.6619 12.798 11.2903C12.8709 10.9188 12.8325 10.5339 12.6876 10.1842C12.5427 9.83441 12.2978 9.53537 11.9837 9.32467Z" fill={theme === 'christmas'? '#b6432c': "#3B5CDE"}/>
            <path d="M17.8262 14.32H14.6562V25H17.951V19.705C17.951 18.315 18.2306 16.97 19.9479 16.97C21.6652 16.97 21.6652 18.56 21.6652 19.8V25H25V19.135C25 16.26 24.356 14.055 21.0062 14.055C20.3775 14.0325 19.7543 14.1804 19.2025 14.4831C18.6507 14.7859 18.1907 15.2322 17.8712 15.775H17.8262V14.32Z" fill={theme === 'christmas'? '#b6432c': "#3B5CDE"}/>
          </svg>
        </a>
      </div>
    </footer>
  );
};
