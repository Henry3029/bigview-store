'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Trash2, Edit3, CheckCircle2, AlertCircle } from 'lucide-react';
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-skin-base pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#D4AF37]">Manage Your Store</h1>
          <p className="text-xs text-skin-muted">Update your store branding and inventory items for EL.D.Gate.</p>
        </div>
        <button 
          onClick={() => setIsOwner(false)} 
          className="text-xs bg-skin-card border border-skin-base px-3 py-1.5 rounded-xl text-skin-muted hover:text-skin-base font-bold"
        >
          Logout Owner
        </button>
      </div>

      {/* Store Branding */}
      <div className="bg-skin-card border border-skin-base rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Store Branding Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Store Name</label>
            <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Banner Image URL</label>
            <input type="text" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
          </div>
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Profile Image URL</label>
            <input type="text" value={profileUrl} onChange={e => setProfileUrl(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
          </div>
        </div>
        <button 
          onClick={async () => { 
            await updateStoreBranding(storeName, bannerUrl, profileUrl); 
            setAlertConfig({ isOpen: true, title: 'Branding Saved', message: 'Store branding updated successfully!', type: 'success' }); 
          }} 
          className="bg-brand-yellow text-black text-xs font-extrabold px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm"
        >
          Save Branding Changes
        </button>
      </div>

      {/* Add / Edit Inventory Item with Imported ImageCaptureField */}
      <div className="bg-skin-card border border-skin-base rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
        
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
              <input type="text" required placeholder="e.g. Groceries" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" />
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
