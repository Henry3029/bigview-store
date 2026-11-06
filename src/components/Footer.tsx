'use client';

import React from 'react';
import { Store } from 'lucide-react';

interface FooterProps {
  storeName: string;
}

export default function Footer({ storeName }: FooterProps) {
  return (
    <footer className="bg-skin-card border-t border-skin-base/30 py-4 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-skin-muted">
        
        {/* Storefront Indicator */}
        <div className="flex items-center gap-1.5 text-emerald-500 font-medium">
          <Store className="w-3.5 h-3.5" />
          <span>Storefront</span>
        </div>

        {/* Branding & Copyright */}
        <p className="text-center sm:text-right">
          <span className="text-emerald-500">© 2026 </span>
          <strong className="text-[#D4AF37]">BIGVIEW</strong> E-Commerce. Built for{' '}
          <strong className="text-skin-base">{storeName}</strong>.
        </p>
      </div>
    </footer>
  );
}
