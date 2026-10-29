'use client';

import React, { useState } from 'react';
import { Lock, Tag, X, User } from 'lucide-react';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userData: { name: string; email: string }) => void;
}

export default function CustomerAuthModal({ isOpen, onClose, onSuccess }: CustomerAuthModalProps) {
  const [isSignInMode, setIsSignInMode] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || (!isSignInMode && !nameInput)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Simulate successful customer authentication / sign up
    onSuccess({
      name: isSignInMode ? 'Valued Customer' : nameInput,
      email: emailInput,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-skin-base z-50 flex flex-col items-center justify-center p-6 animate-in fade-in duration-200 overflow-y-auto">
      
      {/* Top Close Button (Top Far Right / Left aligned as desired) */}
      <button 
        onClick={onClose}
        className="absolute top-6 left-6 p-2.5 text-skin-muted hover:text-skin-base transition rounded-full hover:bg-skin-base border border-skin-base shadow-sm"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Full-Page Content Stack */}
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center my-auto">
        
        {/* Header Branding */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-yellow text-black font-black rounded-2xl flex items-center justify-center text-xl shadow-md">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-skin-base tracking-tight">
            {isSignInMode ? 'Sign In to Your Account' : 'Create Customer Account'}
          </h2>
          <p className="text-xs sm:text-sm text-skin-muted max-w-xs">
            {isSignInMode 
              ? 'Access your saved items, orders, and pickup PINs.' 
              : 'Save your cart, track your orders, and enjoy app discounts at EL.D.Gate.'}
          </p>
        </div>

        {/* Form Flow */}
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left pt-2">
          {!isSignInMode && (
            <div className="space-y-1.5">
              <label className="text-xs text-skin-muted block font-bold uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Adebayo Johnson"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full bg-skin-base border border-skin-base px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-skin-muted block font-bold uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs text-skin-muted block font-bold uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter your password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-4 rounded-2xl hover:opacity-90 transition shadow-lg text-sm mt-2"
          >
            {isSignInMode ? 'Sign In & Proceed' : 'Create Account & Proceed'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-xs text-skin-muted pt-1">
          {isSignInMode ? (
            <p>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setIsSignInMode(false)}
                className="text-skin-base font-bold underline hover:text-brand-yellow transition"
              >
                Register
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setIsSignInMode(true)}
                className="text-skin-base font-bold underline hover:text-brand-yellow transition"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
