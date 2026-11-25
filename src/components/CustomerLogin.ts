'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import PasswordField from '@/components/PasswordField';

interface CustomerLoginProps {
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<boolean> | boolean;
  setShowTroubleModal: (show: boolean) => void;
}

export default function CustomerLogin({
  onClose,
  onLogin,
  setShowTroubleModal,
}: CustomerLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both your email address and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await onLogin(email.trim(), password);
      if (!success) {
        setError('Invalid email or password.');
      }
    } catch (err) {
      console.error('Customer login error:', err);
      setError('An unexpected error occurred while signing in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-skin-card border border-skin-base/40 rounded-3xl p-6 text-skin-base space-y-5 relative">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-[#D4AF37]">Customer Sign In</h2>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-skin-base text-skin-muted hover:text-skin-base transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4 text-left">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-skin-muted block">
            Email Address
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-skin-base border border-skin-base/40 focus:border-brand-yellow px-3.5 py-3 rounded-xl text-sm focus:outline-none text-skin-base"
          />
        </div>

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          showIndicator={false}
        />

        {error && (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-brand-yellow text-black font-extrabold py-3 rounded-full hover:opacity-90 transition shadow-md text-sm disabled:opacity-60"
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      <div className="flex items-center justify-between text-xs text-skin-muted pt-1">
        <button
          type="button"
          onClick={() => setShowTroubleModal(true)}
          className="underline hover:text-skin-base"
        >
          Need help signing in?
        </button>
        <a
          href="/register/customer"
          className="text-brand-yellow font-bold underline"
        >
          Create Account
        </a>
      </div>
    </div>
  );
}
