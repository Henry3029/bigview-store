'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Storefront from '@/components/Storefront';
import AdminDashboard from '@/components/AdminDashboard';
import { Sun, Moon, Store, ShieldAlert } from 'lucide-react';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'store' | 'admin'>('store');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <StoreProvider>
      <div className="min-h-screen bg-skin-base text-skin-base flex flex-col transition-colors">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 bg-skin-card border-b border-skin-base shadow-sm backdrop-blur-md bg-opacity-9org">
          <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 bg-brand-yellow text-black font-black flex items-center justify-center rounded-xl text-lg shadow">
                BV
              </span>
              <div>
                <span className="font-extrabold text-lg tracking-tight">BIGVIEW</span>
                <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow px-1.5 py-0.5 rounded font-bold ml-2">EL.D.Gate Portal</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveTab('store')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${activeTab === 'store' ? 'bg-brand-yellow text-black shadow' : 'hover:bg-skin-base'}`}
              >
                Storefront
              </button>
              <button 
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition ${activeTab === 'admin' ? 'bg-brand-yellow text-black shadow' : 'hover:bg-skin-base'}`}
              >
                Mom's Admin
              </button>

              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-skin-base border border-skin-base text-skin-muted hover:text-skin-base transition"
                title="Toggle Light/Dark Mode"
              >
                {darkMode ? <Sun className="w-5 h-5 text-brand-yellow" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-grow">
          {activeTab === 'store' ? <Storefront /> : <AdminDashboard />}
        </main>

        {/* Footer */}
        <footer className="bg-skin-card border-t border-skin-base py-6 text-center text-xs text-skin-muted">
          <p>© 2026 BIGVIEW E-Commerce. Powered for <strong className="text-skin-base">EL.D.Gate</strong> Store.</p>
        </footer>
      </div>
    </StoreProvider>
  );
}
