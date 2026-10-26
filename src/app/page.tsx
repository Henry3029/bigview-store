'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Storefront from '@/components/Storefront';
import AdminDashboard from '@/components/AdminDashboard';
import Navbar from '@/components/Navbar';
import { getItems, getStoreInfo } from '@/app/actions';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'store' | 'admin'>('store');
  const [initialItems, setInitialItems] = useState([]);
  const [initialStore, setInitialStore] = useState({
    name: 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'mom@eldgate.ng',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    async function loadData() {
      try {
        const [itemsData, storeData] = await Promise.all([getItems(), getStoreInfo()]);
        setInitialItems(itemsData);
        if (storeData) setInitialStore(storeData);
      } catch (err) {
        console.error('Failed to load database data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-skin-base flex items-center justify-center text-skin-base">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-brand-yellow rounded-xl animate-spin mx-auto flex items-center justify-center font-black text-black">BV</div>
          <p className="font-bold text-sm">Connecting EL.D.Gate to MongoDB Atlas...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider initialItems={initialItems} initialStore={initialStore}>
      <div className="min-h-screen bg-skin-base text-skin-base flex flex-col transition-colors">
        
        {/* Responsive Industry-Standard Navbar */}
        <Navbar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          darkMode={darkMode} 
          setDarkMode={setDarkMode} 
          storeName={initialStore.name} 
        />

        {/* Main Content Body */}
        <main className="flex-grow">
          {activeTab === 'store' ? <Storefront /> : <AdminDashboard />}
        </main>

        {/* Footer */}
        <footer className="bg-skin-card border-t border-skin-base py-6 text-center text-xs text-skin-muted">
          <p>© 2026 BIGVIEW E-Commerce. Powered for <strong className="text-skin-base">{initialStore.name}</strong> Store.</p>
        </footer>
      </div>
    </StoreProvider>
  );
}
