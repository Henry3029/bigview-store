'use client';

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { CartItem } from '@/types';
import { calculateDiscount } from '@/lib/pricing';
import BottomAlert from '@/components/BottomAlert';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentCustomer: { name: string; email: string; phone?: string } | null;
  onCheckout: (phone: string) => void;
  onRequireAuth: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  currentCustomer,
  onCheckout,
  onRequireAuth
}: CartDrawerProps) {
  const [customerPhone, setCustomerPhone] = useState('');
  
  // Luxury Bottom Alert State replacing browser alert()
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'error' as 'success' | 'error' | 'info'
  });

  if (!isOpen) return null;

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCustomer) {
      onRequireAuth();
      return;
    }
    if (!customerPhone.trim()) {
      setAlertConfig({
        isOpen: true,
        title: 'Phone Number Required',
        message: 'Please enter your phone number for pickup/delivery updates.',
        type: 'error'
      });
      return;
    }
    onCheckout(customerPhone);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-sm animate-in fade-in duration-150">
        <div className="w-full max-w-md bg-skin-card h-full p-6 flex flex-col shadow-2xl overflow-y-auto">
          <div className="flex justify-between items-center mb-6 border-b border-skin-base pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-yellow" /> Your Cart ({cartItemCount})
            </h2>
            <button 
              onClick={onClose}
              className="text-skin-muted hover:text-skin-base text-lg font-bold p-1"
            >
              ✕
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-skin-muted text-center py-12">Your cart is empty.</p>
          ) : (
            <>
              <div className="space-y-4 flex-grow mb-6">
                {cart.map(item => {
                  const pricing = calculateDiscount(item.price);
                  return (
                    <div key={item.id} className="flex items-center justify-between gap-3 border-b border-skin-base pb-3">
                      <img src={item.imageUrl} alt={item.name} className="w-14 h-14 object-cover rounded-lg" />
                      <div className="flex-grow">
                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-skin-muted">Qty: {item.quantity}</p>
                        <p className="text-sm font-bold text-brand-yellow">₦{(pricing.finalPrice * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <form onSubmit={handleSubmit} className="border-t border-skin-base pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-sm">Checkout Details</h3>
                  {currentCustomer && (
                    <span className="text-[11px] text-green-600 font-bold bg-green-500/10 px-2 py-0.5 rounded-full">
                      Signed in as {currentCustomer.name}
                    </span>
                  )}
                </div>

                <div>
                  <label className="text-xs text-skin-muted block mb-1">Phone Number for Pickup</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 08012345678"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full bg-skin-base border border-skin-base p-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-yellow text-skin-base"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-brand-yellow text-black font-extrabold py-3 rounded-xl hover:opacity-90 transition shadow-lg mt-2"
                >
                  {currentCustomer ? 'Pay Online & Get App Discount' : 'Sign In / Register to Checkout'}
                </button>
                <p className="text-[11px] text-center text-skin-muted">Secured by BIGVIEW. Generates instant 6-digit PIN for store pickup.</p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Modern Bottom Alert Sheet */}
      <BottomAlert 
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig(p => ({ ...p, isOpen: false }))}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
      />
    </>
  );
}
