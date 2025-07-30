import React from "react";

interface InstagramPostComponentProps {
  imageUrl?: string;
  viewMode?: "mobile" | "desktop";
}

export const InstagramPostComponent: React.FC<InstagramPostComponentProps> = ({
  imageUrl = "https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2Fb9fd5dd255894cd7a452621e889c019a?format=webp&width=800",
  viewMode = "mobile",
}) => {
  if (viewMode === "mobile") {
    return (
      <div className="w-[189px] h-[375px] relative overflow-hidden bg-white">
        {/* Phone Frame */}
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2f6dfc77412da131f0ab6c1f3edc1a20a298e9ce?width=378"
          alt=""
          className="w-full h-full object-cover"
        />

        {/* Phone Screen Background */}
        <img
          src="https://cdn.lofty.com/image/fs/servicetool/2025711/9/original_a6b710856ecb46a0.png"
          alt=""
          className="absolute left-[15px] top-[20px] w-[160px] rounded-[20.671px] object-cover"
        />

        {/* Instagram Post Content */}
        <div className="absolute left-[12px] top-[40px] w-[166px] h-[324px] bg-white rounded-lg shadow-[0px_2.938px_8.814px_rgba(32,36,55,0.05)] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              {/* Profile Avatar */}
              <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex items-center justify-center">
                <img
                  src="https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png"
                  alt="Lofty Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              {/* Username */}
              <span className="text-[8px] font-bold text-gray-900">
                LoftyBlast Ads
              </span>
            </div>
            {/* More options dots */}
            <div className="flex gap-0.5">
              <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>
              <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>
              <div className="w-0.5 h-0.5 rounded-full bg-gray-600"></div>
            </div>
          </div>

          {/* Post Image */}
          <div className="relative">
            <img
              src={imageUrl}
              alt="Waterfront houses with reflection"
              className="w-full h-[178px] object-cover"
            />
          </div>

          {/* Action Buttons */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                {/* Heart icon */}
                <img
                  src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_cb6df4c6274443d9.png"
                  alt="Heart"
                  className="w-2.5 h-2.5"
                />
                {/* Comment icon */}
                <img
                  src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_3d00108f3cf74041.png"
                  alt="Comment"
                  className="w-2.5 h-2.5"
                />
                {/* Send icon */}
                <img
                  src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_8715ad18b1da459f.png"
                  alt="Send"
                  className="w-2.5 h-2.5"
                />
              </div>
              {/* Bookmark icon */}
              <img
                src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_12078fbd68694964.png"
                alt="Bookmark"
                className="w-2.5 h-2.5"
              />
            </div>

            {/* Post Description */}
            <div className="text-[8px] text-gray-900 leading-tight">
              <span className="font-medium">
                🏠 NEW LISTING - NOW AVAILABLE!
              </span>{" "}
              Be the first to check out your new dream home! 5532 Pearce{" "}
              <span className="text-gray-500">... more</span>
            </div>
          </div>

          {/* Bottom Navigation Bar */}
          <div className="absolute bottom-0 left-0 w-full bg-white border-t border-gray-100">
            <div className="flex items-center justify-around py-1.5">
              {/* Home icon */}
              <img
                src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_a9e202bca9784a4e.png"
                alt="Home"
                className="w-2.5 h-2.5"
              />
              {/* Profile icon */}
              <img
                src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_9a9c6d210f4b4dc2.png"
                alt="Profile"
                className="w-2.5 h-2.5"
              />
              {/* Search icon */}
              <img
                src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_27838dbf92da426c.png"
                alt="Search"
                className="w-2.5 h-2.5"
              />
              {/* Add icon */}
              <img
                src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_0045e2bb91d24a7f.png"
                alt="Add"
                className="w-2.5 h-2.5"
              />
              {/* Heart icon */}
              <img
                src="https://cdn.lofty.com/image/fs/servicetool/2025717/7/original_e1f0580bb9584d7f.png"
                alt="Heart"
                className="w-2.5 h-2.5"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PC端版本
  return (
    <div className="w-[calc(100vw-65px)] max-w-[390px] h-[366px] bg-white rounded-xl shadow-[0px_4px_30px_0px_rgba(32,36,55,0.08)] relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-[11px] left-[15px] h-[30px] w-[360px] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-[30px] h-[30px] rounded-full border border-[#DEDFE0] bg-white"
            style={{
              backgroundImage: "url('https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png')",
              backgroundSize: "auto 100%",
              backgroundRepeat: "no-repeat"
            }}
          ></div>
          <div className="w-[89px] h-[18px]">
            <h3 className="text-xs font-bold text-[#202437] leading-[18px]">
              LoftyBlast Ads
            </h3>
          </div>
        </div>
        <svg className="w-[15px] h-[3px]" viewBox="0 0 15 3" fill="none">
          <circle cx="1.50012" cy="1.5" r="1.5" fill="#666668" />
          <circle cx="7.50012" cy="1.5" r="1.5" fill="#666668" />
          <circle cx="13.5001" cy="1.5" r="1.5" fill="#666668" />
        </svg>
      </div>

      {/* Property Image */}
      <img
        src={
          imageUrl ||
          "https://api.builder.io/api/v1/image/assets/TEMP/12888e333127ddc48a1a734b27d96750d3f35e51?width=780"
        }
        alt="Lakefront homes with reflection"
        className="absolute left-0 top-[49px] w-[390px] h-[230px] object-cover"
      />

      {/* Action Buttons */}
      <div className="absolute left-[15px] top-[291px] w-[360px] h-[16px] flex items-center justify-between">
        <div className="flex items-center gap-[11px]">
          <svg className="w-[14px] h-[14px]" viewBox="0 0 14 15" fill="none">
            <path
              d="M10.0625 1.85919C10.4553 1.85525 10.845 1.92962 11.2087 2.07794C11.5871 2.24051 11.9292 2.47701 12.215 2.77356C12.5164 3.05251 12.7525 3.39462 12.9062 3.77544C13.0622 4.14207 13.1426 4.53639 13.1426 4.93481C13.1426 5.33323 13.0622 5.72756 12.9062 6.09419C12.7418 6.47959 12.4972 6.82559 12.1887 7.10919L11.375 7.95356C10.8646 8.49023 10.306 9.08377 9.69937 9.73419C9.09271 10.3846 8.54 10.9679 8.04125 11.4842L7.2975 12.2629C7.25872 12.2967 7.21429 12.3234 7.16625 12.3417C7.11281 12.3598 7.05603 12.3657 7 12.3592C6.94312 12.3599 6.88665 12.3495 6.83375 12.3286C6.7862 12.3099 6.74301 12.2816 6.70687 12.2454L6.02 11.5148L4.44937 9.83044C3.86312 9.20044 3.31187 8.60544 2.78687 8.04981L1.83312 7.03481C1.39021 6.61695 1.08575 6.07357 0.960624 5.47765C0.835496 4.88172 0.89569 4.26178 1.13312 3.70106C1.29143 3.31542 1.53006 2.96792 1.83312 2.68169C2.09204 2.40786 2.40689 2.19299 2.75625 2.05169C3.13624 1.92101 3.53568 1.85592 3.9375 1.85919C4.34388 1.87111 4.73845 1.99859 5.075 2.22669C5.54516 2.52883 5.98474 2.8761 6.3875 3.26356L7 3.84981L7.60375 3.25044C8.00065 2.86137 8.44105 2.51932 8.91625 2.23106C9.25598 2.00223 9.65313 1.87338 10.0625 1.85919ZM10.0625 0.984186C9.4948 0.998086 8.94264 1.17253 8.47 1.48731C7.93828 1.81096 7.44511 2.19405 7 2.62919C6.54942 2.20219 6.0586 1.81978 5.53437 1.48731C5.06112 1.17042 4.50694 0.995812 3.9375 0.984186C3.43856 0.981682 2.94287 1.06454 2.47187 1.22919C1.99499 1.40165 1.56079 1.67471 1.19875 2.02981C0.821082 2.39274 0.520612 2.82822 0.315364 3.31011C0.110116 3.79201 0.00431824 4.3104 0.00431824 4.83419C0.00431824 5.35797 0.110116 5.87636 0.315364 6.35826C0.520612 6.84016 0.821082 7.27563 1.19875 7.63856C1.30813 7.75231 1.63625 8.07606 2.14812 8.64919C2.66 9.22231 3.22437 9.79544 3.80625 10.4254L5.38125 12.1142L6.08562 12.8623C6.21082 12.9845 6.35971 13.0798 6.52312 13.1423C6.67498 13.2023 6.83671 13.2335 7 13.2342C7.16612 13.2334 7.33069 13.2022 7.48562 13.1423C7.64865 13.0791 7.7974 12.9839 7.92312 12.8623L8.68 12.0748L10.3469 10.3248C10.9506 9.68023 11.5092 9.09689 12.0225 8.57481C12.5387 8.04106 12.7969 7.76544 12.81 7.75669C13.1904 7.38534 13.4885 6.93817 13.685 6.44419C13.8843 5.97205 13.9869 5.46478 13.9869 4.95231C13.9869 4.43985 13.8843 3.93257 13.685 3.46044C13.4909 2.96521 13.1925 2.51757 12.81 2.14794C12.4456 1.77739 12.0134 1.48034 11.5369 1.27294C11.0693 1.08025 10.5682 0.982106 10.0625 0.984186Z"
              fill="black"
            />
          </svg>

          <svg className="w-[14px] h-[14px]" viewBox="0 0 15 15" fill="none">
            <path
              d="M12.1304 10.3237C12.0396 10.4214 11.97 10.5393 11.9266 10.6691C11.8832 10.7989 11.867 10.9374 11.8793 11.0747C11.9408 11.71 12.0574 12.3378 12.2275 12.95C11.0069 12.6471 10.2614 12.2964 9.92278 12.1127C9.73072 12.0084 9.50953 11.9837 9.30153 12.0433C8.70528 12.2136 8.09074 12.2994 7.47366 12.2983C3.97716 12.2983 1.34866 9.66638 1.34866 6.67253C1.34866 3.67962 3.97716 1.04676 7.47366 1.04676C10.9702 1.04676 13.5987 3.67962 13.5987 6.67253C13.5987 8.04897 13.0588 9.32602 12.1304 10.3237ZM12.5618 13.9851C12.7691 14.0291 12.9771 14.0695 13.1857 14.1061C13.3607 14.1361 13.4937 13.941 13.4245 13.7666C13.3468 13.5703 13.2756 13.3711 13.211 13.1694L13.2084 13.16C12.9914 12.4849 12.8147 11.7085 12.7499 10.9856C13.8235 9.83234 14.4737 8.32276 14.4737 6.67253C14.4737 3.04766 11.3394 0.109131 7.47366 0.109131C3.60791 0.109131 0.473656 3.04766 0.473656 6.67253C0.473656 10.2974 3.60791 13.2359 7.47366 13.2359C8.16696 13.2369 8.85739 13.1405 9.52728 12.949C9.98228 13.1956 10.9614 13.6447 12.5618 13.9851Z"
              fill="black"
            />
          </svg>

          <svg
            className="w-[14px] h-[14px] rotate-[10deg]"
            viewBox="0 0 18 17"
            fill="none"
          >
            <g clipPath="url(#clip0_2898_5236)">
              <path
                d="M17.0189 2.53461C17.068 2.60488 17.0954 2.68802 17.0976 2.77372C17.0999 2.85942 17.0769 2.94389 17.0316 3.01665L9.80704 14.6677C9.74338 14.7703 9.65266 14.8534 9.54484 14.9078C9.43703 14.9621 9.31631 14.9857 9.19596 14.9759C9.07562 14.966 8.96032 14.9232 8.86276 14.852C8.76519 14.7809 8.68915 14.6842 8.64299 14.5727L6.66343 9.78557L2.84208 6.28811C2.75278 6.2066 2.68774 6.10201 2.65412 5.98587C2.62051 5.86973 2.61963 5.74656 2.65159 5.62996C2.68354 5.51335 2.74709 5.40784 2.83522 5.32507C2.92335 5.24229 3.03264 5.18548 3.15102 5.16088L16.5701 2.35864C16.654 2.34092 16.7412 2.34823 16.821 2.37967C16.9007 2.41111 16.9695 2.46529 17.0187 2.53548L17.0189 2.53461ZM7.56778 9.68559L9.28783 13.8432L15.1641 4.36661L7.56778 9.68559ZM14.6623 3.64996L3.74741 5.93064L7.06699 8.96823L14.6631 3.65011L14.6623 3.64996Z"
                fill="black"
              />
            </g>
            <defs>
              <clipPath id="clip0_2898_5236">
                <rect
                  width="14"
                  height="14"
                  fill="white"
                  transform="translate(3.37839) rotate(10)"
                />
              </clipPath>
            </defs>
          </svg>
        </div>

        <svg className="w-[14px] h-[14px]" viewBox="0 0 14 14" fill="none">
          <g clipPath="url(#clip0_2898_5238)">
            <path
              d="M1.74994 1.74988C1.74994 1.28575 1.93431 0.84063 2.2625 0.512441C2.59069 0.184252 3.03581 -0.00012207 3.49994 -0.00012207L10.4999 -0.00012207C10.9641 -0.00012207 11.4092 0.184252 11.7374 0.512441C12.0656 0.84063 12.2499 1.28575 12.2499 1.74988V13.5624C12.2499 13.6415 12.2284 13.7192 12.1877 13.787C12.147 13.8549 12.0887 13.9105 12.0189 13.9479C11.9492 13.9852 11.8706 14.0029 11.7915 13.9992C11.7125 13.9954 11.6359 13.9702 11.5701 13.9264L6.99994 11.4633L2.42981 13.9264C2.36393 13.9702 2.28739 13.9954 2.20834 13.9992C2.1293 14.0029 2.05071 13.9852 1.98094 13.9479C1.91117 13.9105 1.85284 13.8549 1.81216 13.787C1.77148 13.7192 1.74998 13.6415 1.74994 13.5624V1.74988ZM3.49994 0.874878C3.26787 0.874878 3.04531 0.967065 2.88122 1.13116C2.71713 1.29525 2.62494 1.51781 2.62494 1.74988V12.7451L6.75756 10.5734C6.82937 10.5256 6.91369 10.5001 6.99994 10.5001C7.08619 10.5001 7.17051 10.5256 7.24231 10.5734L11.3749 12.7451V1.74988C11.3749 1.51781 11.2828 1.29525 11.1187 1.13116C10.9546 0.967065 10.732 0.874878 10.4999 0.874878H3.49994Z"
              fill="black"
            />
          </g>
          <defs>
            <clipPath id="clip0_2898_5238">
              <rect width="14" height="14" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </div>

      {/* Caption */}
      <div className="absolute left-[15px] top-[318px] h-[36px]">
        <p className="text-[12px] text-black leading-[18px]">
          🏠 NEW LISTING - NOW AVAILABLE! Be the first to check out your new
          dream home! 2 BD/ 1 BA, 5532 Pearce AVE, L️ ...{" "}
          <span className="text-[#828383] font-medium">more</span>
        </p>
      </div>
    </div>
  );
};
