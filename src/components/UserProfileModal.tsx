'use client';

import React from 'react';
import { 
  User, 
  ShoppingBag, 
  Wallet, 
  Star, 
  Clock, 
  MapPin, 
  Headphones, 
  Settings, 
  X,
  ArrowRight
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: 'store' | 'admin') => void;
}

export default function UserProfileModal({ isOpen, onClose, onNavigate }: UserProfileModalProps) {
  if (!isOpen) return null;

  return (
    // Backdrop: dims background and captures outside clicks to close
       <div className="absolute top-[53px] right-2 sm:right-4 w-full max-w-sm z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* Modal Container: Leaves small side gaps (mx-4 max-w-md), wraps content height, prevents closing when clicking inside */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="bg-skin-card border border-skin-base shadow-2xl p-4 sm:p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
      >

        {/* 1. Yellow Signup / Register Button */}
        <button 
          onClick={() => {
            onNavigate('admin');
            onClose();
          }}
          className="w-full bg-brand-yellow text-white font-extrabold py-3 rounded-xl hover:opacity-95 transition shadow-sm text-sm flex items-center justify-center gap-2"
        >
          <span>SING IN / REGISTER</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* 2. Side-by-Side Flex Box: Your Orders & Credit Balance */}
        <div className="grid grid-cols-2 gap-3">
          {/* Orders Box */}
          <div 
            onClick={() => {
              onNavigate('store');
              onClose();
            }}
            className="bg-skin-base/60 border  p-3.5  flex flex-col items-center text-center cursor-pointer hover:border-brand-yellow transition group"
          >
            <div className="p-2.5 rounded-xl ​bg-zinc-900 text-brand-yellow shadow-xs mb-2 group-hover:scale-105 transition">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <span className="font-bold text-xs text-skin-base">Your Orders</span>
          </div>

          {/* Credit Balance Box */}
          <div 
            className="bg-skin-base/60 border border-skin-base/60 p-3.5 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-brand-yellow transition group"
          >
            <div className="p-2.5 rounded-xl ​bg-zinc-900 text-brand-yellow shadow-xs mb-2 group-hover:scale-105 transition">
              <Wallet className="w-8 h-8" />
            </div>
            <span className="font-bold text-xs text-skin-base">Credit Balance</span>
          </div>
        </div>

        {/* 3. Bottom Vertical List */}
        <div className="flex flex-col gap-1 pt-2 border-t border-skin-base/60">
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
          <div className="border-b border-skin-base pb-2">
            <Star className="w-4 h-4 text-brand-yellow" />
            <span>Your Reviews</span>
            </div>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
          <div className="border-b border-skin-base pb-2">
            <Clock className="w-4 h-4 text-skin-muted" />
            <span>Browsing History</span>
            </div>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
          <div className="border-b border-skin-base pb-2">
            <MapPin className="w-4 h-4 text-skin-muted" />
            <span>Delivery / Pickup Address</span>
            </div>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
          <div className="border-b border-skin-base pb-2">
            <Headphones className="w-4 h-4 text-skin-muted" />
            <span>Customer Support</span>
            </div>
          </button>
          <button onClick={() => { onNavigate('admin'); onClose(); }} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
          <div className="border-b border-skin-base pb-2">
            <Settings className="w-4 h-4 text-skin-muted" />
            <span>Settings</span>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}
