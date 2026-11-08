'use client';

import React, { useState } from 'react';
import { Lock, Tag, X } from 'lucide-react';
import PasswordField from '@/components/PasswordField';
import BottomAlert from '@/components/BottomAlert';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { signIn } from 'next-auth/react';

interface CustomerLoginProps {
  onClose?: () => void;
  onLogin: (email: string, pass: string) => void;
  setShowTroubleModal: (val: boolean) => void;
}

export default function CustomerLogin({
  onClose,
  onLogin,
  setShowTroubleModal,
}: CustomerLoginProps) {
  // Form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  
  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Alert Config State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!emailInput.trim()) newErrors.email = 'Please enter your email address.';
    if (!passwordInput.trim()) newErrors.password = 'Please enter your password.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    onLogin(emailInput, passwordInput);
    setPasswordInput('');
    setAlertConfig({
      isOpen: true,
      title: 'Welcome Back',
      message: 'Login Successful.',
      type: 'success'
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-skin-base relative px-3 py-3">
      
      {/* HEADER BAR */}
      <div className="w-full flex items-center justify-between px-4 py-4 sm:px-8 border-b border-skin-base/25">
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 text-skin-muted hover:text-skin-base transition rounded-full hover:bg-skin-card"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        <h1 className="text-xl sm:text-2xl font-black text-[#D4AF37] tracking-wider absolute left-1/2 -translate-x-1/2">
          BIGVIEW
        </h1>

        <div className="w-10" />
      </div>

      {/* CONTENT STACK (No Container Card) */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
          
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-[#D4AF37] mb-1">
              Bigview Store
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#48BB78] font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>All data is safeguarded</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-skin-muted font-medium bg-skin-base/50 py-1.5 px-3 rounded-full mt-3">
              <Tag className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Get lower price on all items</span>
            </div>
          </div>

          {/* Auth form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4 text-left pt-2">
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="Enter your email"
                value={emailInput}
                onChange={e => handleInputChange('email', e.target.value, setEmailInput)}
                className="w-full bg-skin-base border border-skin-base/40 px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
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

            {/* SUBMIT BUTTON */}
            <button 
              type="submit"
              className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md active:scale-95 text-base tracking-wide mt-3"
            >
              Sign In
            </button>
          </form>

          {/* LINK TO REGISTRATION PAGE */}
          <div className="text-xs text-skin-muted pt-1">
            Don't have an account?{' '}
            <a href="/register/customer" className="text-brand-yellow font-bold underline">
              Register Account
            </a>
          </div>

          {/* Trouble signing in? */}
          <div className="pt-1">
            <button 
              type="button"
              onClick={() => setShowTroubleModal(true)}
              className="text-xs text-skin-muted hover:text-skin-base underline font-medium"
            >
              Trouble signing in?
            </button>
          </div>

          {/* Demarcation OR */}
          <div className="w-full relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-skin-base/30" />
            </div>
            <span className="relative bg-skin-base px-4 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
          </div>

          {/* Google Auth Button */}
          <button 
            type="button"
            onClick={() => signIn('google')}
            className="w-full flex items-center justify-center gap-3 bg-skin-card border border-skin-base/40 px-4 py-3.5 rounded-full text-sm font-semibold text-skin-base shadow-sm hover:opacity-95 transition-opacity"
          >
            <GoogleIcon className="w-5 h-5 shrink-0" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

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
