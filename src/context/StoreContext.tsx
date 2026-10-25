'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, StoreInfo, Order, CartItem } from '@/types';

interface StoreContextType {
  store: StoreInfo;
  items: Item[];
  cart: CartItem[];
  orders: Order[];
  isOwner: boolean;
  setIsOwner: (val: boolean) => void;
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
  const [store, setStore] = useState<StoreInfo>({
    name: 'EL.D.Gate',
    bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    ownerEmail: 'el.d.gate@bigview.ng',
  });

  const [items, setItems] = useState<Item[]>([
    { id: '1', name: 'Premium Imported Rice (50kg)', price: 45000, imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80', category: 'Groceries', createdAt: new Date().toISOString() },
    { id: '2', name: 'Designer Leather Shoe', price: 2800, imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80', category: 'Fashion', createdAt: new Date().toISOString() },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const updateStoreInfo = (updates: Partial<StoreInfo>) => {
    setStore(prev => ({ ...prev, ...updates }));
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
      const discount = item.price > 3000 ? 250 : 150;
      return sum + ((item.price - discount) * item.quantity);
    }, 0);

    const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder: Order = {
      id: Date.now().toString(),
      customerName,
      customerPhone,
      items: [...cart],
      totalAmount,
      status: 'PAID_VERIFIED', // Simulated successful online payment
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
      store, items, cart, orders, isOwner, setIsOwner,
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
