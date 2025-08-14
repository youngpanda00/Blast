import React, { useEffect, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Pencil, Heart, MessageCircle, Share, MoreHorizontal, Edit3 } from "lucide-react";
import { trackFBEvent, trackMixPanel } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

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
  const [isEditingInline, setIsEditingInline] = useState<'headline' | 'adCopy' | null>(null);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [isMobileEditModalOpen, setIsMobileEditModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const adPreviewRef = React.useRef<HTMLDivElement>(null);

  useEffect(()=>{
    setImage(initialImage)
  }, [initialImage])

  const handleEdit = () => {
    setTempHeadline(headline);
    setTempAdCopy(adCopy);
    setSelectedTemplate("custom");
    setIsEditing(true);
    trackMixPanel("click", {
      page_name: "ListingBlastSP",
      feature_name: "ListingBlast",
      click_item: "Edit Ad",
      click_action: "edit"
    });
    trackFBEvent('Edit Ad')
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


  return (
    <section ref={adPreviewRef} tabIndex={-1} className="w-full flex flex-col items-center bg-background max-md:bg-white focus:outline-none">
      <div className="w-full max-w-[1140px] mt-12 max-md:my-[30px] max-md:px-4 px-4">
        {/* Desktop header with edit button */}
        {!isMobile && (
          <div className="flex items-center justify-end mb-8">
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

        <div className={`grid grid-cols-1 ${!isMobile ? 'lg:grid-cols-2' : ''} gap-10 max-md:gap-[40px] relative`}>
          {/* Connection Line - only visible on desktop */}
          {highlightedArea && (
            <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-pulse"></div>
              <div className="w-0.5 h-8 bg-gradient-to-b from-transparent via-blue-400 to-transparent mx-auto animate-pulse"></div>
            </div>
          )}

          {/* Facebook-style Ad Preview */}
          <div className="space-y-6 relative max-md:flex max-md:flex-col max-md:justify-start max-md:items-center">
            <div className="mb-6 max-md:mb-[10px]">
              <h3 className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-foreground flex items-center gap-2 max-md:justify-center max-md:items-center`}>
                <span className="w-2 h-2 bg-blue-500 rounded-full max-md:hidden"></span>
                <span className="max-md:hidden">Facebook Ad Preview</span>
                <span className="hidden max-md:block max-md:text-black">Step 2- Your Facebook Ad Preview</span>
                {!isMobile && highlightedArea && (
                  <span className="text-sm font-normal text-muted-foreground animate-pulse">
                    ← {highlightedArea === 'headline' ? 'Headline' : highlightedArea === 'adCopy' ? 'Ad Copy' : 'Image'} highlighted
                  </span>
                )}
              </h3>
            </div>
            <Card className={`${isMobile ? 'w-full' : 'max-w-md mx-auto lg:mx-0'} shadow-xl border-border bg-card relative max-md:w-[90%] max-md:flex max-md:flex-col max-md:justify-center max-md:items-center max-md:mt-[1px]`}>
              <CardContent className="p-0">
                {/* Facebook header */}
                <div className="flex items-center justify-between p-4 max-md:py-[10px] border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-background border-2 border-border flex items-center justify-center">
                      <img
                        src="https://cdn.builder.io/api/v1/image/assets%2F8160475584d34b939ff2d1d5611f94b6%2F07c4fa894c3a4e7490607f4934b2056f"
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
                <div className={`p-4 max-md:py-[14px] transition-all duration-300 relative ${
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
                      <p className="text-sm text-card-foreground leading-relaxed pr-8 max-md:text-xs max-md:leading-[17px]">
                        {(highlightedArea === 'adCopy' || isEditingInline === 'adCopy') && (
                          <div className="absolute -left-2 top-0 w-1 h-full bg-blue-400 rounded-full"></div>
                        )}
                        {adCopy}
                      </p>
                      {false && isMobile && (
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
                    className={`w-full h-52 max-md:h-[150px] object-cover px-4 ${isMobile ? '' : 'rounded-t-lg'}`}
                  />
                  {/* Blurred overlay for mobile fallback image */}
                  {isMobile && image.includes("pexels.com") && (
                    <div className="absolute inset-0 mx-4 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="text-sm font-medium">Sample Property Image</div>
                      </div>
                    </div>
                  )}
                  {false && isMobile && (
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
                {isMobile && isEditingInline === 'headline' ? (
                  <div className="p-4 border-t border-border bg-yellow-50 border-yellow-300 shadow-md">
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
                  </div>
                ) : (
                  <h4 className={`font-semibold text-sm mb-2 pr-8 transition-all duration-300 max-md:mb-[10px] max-md:pt-[10px] max-md:pl-4 md:pt-4 md:pb-2 md:pl-4 ${
                    highlightedArea === 'headline' || isEditingInline === 'headline'
                      ? 'text-yellow-800 text-base font-bold'
                      : 'text-gray-800'
                  }`}>
                    {(highlightedArea === 'headline' || isEditingInline === 'headline') && (
                      <span className="absolute -left-2 top-0 w-1 h-full bg-yellow-400 rounded-full"></span>
                    )}
                    {headline}
                    {false && isMobile && (
                      <button
                        onClick={() => handleInlineEdit('headline')}
                        className="absolute top-1/2 -translate-y-1/2 right-2 w-11 h-11 bg-black/20 backdrop-blur-sm text-white rounded-full shadow-lg flex items-center justify-center active:scale-95 active:opacity-75 transition-all duration-150"
                        aria-label="Edit title"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                  </h4>
                )}

                {/* Facebook engagement - adjusted spacing for mobile */}
                <div className="p-4 max-md:py-2.5 max-md:pl-2.5 max-md:pr-0 border-t border-border bg-accent/20">
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
            {isMobile && (
              <div className="flex justify-center mt-3 max-md:w-full">
                <Dialog open={isMobileEditModalOpen} onOpenChange={setIsMobileEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-500 text-blue-500 hover:bg-blue-50 max-md:w-[90%] max-md:rounded-[26px] max-md:overflow-hidden max-md:border-[#3b5cde] max-md:text-[#3b5cde] max-md:h-[40px]"
                      onClick={() => {
                        setTempHeadline(headline);
                        setTempAdCopy(adCopy);
                        setSelectedTemplate("custom");
                      }}
                    >
                      Edit Your Ad
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[95vw] max-w-md mx-auto">
                    <DialogHeader>
                      <DialogTitle>Edit Your Facebook Ad</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 py-4">
                      {/* Ad Copy Section */}
                      <div>
                        <Label htmlFor="edit-adcopy" className="text-sm font-medium">
                          Ad Copy
                        </Label>
                        <Textarea
                          id="edit-adcopy"
                          value={tempAdCopy}
                          onChange={(e) => setTempAdCopy(e.target.value)}
                          className="mt-2 min-h-[100px]"
                          placeholder="Enter your ad copy..."
                        />
                      </div>

                      {/* Template Selection */}
                      <div>
                        <Label className="text-sm font-medium">Quick Templates</Label>
                        <Select
                          value={selectedTemplate}
                          onValueChange={(value) => {
                            setSelectedTemplate(value);
                            if (value !== "custom") {
                              const template = adCopyTemplates.find(t => t.id === value);
                              if (template) {
                                setTempAdCopy(template.copy);
                              }
                            }
                          }}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Choose a template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="custom">Custom</SelectItem>
                            {adCopyTemplates.map((template) => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Headline Section */}
                      <div>
                        <Label htmlFor="edit-headline" className="text-sm font-medium">
                          Headline ({tempHeadline.length}/60)
                        </Label>
                        <Input
                          id="edit-headline"
                          value={tempHeadline}
                          onChange={(e) => setTempHeadline(e.target.value)}
                          className="mt-2"
                          placeholder="Enter headline..."
                          maxLength={60}
                        />
                      </div>

                      {/* Image Upload Section */}
                      <div>
                        <Label className="text-sm font-medium">Property Image</Label>
                        <div className="mt-2 flex items-center gap-3">
                          <div className="w-16 h-16 rounded-lg overflow-hidden border">
                            <img src={image} alt="Current" className="w-full h-full object-cover" />
                          </div>
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                            />
                            <Button variant="outline" size="sm" asChild>
                              <span>Change Image</span>
                            </Button>
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={() => {
                            setHeadline(tempHeadline);
                            setAdCopy(tempAdCopy);
                            onAdUpdate?.({ image, headline: tempHeadline, adCopy: tempAdCopy });
                            setIsMobileEditModalOpen(false);
                            trackMixPanel("click", {
                              page_name: "ListingBlastSP",
                              feature_name: "ListingBlast",
                              click_item: "Save Ad Edit",
                              click_action: "save"
                            });
                            trackFBEvent('Save Ad Edit');
                          }}
                          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setTempHeadline(headline);
                            setTempAdCopy(adCopy);
                            setIsMobileEditModalOpen(false);
                          }}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )}
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
