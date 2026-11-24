'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X } from 'lucide-react';

interface ImageCaptureFieldProps {
  value: string;
  onChange: (base64OrUrl: string) => void;
  onError?: (message: string) => void;
}

export default function ImageCaptureField({
  value,
  onChange,
  onError,
}: ImageCaptureFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle local file upload & convert to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCameraError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  // Start live camera stream
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      const message =
        'Unable to access device camera. Please check permissions or upload a photo.';
      setCameraError(message);
      onError?.(message);
      stopCamera();
    }
  };

  // Capture snapshot from video stream
  const captureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      onChange(dataUrl);
      stopCamera();
    }
  };

  return (
    <div className="space-y-3 w-full text-left">
      <label className="text-xs font-bold text-skin-muted block">
        Item Image
      </label>

      {/* Preview Box */}
      {value ? (
        <div className="relative w-full h-40 bg-skin-base border border-skin-base rounded-xl overflow-hidden shadow-sm flex items-center justify-center">
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => {
              onChange('');
              if (fileInputRef.current) {
                fileInputRef.current.value = '';
              }
            }}
            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full hover:bg-black transition"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-skin-base/40 rounded-xl hover:border-brand-yellow transition bg-skin-base/50 text-skin-muted hover:text-skin-base"
          >
            <Upload className="w-5 h-5 mb-1 text-brand-yellow" />
            <span className="text-xs font-semibold">Upload File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Camera Capture Button */}
          <button
            type="button"
            onClick={startCamera}
            className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-skin-base/40 rounded-xl hover:border-brand-yellow transition bg-skin-base/50 text-skin-muted hover:text-skin-base"
          >
            <Camera className="w-5 h-5 mb-1 text-brand-yellow" />
            <span className="text-xs font-semibold">Take Photo</span>
          </button>
        </div>
      )}

      {cameraError && (
        <p className="text-[11px] text-red-500 font-medium">{cameraError}</p>
      )}

      {/* Active Camera View Modal/Overlay */}
      {isCameraActive && (
        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
          <div className="relative w-full max-w-md space-y-4 flex flex-col items-center">
            <video
              ref={videoRef}
              playsInline
              className="w-full rounded-2xl shadow-2xl border border-white/20 aspect-video object-cover"
            />

            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={captureSnapshot}
                className="flex-1 bg-brand-yellow text-black font-extrabold py-3.5 rounded-full shadow-lg text-sm"
              >
                Capture Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="px-6 bg-white/20 text-white font-bold py-3.5 rounded-full text-sm hover:bg-white/30 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
