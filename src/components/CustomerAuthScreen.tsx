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
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-skin-card border border-skin-base p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-skin-muted hover:text-skin-base transition rounded-full hover:bg-skin-base"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <h2 className="text-xl font-black text-skin-base">
            {isSignInMode ? 'Sign In to Your Account' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-skin-muted">
            {isSignInMode 
              ? 'Access your saved items, orders, and pickup PINs.' 
              : 'Save your cart, track your orders, and enjoy app discounts at EL.D.Gate.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignInMode && (
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Adebayo Johnson"
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="Enter your email"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
            />
          </div>

          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter your password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md active:scale-95 text-base tracking-wide mt-2"
          >
            {isSignInMode ? 'Sign In & Proceed' : 'Create Account & Proceed'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center text-xs text-skin-muted pt-1">
          {isSignInMode ? (
            <>
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => setIsSignInMode(false)}
                className="text-skin-base font-bold underline hover:text-brand-yellow transition"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => setIsSignInMode(true)}
                className="text-skin-base font-bold underline hover:text-brand-yellow transition"
              >
                Sign In
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
