'use client';

import React, { createContext, useContext, useState } from 'react';
import { Item, StoreInfo, Order, CartItem, UserAccount } from '@/types';
import { 
  getItems, addItemAction, updateItemAction, deleteItemAction, 
  getStoreInfo, updateStoreBranding, placeOrderAction, verifyOrderPinAction, 
  loginOwnerAction, resetPasswordAction, registerCustomerAction, loginCustomerAction 
} from '@/app/actions';

interface StoreContextType {
  store: StoreInfo;
  items: Item[];
  cart: CartItem[];
  orders: Order[];
  isOwner: boolean;
  isCustomer: boolean;
  ownerAccount: UserAccount | null;
  customerAccount: UserAccount | null;
  setIsOwner: (val: boolean) => void;
  setIsCustomer: (val: boolean) => void;
  
  // Owner Actions
  registerOwner: (email: string, pass: string, storeName: string, firstName: string, surname: string, phone: string) => Promise<boolean>;
  loginOwner: (email: string, pass: string) => Promise<boolean>;
  
  // Customer Actions
  registerCustomer: (email: string, pass: string, firstName: string, surname: string, phone: string) => Promise<boolean>;
  loginCustomer: (email: string, pass: string) => Promise<boolean>;

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
  
  // Session states
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isCustomer, setIsCustomer] = useState<boolean>(false);
  
  const [ownerAccount, setOwnerAccount] = useState<UserAccount | null>({
    email: initialStore.ownerEmail || 'mom@eldgate.ng',
    passwordHash: 'eldgate2026',
    storeName: initialStore.name || 'EL.D.Gate',
  });
  
  const [customerAccount, setCustomerAccount] = useState<UserAccount | null>(null);

  // --- Store Owner Auth ---
  const registerOwner = async (email: string, pass: string, storeName: string, firstName: string, surname: string, phone: string): Promise<boolean> => {
    // You can link this to your server action for registration if ready
    setOwnerAccount({ email, passwordHash: pass, storeName });
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
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // --- Customer Auth ---
  const registerCustomer = async (email: string, pass: string, firstName: string, surname: string, phone: string): Promise<boolean> => {
    try {
      // Call your corresponding server action for customer registration
      const result = await registerCustomerAction ? await registerCustomerAction({ email, password: pass, firstName, surname, phone }) : { success: true };
      if (result.success) {
        setCustomerAccount({ email, passwordHash: pass, storeName: '' });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const loginCustomer = async (email: string, pass: string): Promise<boolean> => {
    try {
      const result = await loginCustomerAction ? await loginCustomerAction(email, pass) : { success: true };
      if (result.success) {
        setIsCustomer(true);
        setCustomerAccount({ email, passwordHash: pass, storeName: '' });
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const result = await resetPasswordAction(email);
      if (result.success) {
        alert(`Password reset successful! Your temporary password is: ${result.tempPassword}`);
        return true;
      }
      return false;
    } catch (err) {
      console.error(err);
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
      store, items, cart, orders, isOwner, isCustomer, ownerAccount, customerAccount, 
      setIsOwner, setIsCustomer,
      registerOwner, loginOwner, registerCustomer, loginCustomer, resetPassword,
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
