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
       <div className="absolute top-[51px] right-2 sm:right-4 w-full max-w-sm z-50 animate-in fade-in zoom-in-95 duration-150">
      {/* Click-stop wrapper to re-enable pointer events */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-[310px] pointer-events-auto"
      >
        {/* UPWARD ARROW / CARET POINTER (Positioned right under the User Icon) */}
        <div className="absolute -top-2 right-[34px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-zinc-800 z-10" />

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
            className="p-2 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="p-2.5 rounded-full ​bg-black-900 text-brand-yellow shadow-xs mb-2 group-hover:scale-105 transition">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <span className="font-bold text-xs text-skin-base">Your Orders</span>
          </div>

          {/* Credit Balance Box */}
          <div 
            className="p-2 flex flex-col items-center text-center cursor-pointer"
          >
            <div className="p-2.5 rounded-xl ​bg-zinc-900 text-brand-yellow shadow-xs mb-2 group-hover:scale-105 transition">
              <Wallet className="w-8 h-8" />
            </div>
            <span className="font-bold text-xs text-skin-base">Credit Balance</span>
          </div>
        </div>

        {/* 3. Bottom Vertical List */}
        <div className="flex flex-col gap-1 pt-2 border-t border-skin-base/60">
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base border-b border-skin-base fhover:bg-skin-base transition text-left">
            <Star className="w-4 h-4 text-brand-yellow" />
            <span>Your Reviews</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 border-b border-skin-base rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Clock className="w-4 h-4 text-skin-muted" />
            <span>Browsing History</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 border-b border-skin-base rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <MapPin className="w-4 h-4 text-skin-muted" />
            <span>Delivery / Pickup Address</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 border-b border-skin-base rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Headphones className="w-4 h-4 text-skin-muted" />
            <span>Customer Support</span>
          </button>
          <button onClick={() => { onNavigate('admin'); onClose(); }} className="flex items-center gap-3 p-2.5 border-b border-skin-base rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Settings className="w-4 h-4 text-skin-muted" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
