'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Trash2, Edit3, CheckCircle2, AlertCircle, Store, LogOut, ChevronDown, ShieldCheck } from 'lucide-react';
import ImageCaptureField from '@/components/ImageCaptureField'; // Import your dedicated camera/upload component
import BottomAlert from '@/components/BottomAlert';

export default function AdminDashboard() {
  const { 
    store, 
    items, 
    addItem, 
    updateItem, 
    deleteItem, 
    updateStoreBranding,
    setIsOwner
  } = useStore();

  // Custom Bottom Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success' as 'success' | 'error' | 'info'
  });

  // Item Management State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Groceries');
  const [newItemImage, setNewItemImage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Store Branding State
  const [storeName, setStoreName] = useState(store.name);
  const [bannerUrl, setBannerUrl] = useState(store.bannerUrl);
  const [profileUrl, setProfileUrl] = useState(store.profileUrl);
  const [showMenu, setShowMenu] = useState(false);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) {
      setAlertConfig({ isOpen: true, title: 'Missing Information', message: 'Please provide item name, price, and select or snap an image.', type: 'error' });
      return;
    }
    if (editingId) {
      await updateItem(editingId, {
        name: newItemName,
        price: Number(newItemPrice),
        category: newItemCategory,
        imageUrl: newItemImage,
      });
      setEditingId(null);
    } else {
      await addItem({
        name: newItemName,
        price: Number(newItemPrice),
        category: newItemCategory,
        imageUrl: newItemImage,
      });
    }
    setNewItemName('');
    setNewItemPrice('');
    setNewItemImage('');
    setAlertConfig({ isOpen: true, title: 'Success', message: 'Item saved successfully to inventory!', type: 'success' });
  };

  return (
    <div className="max-w-6xl mx-auto px-3 py-8 space-y-8">
     <div className="relative">
      {/* High-End Glassmorphism Merchant Header */}
      <div className="bg-skin-card/90 backdrop-blur-md border border-skin-base/60 rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4">
        
        {/* Left: Store Branding & Identity */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative">
            <img 
              src={store.profileUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
              alt={store.name} 
              className="w-12 h-12 rounded-2xl object-cover border-2 border-[#D4AF37]/40 shadow-sm shrink-0"
            />
            {/* Live Online Badge */}
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-skin-card rounded-full" />
          </div>

          <div className="min-w-0 text-left">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base sm:text-lg font-black tracking-tight text-skin-base truncate">
                {store.name}
              </h1>
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
            </div>
            <p className="text-[11px] font-medium text-skin-muted flex items-center gap-1">
              <span>Verified Merchant Portal</span>
            </p>
          </div>
        </div>

        {/* Right: Polished Account Menu Trigger */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 bg-skin-base/80 border border-skin-base px-3.5 py-2 rounded-2xl text-xs font-bold text-skin-base hover:border-[#D4AF37] transition-all shadow-sm"
          >
            <span>Account</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showMenu ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              {/* Backdrop to close on outside click */}
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              
              <div className="absolute right-0 mt-2 w-48 bg-skin-card border border-skin-base rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                <div className="px-4 py-2 border-b border-skin-base mb-1">
                  <p className="text-[10px] text-skin-muted uppercase font-extrabold tracking-wider">Signed in as</p>
                  <p className="text-xs font-bold truncate text-skin-base">{store.ownerEmail || 'Store Owner'}</p>
                </div>

                <button 
                  onClick={() => { setShowMenu(false); setIsOwner(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout Owner</span>
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>

      {/* Store Branding Settings */}
<div>
  <h2 className="text-lg font-bold">Store Identity & Assets</h2>
  
  <div className="space-y-4">
    {/* Store Name */}
    <div>
      <label className="text-xs text-skin-muted block mb-1 font-bold">Store Name</label>
      <input 
        type="text" 
        value={storeName} 
        onChange={e => setStoreName(e.target.value)} 
        className="w-full bg-skin-base border border-skin-base p-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow text-skin-base" 
      />
    </div>

<label className="text-xs text-skin-muted block mb-1 font-bold">Store Profile Picture</label>
    {/* Store Profile Image (Using ImageCaptureField) */}
    <ImageCaptureField 
      value={profileUrl} 
      onChange={(val) => setProfileUrl(val)} 
    />

<label className="text-xs text-skin-muted block mb-1 font-bold">Store Banner Picture</label>
    {/* Store Banner Image (Using ImageCaptureField) */}
    <ImageCaptureField 
      value={bannerUrl} 
      onChange={(val) => setBannerUrl(val)} 
    />
  </div>

  <button 
    onClick={async () => { 
      await updateStoreBranding(storeName, bannerUrl, profileUrl); 
      setAlertConfig({ isOpen: true, title: 'Branding Saved', message: 'Store branding updated successfully!', type: 'success' }); 
    }} 
    className="w-full sm:w-auto bg-brand-yellow text-black text-xs font-extrabold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm"
  >
    Save Branding Changes
  </button>
</div>


      {/* Add / Edit Inventory Item with Imported ImageCaptureField */}
      <div>
        <h2 className="text-lg font-bold">{editingId ? 'Edit Inventory Item' : 'Product Management'}</h2>
        
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Item Name</label>
              <input type="text" required placeholder="e.g. Rice, Mop" value={newItemName} onChange={e => setNewItemName(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Price (NGN)</label>
              <input type="number" required placeholder="e.g. 3500" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Category</label>
              <input type="text" required placeholder="e.g. building materials" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
            </div>
          </div>

          {/* Clean Dedicated Component Integration */}
          <ImageCaptureField value={newItemImage} onChange={(val) => setNewItemImage(val)} />

          <button type="submit" className="bg-brand-yellow text-black font-extrabold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm text-sm">
            {editingId ? 'Update Item' : 'Publish Item to Store'}
          </button>
        </form>
      </div>

      {/* Inventory List */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Current Store Inventory ({items.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-skin-card border border-skin-base rounded-2xl p-4 flex items-center justify-between gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                <p className="text-xs text-skin-muted">{item.category}</p>
                <p className="text-sm font-black text-brand-yellow">₦{item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button 
                  onClick={() => { 
                    setEditingId(item.id); 
                    setNewItemName(item.name); 
                    setNewItemPrice(item.price.toString()); 
                    setNewItemCategory(item.category); 
                    setNewItemImage(item.imageUrl); 
                  }} 
                  className="p-2 rounded-lg bg-skin-base text-skin-muted hover:text-skin-base"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteItem(item.id)} 
                  className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomAlert 
        isOpen={alertConfig.isOpen} 
        onClose={() => setAlertConfig(p => ({ ...p, isOpen: false }))} 
        title={alertConfig.title} 
        message={alertConfig.message} 
        type={alertConfig.type} 
      />
    </div>
  );
}
