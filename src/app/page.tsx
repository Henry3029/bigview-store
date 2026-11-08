'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider } from '@/context/StoreContext';
import Storefront from '@/components/Storefront';
import LoadingScreen from '@/components/LoadingScreen';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { getItems, getStoreInfo } from '@/app/actions';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [initialItems, setInitialItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialStore, setInitialStore] = useState({
    name: 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'mom@eldgate.ng',
  });

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [itemsData, storeData] = await Promise.all([getItems(), getStoreInfo()]);
        if (isMounted) {
          if (itemsData) setInitialItems(itemsData);
          if (storeData) setInitialStore(storeData);
        }
      } catch (err) {
        console.error('Failed to load database data:', err);
      } finally {
        if (isMounted) {
          setTimeout(() => {
            setIsLoading(false);
          }, 800);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);
  
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <StoreProvider initialItems={initialItems} initialStore={initialStore}>
      <div className="min-h-screen bg-skin-base text-skin-base flex flex-col transition-colors">
        {/* Dedicated Modern Header */}
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Main View: Strictly Storefront */}
        <main className="flex-grow">
          <Storefront searchQuery={searchQuery} />
        </main>

        {/* Dedicated Footer */}
        <Footer
          storeName={initialStore.name}
        />
      </div>
    </StoreProvider>
  );
}
