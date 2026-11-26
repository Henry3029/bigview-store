'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import PasswordField from '@/components/PasswordField';
import BottomAlert from '@/components/BottomAlert';
import CloseToStoreButton from '@/components/CloseToStoreButton';
import { GoogleIcon } from '@/components/icons/GoogleIcon';

function CustomerLoginContent() {
  const router = useRouter();
  const { loginCustomer } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info',
  });

  const handleInputChange = (
    field: string,
    value: string,
    setter: (val: string) => void
  ) => {
    setter(value);
    if (errors[field]) {
      setErrors((currentErrors) => {
        const updated = { ...currentErrors };
        delete updated[field];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      const success = await loginCustomer(emailInput.trim(), passwordInput);
      if (!success) {
        setAlertConfig({
          isOpen: true,
          title: 'Access Denied',
          message: 'Invalid email or password. Please try again.',
          type: 'error',
        });
        return;
      }

      setPasswordInput('');
      router.push('/');
    } catch {
      setAlertConfig({
        isOpen: true,
        title: 'Login Error',
        message: 'An error occurred during sign-in. Please try again.',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-skin-base relative px-3 py-3">
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-2">
        <CloseToStoreButton
          onClick={() => router.push('/')}
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20"
        />

        <div className="w-full max-w-sm space-y-6 flex flex-col items-center text-center">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-4xl font-black text-[#D4AF37] mb-1">
              Bigview Store
            </h2>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#48BB78] font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>All data is safeguarded</span>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="w-full space-y-4 text-left pt-2"
          >
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) =>
                  handleInputChange('email', e.target.value, setEmailInput)
                }
                className="w-full bg-skin-base border border-skin-base/40 px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base shadow-sm"
              />
              {errors.email && (
                <p className="text-[11px] text-red-500 font-medium mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <PasswordField
              label="Password"
              value={passwordInput}
              onChange={(val) =>
                handleInputChange('password', val, setPasswordInput)
              }
              error={errors.password}
              showIndicator={false}
            />

            <button
              type="submit"
              className="w-full bg-brand-yellow text-black font-extrabold py-2.5 rounded-full hover:opacity-90 transition shadow-md active:scale-95 text-base tracking-wide mt-3"
            >
              Sign In
            </button>
          </form>

          <div className="text-xs text-skin-muted pt-1">
            Don&apos;t have an account?{' '}
            <Link
              href="/register/customer"
              className="text-brand-yellow font-bold underline"
            >
              Register Account
            </Link>
          </div>

          <div className="pt-1">
            <button
              type="button"
              onClick={() =>
                setAlertConfig({
                  isOpen: true,
                  title: 'Password Help',
                  message:
                    'Please contact store support or register a new customer account.',
                  type: 'info',
                })
              }
              className="text-xs text-skin-muted hover:text-skin-base underline font-medium"
            >
              Trouble signing in?
            </button>
          </div>

          <div className="w-full relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-skin-base/30" />
            </div>
            <span className="relative bg-skin-base px-4 text-xs text-skin-muted uppercase font-bold tracking-widest">
              OR
            </span>
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="w-full flex items-center justify-center gap-3 bg-skin-card border border-skin-base/40 px-4 py-3.5 rounded-full text-sm font-semibold text-skin-base shadow-sm hover:opacity-95 transition-opacity"
          >
            <GoogleIcon className="w-5 h-5 shrink-0" />
            <span>Continue with Google</span>
          </button>
        </div>
      </div>

      <BottomAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig((p) => ({ ...p, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <StoreProvider
      initialItems={[]}
      initialStore={{
        name: 'BIGVIEW Store',
        bannerUrl: '',
        profileUrl: '',
        ownerEmail: '',
      }}
    >
      <CustomerLoginContent />
    </StoreProvider>
  );
}