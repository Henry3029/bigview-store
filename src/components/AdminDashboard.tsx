'use client';

import React, { useState } from 'react';
import { useStore } from '@/context/StoreContext';
import { Lock, Tag, ShieldCheck, Plus, Trash2, Edit3, Image as ImageIcon } from 'lucide-react';
import { getDynamicPresetImages } from '@/lib/imageFetcher';

export default function AdminDashboard() {
  const { 
    store, 
    items, 
    isOwner, 
    addItem, 
    updateItem, 
    deleteItem, 
    updateStoreBranding,
    loginOwner,
    loginWithGoogle,
    resetPassword
  } = useStore();

  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Trouble signing in modals
  const [showTroubleModal, setShowTroubleModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmailInput, setResetEmailInput] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);

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

  const dynamicSuggestions = getDynamicPresetImages(newItemName);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginOwner(emailInput, passwordInput);
    if (!success && isRegistering) {
      alert('Registration/Login processed. Welcome to Manage Your Store!');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice || !newItemImage) {
      alert('Please provide item name, price, and select an image.');
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
  };

  // IF NOT LOGGED IN: Full Page Login / Registration View
  if (!isOwner) {
    return (
      <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 bg-skin-base relative">
        <div className="w-full max-w-sm bg-skin-card border border-skin-base p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          
          {/* Top Center BIGVIEW Brand */}
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-black text-[#D4AF37] tracking-wider">BIGVIEW</h1>
            <div className="flex items-center justify-center gap-1.5 text-xs text-[#48BB78] font-bold mt-1">
              <Lock className="w-3.5 h-3.5" />
              <span>All data is safeguarded with a padlock</span>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-skin-muted font-medium bg-skin-base/50 py-1.5 px-3 rounded-full mt-3">
              <Tag className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Get lower price on all items</span>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Email Address</label>
              <input 
                type="email" 
                required
                placeholder="Enter your email"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Password</label>
              <input 
                type="password" 
                required
                placeholder="Enter password"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md active:scale-95 text-sm"
            >
              Continue
            </button>
          </form>

          {/* Trouble signing in? */}
          <div className="text-center pt-2">
            <button 
              onClick={() => setShowTroubleModal(true)}
              className="text-xs text-skin-muted hover:text-skin-base underline font-medium"
            >
              Trouble signing in?
            </button>
          </div>

          {/* Demarcation OR */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-skin-base" /></div>
            <span className="relative bg-skin-card px-3 text-xs text-skin-muted uppercase font-bold tracking-widest">OR</span>
          </div>

          {/* Continue with Google */}
          <button 
            onClick={() => setShowGoogleModal(true)}
            className="w-full flex items-center justify-center gap-3 bg-skin-base border border-skin-base py-3 rounded-full font-bold text-xs hover:bg-skin-base/80 transition"
          >
            <span className="w-5 h-5 bg-black text-[#D4AF37] font-black rounded flex items-center justify-center text-[10px]">G</span>
            Continue with Google
          </button>
        </div>

        {/* 1. TROUBLE SIGNING IN MODAL (Bottom Slide on Mobile / Centered on Desktop) */}
        {showTroubleModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity">
            <div className="w-full sm:max-w-md bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-skin-base space-y-5 animate-in slide-in-from-bottom duration-200">
              <div className="flex justify-between items-center border-b border-skin-base pb-3">
                <h3 className="font-extrabold text-base">Trouble Signing In?</h3>
                <button onClick={() => setShowTroubleModal(false)} className="text-skin-muted hover:text-skin-base font-bold text-lg">✕</button>
              </div>

              <div className="space-y-4 text-xs text-skin-muted">
                <div className="space-y-2">
                  <p>If you registered your account with your email address and forgot your password, you can reset your password.</p>
                  <button 
                    onClick={() => { setShowTroubleModal(false); setShowResetModal(true); }}
                    className="w-full py-2.5 rounded-full border border-skin-base font-bold text-skin-base hover:bg-skin-base transition text-xs"
                  >
                    Reset your password
                  </button>
                </div>

                <div className="space-y-2 pt-2 border-t border-skin-base">
                  <p>If you forgot your account, you can try to find your account by email, mobile phone number, or order ID.</p>
                  <button 
                    onClick={() => alert('Account lookup feature initiated.')}
                    className="w-full py-2.5 rounded-full border border-skin-base font-bold text-skin-base hover:bg-skin-base transition text-xs"
                  >
                    Find your account
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. RESET PASSWORD MODAL (Almost full viewport on Mobile / Centered on Desktop) */}
        {showResetModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center transition-opacity">
            <div className="w-full sm:max-w-lg h-[92vh] sm:h-auto bg-skin-card rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-skin-base space-y-6 flex flex-col justify-between sm:justify-start animate-in slide-in-from-bottom duration-200 overflow-y-auto">
              <div>
                <div className="flex justify-between items-center border-b border-skin-base pb-3 mb-6">
                  <h3 className="font-black text-lg">Reset Password</h3>
                  <button onClick={() => setShowResetModal(false)} className="text-skin-muted hover:text-skin-base font-bold text-lg">✕</button>
                </div>
                
                <p className="text-xs text-skin-muted mb-4">
                  Enter your email address below and we'll send you a 6-digit password reset code.
                </p>

                <div className="space-y-3">
                  <label className="text-xs text-skin-muted block font-bold">Email Address</label>
                  <input 
                    type="email"
                    placeholder="Enter your registered email"
                    value={resetEmailInput}
                    onChange={e => setResetEmailInput(e.target.value)}
                    className="w-full bg-skin-base border border-skin-base px-3.5 py-3 rounded-xl text-sm focus:outline-none focus:border-brand-yellow"
                  />
                </div>
              </div>

              <button 
                onClick={async () => {
                  await resetPassword(resetEmailInput);
                  setShowResetModal(false);
                }}
                className="w-full bg-brand-yellow text-black font-extrabold py-3.5 rounded-full hover:opacity-90 transition shadow-md text-sm"
              >
                Submit
              </button>
            </div>
          </div>
        )}

        {/* 3. GOOGLE SIGN-IN MODAL (Black background with BV logo box) */}
        {showGoogleModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-[#18181b] border border-gray-800 text-white w-full max-w-sm rounded-3xl p-8 text-center space-y-6 shadow-2xl relative">
              <button onClick={() => setShowGoogleModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>
              
              {/* BV Logo in small square box with yellow background */}
              <div className="w-14 h-14 bg-brand-yellow text-black font-black rounded-2xl mx-auto flex items-center justify-center text-xl shadow-lg">
                BV
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-extrabold tracking-tight">Sign in to Google</h3>
                <p className="text-xs text-gray-400">to continue to BIGVIEW EL.D.Gate</p>
              </div>

              <button 
                onClick={() => { loginWithGoogle(); setShowGoogleModal(false); }}
                className="w-full bg-brand-yellow text-black font-bold py-3.5 rounded-full hover:opacity-90 transition shadow-lg text-sm"
              >
                Authenticate with Google Account
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // IF LOGGED IN: MANAGE YOUR STORE DASHBOARD
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-skin-base pb-4">
        <div>
          <h1 className="text-2xl font-black text-[#D4AF37]">Manage Your Store</h1>
          <p className="text-xs text-skin-muted">Update your store branding, banner, and inventory items for EL.D.Gate.</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-xs bg-skin-card border border-skin-base px-3 py-1.5 rounded-xl text-skin-muted hover:text-skin-base font-bold"
        >
          Logout Owner
        </button>
      </div>

      {/* Store Branding Section */}
      <div className="bg-skin-card border border-skin-base rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">Store Branding Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Store Name</label>
            <input 
              type="text" 
              value={storeName} 
              onChange={e => setStoreName(e.target.value)} 
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" 
            />
          </div>
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Banner Image URL</label>
            <input 
              type="text" 
              value={bannerUrl} 
              onChange={e => setBannerUrl(e.target.value)} 
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" 
            />
          </div>
          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Profile Image URL</label>
            <input 
              type="text" 
              value={profileUrl} 
              onChange={e => setProfileUrl(e.target.value)} 
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm" 
            />
          </div>
        </div>
        <button 
          onClick={async () => {
            await updateStoreBranding(storeName, bannerUrl, profileUrl);
            alert('Store branding updated successfully!');
          }}
          className="bg-brand-yellow text-black text-xs font-extrabold px-5 py-2.5 rounded-xl hover:opacity-90 transition shadow-sm"
        >
          Save Branding Changes
        </button>
      </div>

      {/* Add / Edit Inventory Item */}
      <div className="bg-skin-card border border-skin-base rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold">{editingId ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
        
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Item Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Mop, Broom, Rice"
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Price (NGN)</label>
              <input 
                type="number" 
                required
                placeholder="e.g. 3500"
                value={newItemPrice}
                onChange={e => setNewItemPrice(e.target.value)}
                className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Category</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Household Items"
                value={newItemCategory}
                onChange={e => setNewItemCategory(e.target.value)}
                className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Dynamic Image Picker Suggestions */}
          {newItemName && (
            <div>
              <label className="text-xs text-skin-muted block mb-1 font-bold">Choose a Smart Suggested Image:</label>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {dynamicSuggestions.map((img, idx) => (
                  <img 
                    key={idx}
                    src={img} 
                    alt="Suggestion" 
                    onClick={() => setNewItemImage(img)}
                    className={`w-16 h-16 rounded-xl object-cover cursor-pointer border-2 transition ${newItemImage === img ? 'border-brand-yellow scale-105' : 'border-skin-base'}`}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-skin-muted block mb-1 font-bold">Or Paste Image URL / Custom Gallery Link</label>
            <input 
              type="text" 
              required
              placeholder="https://..."
              value={newItemImage}
              onChange={e => setNewItemImage(e.target.value)}
              className="w-full bg-skin-base border border-skin-base p-2.5 rounded-xl text-sm"
            />
          </div>

          <button 
            type="submit"
            className="bg-brand-yellow text-black font-extrabold px-6 py-3 rounded-xl hover:opacity-90 transition shadow-sm text-sm"
          >
            {editingId ? 'Update Item' : 'Publish Item to Store'}
          </button>
        </form>
      </div>

      {/* Current Store Inventory List */}
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
    </div>
  );
}
