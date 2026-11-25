'use client';

import React from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';

interface CloseToStoreButtonProps {
  href?: string;
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export default function CloseToStoreButton({
  href = '/',
  onClick,
  className = '',
  ariaLabel = 'Back to Storefront',
}: CloseToStoreButtonProps) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={ariaLabel}
        title={ariaLabel}
        className={`p-2 rounded-full bg-skin-card border border-skin-base/40 text-skin-base hover:border-brand-yellow hover:text-brand-yellow transition shadow-sm ${className}`}
      >
        <X className="w-5 h-5" />
      </button>
    );
  }

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      title={ariaLabel}
      className={`p-2 rounded-full bg-skin-card border border-skin-base/40 text-skin-base hover:border-brand-yellow hover:text-brand-yellow transition shadow-sm ${className}`}
    >
      <X className="w-5 h-5" />
    </Link>
  );
}
