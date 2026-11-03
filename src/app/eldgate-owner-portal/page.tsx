'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import AdminDashboard from '@/components/AdminDashboard';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
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
  const [storeNameInput, setStoreNameInput] = useState('EL.D.Gate');
  const [isRegistering, setIsRegistering] = useState(false);

  // Additional Registration Inputs (Fixed missing states)
  const [firstNameInput, setFirstNameInput] = useState('');
  const [surnameInput, setSurnameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // Recovery Modals State
  const [showTroubleModal, setShowTroubleModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      if (passwordInput !== confirmPasswordInput) {
        alert('Passwords do not match.');
        return;
      }
      const success = registerOwner(emailInput, passwordInput, storeNameInput);
      if (success) {
        alert('Store account registered successfully! Welcome to BIGVIEW Store.');
      }
    } else {
      const success = await loginOwner(emailInput, passwordInput);
      if (!success) {
        alert('Access denied. Check your credentials or authorization.');
      }
    }
  };

  // If already logged in, render admin dashboard directly
  if (isOwner) {
    return <AdminDashboard />;
  }

  // Otherwise, render full-page immersive view
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-t-1px p-b-12 bg-skin-base text-skin-base relative">
      
      {/* Centered Content Stack */}
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
        
        {/* Top Logo & Branding */}
        <div className="space-y-1 flex flex-col items-center">
          <h1 className="text-2xl sm:text-4xl font-black tracking-wider uppercase font-sans text-[#D4AF37]">
  BIGVIEW
</h1>


          <p className="text-xs sm:text-sm text-emerald-500 max-w-xs flex items-center justify-center gap-1.5 font-medium">
  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
  <span>All data is safeguarded</span>
</p>
        </div>

        {/* Full-Width Form Flow */}
        <form onSubmit={handleAuthSubmit} className="w-full space-y-4 text-left pt-2">
          
          {isRegistering && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {/* First Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-skin-muted block">First Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. John"
                    value={firstNameInput}
                    onChange={e => { setFirstNameInput(e.target.value); setErrors({ ...errors, firstName: '' }); }}
                    className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                    }`}
                  />
                  {errors.firstName && <p className="text-[11px] text-red-500 font-medium">{errors.firstName}</p>}
                </div>

                {/* Surname */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-skin-muted block">Surname</label>
                  <input 
                    type="text" 
                    value={surnameInput}
                    onChange={e => { setSurnameInput(e.target.value); setErrors({ ...errors, surname: '' }); }}
                    className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                      errors.surname ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                    }`}
                  />
                  {errors.surname && <p className="text-[11px] text-red-500 font-medium">{errors.surname}</p>}
                </div>
              </div>

              {/* Store Name */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted block">Store Name</label>
                <input 
                  type="text" 
                  value={storeNameInput}
                  onChange={e => { setStoreNameInput(e.target.value); setErrors({ ...errors, storeName: '' }); }}
                  className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                    errors.storeName ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                  }`}
                />
                {errors.storeName && <p className="text-[11px] text-red-500 font-medium">{errors.storeName}</p>}
              </div>

              {/* Phone Number */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-skin-muted block">Phone Number</label>
                <input 
                  type="tel" 
                  value={phoneInput}
                  onChange={e => { setPhoneInput(e.target.value); setErrors({ ...errors, phone: '' }); }}
                  className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                  }`}
                />
                {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
              </div>
            </>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-skin-muted block">Email Address</label>
            <input 
              type="email" 
              value={emailInput}
              onChange={e => { setEmailInput(e.target.value); setErrors({ ...errors, email: '' }); }}
              className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-skin-muted block">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setErrors({ ...errors, password: '' }); }}
              className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
              }`}
            />
            {errors.password && <p className="text-[11px] text-red-500 font-medium">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          {isRegistering && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-skin-muted block">Confirm Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={confirmPasswordInput}
                onChange={e => { setConfirmPasswordInput(e.target.value); setErrors({ ...errors, confirmPassword: '' }); }}
                className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base ${
                  errors.confirmPassword ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
                }`}
              />
              {errors.confirmPassword && <p className="text-[11px] text-red-500 font-medium">{errors.confirmPassword}</p>}
            </div>
          )}

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-4 rounded-full hover:opacity-90 transition shadow-lg text-sm mt-2"
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
              className="pt-2 text-xs text-skin-muted hover:text-skin-base underline font-medium"
            >
              Trouble signing in?
            </button>
          </div>
        )}

        {/* Demarcation */}
        <div className="w-full relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-skin-base/15" /></div>
          <span className="relative bg-skin-base px-4 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-3 bg-skin-card border border-skin-base px-4 py-3.5 rounded-full text-sm font-semibold text-skin-base hover:opacity-95 transition-opacity"
        >
          <GoogleIcon className="w-5 h-5 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>

      {/* 1. TROUBLE SIGNING IN MODAL (Fixed nested wrapper bug) */}
      {showTroubleModal && (
        <div 
          onClick={() => setShowTroubleModal(false)}
          className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4 transition-opacity animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-skin-base space-y-5 animate-in slide-in-from-bottom duration-200 text-left"
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [itemsData, storeData] = await Promise.all([getItems(), getStoreInfo()]);
        if (itemsData) setInitialItems(itemsData);
        if (storeData) setInitialStore(storeData);
      } catch (err) {
        console.error('Failed to load portal data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortalData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-skin-base flex items-center justify-center text-skin-base">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-brand-yellow text-black font-black rounded-xl animate-spin mx-auto flex items-center justify-center">
            🔒
          </div>
          <p className="font-bold text-sm">Loading BIGVIEW Store Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider initialItems={initialItems} initialStore={initialStore}>
      <OwnerPortalAuthContent />
    </StoreProvider>
  );
}
