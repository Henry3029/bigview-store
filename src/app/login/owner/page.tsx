'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import AdminDashboard from '@/components/AdminDashboard';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import LoadingScreen from '@/components/LoadingScreen';
import PasswordField from '@/components/PasswordField';
import BottomAlert from '@/components/BottomAlert';
import { signIn } from "next-auth/react";
import { Lock } from 'lucide-react';
import { getItems, getStoreInfo } from '@/app/actions';
import { Item, StoreInfo } from '@/types';

// 1. Full-Page Immersive Authentication Component
function OwnerLoginContent() {
  const { isOwner, loginOwner, resetPassword } = useStore();
  
  // Basic Auth Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Alert input state
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  // Recovery Modals State
  const [showTroubleModal, setShowTroubleModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  
  // Splash Screen Boot Timer Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Clear specific error field helper
  const handleInputChange = (field: string, value: string, setter: (val: string) => void) => {
    setter(value);
    if (errors[field]) {
      setErrors(currentErrors => {
        const updated = { ...currentErrors };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!emailInput.trim()) newErrors.email = 'Please enter your email address.';
    if (!passwordInput.trim()) newErrors.password = 'Please enter your password.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const success = await loginOwner(emailInput, passwordInput);
      if (success === false) {
        setAlertConfig({
          isOpen: true,
          title: 'Access Denied',
          message: 'Check your credentials or authorization.',
          type: 'error'
        });
      }
    } catch (err) {
      setAlertConfig({
        isOpen: true,
        title: 'Login Error',
        message: 'An error occurred during sign-in. Please try again.',
        type: 'error'
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  // If already logged in, render admin dashboard directly
  if (isOwner) {
    return <AdminDashboard />;
  }

  // Otherwise, render full-page immersive login view
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-3 pb-12 bg-skin-base text-skin-base relative">
      
      {/* Centered Content Stack */}
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
        
        {/* Top Branding */}
        <div className="space-y-1.5 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-black font-sans text-[#D4AF37] tracking-normal">
            Bigview store
          </h2>

          <p className="text-xs sm:text-sm text-emerald-500 max-w-xs flex items-center justify-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>All data is safeguarded</span>
          </p>
        </div>

        {/* Full-Width Form Flow */}
        <form onSubmit={handleLoginSubmit} noValidate className="w-full space-y-4 text-left pt-2">
          
          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-skin-muted block">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={emailInput}
              onChange={e => handleInputChange('email', e.target.value, setEmailInput)}
              className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-skin-base/40 focus:border-brand-yellow'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <PasswordField 
            label="Password"
            value={passwordInput}
            onChange={(val) => handleInputChange('password', val, setPasswordInput)}
            error={errors.password}
            showIndicator={false}
          />

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-lg text-sm mt-3"
          >
            Sign In
          </button>
        </form>

        {/* Link to Registration Page */}
        <div className="text-xs text-skin-muted pt-1">
          <p>
            Setting up for the first time?{' '}
            <a href="/register/owner" className="text-brand-yellow font-bold underline">
              Register Account
            </a>
          </p>
        </div>

        {/* Trouble signing in? */}
        <div>
          <button 
            onClick={() => setShowTroubleModal(true)}
            className="text-xs text-skin-muted hover:text-skin-base underline font-medium"
          >
            Trouble signing in?
          </button>
        </div>

        {/* Demarcation */}
        <div className="w-full relative flex items-center justify-center py-1">
          <div 
            className="absolute inset-0 flex items-center"
            style={{
              maskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)',
              WebkitMaskImage: 'linear-gradient(to right, transparent, black 20%, black 80%, transparent)'
            }}
          >
            <div className="w-full border-t border-skin-base/30" />
          </div>
          <span className="relative bg-skin-base px-4 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-3 bg-skin-card border border-skin-base/40 px-4 py-3.5 rounded-full text-sm font-semibold text-skin-base shadow-sm hover:opacity-95 transition-opacity"
        >
          <GoogleIcon className="w-5 h-5 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>

      {/* 1. TROUBLE SIGNING IN MODAL */}
      {showTroubleModal && (
        <div 
          onClick={() => setShowTroubleModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-skin-base/40 space-y-5 animate-in slide-in-from-bottom-full duration-300 ease-out text-left"
          >
            <div className="flex justify-between items-center border-b border-skin-base/30 pb-3">
              <h3 className="font-extrabold text-base">Trouble Signing In?</h3>
              <button onClick={() => setShowTroubleModal(false)} className="text-skin-muted hover:text-skin-base font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4 text-xs text-skin-muted">
              <div className="space-y-2">
                <p>If you forgot your owner password, you can request a secure reset code.</p>
                <button 
                  onClick={() => { setShowTroubleModal(false); setShowResetModal(true); }}
                  className="w-full py-2.5 rounded-full border border-skin-base/40 font-bold text-skin-base hover:bg-skin-base transition text-xs"
                >
                  Reset your password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. RESET PASSWORD MODAL */}
      {showResetModal && (
        <div 
          onClick={() => setShowResetModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-skin-base/40 space-y-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-200 text-left"
          >
            <div>
              <div className="flex justify-between items-center border-b border-skin-base/30 pb-3 mb-6">
                <h3 className="font-black text-lg">Reset Password</h3>
                <button onClick={() => setShowResetModal(false)} className="text-skin-muted hover:text-skin-base font-bold text-lg">✕</button>
              </div>
              
              <p className="text-xs text-skin-muted mb-4">
                Enter your registered store email address below to generate a temporary reset password.
              </p>

              <div className="space-y-3">
                <label className="text-xs text-skin-muted block font-bold">Store Email Address</label>
                <input 
                  type="email"
                  placeholder="mom@eldgate.ng"
                  value={resetEmailInput}
                  onChange={e => setResetEmailInput(e.target.value)}
                  className="w-full bg-skin-base border border-skin-base/40 px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
                />
              </div>
            </div>

            <button 
              onClick={async () => {
                await resetPassword(resetEmailInput);
                setShowResetModal(false);
              }}
              className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md text-sm mt-6"
            >
              Submit Reset Request
            </button>
          </div>
        </div>
      )}
      
      <BottomAlert 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig(p => ({ ...p, isOpen: false }))} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />

    </div>
  );
}

// 2. Main Page Route Wrapper with StoreProvider
export default function OwnerLoginPage() {
  const [initialItems, setInitialItems] = useState<Item[]>([]);
  const [initialStore, setInitialStore] = useState<StoreInfo>({
    name: 'BIGVIEW Store',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'mom@eldgate.ng'
  });

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [itemsData, storeData] = await Promise.all([getItems(), getStoreInfo()]);
        if (itemsData) setInitialItems(itemsData);
        if (storeData) setInitialStore(storeData);
      } catch (err) {
        console.error('Failed to load portal data:', err);
      }
    }
    loadPortalData();
  }, []);

  return (
    <StoreProvider initialItems={initialItems} initialStore={initialStore}>
      <OwnerLoginContent />
    </StoreProvider>
  );
}
