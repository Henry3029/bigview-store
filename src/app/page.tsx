'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Storefront from '@/components/Storefront';
import AdminDashboard from '@/components/AdminDashboard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getItems, getStoreInfo } from '@/app/actions';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'store' | 'admin'>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [initialItems, setInitialItems] = useState([]);
  const [initialStore, setInitialStore] = useState({
    name: 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'mom@eldgate.ng',
  });
  const [loading, setLoading] = useState(true);

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
          <div className="w-12 h-12 bg-[#D4AF37] text-black font-black rounded-xl animate-spin mx-auto flex items-center justify-center">
            BV
          </div>
          <p className="font-bold text-sm">Loading EL.D.Gate Store...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider initialItems={initialItems} initialStore={initialStore}>
      <div className="min-h-screen bg-skin-base text-skin-base flex flex-col transition-colors">
        {/* Dedicated Modern Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCart={() => setActiveTab('store')}
        />

        {/* Main View */}
        <main className="flex-grow">
          {activeTab === 'store' ? (
            <Storefront searchQuery={searchQuery} />
          ) : (
            <AdminDashboard />
          )}
        </main>

        {/* Dedicated Footer */}
        <Footer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          storeName={initialStore.name}
        />
      </div>
    </StoreProvider>
  );
}
