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
    // Outer positioning: px-3 ensures space on both left & right edges of the viewport
    <div className="absolute top-[48px] inset-x-0 z-50 flex justify-end px-3 sm:px-4 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
      
      {/* Click-stop wrapper, slightly shifted right to line up with the icon */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="relative w-full max-w-[310px] mr-1 pointer-events-auto shadow-2xl"
      >
        {/* UPWARD ARROW / CARET POINTER (Points precisely to the user icon) */}
        <div className="absolute -top-2 right-[30px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-zinc-800 z-10" />

        {/* MAIN MODAL BOX: Restored solid dark background, shadow, and rounded edges */}
       <div className="bg-skin-card border border-skin-base shadow-2xl rounded-xl p-4 flex flex-col gap-3.5 text-skin-base max-h-[80vh] overflow-y-auto">

          {/* 1. Yellow Sign In / Register Button */}
          <button 
            onClick={() => {
              onNavigate('admin');
              onClose();
            }}
            className="w-full bg-brand-yellow text-white font-extrabold py-2.5 rounded-full hover:opacity-95 transition shadow-sm text-base flex items-center justify-center gap-2"
          >
            <span>SIGN IN / REGISTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* 2. Side-by-Side Flex Box: Your Orders & Credit Balance */}
          <div className="grid grid-cols-2 gap-2">
            {/* Orders Box */}
            <div 
              onClick={() => {
                onNavigate('store');
                onClose();
              }}
              className="flex flex-col items-center text-center cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-zinc-900 text-brand-yellow shadow-xs mb-1.5 group-hover:scale-105 transition">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-skin-inverted">Your Orders</span>
            </div>

            {/* Credit Balance Box */}
            <div 
              className="flex flex-col items-center text-center cursor-pointer"
            >
              <div className="p-2.5 rounded-full bg-zinc-900 text-brand-yellow shadow-xs mb-1.5 group-hover:scale-105 transition">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="font-bold text-xs text-skin-inverted">Credit Balance</span>
            </div>
          </div>

          {/* 3. Bottom Vertical List */}
          <div className="flex flex-col gap-0.5 pt-1 border-t border-zinc-800">
            <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold ​text-skin-inverted border-b border-zinc-800/80 hover:bg-zinc-800 transition text-left">
              <Star className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
              <span>Your Reviews</span>
            </button>
            <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold ​text-skin-inverted border-b border-zinc-800/80 hover:bg-zinc-800 transition text-left">
              <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Browsing History</span>
            </button>
            <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold ​text-skin-inverted border-b border-zinc-800/80 hover:bg-zinc-800 transition text-left">
              <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Delivery / Pickup Address</span>
            </button>
            <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold ​text-skin-inverted border-b border-zinc-800/80 hover:bg-zinc-800 transition text-left">
              <Headphones className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Customer Support</span>
            </button>
            <button onClick={() => { onNavigate('admin'); onClose(); }} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold ​text-skin-inverted hover:bg-zinc-800 transition text-left">
              <Settings className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <span>Settings</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
