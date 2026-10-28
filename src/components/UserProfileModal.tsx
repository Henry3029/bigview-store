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
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Modal Container: Leaves small side gaps (mx-4 max-w-md), wraps content height, prevents closing when clicking inside */}
      <div 
        onClick={(e) => e.stopPropagation()} 
        className="w-full max-w-md bg-skin-card border border-skin-base rounded-3xl shadow-2xl p-5 sm:p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
      >
        
        {/* Top Header Row with Close (X) Button */}
        <div className="flex items-center justify-between pb-3 border-b border-skin-base/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-brand-yellow/20 text-brand-yellow flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base tracking-tight">Account & Profile</h3>
              <p className="text-[11px] text-skin-muted">EL.D.Gate Customer Portal</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-skin-base text-skin-muted hover:text-skin-base transition"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Yellow Signup / Register Button */}
        <button 
          onClick={() => {
            onNavigate('admin');
            onClose();
          }}
          className="w-full bg-brand-yellow text-black font-extrabold py-3 rounded-xl hover:opacity-95 transition shadow-sm text-sm flex items-center justify-center gap-2"
        >
          <span>Sign Up / Register Store Access</span>
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
            className="bg-skin-base/60 border border-skin-base/60 p-3.5 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-brand-yellow transition group"
          >
            <div className="p-2.5 rounded-xl bg-skin-card text-brand-yellow shadow-xs mb-2 group-hover:scale-105 transition">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-skin-base">Your Orders</span>
            <span className="text-[10px] text-skin-muted">Track pickups & PINs</span>
          </div>

          {/* Credit Balance Box */}
          <div 
            className="bg-skin-base/60 border border-skin-base/60 p-3.5 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-brand-yellow transition group"
          >
            <div className="p-2.5 rounded-xl bg-skin-card text-brand-yellow shadow-xs mb-2 group-hover:scale-105 transition">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-skin-base">Credit Balance</span>
            <span className="text-[10px] text-brand-yellow font-extrabold">₦0.00 Active</span>
          </div>
        </div>

        {/* 3. Bottom Vertical List */}
        <div className="flex flex-col gap-1 pt-2 border-t border-skin-base/60">
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Star className="w-4 h-4 text-brand-yellow" />
            <span>Your Reviews</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Clock className="w-4 h-4 text-skin-muted" />
            <span>Browsing History</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <MapPin className="w-4 h-4 text-skin-muted" />
            <span>Delivery / Pickup Address</span>
          </button>
          <button onClick={onClose} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Headphones className="w-4 h-4 text-skin-muted" />
            <span>Customer Support</span>
          </button>
          <button onClick={() => { onNavigate('admin'); onClose(); }} className="flex items-center gap-3 p-2.5 rounded-xl text-xs sm:text-sm font-semibold text-skin-base hover:bg-skin-base transition text-left">
            <Settings className="w-4 h-4 text-skin-muted" />
            <span>Settings</span>
          </button>
        </div>

      </div>
    </div>
  );
}
