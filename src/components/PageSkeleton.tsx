'use client';

import React from 'react';

export default function PageSkeleton() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-skin-base animate-pulse">
      
      {/* Centered Mock Content Stack */}
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center">
        
        {/* Mock Top Logo Skeleton */}
        <div className="w-16 h-16 bg-skin-card rounded-2xl border border-skin-base shadow-sm" />
        
        {/* Mock Heading Skeleton */}
        <div className="space-y-2 text-center w-full flex flex-col items-center">
          <div className="h-7 w-48 bg-skin-card rounded-xl" />
          <div className="h-4 w-64 bg-skin-card rounded-lg" />
        </div>

        {/* Mock Input Fields Skeletons */}
        <div className="w-full space-y-4 pt-4">
          <div className="space-y-1.5 text-left">
            <div className="h-3 w-20 bg-skin-card rounded" />
            <div className="w-full h-12 bg-skin-card rounded-2xl border border-skin-base" />
          </div>

          <div className="space-y-1.5 text-left">
            <div className="h-3 w-20 bg-skin-card rounded" />
            <div className="w-full h-12 bg-skin-card rounded-2xl border border-skin-base" />
          </div>

          {/* Mock Button Skeleton */}
          <div className="w-full h-14 bg-brand-yellow/40 rounded-2xl mt-2" />
        </div>

        {/* Mock Footer Links */}
        <div className="h-4 w-36 bg-skin-card rounded-lg pt-2" />
      </div>
    </div>
  );
}
