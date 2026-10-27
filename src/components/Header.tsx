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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const userInitial = isOwner && ownerAccount?.email ? ownerAccount.email.charAt(0).toUpperCase() : null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-skin-card border-b border-skin-base/30 py-1 px-3">

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3">
          
                  {/* LEFT: Back Icon + Clickable BIGVIEW Logo */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  window.history.back();
                }
              }}
              className="p-1.5 rounded-full hover:bg-skin-base/50 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Go Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveTab('store')}
              className="font-black text-base sm:text-lg tracking-wider text-[#D4AF37] drop-shadow-sm select-none hover:opacity-90 text-left"
            >
              BIGVIEW
            </button>
          </div>


          {/* MIDDLE: Sleek Opacity Search Bar */}
          <div className="flex-1 max-w-md mx-1">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-skin-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search items..."
                className="w-full bg-stone-500/10 rounded-full pl-9 pr-3 py-1 text-xs sm:text-sm text-skin-base placeholder:text-skin-muted/70 focus:outline-none hover:bg-stone-500/20 cursor-pointer sm:cursor-text"

              />
            </div>
          </div>
          
          {isSearchOpen && (
  <div className="fixed inset-0 z-50 bg-skin-base flex flex-col p-4 animate-in fade-in duration-150">
    {/* Search Header */}
    <div className="flex items-center gap-3 pb-3 border-b border-skin-base">
      <div className="relative flex-1 flex items-center">
        <Search className="w-5 h-5 absolute left-3 text-skin-muted" />
        <input
          type="text"
          autoFocus // Automatically pops up the mobile keyboard
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search EL.D.Gate items..."
          className="w-full bg-skin-card border-2 border-[#48BB78] rounded-full pl-10 pr-4 py-2 text-sm text-skin-base focus:outline-none shadow-md"
        />
      </div>
      <button 
        onClick={() => setIsSearchOpen(false)}
        className="font-bold text-sm px-3 py-2 text-skin-muted hover:text-skin-base"
      >
        Cancel
      </button>
    </div>

    {/* Search Results Preview or Quick Categories */}
    <div className="flex-1 overflow-y-auto py-4">
      <p className="text-xs text-skin-muted font-bold uppercase tracking-wider mb-3">
        Matching Items ({searchQuery ? 'Filtered' : 'Type to search'})
      </p>
      {/* You can map your filtered items list here */}
    </div>
  </div>
)}


          {/* RIGHT: Mobile Menu (Hidden on Desktop), User Profile, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Mobile Hamburger (Hidden on md and above) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl hover:bg-skin-base/50 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Icon / Avatar */}
            <button
              onClick={() => setActiveTab('admin')}
              className="p-1 rounded-full transition-transform active:scale-95"
              aria-label="Manage Store"
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

        {/* DESKTOP TOP NAVIGATION SUB-BAR (Replaces hamburger on desktop) */}
        <div className="hidden md:flex items-center justify-center gap-6 border-t border-skin-base/20 py-1.5 bg-skin-card/50 text-xs font-bold">
          <button
            onClick={() => setActiveTab('store')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'store' ? 'bg-[#48BB78] text-white shadow-sm' : 'text-skin-muted hover:text-skin-base'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            Storefront
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors ${
              activeTab === 'admin' ? 'bg-[#48BB78] text-white shadow-sm' : 'text-skin-muted hover:text-skin-base'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Manage Your Store
          </button>
        </div>
      </header>

      {/* MOBILE FULL-PAGE MENU (Appears right below header without covering it, NO slide-in effect) */}
      {mobileMenuOpen && (
        <div className="absolute top-[53px] left-0 w-full bg-skin-card border-b border-skin-base/30 shadow-xl z-40 md:hidden p-5 flex flex-col gap-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-skin-base/20">
            <span className="font-extrabold text-sm text-skin-muted uppercase tracking-wider">Navigation Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-lg bg-skin-base/40 text-skin-muted hover:text-skin-base"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => { setActiveTab('store'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'store' ? 'bg-[#48BB78] text-white shadow-md' : 'bg-skin-base/30 text-skin-base'
              }`}
            >
              <Store className="w-5 h-5" />
              Storefront View
            </button>
            <button
              onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'admin' ? 'bg-[#48BB78] text-white shadow-md' : 'bg-skin-base/30 text-skin-base'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
              Manage Your Store
            </button>
          </div>

          {/* Shop by Category Section */}
          <div className="pt-3 border-t border-skin-base/20">
            <h3 className="font-extrabold text-xs text-skin-muted uppercase tracking-wider mb-3">Shop by Category</h3>
            <div className="grid grid-cols-2 gap-2">
              <div 
                onClick={() => { setSearchQuery('Building'); setMobileMenuOpen(false); setActiveTab('store'); }}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-skin-base/30 hover:bg-skin-base/60 cursor-pointer border border-skin-base/20 transition"
              >
                <img src="https://images.unsplash.com/photo-1541888946425-d0fbb18fcd35?auto=format&fit=crop&w=100&q=80" alt="Building Materials" className="w-9 h-9 rounded-lg object-cover" />
                <span className="text-xs font-bold line-clamp-1">Building Materials</span>
              </div>
              <div 
                onClick={() => { setSearchQuery('Household'); setMobileMenuOpen(false); setActiveTab('store'); }}
                className="flex items-center gap-2.5 p-2 rounded-xl bg-skin-base/30 hover:bg-skin-base/60 cursor-pointer border border-skin-base/20 transition"
              >
                <img src="https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=100&q=80" alt="Household Items" className="w-9 h-9 rounded-lg object-cover" />
                <span className="text-xs font-bold line-clamp-1">Household Items</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
