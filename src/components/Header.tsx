'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Menu, User, ShoppingBag, X, Store, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

interface HeaderProps {
  onBack?: () => void;
  activeTab: 'store' | 'admin';
  setActiveTab: (tab: 'store' | 'admin') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenCart: () => void;
}

export default function Header({
  onBack,
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  onOpenCart,
}: HeaderProps) {
  const { cart, ownerAccount, isOwner } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // User avatar logic: first letter of owner's email/name if logged in
  const userInitial = isOwner && ownerAccount?.email ? ownerAccount.email.charAt(0).toUpperCase() : null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-skin-card/90 backdrop-blur-md border-b border-skin-base/30 py-[1px] px-[2px]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          
          {/* LEFT SECTION: Back Icon + BIGVIEW Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onBack || (() => window.history.back())}
              className="p-1.5 rounded-full hover:bg-skin-base/50 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="font-black text-base sm:text-lg tracking-wider text-[#D4AF37] drop-shadow-sm select-none">
              BIGVIEW
            </span>
          </div>

          {/* MIDDLE SECTION: Sleek Opacity Search Bar */}
          <div className="flex-1 max-w-md mx-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-skin-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                className="w-full bg-skin-base/40 border border-skin-base/50 rounded-full pl-9 pr-3 py-1 text-xs sm:text-sm text-skin-base placeholder:text-skin-muted/70 focus:outline-none focus:bg-skin-base/80 focus:border-[#48BB78]/60 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* RIGHT SECTION: Menu, User Profile, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Modern Hamburger Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-xl hover:bg-skin-base/50 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Icon / Avatar */}
            <button
              onClick={() => setActiveTab('admin')}
              className="p-1 rounded-full transition-transform active:scale-95"
              aria-label="User Account"
            >
              {userInitial ? (
                <div className="w-7 h-7 rounded-full bg-[#48BB78] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {userInitial}
                </div>
              ) : (
                <div className="p-1.5 rounded-full hover:bg-skin-base/50 text-skin-muted hover:text-skin-base">
                  <User className="w-5 h-5" />
                </div>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={onOpenCart}
              className="relative p-1.5 rounded-xl hover:bg-skin-base/50 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#48BB78] text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Modern Slide-out Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-xs bg-skin-card h-full shadow-2xl p-5 flex flex-col justify-between border-l border-skin-base/30 animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-skin-base/30">
                <span className="font-black text-lg text-[#D4AF37]">BIGVIEW</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-skin-base/50 text-skin-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tab Options with Green Active State */}
              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'store'
                      ? 'bg-[#48BB78] text-white shadow-md'
                      : 'bg-skin-base/40 text-skin-muted hover:text-skin-base'
                  }`}
                >
                  <Store className="w-5 h-5" />
                  Storefront View
                </button>
                <button
                  onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === 'admin'
                      ? 'bg-[#48BB78] text-white shadow-md'
                      : 'bg-skin-base/40 text-skin-muted hover:text-skin-base'
                  }`}
                >
                  <ShieldCheck className="w-5 h-5" />
                  Mom's Admin Dashboard
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-skin-base/30 text-center text-xs text-skin-muted">
              <p>BIGVIEW PWA • EL.D.Gate</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
