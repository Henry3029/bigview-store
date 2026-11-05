'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  showIndicator?: boolean; // Set to true for main password, false for confirm password
}

export default function PasswordField({
  label = "Password",
  value,
  onChange,
  placeholder = "••••••••",
  error,
  showIndicator = false
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Constraint validation checks
  const hasLength = value.length >= 8;
  const hasUpper = /[A-Z]/.test(value);
  const hasLower = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);
  const hasSpecial = /[^A-Za-z0-9]/.test(value);

  // Calculate strength score (0 to 5)
  const passedConstraints = [hasLength, hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

  // Determine indicator color and width based on score
  const getIndicatorStyles = () => {
    if (passedConstraints === 0) return { width: '0%', color: 'bg-transparent' };
    if (passedConstraints <= 2) return { width: '33%', color: 'bg-red-500' };
    if (passedConstraints <= 4) return { width: '66%', color: 'bg-[#EAB308]' };
    return { width: '100%', color: 'bg-green-500' };
  };

  const indicator = getIndicatorStyles();

  return (
    <div className="space-y-1.5 w-full text-left">
      {label && (
        <label className="text-xs font-bold text-skin-muted block">
          {label}
        </label>
      )}

      {/* Input wrapper with relative positioning for the eye icon */}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-skin-base border px-3.5 py-3 pr-11 rounded-xl text-sm focus:outline-none text-skin-base shadow-sm transition-colors ${
            error ? 'border-red-500 focus:border-red-500' : 'border-skin-base focus:border-brand-yellow'
          }`}
        />

        {/* Eye icon toggle button */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-skin-muted hover:text-skin-base transition-colors focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Error Message Display */}
      {error && (
        <p className="text-[11px] text-red-500 font-medium pt-0.5">{error}</p>
      )}

      {/* Dynamic Strength Indicator Bar (Only rendered if showIndicator is true) */}
      {showIndicator && value.length > 0 && (
        <div className="space-y-1 pt-1">
          <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${indicator.color}`}
              style={{ width: indicator.width }}
            />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-skin-muted px-0.5">
            <span>
              {passedConstraints === 5 ? '✓ Strong Password' : '8+ chars, upper, lower, number, symbol'}
            </span>
            <span>{passedConstraints}/5</span>
          </div>
        </div>
      )}
    </div>
  );
}
