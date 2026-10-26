'use client';

import React from 'react';
import { Store, ShieldCheck } from 'lucide-react';

interface FooterProps {
  activeTab: 'store' | 'admin';
  setActiveTab: (tab: 'store' | 'admin') => void;
  storeName: string;
}

export default function Footer({ activeTab, setActiveTab, storeName }: FooterProps) {
  return (
    <footer className="bg-skin-card border-t border-skin-base/30 py-4 px-4 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-skin-muted">
        
        {/* Navigation Quick Links */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-1.5 font-bold transition-colors ${
              activeTab === 'store' ? 'text-[#48BB78]' : 'hover:text-skin-base'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Storefront
          </button>
          <span>•</span>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 font-bold transition-colors ${
              activeTab === 'admin' ? 'text-[#48BB78]' : 'hover:text-skin-base'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Mom's Admin
          </button>
        </div>

        {/* Branding & Copyright */}
        <p className="text-center sm:text-right">
          © 2026 <strong className="text-[#D4AF37]">BIGVIEW</strong> E-Commerce. Built for{' '}
          <strong className="text-skin-base">{storeName}</strong>.
        </p>
      </div>
    </footer>
  );
}
