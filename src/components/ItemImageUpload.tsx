'use client';

import React, { useState, useEffect } from 'react';
import { Camera, Upload } from 'lucide-react';

interface ItemImageUploadProps {
  value?: string;
  onChange?: (imageUrl: string) => void;
  onImageSelected?: (imageUrl: string) => void;
}

export default function ItemImageUpload({
  value = '',
  onChange,
  onImageSelected,
}: ItemImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(value);

  useEffect(() => {
    setPreviewUrl(value || '');
  }, [value]);

  const emitImage = (url: string) => {
    setPreviewUrl(url);
    onChange?.(url);
    onImageSelected?.(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        emitImage(reader.result);
      }
    };
    reader.onerror = () => {
      console.error('Failed to read selected image file.');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs text-skin-muted block font-semibold">
        Product Photo
      </label>

      <div className="flex items-center gap-4">
        {/* Preview thumbnail box */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-skin-card border border-skin-base rounded-2xl overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
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
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
}
