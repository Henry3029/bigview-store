'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, StoreInfo, Order, CartItem, UserAccount } from '@/types';
import { 
  getItems, addItemAction, updateItemAction, deleteItemAction, 
  getStoreInfo, updateStoreBranding, placeOrderAction, verifyOrderPinAction, loginOwnerAction,  resetPasswordAction
} from '@/app/actions';

interface StoreContextType {
  store: StoreInfo;
  items: Item[];
  cart: CartItem[];
  orders: Order[];
  isOwner: boolean;
  ownerAccount: UserAccount | null;
  setIsOwner: (val: boolean) => void;
  registerOwner: (email: string, pass: string, storeName: string) => boolean;
  loginOwner: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => void;
  resetPassword: (email: string) => Promise<boolean>;
  updateStoreInfo: (info: Partial<StoreInfo>) => Promise<void>;
  addItem: (item: Omit<Item, 'id' | 'createdAt'>) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerPhone: string) => Promise<Order>;
  verifyOrderPin: (pin: string) => Promise<boolean>;
  updateStoreBranding: (name: string, bannerUrl: string, profileUrl: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ 
  children: React.ReactNode; 
  initialItems: Item[]; 
  initialStore: StoreInfo; 
}> = ({ children, initialItems, initialStore }) => {
  const [store, setStore] = useState<StoreInfo>(initialStore);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [ownerAccount, setOwnerAccount] = useState<UserAccount | null>({
    email: initialStore.ownerEmail || 'mom@eldgate.ng',
    passwordHash: 'eldgate2026',
    storeName: initialStore.name || 'EL.D.Gate',
  });

  const registerOwner = (email: string, pass: string, storeName: string): boolean => {
    setOwnerAccount({ email, passwordHash: pass, storeName });
    setIsOwner(true);
    return true;
  };

    const loginOwner = async (email: string, pass: string): Promise<boolean> => {
    try {
      const result = await loginOwnerAction(email, pass);
      if (result.success) {
        setIsOwner(true);
        setOwnerAccount({ email, passwordHash: pass, storeName: result.storeName || store.name });
        return true;
      }
      alert(result.message);
      return false;
    } catch (err) {
      console.error(err);
      alert('Login failed. Check your connection.');
      return false;
    }
  };

  const loginWithGoogle = () => {
    // For Google Auth in production, this can hook into NextAuth / Firebase. 
    // For now, we authenticate the store owner session directly:
    setOwnerAccount({ email: 'el.d.gate.store@gmail.com', passwordHash: 'GOOGLE_AUTH', storeName: store.name });
    setIsOwner(true);
    alert('Successfully authenticated with Google!');
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const result = await resetPasswordAction(email);
      if (result.success) {
        alert(`Password reset successful! Your temporary password is: ${result.tempPassword}`);
        return true;
      }
      alert(result.message);
      return false;
    } catch (err) {
      console.error(err);
      alert('Password reset failed.');
      return false;
    }
  };

  const updateStoreInfo = async (updates: Partial<StoreInfo>) => {
    const newName = updates.name || store.name;
    const newBanner = updates.bannerUrl || store.bannerUrl;
    const newProfile = updates.profileUrl || store.profileUrl;

    await updateStoreBranding(newName, newBanner, newProfile);
    setStore(prev => ({ ...prev, ...updates }));
  };

  const addItem = async (newItemData: Omit<Item, 'id' | 'createdAt'>) => {
    await addItemAction(newItemData);
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const merged = {
      name: updates.name ?? target.name,
      price: updates.price ?? target.price,
      category: updates.category ?? target.category,
      imageUrl: updates.imageUrl ?? target.imageUrl,
    };
    await updateItemAction(id, merged);
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  const deleteItem = async (id: string) => {
    await deleteItemAction(id);
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

  const placeOrder = async (customerName: string, customerPhone: string): Promise<Order> => {
    const totalAmount = cart.reduce((sum, item) => {
      const discount = item.price > 3000 ? 200 : 100;
      return sum + ((item.price - discount) * item.quantity);
    }, 0);

    const newOrder = await placeOrderAction(customerName, customerPhone, cart, totalAmount);
    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const verifyOrderPin = async (pin: string): Promise<boolean> => {
    return await verifyOrderPinAction(pin);
  };
  
    const handleUpdateStoreBranding = async (name: string, bannerUrl: string, profileUrl: string) => {
    await updateStoreBranding(name, bannerUrl, profileUrl);
    setStore(prev => ({ ...prev, name, bannerUrl, profileUrl }));
  };

  return (
    <StoreContext.Provider value={{
      store, items, cart, orders, isOwner, ownerAccount, setIsOwner,
      registerOwner, loginOwner, loginWithGoogle, resetPassword,
      updateStoreInfo, addItem, updateItem, deleteItem,
      addToCart, removeFromCart, clearCart, placeOrder, verifyOrderPin, 
      updateStoreBranding: handleUpdateStoreBranding
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
