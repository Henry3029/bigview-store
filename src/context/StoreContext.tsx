'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, StoreInfo, Order, CartItem, UserAccount } from '@/types';

interface StoreContextType {
  store: StoreInfo;
  items: Item[];
  cart: CartItem[];
  orders: Order[];
  isOwner: boolean;
  ownerAccount: UserAccount | null;
  setIsOwner: (val: boolean) => void;
  registerOwner: (email: string, pass: string, storeName: string) => boolean;
  loginOwner: (email: string, pass: string) => boolean;
  loginWithGoogle: () => void;
  resetPassword: (email: string) => boolean;
  updateStoreInfo: (info: Partial<StoreInfo>) => void;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerPhone: string) => Order;
  verifyOrderPin: (pin: string) => boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persist registered account in localStorage so it stays secure between refreshes
  const [ownerAccount, setOwnerAccount] = useState<UserAccount | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('bigview_owner');
      if (saved) return JSON.parse(saved);
    }
    // Default initial test account if none exists yet
    return { email: 'mom@eldgate.ng', passwordHash: 'eldgate2026', storeName: 'EL.D.Gate' };
  });

  const [store, setStore] = useState<StoreInfo>({
    name: ownerAccount?.storeName || 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: ownerAccount?.email || 'mom@eldgate.ng',
  });

    const [items, setItems] = useState<Item[]>([
    { 
      id: '1', 
      name: 'Premium Imported Rice (50kg)', 
      price: 45000, 
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', 
      category: 'Groceries', 
      createdAt: '2026-10-25T00:00:00.000Z' 
    },
    { 
      id: '2', 
      name: 'Designer Leather Shoe', 
      price: 2800, 
      imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80', 
      category: 'Fashion', 
      createdAt: '2026-10-25T00:00:00.000Z' 
    },
  ]);


  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  useEffect(() => {
    if (ownerAccount) {
      localStorage.setItem('bigview_owner', JSON.stringify(ownerAccount));
      setStore(prev => ({ ...prev, name: ownerAccount.storeName, ownerEmail: ownerAccount.email }));
    }
  }, [ownerAccount]);

  const registerOwner = (email: string, pass: string, storeName: string): boolean => {
    const newAcc: UserAccount = { email, passwordHash: pass, storeName };
    setOwnerAccount(newAcc);
    setIsOwner(true);
    return true;
  };

  const loginOwner = (email: string, pass: string): boolean => {
    if (ownerAccount && ownerAccount.email === email && ownerAccount.passwordHash === pass) {
      setIsOwner(true);
      return true;
    }
    // Fallback default
    if (email === 'mom@eldgate.ng' && pass === 'eldgate2026') {
      setIsOwner(true);
      return true;
    }
    return false;
  };

  const loginWithGoogle = () => {
    // Industrial standard simulated Google OAuth popup/redirect login
    const googleEmail = 'el.d.gate.store@gmail.com';
    const googleStoreName = 'EL.D.Gate';
    setOwnerAccount({ email: googleEmail, passwordHash: 'GOOGLE_OAUTH_USER', storeName: googleStoreName });
    setIsOwner(true);
    alert('Successfully logged in with Google!');
  };

  const resetPassword = (email: string): boolean => {
    if (ownerAccount && ownerAccount.email === email) {
      alert(`Password reset link has been sent to ${email}. (For this demo, your temporary password is reset to: 'newpassword123')`);
      setOwnerAccount({ ...ownerAccount, passwordHash: 'newpassword123' });
      return true;
    }
    alert('Email address not found in BIGVIEW registry.');
    return false;
  };

  const updateStoreInfo = (updates: Partial<StoreInfo>) => {
    setStore(prev => ({ ...prev, ...updates }));
    if (updates.name && ownerAccount) {
      setOwnerAccount({ ...ownerAccount, storeName: updates.name });
    }
  };

  const addItem = (newItemData: Omit<Item, 'id' | 'createdAt'>) => {
    const newItem: Item = {
      ...newItemData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = (id: string, updates: Partial<Item>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const deleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const addToCart = (item: Item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (customerName: string, customerPhone: string): Order => {
    const totalAmount = cart.reduce((sum, item) => {
      const discount = item.price > 3000 ? 200 : 100;
      return sum + ((item.price - discount) * item.quantity);
    }, 0);

    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      customerPhone,
      items: [...cart],
      totalAmount,
      status: 'PAID_VERIFIED',
      verificationPin,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const verifyOrderPin = (pin: string): boolean => {
    const order = orders.find(o => o.verificationPin === pin);
    return !!order;
  };

  return (
    <StoreContext.Provider value={{
      store, items, cart, orders, isOwner, ownerAccount, setIsOwner,
      registerOwner, loginOwner, loginWithGoogle, resetPassword,
      updateStoreInfo, addItem, updateItem, deleteItem,
      addToCart, removeFromCart, clearCart, placeOrder, verifyOrderPin
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
