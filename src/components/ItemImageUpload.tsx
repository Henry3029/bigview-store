'use client';

import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';

interface ItemImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
}

export default function ItemImageUpload({ onImageSelected }: ItemImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Generate a local preview URL for the image
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Pass the URL up to your parent form handler
      onImageSelected(objectUrl);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-skin-muted block font-semibold">Product Photo</label>
      
      <div className="flex items-center gap-4">
        {/* Preview thumbnail box */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-skin-card border border-skin-base rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
          {previewUrl ? (
            <img src={previewUrl} alt="Product preview" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-6 h-6 text-skin-muted" />
          )}
        </div>

        {/* Upload Button */}
        <label className="flex-1 cursor-pointer bg-skin-card border border-skin-base hover:border-brand-yellow transition p-3.5 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-skin-base shadow-sm group">
          <Upload className="w-4 h-4 text-brand-yellow group-hover:scale-110 transition" />
          <span>Snap Photo or Upload</span>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" // Instantly launches the phone camera on mobile!
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
      </div>
    </div>
  );
}
