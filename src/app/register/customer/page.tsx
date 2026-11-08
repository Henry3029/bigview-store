'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import LoadingScreen from '@/components/LoadingScreen';
import PasswordField from '@/components/PasswordField';
import Storefront from '@/components/Storefront';
import { signIn } from "next-auth/react";
import { Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 1. Full-Page Immersive Authentication Component
function CustomerPortalAuthContent() {
  const { isCustomer, registerCustomer } = useStore();
  const router = useRouter();
  
  // Basic Auth Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [registrationSuccessMessage, setRegistrationSuccessMessage] = useState<string | null>(null);

  // Additional Registration Inputs
  const [firstNameInput, setFirstNameInput] = useState('');
  const [surnameInput, setSurnameInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');

  // Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Splash Screen Boot Timer Effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);
  
  // Auto-dismiss success message and redirect after successful registration
  useEffect(() => {
    if (registrationSuccessMessage) {
      const timer = setTimeout(() => {
        setRegistrationSuccessMessage(null);
        router.push('/login/customer');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [registrationSuccessMessage, router]);

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

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};

    if (!emailInput.trim()) newErrors.email = 'Please enter your email address.';
    if (!passwordInput.trim()) newErrors.password = 'Please enter your password.';
    if (!firstNameInput.trim()) newErrors.firstName = 'Please enter your first name.';
    if (!surnameInput.trim()) newErrors.surname = 'Please enter your surname.';
    if (!phoneInput.trim()) newErrors.phone = 'Please enter your phone number.';

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(passwordInput)) {
      newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number & special character.';
    } else if (passwordInput !== confirmPasswordInput) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    await registerCustomer(
      emailInput, 
      passwordInput, 
      firstNameInput, 
      surnameInput, 
      phoneInput
    );
      
    setPasswordInput('');
    setConfirmPasswordInput('');
    setRegistrationSuccessMessage('Account registered successfully!');
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isCustomer) {
    return <Storefront />;
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start px-4 pt-3 pb-12 bg-skin-base text-skin-base relative">
      <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
      
        {registrationSuccessMessage && (
          <div className="w-full bg-emerald-600 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md text-center animate-in fade-in duration-300">
            {registrationSuccessMessage}
          </div>
        )}
        
        <div className="space-y-1.5 flex flex-col items-center">
          <h2 className="text-2xl sm:text-4xl font-black font-sans text-[#D4AF37] tracking-normal">
            Customer Registration
          </h2>
          <p className="text-xs sm:text-sm text-emerald-500 max-w-xs flex items-center justify-center gap-1.5 font-medium">
            <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>All data is safeguarded</span>
          </p>
        </div>

        <form onSubmit={handleRegistration} noValidate className="w-full space-y-4 text-left pt-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-skin-muted block">First Name</label>
              <input 
                type="text" 
                placeholder="e.g. John"
                value={firstNameInput}
                onChange={e => handleInputChange('firstName', e.target.value, setFirstNameInput)}
                className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                  errors.firstName ? 'border-red-500' : 'border-skin-base/40 focus:border-brand-yellow'
                }`}
              />
              {errors.firstName && <p className="text-[11px] text-red-500 font-medium">{errors.firstName}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-skin-muted block">Last Name</label>
              <input 
                type="text" 
                placeholder="e.g. Doe"
                value={surnameInput}
                onChange={e => handleInputChange('surname', e.target.value, setSurnameInput)}
                className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                  errors.surname ? 'border-red-500' : 'border-skin-base/40 focus:border-brand-yellow'
                }`}
              />
              {errors.surname && <p className="text-[11px] text-red-500 font-medium">{errors.surname}</p>}
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-skin-muted block">Phone Number</label>
            <input 
              type="tel" 
              placeholder="+234..."
              value={phoneInput}
              onChange={e => handleInputChange('phone', e.target.value, setPhoneInput)}
              className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                errors.phone ? 'border-red-500' : 'border-skin-base/40 focus:border-brand-yellow'
              }`}
            />
            {errors.phone && <p className="text-[11px] text-red-500 font-medium">{errors.phone}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-skin-muted block">Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com"
              value={emailInput}
              onChange={e => handleInputChange('email', e.target.value, setEmailInput)}
              className={`w-full bg-skin-base border px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm ${
                errors.email ? 'border-red-500' : 'border-skin-base/40 focus:border-brand-yellow'
              }`}
            />
            {errors.email && <p className="text-[11px] text-red-500 font-medium">{errors.email}</p>}
          </div>

          <PasswordField 
            label="Password"
            value={passwordInput}
            onChange={(val) => handleInputChange('password', val, setPasswordInput)}
            error={errors.password}
            showIndicator={true}
          />

          <PasswordField 
            label="Confirm Password"
            value={confirmPasswordInput}
            onChange={(val) => handleInputChange('confirmPassword', val, setConfirmPasswordInput)}
            error={errors.confirmPassword}
            showIndicator={false}
          />

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-lg text-sm mt-3"
          >
            Register Account
          </button>
        </form>

        <div className="text-xs text-skin-muted pt-1">
          <p>
            Already have a customer account?{' '}
            <a href="/login/customer" className="text-brand-yellow font-bold underline">
              Sign In
            </a>
          </p>
        </div>

        <div className="w-full relative flex items-center justify-center py-1">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-skin-base/30" />
          </div>
          <span className="relative bg-skin-base px-4 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
        </div>

        <button 
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center gap-3 bg-skin-card border border-skin-base/40 px-4 py-3.5 rounded-full text-sm font-semibold text-skin-base shadow-sm hover:opacity-95 transition-opacity"
        >
          <GoogleIcon className="w-5 h-5 shrink-0" />
          <span>Continue with Google</span>
        </button>
      </div>
    </div>
  );
}

// 2. Cleaned Wrapper (No heavy database fetching needed here)
export default function CustomerRegisterPage() {
  return (
    <StoreProvider initialItems={[]} initialStore={{ name: 'BIGVIEW Store', bannerUrl: '', profileUrl: '', ownerEmail: '' }}>
      <CustomerPortalAuthContent />
    </StoreProvider>
  );
}
