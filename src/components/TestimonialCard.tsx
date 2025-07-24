import React from "react";
import { Separator } from "./ui/separator";
import { MoreHorizontal } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  date: string;
  content: string;
  likes: string;
  avatar?: string;
  hasLikeButton?: boolean;
  hasCommentButton?: boolean;
}

export const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  date,
  content,
  likes,
  avatar,
  hasLikeButton = false,
  hasCommentButton = false,
}) => {
  return (
    <div
      className="flex flex-col pt-[20px] pb-[20px] px-[15px] rounded-xl w-full h-[210px] shadow-sm border border-gray-100"
      style={{ backgroundColor: "#F6F7FB" }}
    >
      <div className="flex w-full items-stretch gap-5 justify-between">
        <div className="flex items-center gap-2.5">
          {avatar && (
            <img
              src={avatar}
              className="aspect-[1] object-contain w-10 h-10 shrink-0 rounded-full"
              alt={`${name} avatar`}
            />
          )}
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium leading-none text-gray-900">
              {name}
            </div>
            <div className="text-[10px] font-normal leading-[1.4] text-gray-500">
              {date}
            </div>
          </div>
        </div>
        <MoreHorizontal
          className="w-[14px] h-[14px] shrink-0"
          color="#A0A3AF"
        />
      </div>

      <div className="text-sm font-normal leading-5 mt-2.5 flex-1 text-gray-800">
        {content}
      </div>

      <Separator
        className="my-[7.5px]"
        style={{ backgroundColor: "#EBECF1" }}
      />

      <div className="flex items-center gap-1.5 text-sm font-normal whitespace-nowrap leading-[1.2]">
        {hasLikeButton && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/8403fb5ea75de7c33d8edd5399a11c17b9eac640?placeholderIfAbsent=true"
            className="aspect-[1.95] object-contain w-[35px] shrink-0"
            alt="Like"
          />
        )}
        {hasCommentButton && (
          <img
            src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/b9753e3d7a5aa62fea50d1bdf2564ee486a46cac?placeholderIfAbsent=true"
            className="aspect-[1.95] object-contain w-[35px] shrink-0"
            alt="Comment"
          />
        )}
        <div className="text-gray-700">{likes}</div>
      </div>
    </div>
  );
};
