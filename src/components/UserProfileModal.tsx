'use client';

import React from 'react';
import { 
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
  onOpenAuth?: () => void;
}

export default function UserProfileModal({ isOpen, onClose, onOpenAuth }: UserProfileModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 z-40 bg-transparent" 
      />

      {/* Outer positioning */}
      <div className="absolute top-[48px] inset-x-0 z-50 flex justify-end px-3 sm:px-4 pointer-events-none animate-in fade-in zoom-in-95 duration-150">
        
        {/* Click-stop wrapper */}
        <div 
          onClick={(e) => e.stopPropagation()} 
          className="relative w-full max-w-[310px] mr-1 pointer-events-auto shadow-2xl"
        >
          {/* Caret Pointer */}
          <div className="absolute -top-2 right-[30px] w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-skin-card z-10" />

          {/* MAIN MODAL BOX */}
          <div className="bg-skin-card border border-skin-base/40 shadow-2xl rounded-xl p-4 flex flex-col gap-3.5 text-skin-base max-h-[80vh] overflow-y-auto">

            {/* Sign In / Register Button */}
            <button 
              onClick={() => {
                onClose();
                if (onOpenAuth) {
                  onOpenAuth();
                }
              }}
              className="w-full bg-brand-yellow text-black font-extrabold py-2.5 rounded-full hover:opacity-95 transition shadow-sm text-sm flex items-center justify-center gap-2"
            >
              <span>SIGN IN / REGISTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Orders & Credit Balance */}
            <div className="grid grid-cols-2 gap-2">
              <div 
                onClick={onClose}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="p-2.5 rounded-full bg-skin-base text-brand-yellow shadow-xs mb-1.5 group-hover:scale-105 transition">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-skin-base">Your Orders</span>
              </div>

              <div 
                onClick={onClose}
                className="flex flex-col items-center text-center cursor-pointer group"
              >
                <div className="p-2.5 rounded-full bg-skin-base text-brand-yellow shadow-xs mb-1.5 group-hover:scale-105 transition">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="font-bold text-xs text-skin-base">Credit Balance</span>
              </div>
            </div>

            {/* Bottom Vertical List */}
            <div className="flex flex-col gap-0.5 pt-1 border-t border-skin-base/30">
              <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-skin-base border-b border-skin-base/20 hover:bg-skin-base/50 transition text-left">
                <Star className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
                <span>Your Reviews</span>
              </button>
              <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-skin-base border-b border-skin-base/20 hover:bg-skin-base/50 transition text-left">
                <Clock className="w-3.5 h-3.5 text-skin-muted shrink-0" />
                <span>Browsing History</span>
              </button>
              <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-skin-base border-b border-skin-base/20 hover:bg-skin-base/50 transition text-left">
                <MapPin className="w-3.5 h-3.5 text-skin-muted shrink-0" />
                <span>Delivery / Pickup Address</span>
              </button>
              <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-skin-base border-b border-skin-base/20 hover:bg-skin-base/50 transition text-left">
                <Headphones className="w-3.5 h-3.5 text-skin-muted shrink-0" />
                <span>Customer Support</span>
              </button>
              <button onClick={onClose} className="flex items-center gap-3 p-2 rounded-lg text-xs font-semibold text-skin-base hover:bg-skin-base/50 transition text-left">
                <Settings className="w-3.5 h-3.5 text-skin-muted shrink-0" />
                <span>Settings</span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
