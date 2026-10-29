'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import AdminDashboard from '@/components/AdminDashboard';
import { Lock } from 'lucide-react';
import { getItems, getStoreInfo } from '@/app/actions';
import { Item, StoreInfo } from '@/types';

// 1. Full-Page Immersive Authentication Component
function OwnerPortalAuthContent() {
  const { isOwner, loginOwner, registerOwner, resetPassword, loginWithGoogle } = useStore();
  
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('EL.D.Gate');
  const [isRegistering, setIsRegistering] = useState(false);

  // Recovery Modals State
  const [showTroubleModal, setShowTroubleModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      const success = registerOwner(emailInput, passwordInput, storeNameInput);
      if (success) {
        alert('Store account registered successfully! Welcome to EL.D.Gate Portal.');
      }
    } else {
      const success = await loginOwner(emailInput, passwordInput);
      if (!success) {
        alert('Access denied. Check your credentials or authorization.');
      }
    }
  };

  // If already logged in, render her admin dashboard directly
  if (isOwner) {
    return <AdminDashboard />;
  }

  // Otherwise, render full-page immersive view
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-skin-base text-skin-base relative">
      
      {/* Centered Content Stack (No Boxed Container Card) */}
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
        
        {/* Top Logo & Branding */}
        <div className="space-y-2 flex flex-col items-center">
          <div className="w-16 h-16 bg-brand-yellow text-black font-black rounded-2xl flex items-center justify-center text-xl shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">EL.D.Gate Portal</h1>
          <p className="text-xs sm:text-sm text-skin-muted max-w-xs">
            {isRegistering ? 'Register your store management account' : 'Restricted access. Authorized store owner login.'}
          </p>
        </div>

        {/* Full-Width Form Flow */}
        <form onSubmit={handleAuthSubmit} className="w-full space-y-4 text-left pt-2">
          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-xs text-skin-muted block font-bold uppercase tracking-wider">Store Name</label>
              <input 
                type="text" 
                required
                placeholder="EL.D.Gate"
                value={storeNameInput}
                onChange={e => setStoreNameInput(e.target.value)}
                className="w-full bg-skin-base border border-skin-base px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs text-skin-muted block font-bold uppercase tracking-wider">Store Email</label>
            <input 
              type="email" 
              required
              placeholder="mom@eldgate.ng"
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
              placeholder="Enter secure password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-4 py-3.5 rounded-2xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-4 rounded-2xl hover:opacity-90 transition shadow-lg text-sm mt-2"
          >
            {isRegistering ? 'Register Owner Account' : 'Unlock Admin Dashboard'}
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
        <div className="w-full relative flex items-center justify-center py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-skin-base/40" /></div>
          <span className="relative bg-skin-base px-4 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
        </div>

        {/* Google Auth Button */}
        <button 
          onClick={() => setShowGoogleModal(true)}
          className="w-full flex items-center justify-center gap-3 bg-skin-base border border-skin-base py-3.5 rounded-2xl font-bold text-xs hover:opacity-80 transition text-skin-base shadow-sm"
        >
          <span className="w-5 h-5 bg-black text-[#D4AF37] font-black rounded flex items-center justify-center text-[10px]">G</span>
          Continue with Google
        </button>
      </div>

      {/* 1. TROUBLE SIGNING IN MODAL */}
      {showTroubleModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity">
          <div className="w-full sm:max-w-md bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-skin-base space-y-5 animate-in slide-in-from-bottom duration-200 text-left">
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
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity">
          <div className="w-full sm:max-w-lg bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-skin-base space-y-6 flex flex-col justify-between animate-in slide-in-from-bottom duration-200 text-left">
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

      {/* 3. GOOGLE SIGN-IN MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="bg-[#18181b] border border-gray-800 text-white w-full max-w-sm rounded-3xl p-8 text-center space-y-6 shadow-2xl relative">
            <button onClick={() => setShowGoogleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
            
            <div className="w-14 h-14 bg-brand-yellow text-black font-black rounded-2xl mx-auto flex items-center justify-center text-xl shadow-lg">
              BV
            </div>
            
            <div className="space-y-1">
              <h3 className="text-xl font-extrabold tracking-tight">Sign in with Google</h3>
              <p className="text-xs text-gray-400">to continue to EL.D.Gate Admin Portal</p>
            </div>

            <button 
              onClick={() => { loginWithGoogle(); setShowGoogleModal(false); }}
              className="w-full bg-brand-yellow text-black font-bold py-3.5 rounded-full hover:opacity-90 transition shadow-lg text-sm"
            >
              Authenticate Owner Google Account
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
  const [initialStore, setInitialStore] =<StoreInfo>({
    name: 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'mom@eldgate.ng',
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
          <p className="font-bold text-sm">Loading Owner Portal...</p>
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
