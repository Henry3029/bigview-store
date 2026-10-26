'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { getDynamicPresetImages } from '@/lib/imageFetcher';
import { Plus, Trash2, Edit2, CheckCircle2, Store as StoreIcon, QrCode, Lock, Mail, UserPlus, LogIn, KeyRound } from 'lucide-react';

export default function AdminDashboard() {
  const { store, items, orders, updateStoreInfo, addItem, updateItem, deleteItem, verifyOrderPin, isOwner, setIsOwner, loginOwner, registerOwner, loginWithGoogle, resetPassword } = useStore();

  // Auth form modes: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Auth Inputs
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [storeNameInput, setStoreNameInput] = useState('EL.D.Gate');

  // New/Edit Item form state
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCategory, setItemCategory] = useState('Groceries');
  const [itemImageUrl, setItemImageUrl] = useState('');

  // Store settings edit state
  const [editStoreName, setEditStoreName] = useState(store.name);
  const [bannerInput, setBannerInput] = useState(store.bannerUrl);
  const [profileInput, setProfileInput] = useState(store.profileUrl);

  // PIN verification state for mom
  const [pinInput, setPinInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginOwner(emailInput.trim(), passwordInput);
    if (!success) {
      alert('Invalid email or password. Please check your credentials or click "Forgot Password".');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput || !storeNameInput) {
      alert('Please fill in all registration fields.');
      return;
    }
    registerOwner(emailInput.trim(), passwordInput, storeNameInput.trim());
    alert(`Account created successfully for ${storeNameInput}! Welcome to BIGVIEW.`);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      alert('Please enter your registered email address.');
      return;
    }
    await resetPassword(emailInput.trim());
    setAuthMode('login');
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

  // If not logged in as owner, show industrial Auth Screen (Login / Register / Forgot Password / Google)
  if (!isOwner) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
        <div className="bg-skin-card border border-skin-base p-8 rounded-2xl max-w-md w-full shadow-xl">
          <div className="text-center mb-6">
            <StoreIcon className="w-12 h-12 mx-auto text-brand-yellow mb-2" />
            <h2 className="text-2xl font-black">BIGVIEW Vendor Portal</h2>
            <p className="text-xs text-skin-muted mt-1">Manage EL.D.Gate store, prices & customer orders securely.</p>
          </div>

          {/* Google OAuth Button */}
          <button 
            type="button"
            onClick={loginWithGoogle}
            className="w-full bg-skin-base border border-skin-base py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-brand-yellow/10 transition mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.19v3.15C3.17 21.37 7.24 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.19C.43 8.13 0 9.87 0 12s.43 3.87 1.19 5.4l4.09-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.63 1.19 6.6l4.09 3.15c.95-2.84 3.6-4.95 6.72-4.95z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex py-2 items-center mb-6">
            <div className="flex-grow border-t border-skin-base"></div>
            <span className="flex-shrink mx-4 text-xs text-skin-muted uppercase">or continue with email</span>
            <div className="flex-grow border-t border-skin-base"></div>
          </div>

          {/* Login Form */}
          {authMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-skin-muted block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-skin-muted" />
                  <input 
                    type="email"
                    required
                    placeholder="mom@eldgate.ng"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    className="w-full bg-skin-base border border-skin-base pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs text-skin-muted">Password</label>
                  <button 
                    type="button" 
                    onClick={() => setAuthMode('forgot')}
                    className="text-xs text-brand-yellow hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-skin-muted" />
                  <input 
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    className="w-full bg-skin-base border border-skin-base pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-yellow text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Sign In to Store
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-skin-muted">Don't have an account? </span>
                <button 
                  type="button" 
                  onClick={() => setAuthMode('register')}
                  className="text-xs font-bold text-brand-yellow hover:underline"
                >
                  Register Store
                </button>
              </div>
            </form>
          )}

          {/* Register Form */}
          {authMode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-skin-muted block mb-1">Store Name (e.g. EL.D.Gate)</label>
                <input 
                  type="text"
                  required
                  placeholder="EL.D.Gate"
                  value={storeNameInput}
                  onChange={e => setStoreNameInput(e.target.value)}
                  className="w-full bg-skin-base border border-skin-base px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="text-xs text-skin-muted block mb-1">Email Address</label>
                <input 
                  type="email"
                  required
                  placeholder="mom@eldgate.ng"
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  className="w-full bg-skin-base border border-skin-base px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <div>
                <label className="text-xs text-skin-muted block mb-1">Create Password</label>
                <input 
                  type="password"
                  required
                  placeholder="Choose a strong password"
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  className="w-full bg-skin-base border border-skin-base px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-yellow text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Register & Open Store
              </button>

              <div className="text-center pt-2">
                <span className="text-xs text-skin-muted">Already have an account? </span>
                <button 
                  type="button" 
                  onClick={() => setAuthMode('login')}
                  className="text-xs font-bold text-brand-yellow hover:underline"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {/* Forgot Password Form */}
          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <div className="text-xs text-skin-muted mb-2">
                Enter your registered email address below and we will instantly send you a secure password recovery link.
              </div>
              <div>
                <label className="text-xs text-skin-muted block mb-1">Registered Email</label>
                <div className="relative">
                  <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-skin-muted" />
                  <input 
                    type="email"
                    required
                    placeholder="mom@eldgate.ng"
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    className="w-full bg-skin-base border border-skin-base pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-brand-yellow text-black font-bold py-3 rounded-xl hover:opacity-90 transition shadow-md"
              >
                Send Password Reset Link
              </button>

              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => setAuthMode('login')}
                  className="text-xs text-brand-yellow hover:underline font-bold"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}
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
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Welcome, Mom ({store.name})</h1>
          <p className="text-sm text-skin-muted">Logged in as: <strong className="text-skin-base">{store.ownerEmail}</strong></p>
        </div>
        <button 
          onClick={() => setIsOwner(false)}
          className="border border-skin-base px-4 py-2 rounded-xl text-sm font-bold hover:bg-skin-base transition"
        >
          Lock / Logout
        </button>
      </div>

      {/* Fraud Prevention PIN Verifier Widget */}
      <div className="bg-gradient-to-r from-brand-yellow/15 to-transparent border border-brand-yellow/40 p-6 rounded-2xl shadow-sm">
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
        <h2 className="text-xl font-bold mb-4">Edit Store Branding ({store.name})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-skin-muted block mb-1">Store Name</label>
            <input 
              type="text"
              value={editStoreName}
              onChange={e => setEditStoreName(e.target.value)}
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
            updateStoreInfo({ name: editStoreName, bannerUrl: bannerInput, profileUrl: profileInput });
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

        {isAddingItem && (
          <form onSubmit={handleSaveItem} className="bg-skin-base border border-skin-base p-6 rounded-2xl mb-8 space-y-4">
            <h3 className="font-bold text-base">{editingItemId ? 'Edit Item' : `Add New Item to ${store.name}`}</h3>
            
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
