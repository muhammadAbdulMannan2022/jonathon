'use client';

import React from "react"

import { useState } from 'react';

import { CloudUpload, X, Image as ImageIcon, MessageSquare } from 'lucide-react';

interface TrustSectionProps {
  formData: {
    uploadedImage: string | null;
    additionalComments: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function TrustSection({
  formData,
  onChange,
}: TrustSectionProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('uploadedImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2 bg-primary/10 rounded-md">
          <ImageIcon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold text-foreground">Help others trust this deal</h2>
          <p className="text-xs text-muted-foreground font-medium">Deals with proof are more likely to be approved faster</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Upload Photo */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Proof of Deal</label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/5'
                : formData.uploadedImage
                  ? 'border-border bg-muted/30'
                  : 'border-border bg-background hover:bg-muted/30 hover:border-border-accent'
            }`}
          >
            {formData.uploadedImage ? (
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-48 h-48 rounded-lg overflow-hidden shadow-md border-2 border-background">
                    <img
                      src={formData.uploadedImage || "/placeholder.svg"}
                      alt="Uploaded proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => onChange('uploadedImage', '')}
                    className="absolute -top-3 -right-3 bg-destructive text-destructive-foreground p-2 rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="mt-4 text-sm font-bold text-foreground">Snapshot ready!</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="bg-muted p-4 rounded-full mb-4 group-hover:bg-background transition-colors">
                  <CloudUpload className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-sm font-bold text-foreground">Click or drag image to upload</h3>
                <p className="text-xs text-muted-foreground mt-2 max-w-[200px]">
                  Allowed formats: JPG, PNG, WEBP (Max 5MB)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleInputChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="absolute inset-0 cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Additional Comments */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-semibold text-foreground">Additional Comments</label>
          </div>
          <textarea
            value={formData.additionalComments}
            onChange={(e) => onChange('additionalComments', e.target.value)}
            placeholder="Tell us more about how to get this deal, any restrictions, or your personal experience..."
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground placeholder:text-muted-foreground resize-none"
          />
        </div>
      </div>
    </div>
  );
}


