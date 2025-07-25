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
    id: "default",
    name: "Default",
    copy: "🏡 NEW LISTING - NOW AVAILABLE! Be the first to check out your new dream home!"
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
  const [highlightedArea, setHighlightedArea] = useState<'headline' | 'adCopy' | 'image' | null>(null);

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
    <section className="w-full flex flex-col items-center bg-background">
      <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-border mt-[29px]" />

      <div className="w-full max-w-[1140px] mt-12 max-md:px-6 px-4">
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative">
          {/* Connection Line - only visible on desktop */}
          {highlightedArea && (
            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent mx-auto animate-pulse"></div>
            </div>
          )}

          {/* Facebook-style Ad Preview */}
          <div className="space-y-6 relative">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Facebook Ad Preview
              {highlightedArea && (
                <span className="text-sm font-normal text-muted-foreground animate-pulse">
                  ← {highlightedArea === 'headline' ? 'Headline' : highlightedArea === 'adCopy' ? 'Ad Copy' : 'Image'} highlighted
                </span>
              )}
            </h3>
            <Card className="max-w-md mx-auto lg:mx-0 shadow-xl border-border bg-card relative">
              <CardContent className="p-0">
                {/* Facebook header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-background border-2 border-border flex items-center justify-center">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets/b7536598065f4e65a807787a2ac37040/413dc641e0fcb15ee6fb4e31ee9f16be41c5456d?placeholderIfAbsent=true"
                        alt="Lofty Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-card-foreground"><p>Real Estate Service</p></div>
                      <div className="text-xs text-muted-foreground">Sponsored</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                </div>

                {/* Ad content */}
                <div className={`p-4 transition-all duration-300 ${
                  highlightedArea === 'adCopy'
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-md'
                    : ''
                }`}>
                  <p className="text-sm text-card-foreground leading-relaxed relative">
                    {highlightedArea === 'adCopy' && (
                      <div className="absolute -left-2 top-0 w-1 h-full bg-blue-400 rounded-full"></div>
                    )}
                    {adCopy}
                  </p>
                </div>

                {/* Ad image */}
                <div className={`transition-all duration-300 ${
                  highlightedArea === 'image'
                    ? 'ring-4 ring-blue-300 shadow-lg'
                    : ''
                }`}>
                  <img
                    src={image}
                    alt="Property"
                    className="w-full h-52 object-cover rounded-t-lg"
                  />
                </div>

                {/* Headline section - below image */}
                <div className={`p-4 border-t border-border transition-all duration-300 ${
                  highlightedArea === 'headline'
                    ? 'bg-yellow-50 border-yellow-300 shadow-md'
                    : 'bg-gray-50'
                }`}>
                  <h4 className={`font-semibold text-sm mb-2 transition-all duration-300 relative ${
                    highlightedArea === 'headline'
                      ? 'text-yellow-800 text-base font-bold'
                      : 'text-gray-800'
                  }`}>
                    {highlightedArea === 'headline' && (
                      <span className="absolute -left-2 top-0 w-1 h-full bg-yellow-400 rounded-full"></span>
                    )}
                    {headline}
                  </h4>
                  <p className="text-gray-600 text-xs">loftyblast.com</p>
                </div>

                {/* Facebook engagement */}
                <div className="p-4 border-t border-border bg-accent/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded transition-colors">
                        <Heart className="w-4 h-4" />
                        Like
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </button>
                      <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent px-3 py-2 rounded transition-colors">
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
                  <Label htmlFor="headline" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>
                    Headline
                    <span className="text-xs text-muted-foreground font-normal">(appears on image overlay)</span>
                  </Label>
                  <Input
                    id="headline"
                    value={tempHeadline}
                    onChange={(e) => setTempHeadline(e.target.value)}
                    onMouseEnter={() => setHighlightedArea('headline')}
                    onMouseLeave={() => setHighlightedArea(null)}
                    onFocus={() => setHighlightedArea('headline')}
                    onBlur={() => setHighlightedArea(null)}
                    placeholder="Enter your ad headline"
                    className={`border-border bg-background transition-all duration-300 ${
                      highlightedArea === 'headline'
                        ? 'border-yellow-400 shadow-md ring-2 ring-yellow-200'
                        : ''
                    }`}
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
                        className={`p-4 text-left text-sm rounded-lg border-2 transition-all duration-200 h-20 flex flex-col ${
                          selectedTemplate === template.id
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-border bg-card text-card-foreground hover:border-primary/30 hover:bg-accent/50"
                        }`}
                      >
                        <div className="font-semibold mb-1 line-clamp-1">{template.name}</div>
                        <div className="text-xs opacity-70 line-clamp-2 flex-1 overflow-hidden">
                          {template.copy}
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => handleTemplateSelect("custom")}
                      className={`p-4 text-left text-sm rounded-lg border-2 transition-all duration-200 h-20 flex flex-col ${
                        selectedTemplate === "custom"
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border bg-card text-card-foreground hover:border-primary/30 hover:bg-accent/50"
                      }`}
                    >
                      <div className="font-semibold mb-1 line-clamp-1">Custom</div>
                      <div className="text-xs opacity-70 line-clamp-2 flex-1 overflow-hidden">
                        Write your own copy
                      </div>
                    </button>
                  </div>

                  {/* Ad Copy Textarea */}
                  <div className="space-y-3">
                    <Label htmlFor="adCopy" className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                      {selectedTemplate === "custom" ? "Custom Ad Copy" : "Ad Copy (Editable)"}
                      <span className="text-xs text-muted-foreground font-normal">(main post content)</span>
                    </Label>
                    <Textarea
                      id="adCopy"
                      value={tempAdCopy}
                      onChange={(e) => {
                        setTempAdCopy(e.target.value);
                        setSelectedTemplate("custom");
                      }}
                      onMouseEnter={() => setHighlightedArea('adCopy')}
                      onMouseLeave={() => setHighlightedArea(null)}
                      onFocus={() => setHighlightedArea('adCopy')}
                      onBlur={() => setHighlightedArea(null)}
                      placeholder="Write your ad copy here..."
                      className={`border-border bg-background min-h-[100px] transition-all duration-300 ${
                        highlightedArea === 'adCopy'
                          ? 'border-blue-400 shadow-md ring-2 ring-blue-200'
                          : ''
                      }`}
                      rows={4}
                      maxLength={200}
                    />
                    <p className="text-xs text-muted-foreground">
                      {tempAdCopy.length}/200 characters
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="image" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                    Ad Image
                    <span className="text-xs text-muted-foreground font-normal">(main visual content)</span>
                  </Label>
                  <div
                    className="flex items-center gap-4"
                    onMouseEnter={() => setHighlightedArea('image')}
                    onMouseLeave={() => setHighlightedArea(null)}
                  >
                    <img
                      src={image}
                      alt="Current ad image"
                      className={`w-20 h-20 object-cover rounded-lg border-2 shadow-sm transition-all duration-300 ${
                        highlightedArea === 'image'
                          ? 'border-green-400 shadow-lg ring-2 ring-green-200 scale-105'
                          : 'border-border'
                      }`}
                    />
                    <div className="flex-1 space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={`text-sm bg-background transition-all duration-300 ${
                          highlightedArea === 'image'
                            ? 'border-green-400 ring-2 ring-green-200'
                            : 'border-border'
                        }`}
                      />
                      <p className="text-xs text-muted-foreground">
                        <p>Recommended Aspect Ratio: 1:1 or 4:5</p>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-6 border-t border-border">
                  <Button onClick={handleSave} className="flex-1" style={{backgroundColor: '#3b5cde'}} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d4bcc'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b5cde'}>
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="flex-1 border-border">
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Preview Overview Card */}
                <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-xl border-2 border-blue-100 shadow-lg">
                  {/* Header with icon */}
                  <div className="flex items-center gap-3 p-6 pb-4">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-bold text-gray-800">Your Ad Preview</h4>
                  </div>

                  {/* Content Grid */}
                  <div className="px-6 pb-6 space-y-4">
                    {/* Headline Preview */}
                    <div className="group p-4 bg-white/70 rounded-lg border border-yellow-200 hover:border-yellow-400 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 bg-yellow-400 rounded-full mt-1 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-600 mb-1">Headline</div>
                          <div className="text-gray-800 font-medium leading-relaxed group-hover:text-yellow-800 transition-colors">
                            "{headline}"
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ad Copy Preview */}
                    <div className="group p-4 bg-white/70 rounded-lg border border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-start gap-3">
                        <div className="w-4 h-4 bg-blue-400 rounded-full mt-1 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-600 mb-1">Ad Copy</div>
                          <div className="text-gray-800 leading-relaxed group-hover:text-blue-800 transition-colors line-clamp-3">
                            "{adCopy}"
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Image Preview */}
                    <div className="group p-4 bg-white/70 rounded-lg border border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 bg-green-400 rounded-full flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="text-sm font-semibold text-gray-600 mb-2">Current Image</div>
                          <img
                            src={image}
                            alt="Current ad image"
                            className="w-full h-24 object-cover rounded-md border border-gray-200 group-hover:scale-[1.02] transition-transform duration-300"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-2 right-2 w-20 h-20 bg-blue-100 rounded-full opacity-50 -z-10"></div>
                  <div className="absolute bottom-2 left-2 w-16 h-16 bg-purple-100 rounded-full opacity-50 -z-10"></div>
                </div>

                {/* Call to Action */}
                <div className="text-center p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
                  <div className="inline-flex items-center gap-2 text-gray-600 mb-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="font-medium">Ready to Customize?</span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                    Click <span className="font-semibold text-blue-600">"Edit Ad"</span> above to customize your headline, copy, and image.
                    See your changes reflected in real-time on the left preview.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
