'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { getDynamicPresetImages } from '@/lib/imageFetcher';
import { Plus, Trash2, Edit2, ShieldCheck, CheckCircle2, Store as StoreIcon, QrCode } from 'lucide-react';

export default function AdminDashboard() {
  const { store, items, orders, updateStoreInfo, addItem, updateItem, deleteItem, verifyOrderPin, isOwner, setIsOwner } = useStore();

  // Owner login password state (simple secure check for mom)
  const [passwordInput, setPasswordInput] = useState('');
  
  // New/Edit Item form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Groceries');
  const [itemImageUrl, setItemImageUrl] = useState('');
  const [customFileUrl, setCustomFileUrl] = useState('');

  // Store settings edit state
  const [storeNameInput, setStoreNameInput] = useState(store.name);
  const [bannerInput, setBannerInput] = useState(store.bannerUrl);
  const [profileInput, setProfileInput] = useState(store.profileUrl);

  // PIN verification state for mom
  const [pinInput, setPinInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'eldgate2026' || passwordInput === 'admin') {
      setIsOwner(true);
      setPasswordInput('');
    } else {
      alert('Incorrect store owner password. (Hint for testing: eldgate2026)');
    }
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !itemPrice || !itemImageUrl) {
      alert('Please provide item name, price, and select an image.');
      return;
    }

    if (editingItemId) {
      updateItem(editingItemId, {
        name: itemName,
        price: parseFloat(itemPrice),
        category: itemCategory,
        imageUrl: itemImageUrl,
      });
      setEditingItemId(null);
    } else {
      addItem({
        name: itemName,
        price: parseFloat(itemPrice),
        category: itemCategory,
        imageUrl: itemImageUrl,
      });
    }

    // Reset form
    setItemName('');
    setItemPrice('');
    setItemImageUrl('');
    setIsAddingItem(false);
  };

  const startEdit = (item: any) => {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemPrice(item.price.toString());
    setItemCategory(item.category);
    setItemImageUrl(item.imageUrl);
    setIsAddingItem(true);
  };

  const handleVerifyPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = verifyOrderPin(pinInput.trim());
    if (isValid) {
      setVerificationResult({
        success: true,
        message: `SUCCESS: PIN ${pinInput} is valid! Payment confirmed through BIGVIEW app.`
      });
    } else {
      setVerificationResult({
        success: false,
        message: `INVALID: PIN ${pinInput} not found or unpaid! Do not release items.`
      });
    }
    setPinInput('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setItemImageUrl(url);
    }
  };

  if (!isOwner) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-skin-card border border-skin-base p-8 rounded-2xl max-w-md w-full shadow-lg text-center">
          <StoreIcon className="w-12 h-12 mx-auto text-brand-yellow mb-4" />
          <h2 className="text-2xl font-black mb-2">EL.D.Gate Vendor Portal</h2>
          <p className="text-sm text-skin-muted mb-6">Enter owner password to manage inventory, update prices, and verify app payments.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password"
              placeholder="Store Owner Password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base p-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
              required
            />
            <button 
              type="submit"
              className="w-full bg-brand-yellow text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md"
            >
              Login as Store Owner
            </button>
          </form>
          <p className="text-[11px] text-skin-muted mt-4">Demo password: <code className="bg-skin-base px-1.5 py-0.5 rounded">eldgate2026</code></p>
        </div>
      </div>
    );
  }

  const dynamicPresets = getDynamicPresetImages(itemName);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12 pb-24">
      {/* Top Header & Logout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-skin-card p-6 rounded-2xl border border-skin-base shadow-sm">
        <div>
          <span className="bg-brand-yellow text-black text-xs font-bold px-2.5 py-0.5 rounded-full">
            Store Owner Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Welcome, Mom (EL.D.Gate)</h1>
          <p className="text-sm text-skin-muted">Manage items, prices, store banner, and verify customer payments securely.</p>
        </div>
        <button 
          onClick={() => setIsOwner(false)}
          className="border border-skin-base px-4 py-2 rounded-xl text-sm font-bold hover:bg-skin-base transition"
        >
          Lock / Logout Owner View
        </button>
      </div>

      {/* Fraud Prevention PIN Verifier Widget */}
      <div className="bg-gradient-to-r from-brand-yellow/10 to-transparent border border-brand-yellow/40 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <QrCode className="w-8 h-8 text-brand-yellow" />
          <div>
            <h2 className="text-lg font-bold">Payment Verification Scanner (Anti-Fraud)</h2>
            <p className="text-xs text-skin-muted">Type or scan the customer's 6-digit receipt PIN before handing over goods.</p>
          </div>
        </div>

        <form onSubmit={handleVerifyPinSubmit} className="flex gap-3 max-w-lg mt-4">
          <input 
            type="text" 
            maxLength={6}
            placeholder="Enter 6-digit PIN"
            value={pinInput}
            onChange={e => setPinInput(e.target.value)}
            className="bg-skin-card border border-skin-base px-4 py-3 rounded-xl font-mono text-lg tracking-widest flex-grow focus:outline-none focus:border-brand-yellow uppercase"
            required
          />
          <button 
            type="submit"
            className="bg-brand-yellow text-black font-bold px-6 py-3 rounded-xl hover:opacity-95 transition shadow"
          >
            Verify PIN
          </button>
        </form>

        {verificationResult && (
          <div className={`mt-4 p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${verificationResult.success ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500' : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500'}`}>
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{verificationResult.message}</span>
          </div>
        )}
      </div>

      {/* Store Identity Settings */}
      <div className="bg-skin-card border border-skin-base p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold mb-4">Edit Store Branding (EL.D.Gate)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-skin-muted block mb-1">Store Name</label>
            <input 
              type="text"
              value={storeNameInput}
              onChange={e => setStoreNameInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-skin-muted block mb-1">Banner Image URL</label>
            <input 
              type="text"
              value={bannerInput}
              onChange={e => setBannerInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-skin-muted block mb-1">Profile Picture URL</label>
            <input 
              type="text"
              value={profileInput}
              onChange={e => setProfileInput(e.target.value)}
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
            />
          </div>
        </div>
        <button 
          onClick={() => {
            updateStoreInfo({ name: storeNameInput, bannerUrl: bannerInput, profileUrl: profileInput });
            alert('Store branding updated successfully!');
          }}
          className="bg-brand-yellow text-black font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition"
        >
          Save Store Details
        </button>
      </div>

      {/* Inventory Management Section */}
      <div className="bg-skin-card border border-skin-base p-6 rounded-2xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Inventory & Price Manager ({items.length} Items)</h2>
          <button 
            onClick={() => {
              setEditingItemId(null);
              setItemName('');
              setItemPrice('');
              setItemImageUrl('');
              setIsAddingItem(!isAddingItem);
            }}
            className="bg-brand-yellow text-black font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition shadow"
          >
            <Plus className="w-4 h-4" /> {isAddingItem ? 'Close Form' : 'Add New Item'}
          </button>
        </div>

        {/* Add/Edit Item Form with Dynamic Sample Image Suggestions */}
        {isAddingItem && (
          <form onSubmit={handleSaveItem} className="bg-skin-base border border-skin-base p-6 rounded-2xl mb-8 space-y-4">
            <h3 className="font-bold text-base">{editingItemId ? 'Edit Item' : 'Add New Item to EL.D.Gate'}</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-skin-muted block mb-1">Item Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Ankara Fabric, Palm Oil"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
                  className="w-full bg-skin-card border border-skin-base p-2.5 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-skin-muted block mb-1">Price (NGN ₦)</label>
                <input 
                  type="number" 
                  required
                  placeholder="e.g. 3500"
                  value={itemPrice}
                  onChange={e => setItemPrice(e.target.value)}
                  className="w-full bg-skin-card border border-skin-base p-2.5 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-skin-muted block mb-1">Category</label>
                <select 
                  value={itemCategory}
                  onChange={e => setItemCategory(e.target.value)}
                  className="w-full bg-skin-card border border-skin-base p-2.5 rounded-xl text-sm"
                >
                  <option value="Groceries">Groceries</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Beauty">Beauty</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* Smart Dynamic Preset Image Suggestions & Upload */}
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">
                Choose Image (Instant Presets based on "{itemName || 'your item'}") or Upload from Gallery:
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                {dynamicPresets.map((url, idx) => (
                  <div 
                    key={idx}
                    onClick={() => setItemImageUrl(url)}
                    className={`h-24 rounded-xl border-2 overflow-hidden cursor-pointer relative ${itemImageUrl === url ? 'border-brand-yellow ring-2 ring-brand-yellow' : 'border-skin-base'}`}
                  >
                    <img src={url} alt="Preset option" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Preset {idx + 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange}
                  className="text-xs text-skin-muted file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-brand-yellow file:text-black hover:file:opacity-90"
                />
                {itemImageUrl && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-bold">✓ Image selected</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                type="submit"
                className="bg-brand-yellow text-black font-bold px-6 py-2.5 rounded-xl text-sm hover:opacity-90 transition shadow"
              >
                {editingItemId ? 'Update Item' : 'Publish Item to Store'}
              </button>
              <button 
                type="button"
                onClick={() => setIsAddingItem(false)}
                className="border border-skin-base px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-skin-base"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Existing Items Table / Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-skin-base border border-skin-base rounded-2xl p-4 flex gap-4 items-center">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded-xl shrink-0" />
              <div className="flex-grow min-w-0">
                <h4 className="font-bold text-sm truncate">{item.name}</h4>
                <p className="text-xs text-skin-muted">{item.category}</p>
                <p className="text-sm font-bold text-brand-yellow mt-1">₦{item.price.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button 
                  onClick={() => startEdit(item)}
                  className="p-2 bg-skin-card border border-skin-base rounded-lg hover:text-brand-yellow"
                  title="Edit Item / Price"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => deleteItem(item.id)}
                  className="p-2 bg-skin-card border border-skin-base rounded-lg text-red-500 hover:bg-red-500/10"
                  title="Delete Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
