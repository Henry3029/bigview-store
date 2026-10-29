'use client';

import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from '@/context/StoreContext';
import AdminDashboard from '@/components/AdminDashboard';
import { Lock } from 'lucide-react';
import { getItems, getStoreInfo } from '@/app/actions';
import { Item, StoreInfo } from '@/types';

// 1. Internal component that handles the login and dashboard logic with useStore access
function OwnerPortalContent() {
  const { isOwner, loginOwner } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginOwner(email, password);
    if (!success) {
      alert('Access denied. Incorrect credentials or unauthorized email.');
    }
  };

  // If already logged in, render her admin dashboard directly
  if (isOwner) {
    return <AdminDashboard />;
  }

  // Otherwise, show the secure login screen
  return (
    <div className="min-h-screen flex items-center justify-center bg-skin-base px-4">
      <div className="w-full max-w-sm bg-skin-card border border-skin-base p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-yellow text-black font-black rounded-xl mx-auto flex items-center justify-center text-lg">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-black text-skin-base">EL.D.Gate Owner Portal</h1>
          <p className="text-xs text-skin-muted">Restricted access. Authorized store management only.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Store Email</label>
            <input 
              type="email" 
              required
              placeholder="mom@eldgate.ng"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
            />
          </div>

          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Owner Password</label>
            <input 
              type="password" 
              required
              placeholder="Enter secure password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md text-sm"
          >
            Unlock Admin Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// 2. Main Page Component that loads data and wraps everything in StoreProvider
export default function SecretOwnerPortalPage() {
  const [initialItems, setInitialItems] = useState<Item[]>([]);
  const [initialStore, setInitialStore] = useState<StoreInfo>({
    name: 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'mom@eldgate.ng',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPortalData() {
      try {
        const [itemsData, storeData] = await Promise.all([getItems(), getStoreInfo()]);
        if (itemsData) setInitialItems(itemsData);
        if (storeData) setInitialStore(storeData);
      } catch (err) {
        console.error('Failed to load portal data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortalData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-skin-base flex items-center justify-center text-skin-base">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-brand-yellow text-black font-black rounded-xl animate-spin mx-auto flex items-center justify-center">
            🔒
          </div>
          <p className="font-bold text-sm">Securing Owner Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreProvider initialItems={initialItems} initialStore={initialStore}>
      <OwnerPortalContent />
    </StoreProvider>
  );
}
