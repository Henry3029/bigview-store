'use client';

import React, { useState } from 'react';
import { Store, ShoppingBag, ShieldCheck, Sun, Moon, Menu, X, Settings, Package } from 'lucide-react';

interface NavbarProps {
  activeTab: 'store' | 'admin';
  setActiveTab: (tab: 'store' | 'admin') => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  storeName: string;
}

export default function Navbar({ activeTab, setActiveTab, darkMode, setDarkMode, storeName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top Header / Navigation Bar */}
      <header className="sticky top-0 z-50 bg-skin-card border-b border-skin-base shadow-sm backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 bg-brand-yellow text-black font-black flex items-center justify-center rounded-xl text-lg shadow-md">
              BV
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight">BIGVIEW</span>
                <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow px-2 py-0.5 rounded-full font-bold">PWA</span>
              </div>
              <p className="text-xs text-skin-muted font-medium">{storeName}</p>
            </div>
          </div>

          {/* Desktop Navigation Links (Always visible on large screens) */}
          <nav className="hidden md:flex items-center gap-2 bg-skin-base p-1.5 rounded-2xl border border-skin-base">
            <button 
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'store' ? 'bg-brand-yellow text-black shadow-sm' : 'text-skin-muted hover:text-skin-base'}`}
            >
              <Store className="w-4 h-4" />
              Storefront
            </button>
            <button 
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition ${activeTab === 'admin' ? 'bg-brand-yellow text-black shadow-sm' : 'text-skin-muted hover:text-skin-base'}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Mom's Admin
            </button>
          </nav>

          {/* Actions & Theme Toggle */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-skin-base border border-skin-base text-skin-muted hover:text-skin-base transition shadow-sm"
              title="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-brand-yellow" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Mobile Hamburger Menu Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-skin-base border border-skin-base text-skin-base shadow-sm"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity">
          <div className="w-4/5 max-w-xs bg-skin-card h-full shadow-2xl p-6 flex flex-col justify-between border-l border-skin-base animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-skin-base">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 bg-brand-yellow text-black font-black flex items-center justify-center rounded-xl">BV</span>
                  <span className="font-bold text-lg">Menu</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-skin-base text-skin-muted hover:text-skin-base"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Links */}
              <div className="flex flex-col gap-2 mt-6">
                <button 
                  onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${activeTab === 'store' ? 'bg-brand-yellow text-black shadow' : 'bg-skin-base text-skin-base'}`}
                >
                  <Store className="w-5 h-5" />
                  Storefront View
                </button>
                <button 
                  onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${activeTab === 'admin' ? 'bg-brand-yellow text-black shadow' : 'bg-skin-base text-skin-base'}`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  Mom's Admin Dashboard
                </button>
              </div>
            </div>

            <div className="pt-6 border-t border-skin-base text-xs text-skin-muted text-center">
              <p>BIGVIEW PWA for <strong className="text-skin-base">{storeName}</strong></p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
