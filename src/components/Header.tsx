'use client';

import React, { useState } from 'react';
import { ArrowLeft, Search, Menu, User, ShoppingBag, X, Store, ShieldCheck } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import UserProfileModal from './UserProfileModal';

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
  const { cart, ownerAccount, isOwner, items } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  import React, { useState, useEffect } from 'react';

// Inside your Header component:
useEffect(() => {
  if (mobileMenuOpen || isProfileModalOpen || isSearchOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'unset';
  }
  return () => {
    document.body.style.overflow = 'unset';
  };
}, [mobileMenuOpen, isProfileModalOpen, isSearchOpen]);


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
                } else if (window.history.length > 1) {
                  window.history.back();
                } else {
                  setActiveTab('store'); 
                }
              }}
              className="p-1.5 rounded-full hover:bg-skin-base/20 text-skin-muted hover:text-skin-base transition-colors"
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
              <div className="flex items-center gap-3 pb-3 border-b border-skin-base">
                <div className="relative flex-1 flex items-center">
                  <Search className="w-5 h-5 absolute left-3 text-skin-muted" />
                  <input
                    type="text"
                    autoFocus
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

              <div className="flex-1 overflow-y-auto py-4">
                <p className="text-xs text-skin-muted font-bold uppercase tracking-wider mb-3">
                  Matching Items ({searchQuery ? 'Filtered' : 'Type to search'})
                </p>
              </div>
            </div>
          )}

          {/* RIGHT: Mobile Menu, User Profile, Cart */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-xl hover:bg-skin-base/50 text-skin-muted hover:text-skin-base transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* User Icon Trigger */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="p-1 rounded-full transition-transform active:scale-95"
              aria-label="Manage Account"
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

        {/* DESKTOP TOP NAVIGATION SUB-BAR */}
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

      {/* MOBILE FULL-PAGE MENU */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[53px] bottom-0 bg-skin-card border-b border-skin-base/30 shadow-2xl z-40 md:hidden p-5 flex flex-col gap-4 overflow-y-auto animate-in fade-in duration-150">
          <div className="py-2">
            <h3 className="text-xs font-bold text-skin-muted uppercase tracking-wider mb-3 px-1">
              Shop By Categories
            </h3>
            
            <div className="grid grid-cols-2 gap-3">
              {Array.from(new Set(items.map(item => item.category))).map((category, index) => {
                const catItem = items.find(item => item.category === category);
                
                return (
                  <div 
                    key={index}
                    onClick={() => {
                      setMobileMenuOpen(false);
                    }}
                    className="bg-skin-base border border-skin-base/60 rounded-2xl p-2.5 flex flex-col items-center text-center cursor-pointer hover:border-brand-yellow transition group shadow-sm"
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-skin-card mb-2 shadow-inner relative">
                      <img 
                        src={catItem?.imageUrl || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80"} 
                        alt={category}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    
                    <span className="font-bold text-xs text-skin-base truncate w-full">
                      {category}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal Integration */}
      <UserProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        onNavigate={(tab) => setActiveTab(tab)} 
      />
    </>
  );
}