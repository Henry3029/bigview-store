'use client';

import React, { useState } from 'react';
import { Lock, Tag, X } from 'lucide-react';

interface AuthScreenProps {
  onClose?: () => void;
  onRegister: (email: string, pass: string, storeName: string) => void;
  onLogin: (email: string, pass: string) => void;
  setShowTroubleModal: (val: boolean) => void;
  setShowGoogleModal: (val: boolean) => void;
  loginWithGoogle: () => void;
}

export default function AuthScreen({
  onClose,
  onRegister,
  onLogin,
  setShowTroubleModal,
  setShowGoogleModal,
  loginWithGoogle,
}: AuthScreenProps) {
  // Toggle between 'register' and 'signin' mode
  const [isSignInMode, setIsSignInMode] = useState(false);

  // Form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('EL.D.Gate');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignInMode) {
      onLogin(emailInput, passwordInput);
    } else {
      if (passwordInput !== confirmPasswordInput) {
        alert('Passwords do not match. Please check and try again.');
        return;
      }
      onRegister(emailInput, passwordInput, storeNameInput);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-skin-base relative">
      
      {/* HEADER BAR: Top-Left 'X' button & Top-Center Golden 'BIGVIEW' title */}
      <div className="w-full flex items-center justify-between px-4 py-4 sm:px-8 border-b border-skin-base/20">
        <button 
          onClick={onClose}
          className="p-2 text-skin-muted hover:text-skin-base transition rounded-full hover:bg-skin-card"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>

        <h1 className="text-xl sm:text-2xl font-black text-[#D4AF37] tracking-wider absolute left-1/2 -translate-x-1/2">
          BIGVIEW
        </h1>

        <div className="w-10" />
      </div>

      {/* MAIN CENTERED CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm sm:max-w-md bg-skin-card border border-skin-base p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          
          {/* Safeguarded & Price Tag Banners */}
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-skin-base mb-1">
              {isSignInMode ? 'Sign In to Your Store' : 'Create Vendor Account'}
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#48BB78] font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>All data is safeguarded with a padlock</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-skin-muted font-medium bg-skin-base/50 py-1.5 px-3 rounded-full mt-3">
              <Tag className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Get lower price on all items</span>
            </div>
          </div>

          {/* DYNAMIC AUTH FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Show Store Name field ONLY during Registration */}
            {!isSignInMode && (
              <div>
                <label className="text-xs text-skin-muted block mb-1 font-bold">Store Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. EL.D.Gate"
                  value={storeNameInput}
                  onChange={e => setStoreNameInput(e.target.value)}
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
                placeholder="Enter password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
              />
            </div>

            {/* Show Confirm Password field ONLY during Registration */}
            {!isSignInMode && (
              <div>
                <label className="text-xs text-skin-muted block mb-1 font-bold">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="Re-enter password"
                  value={confirmPasswordInput}
                  onChange={e => setConfirmPasswordInput(e.target.value)}
                  className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
                />
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md active:scale-95 text-base tracking-wide mt-2"
            >
              {isSignInMode ? 'Sign In' : 'Register'}
            </button>
          </form>

          {/* TOGGLE BETWEEN REGISTER & SIGN IN */}
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

          {/* Trouble signing in? */}
          <div className="text-center pt-1">
            <button 
              type="button"
              onClick={() => setShowTroubleModal(true)}
              className="text-xs text-skin-muted hover:text-skin-base underline font-medium"
            >
              Trouble signing in?
            </button>
          </div>

          {/* Demarcation OR */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-skin-base" /></div>
            <span className="relative bg-skin-card px-3 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
          </div>

          {/* CONTINUE WITH GOOGLE (Real G Logo & Increased Font Size) */}
          <button 
            type="button"
            onClick={() => { loginWithGoogle(); setShowGoogleModal(true); }}
            className="w-full flex items-center justify-center gap-3 bg-skin-base border border-skin-base py-3.5 rounded-full font-bold text-sm text-skin-base hover:bg-skin-base/80 transition shadow-sm"
          >
            {/* Real Google 'G' SVG Logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.32 7.23 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.13 0 9.87 0 12s.43 3.87 1.18 5.4l4.09-3.16z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
}
