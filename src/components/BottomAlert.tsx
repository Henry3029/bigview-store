'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface BottomAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: 'success' | 'error' | 'info';
}

export default function BottomAlert({
  isOpen,
  onClose,
  title,
  message,
  type = 'success'
}: BottomAlertProps) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-opacity animate-in fade-in duration-200"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-skin-base space-y-4 animate-in slide-in-from-bottom-full duration-300 ease-out text-left relative"
      >
        {/* Header with Icon & Close Button */}
        <div className="flex justify-between items-center border-b border-skin-base pb-3">
          <div className="flex items-center gap-2">
            {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
            {type === 'error' && <AlertCircle className="w-5 h-5 text-red-500" />}
            <h3 className="font-extrabold text-base text-skin-base">
              {title || (type === 'success' ? 'Success' : 'Notice')}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-skin-muted hover:text-skin-base font-bold text-lg p-1"
            aria-label="Close alert"
          >
            ✕
          </button>
        </div>

        {/* Message Content */}
        <p className="text-xs sm:text-sm text-skin-muted font-medium leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        <button 
          onClick={onClose}
          className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md text-sm mt-2"
        >
          Okay
        </button>
      </div>
    </div>
  );
}




/*
how to use it in your components, replacing alert()
// 1. Add state for the custom alert
const [alertConfig, setAlertConfig] = useState<{
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}>({
  isOpen: false,
  title: '',
  message: '',
  type: 'success'
});

// 2. Trigger it anywhere instead of alert(...)
// Example inside your auth submit handler:
if (success) {
  setAlertConfig({
    isOpen: true,
    title: 'Welcome to BIGVIEW',
    message: 'Store account registered successfully!',
    type: 'success'
  });
}

//render it at the bottom of your jsx tree 
//Custom Sliding Bottom Alert Component 
<BottomAlert 
  isOpen={alertConfig.isOpen}
  onClose={() => setAlertConfig(prev => ({ ...prev, isOpen: false }))}
  title={alertConfig.title}
  message={alertConfig.message}
  type={alertConfig.type}
/>
*/