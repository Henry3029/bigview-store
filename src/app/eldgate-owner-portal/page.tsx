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
function OwnerPortalAuthContent() {
  const { isOwner, loginOwner, registerOwner, resetPassword } = useStore();
  
  // Basic Auth Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('BIGVIEW Store');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // alert input
  const [alertConfig, setAlertConfig] = useState({
  isOpen: false,
  title: '',
  message: '',
  type: 'success' as 'success' | 'error' | 'info'
});

  // Additional Registration Inputs
  const [firstNameInput, setFirstNameInput] = useState('');
  const [surnameInput, setSurnameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

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
    }, 800); // 800ms high-end branded flash

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

    const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!emailInput.trim()) newErrors.email = 'Please enter your email address.';
    if (!passwordInput.trim()) newErrors.password = 'Please enter your password.';

    if (isRegistering) {
      if (!firstNameInput.trim()) newErrors.firstName = 'Please enter your first name.';
      if (!surnameInput.trim()) newErrors.surname = 'Please enter your surname.';
      if (!storeNameInput.trim()) newErrors.storeName = 'Please enter your store name.';
      if (!phoneInput.trim()) newErrors.phone = 'Please enter your phone number.';

      // Strong Password Validation Rules
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(passwordInput)) {
        newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number & special character.';
      } else if (passwordInput !== confirmPasswordInput) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    if (isRegistering) {
      const success = registerOwner(emailInput, passwordInput, storeNameInput);
      if (success) {
      	// Clear password inputs so the strength meter automatically vanishes
      setPasswordInput('');
      setConfirmPasswordInput('');
        setAlertConfig({
        isOpen: true,
        title: 'Welcome to BIGVIEW',
        message: 'Store account registered successfully! Welcome to your owner portal.',
        type: 'success'
      });
      setIsRegistering(false); // Switch back to sign-in mode or let them log in
    }
    } else {
    const success = await loginOwner(emailInput, passwordInput);
    if (!success) {
      setAlertConfig({
        isOpen: true,
        title: 'Access Denied',
        message: 'Check your credentials or authorization.',
        type: 'error'
      });
    }
  }
};

  
  if (isLoading) {
  return <LoadingScreen message="Loading BIGVIEW Store..." />;
}

  // If already logged in, render admin dashboard directly
  if (isOwner) {
    return <AdminDashboard />;
  }

  // Otherwise, render full-page immersive view
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-3 pb-12 bg-skin-base text-skin-base relative">
      
      {/* Centered Content Stack */}
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
        
        {/* Top Branding (Text & Security Badge Only) */}
        <div className="space-y-1.5 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-black font-sans text-[#D4AF37] tracking-normal">
            Bigview store
          </h2>

          <p className="text-xs sm:text-sm text-emerald-500 max-w-xs flex items-center justify-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>All data is safeguarded</span>
          </p>
        </div>

        {/* Full-Width Form Flow with Custom Validation & noValidate */}
        <form onSubmit={handleAuthSubmit} noValidate className="w-full space-y-4 text-left pt-2">
          
          {isRegistering && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-skin-muted block">First Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John"
                    value={firstNameInput}
                    onChange={e => handleInputChange('firstName', e.target.value, setFirstNameInput)}
                    className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                    }`}
                  />
                  {errors.firstName && <p className="text-[11px] text-red-500 font-medium">{errors.firstName}</p>}
                </div>

                {/* Surname */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-skin-muted block">Last Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Doe"
                    value={surnameInput}
                    onChange={e => handleInputChange('surname', e.target.value, setSurnameInput)}
                    className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                      errors.surname ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                    }`}
                  />
                  {errors.surname && <p className="text-[11px] text-red-500 font-medium">{errors.surname}</p>}
                </div>
              </div>

              {/* Store Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-skin-muted block">Store Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. eldgate"
                  value={storeNameInput}
                  onChange={e => handleInputChange('storeName', e.target.value, setStoreNameInput)}
                  className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                    errors.storeName ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                  }`}
                />
                {errors.storeName && <p className="text-[11px] text-red-500 font-medium">{errors.storeName}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-skin-muted block">Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="+234..."
                  value={phoneInput}
                  onChange={e => handleInputChange('phone', e.target.value, setPhoneInput)}
                  className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-skin-muted block">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={emailInput}
              onChange={e => handleInputChange('email', e.target.value, setEmailInput)}
              className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
          </div>

         {/* Password Field (with eye toggle & strength indicator) */}
<PasswordField 
  label="Password"
  value={passwordInput}
  onChange={(val) => handleInputChange('password', val, setPasswordInput)}
  error={errors.password}
  showIndicator={isRegistering} // Shows strength bar during registration
/>

          {/* Confirm Password Field (with eye toggle only) */}
{isRegistering && (
  <PasswordField 
    label="Confirm Password"
    value={confirmPasswordInput}
    onChange={(val) => handleInputChange('confirmPassword', val, setConfirmPasswordInput)}
    error={errors.confirmPassword}
    showIndicator={false} // Eye toggle enabled, strength bar hidden
  />
)}

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-lg text-sm mt-3"
          >
            {isRegistering ? 'Register Your Store' : 'Sign In'}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="text-xs text-skin-muted pt-1">
          {isRegistering ? (
            <p>
              Already have an owner account?{' '}
              <button onClick={() => setIsRegistering(false)} className="text-brand-yellow font-bold underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Setting up for the first time?{' '}
              <button onClick={() => setIsRegistering(true)} className="text-brand-yellow font-bold underline">
                Register Account
              </button>
            </p>
          )}
        </div>

        {/* Trouble signing in? */}
        {!isRegistering && (
          <div>
            <button 
              onClick={() => setShowTroubleModal(true)}
              className="text-xs text-skin-muted hover:text-skin-base underline font-medium"
            >
              Trouble signing in?
            </button>
          </div>
        )}

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
          className="w-full flex items-center justify-center gap-3 bg-skin-card border border-skin-base px-4 py-3.5 rounded-full text-sm font-semibold text-skin-base shadow-sm hover:opacity-95 transition-opacity"
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
            className="w-full sm:max-w-md bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-skin-base space-y-5 animate-in slide-in-from-bottom-full duration-300 ease-out text-left"
          >
            <div className="flex justify-between items-center border-b border-skin-base pb-3">
              <h3 className="font-extrabold text-base">Trouble Signing In?</h3>
              <button onClick={() => setShowTroubleModal(false)} className="text-skin-muted hover:text-skin-base font-bold text-lg">✕</button>
            </div>

            <div className="space-y-4 text-xs text-skin-muted">
              <div className="space-y-2">
                <p>If you forgot your owner password, you can request a secure reset code.</p>
                <button 
                  onClick={() => { setShowTroubleModal(false); setShowResetModal(true); }}
                  className="w-full py-2.5 rounded-full border border-skin-base font-bold text-skin-base hover:bg-skin-base transition text-xs"
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
            className="w-full sm:max-w-lg bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-skin-base space-y-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-200 text-left"
          >
            <div>
              <div className="flex justify-between items-center border-b border-skin-base pb-3 mb-6">
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
                  className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
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
export default function SecretOwnerPortalPage() {
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
      <OwnerPortalAuthContent />
    </StoreProvider>
  );
}
