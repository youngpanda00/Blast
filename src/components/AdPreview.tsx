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
  initialImage = "https://images.pexels.com/photos/3555615/pexels-photo-3555615.jpeg",
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
    setSelectedTemplate("custom");
    setIsEditing(true);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId !== "custom") {
      const template = adCopyTemplates.find(t => t.id === templateId);
      if (template) {
        setTempAdCopy(template.copy);
      }
    }
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
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">
            Preview Your Ad
          </h2>
          <Button
            onClick={isEditing ? undefined : handleEdit}
            variant="outline"
            className="flex items-center gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            disabled={isEditing}
          >
            <Pencil className="w-4 h-4" />
            Edit Ad
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Facebook-style Ad Preview */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Facebook Ad Preview
            </h3>
            <Card className="max-w-md mx-auto lg:mx-0 shadow-lg">
              <CardContent className="p-0">
                {/* Facebook header */}
                <div className="flex items-center justify-between p-3 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/413dc641e0fcb15ee6fb4e31ee9f16be41c5456d?placeholderIfAbsent=true"
                        alt="Lofty Logo"
                        className="w-full h-full object-contain"
                      />
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
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-foreground mb-6">
              Edit Your Ad Content
            </h3>

            {isEditing ? (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="headline" className="text-sm font-semibold text-foreground">
                    Headline
                  </Label>
                  <Input
                    id="headline"
                    value={tempHeadline}
                    onChange={(e) => setTempHeadline(e.target.value)}
                    placeholder="Enter your ad headline"
                    className="border-border bg-background"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {tempHeadline.length}/60 characters
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-semibold text-foreground block">
                    Ad Copy Templates
                  </Label>

                  {/* Template Selection */}
                  <div className="grid grid-cols-2 gap-3">
                    {adCopyTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template.id)}
                        className={`p-4 text-left text-sm rounded-lg border-2 transition-all duration-200 ${
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border bg-card text-card-foreground hover:border-primary/30 hover:bg-accent/50"
                        }`}
                      >
                        <div className="font-semibold mb-1">{template.name}</div>
                        <div className="text-xs opacity-70 line-clamp-2">
                          {template.copy.substring(0, 60)}...
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleTemplateSelect("custom")}
                      className={`p-4 text-left text-sm rounded-lg border-2 transition-all duration-200 ${
                        selectedTemplate === "custom"
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border bg-card text-card-foreground hover:border-primary/30 hover:bg-accent/50"
                      }`}
                    >
                      <div className="font-semibold mb-1">Custom</div>
                      <div className="text-xs opacity-70">
                        Write your own copy
                      </div>
                    </button>
                  </div>

                  {/* Ad Copy Textarea */}
                  <div className="space-y-3">
                    <Label htmlFor="adCopy" className="text-sm font-semibold text-foreground">
                      {selectedTemplate === "custom" ? "Custom Ad Copy" : "Ad Copy (Editable)"}
                    </Label>
                    <Textarea
                      id="adCopy"
                      value={tempAdCopy}
                      onChange={(e) => {
                        setTempAdCopy(e.target.value);
                        setSelectedTemplate("custom");
                      }}
                      placeholder="Write your ad copy here..."
                      className="border-border bg-background min-h-[100px]"
                      rows={4}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {tempAdCopy.length}/200 characters
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm font-semibold text-foreground">
                    Ad Image
                  </Label>
                  <div className="flex items-center gap-4">
                    <img
                      src={image}
                      alt="Current ad image"
                      className="w-20 h-20 object-cover rounded-lg border-2 border-border shadow-sm"
                    />
                    <div className="flex-1 space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="text-sm border-border bg-background"
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 1200x630px
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 border-border">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-accent/30 rounded-lg border border-border">
                  <h4 className="font-semibold text-foreground mb-4">Current Ad Settings:</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-foreground">Headline:</span>
                      <span className="ml-2 text-muted-foreground">{headline}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">Ad Copy:</span>
                      <span className="ml-2 text-muted-foreground">{adCopy}</span>
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
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
