import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Pencil, Heart, MessageCircle, Share, MoreHorizontal, ChevronDown, ChevronUp, Edit3 } from "lucide-react";
import { trackMixPanel } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  initialImage = "https://images.pexels.com/photos/5997993/pexels-photo-5997993.jpeg",
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingInline, setIsEditingInline] = useState<'headline' | 'adCopy' | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const isMobile = useIsMobile();
  const adPreviewRef = React.useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setImage(initialImage)
  }, [initialImage])

  const handleEdit = () => {
    if (isMobile) {
      setIsExpanded(!isExpanded);
      // Focus jump to ad preview when expanded
      if (!isExpanded) {
        setTimeout(() => {
          adPreviewRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
          adPreviewRef.current?.focus();
        }, 100);
      }
    } else {
      setTempHeadline(headline);
      setTempAdCopy(adCopy);
      setSelectedTemplate("custom");
      setIsEditing(true);
    }
    trackMixPanel("click", {
      page_name: "ListingBlastSP",
      feature_name: "ListingBlast",
      click_item: isMobile ? "Preview Your Ad" : "Edit Ad",
      click_action: isMobile ? "expand" : "edit"
    });
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

  const handleInlineEdit = (type: 'headline' | 'adCopy') => {
    setIsEditingInline(type);
    setHighlightedArea(type);
    if (type === 'headline') {
      setTempHeadline(headline);
    } else {
      setTempAdCopy(adCopy);
    }
  };

  const saveInlineEdit = () => {
    if (isEditingInline === 'headline') {
      setHeadline(tempHeadline);
      onAdUpdate?.({ image, headline: tempHeadline, adCopy });
    } else if (isEditingInline === 'adCopy') {
      setAdCopy(tempAdCopy);
      onAdUpdate?.({ image, headline, adCopy: tempAdCopy });
    }
    setIsEditingInline(null);
    setHighlightedArea(null);
  };

  const cancelInlineEdit = () => {
    setIsEditingInline(null);
    setHighlightedArea(null);
    setTempHeadline(headline);
    setTempAdCopy(adCopy);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId !== "custom") {
      const template = adCopyTemplates.find(t => t.id === templateId);
      if (template) {
        setTempAdCopy(template.copy);
        setAdCopy(template.copy);
        onAdUpdate?.({ image, headline, adCopy: template.copy });
      }
    }
    setShowTemplateDropdown(false);
  };

  // Mobile expandable button
  if (isMobile && !isExpanded) {
    return (
      <section className="w-full flex flex-col items-center bg-background">
        <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-border mt-[29px]" />

        <div className="w-full max-w-[1140px] mt-8 px-4">
          <Button
            onClick={handleEdit}
            className="w-full flex items-center justify-between p-4 h-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-lg font-semibold">Preview Your Ad</span>
            </div>
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section ref={adPreviewRef} tabIndex={-1} className="w-full flex flex-col items-center bg-background focus:outline-none">
      <div className="w-[1140px] shrink-0 max-w-full h-[1px] bg-border mt-[29px]" />

      <div className="w-full max-w-[1140px] mt-12 max-md:px-4 px-4">
        {/* Mobile header with collapse button */}
        {isMobile && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">
              Preview Your Ad
            </h2>
            <Button
              onClick={() => setIsExpanded(false)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ChevronUp className="w-4 h-4" />
              Collapse
            </Button>
          </div>
        )}

        {/* Desktop header */}
        {!isMobile && (
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-foreground">
              Preview Your Ad
            </h2>
            <Button
              onClick={isEditing ? undefined : handleEdit}
              variant="outline"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={isEditing}
            >
              <Pencil className="w-4 h-4" />
              Edit Ad
            </Button>
          </div>
        )}

        <div className={`grid grid-cols-1 ${!isMobile ? 'lg:grid-cols-2' : ''} gap-10 relative`}>
          {/* Connection Line - only visible on desktop */}
          {highlightedArea && (
            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent mx-auto animate-pulse"></div>
            </div>
          )}

          {/* Facebook-style Ad Preview */}
          <div className="space-y-6 relative">
            <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground mb-6 flex items-center gap-2`}>
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Facebook Ad Preview
              {!isMobile && highlightedArea && (
                <span className="text-sm font-normal text-muted-foreground animate-pulse">
                  ← {highlightedArea === 'headline' ? 'Headline' : highlightedArea === 'adCopy' ? 'Ad Copy' : 'Image'} highlighted
                </span>
              )}
            </h3>
            <Card className={`${isMobile ? 'w-full' : 'max-w-md mx-auto lg:mx-0'} shadow-xl border-border bg-card relative`}>
              <CardContent className="p-0">
                {/* Facebook header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-background border-2 border-border flex items-center justify-center">
                      <img
                        src="https://cdn.lofty.com/image/fs/servicetool/2025710/8/original_60f236a4963f4083.png"
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

                {/* Ad content - with mobile inline editing */}
                <div className={`p-4 transition-all duration-300 relative ${
                  highlightedArea === 'adCopy' || isEditingInline === 'adCopy'
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-md'
                    : ''
                }`}>
                  {isMobile && isEditingInline === 'adCopy' ? (
                    <div className="space-y-3 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-blue-700">✏️ Edit Ad Copy</span>
                          <div className="flex gap-1">
                            <Button onClick={saveInlineEdit} size="sm" className="text-xs h-7 px-3 bg-blue-500 hover:bg-blue-600">
                              ✓ Save
                            </Button>
                            <Button onClick={cancelInlineEdit} variant="outline" size="sm" className="text-xs h-7 px-3 border-blue-300">
                              ✕ Cancel
                            </Button>
                          </div>
                        </div>
                        <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                          <SelectTrigger className="h-8 text-xs border-blue-300 bg-white">
                            <SelectValue placeholder="Choose template" />
                          </SelectTrigger>
                          <SelectContent>
                            {adCopyTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id} className="text-xs">
                                {template.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="custom" className="text-xs">Custom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        value={tempAdCopy}
                        onChange={(e) => setTempAdCopy(e.target.value)}
                        className="text-sm min-h-[80px] border-blue-300 focus:border-blue-500 bg-white"
                        placeholder="Enter your ad copy..."
                        autoFocus
                      />
                    </div>
                  ) : (
                    <div className="relative group">
                      <p className="text-sm text-card-foreground leading-relaxed pr-8">
                        {(highlightedArea === 'adCopy' || isEditingInline === 'adCopy') && (
                          <div className="absolute -left-2 top-0 w-1 h-full bg-blue-400 rounded-full"></div>
                        )}
                        {adCopy}
                      </p>
                      {isMobile && (
                        <button
                          onClick={() => handleInlineEdit('adCopy')}
                          className="absolute top-2 right-2 w-11 h-11 bg-black/20 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 active:opacity-75 transition-all duration-150"
                          aria-label="Edit text"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Ad image - with mobile upload */}
                <div className={`transition-all duration-300 relative group ${
                  highlightedArea === 'image'
                    ? 'ring-4 ring-green-300 shadow-lg'
                    : ''
                }`}>
                  <img
                    src={image}
                    alt="Property"
                    className={`w-full h-52 object-cover ${isMobile ? '' : 'rounded-t-lg'}`}
                  />
                  {isMobile && (
                    <div className="absolute bottom-2 right-2">
                      <label className="cursor-pointer w-11 h-11 bg-black/30 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 active:opacity-75 transition-all duration-150">
                        <Pencil className="w-4 h-4" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageUpload(e);
                            setHighlightedArea('image');
                            setTimeout(() => setHighlightedArea(null), 2000);
                          }}
                          className="hidden"
                          aria-label="Edit image"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Headline section - below image with mobile inline editing */}
                <div className={`p-4 border-t border-border transition-all duration-300 ${
                  highlightedArea === 'headline' || isEditingInline === 'headline'
                    ? 'bg-yellow-50 border-yellow-300 shadow-md'
                    : 'bg-gray-50'
                }`}>
                  {isMobile && isEditingInline === 'headline' ? (
                    <div className="space-y-3 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-yellow-700">📝 Edit Headline</span>
                        <div className="flex gap-1">
                          <Button onClick={saveInlineEdit} size="sm" className="text-xs h-7 px-3 bg-yellow-500 hover:bg-yellow-600">
                            ✓ Save
                          </Button>
                          <Button onClick={cancelInlineEdit} variant="outline" size="sm" className="text-xs h-7 px-3 border-yellow-300">
                            ✕ Cancel
                          </Button>
                        </div>
                      </div>
                      <Input
                        value={tempHeadline}
                        onChange={(e) => setTempHeadline(e.target.value)}
                        className="text-sm border-yellow-300 focus:border-yellow-500 bg-white"
                        placeholder="Enter headline..."
                        autoFocus
                        maxLength={60}
                      />
                      <p className="text-xs text-yellow-600">
                        {tempHeadline.length}/60 characters
                      </p>
                    </div>
                  ) : (
                    <div className="relative group">
                      <h4 className={`font-semibold text-sm mb-2 pr-8 transition-all duration-300 ${
                        highlightedArea === 'headline' || isEditingInline === 'headline'
                          ? 'text-yellow-800 text-base font-bold'
                          : 'text-gray-800'
                      }`}>
                        {(highlightedArea === 'headline' || isEditingInline === 'headline') && (
                          <span className="absolute -left-2 top-0 w-1 h-full bg-yellow-400 rounded-full"></span>
                        )}
                        {headline}
                      </h4>
                      {isMobile && (
                        <button
                          onClick={() => handleInlineEdit('headline')}
                          className="absolute top-1/2 -translate-y-1/2 right-2 w-11 h-11 bg-black/20 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 active:opacity-75 transition-all duration-150"
                          aria-label="Edit title"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                  <p className="text-gray-600 text-xs">loftyblast.com</p>
                </div>

                {/* Facebook engagement - adjusted spacing for mobile */}
                <div className="p-4 border-t border-border bg-accent/20">
                  <div className="flex items-center justify-between">
                    <div className={`flex items-center ${isMobile ? 'gap-4' : 'gap-6'}`}>
                      <button className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} rounded transition-colors`}>
                        <Heart className="w-4 h-4" />
                        Like
                      </button>
                      <button className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} rounded transition-colors`}>
                        <MessageCircle className="w-4 h-4" />
                        Comment
                      </button>
                      <button className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent ${isMobile ? 'px-2 py-1' : 'px-3 py-2'} rounded transition-colors`}>
                        <Share className="w-4 h-4" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editing Panel - Hidden on mobile */}
          {!isMobile && (
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
                  <Button onClick={handleSave} className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
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

              </div>
            )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
