import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Pencil, Heart, MessageCircle, Share, MoreHorizontal } from "lucide-react";

interface AdPreviewProps {
  initialImage?: string;
  initialHeadline?: string;
  initialAdCopy?: string;
  onAdUpdate?: (data: { image: string; headline: string; adCopy: string }) => void;
}

const adCopyTemplates = [
  {
    id: "luxury",
    name: "Luxury Focus",
    copy: "Experience luxury living at its finest! This exquisite property offers premium amenities, stunning architecture, and an unbeatable location. Schedule your exclusive viewing today!"
  },
  {
    id: "family",
    name: "Family-Friendly",
    copy: "Your perfect family home awaits! Spacious rooms, safe neighborhood, great schools nearby. Everything your family needs for comfortable living. Don't miss this opportunity!"
  },
  {
    id: "investment",
    name: "Investment Opportunity",
    copy: "Smart investors, take notice! Prime location, strong rental potential, and excellent growth prospects. This property won't last long. Contact us for detailed investment analysis!"
  }
];

export const AdPreview: React.FC<AdPreviewProps> = ({
  initialImage = "/lovable-uploads/20b5647d-061e-4695-80b4-a0c7c6e23d08.png",
  initialHeadline = "Beautiful Home in Prime Location",
  initialAdCopy = "Discover your dream home in this stunning property featuring modern amenities and a perfect location. Contact us today for a private showing!",
  onAdUpdate,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(initialHeadline);
  const [adCopy, setAdCopy] = useState(initialAdCopy);
  const [image, setImage] = useState(initialImage);
  const [tempHeadline, setTempHeadline] = useState(headline);
  const [tempAdCopy, setTempAdCopy] = useState(adCopy);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("custom");

  const handleEdit = () => {
    setTempHeadline(headline);
    setTempAdCopy(adCopy);
    setIsEditing(true);
  };

  const handleSave = () => {
    setHeadline(tempHeadline);
    setAdCopy(tempAdCopy);
    setIsEditing(false);
    onAdUpdate?.({ image, headline: tempHeadline, adCopy: tempAdCopy });
  };

  const handleCancel = () => {
    setTempHeadline(headline);
    setTempAdCopy(adCopy);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      onAdUpdate?.({ image: url, headline, adCopy });
    }
  };

  return (
    <section className="w-full flex flex-col items-center">
      <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-[#EBECF1] mt-[29px]" />
      
      <div className="w-full max-w-[1140px] mt-10 max-md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-black text-xl font-bold">
            Preview Your Ad
          </h2>
          <Button
            onClick={isEditing ? undefined : handleEdit}
            variant="outline"
            className="flex items-center gap-2"
            disabled={isEditing}
          >
            <Pencil className="w-4 h-4" />
            Edit Ad
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Facebook-style Ad Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Facebook Ad Preview
            </h3>
            <Card className="max-w-md mx-auto lg:mx-0 shadow-lg">
              <CardContent className="p-0">
                {/* Facebook header */}
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">L</span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">Lofty Real Estate</div>
                      <div className="text-xs text-gray-500">Sponsored</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-gray-500" />
                </div>

                {/* Ad content */}
                <div className="p-3">
                  <p className="text-sm text-gray-800 mb-3">{adCopy}</p>
                </div>

                {/* Ad image */}
                <div className="relative">
                  <img
                    src={image}
                    alt="Property"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                    <h4 className="text-white font-semibold text-sm">{headline}</h4>
                    <p className="text-white/90 text-xs">loftyblast.com</p>
                  </div>
                </div>

                {/* Facebook engagement */}
                <div className="p-3 border-t">
                  <div className="flex items-center justify-between text-gray-500">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 text-sm hover:bg-gray-100 px-2 py-1 rounded">
                        <Heart className="w-4 h-4" />
                        Like
                      </button>
                      <button className="flex items-center gap-1 text-sm hover:bg-gray-100 px-2 py-1 rounded">
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </button>
                      <button className="flex items-center gap-1 text-sm hover:bg-gray-100 px-2 py-1 rounded">
                        <Share className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editing Panel */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Edit Your Ad Content
            </h3>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="headline" className="text-sm font-medium text-gray-700">
                    Headline
                  </Label>
                  <Input
                    id="headline"
                    value={tempHeadline}
                    onChange={(e) => setTempHeadline(e.target.value)}
                    placeholder="Enter your ad headline"
                    className="mt-1"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {tempHeadline.length}/60 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="adCopy" className="text-sm font-medium text-gray-700">
                    Ad Copy
                  </Label>
                  <Textarea
                    id="adCopy"
                    value={tempAdCopy}
                    onChange={(e) => setTempAdCopy(e.target.value)}
                    placeholder="Write your ad copy here..."
                    className="mt-1"
                    rows={4}
                    maxLength={200}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {tempAdCopy.length}/200 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Ad Image
                  </Label>
                  <div className="mt-1 flex items-center gap-3">
                    <img
                      src={image}
                      alt="Current ad image"
                      className="w-16 h-16 object-cover rounded border"
                    />
                    <div>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended: 1200x630px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleSave} className="flex-1">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-sm">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Current Ad Settings:</h4>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Headline:</span> {headline}
                    </div>
                    <div>
                      <span className="font-medium">Ad Copy:</span> {adCopy}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Click "Edit Ad" to customize your ad headline, copy, and image. 
                  Your changes will be reflected in the preview in real-time.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
