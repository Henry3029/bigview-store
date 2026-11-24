'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, StoreInfo, Order, CartItem, UserAccount } from '@/types';
import { calculateDiscount } from '@/lib/pricing';
import {
  getItems,
  addItemAction,
  updateItemAction,
  deleteItemAction,
  updateStoreBranding,
  placeOrderAction,
  verifyOrderPinAction,
  loginOwnerAction,
  resetPasswordAction,
  registerCustomerAction,
  loginCustomerAction,
} from '@/app/actions';

export type NewItemInput = Omit<Item, 'id' | 'createdAt'>;

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
  registerOwner: (
    email: string,
    pass: string,
    storeName: string,
    firstName: string,
    surname: string,
    phone: string
  ) => Promise<boolean>;
  loginOwner: (email: string, pass: string) => Promise<boolean>;

  // Customer Actions
  registerCustomer: (
    email: string,
    pass: string,
    firstName: string,
    surname: string,
    phone: string
  ) => Promise<boolean>;
  loginCustomer: (email: string, pass: string) => Promise<boolean>;

  resetPassword: (email: string) => Promise<boolean>;
  updateStoreInfo: (info: Partial<StoreInfo>) => Promise<void>;
  updateStoreBranding: (
    name: string,
    bannerUrl: string,
    profileUrl: string
  ) => Promise<void>;
  addItem: (newItemData: NewItemInput) => Promise<void>;
  updateItem: (id: string, updates: Partial<Item>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addToCart: (item: Item) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, customerPhone: string) => Promise<Order>;
  verifyOrderPin: (pin: string) => Promise<boolean>;
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

  // Sync state when initialStore or initialItems load asynchronously
  useEffect(() => {
    if (initialStore) {
      setStore(initialStore);
    }
  }, [initialStore]);

  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // --- Store Owner Auth ---
  const registerOwner = async (
    email: string,
    pass: string,
    storeName: string,
    firstName: string,
    surname: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const resolvedStoreName = storeName.trim() || store.name || 'EL.D.Gate';

      const actionsModule = await import('@/app/actions');
      if (typeof (actionsModule as Record<string, unknown>).registerOwnerAction === 'function') {
        const registerFn = (actionsModule as unknown as {
          registerOwnerAction: (
            email: string,
            pass: string,
            storeName: string,
            firstName: string,
            surname: string,
            phone: string
          ) => Promise<{ success: boolean }>;
        }).registerOwnerAction;

        const result = await registerFn(
          normalizedEmail,
          pass,
          resolvedStoreName,
          firstName,
          surname,
          phone
        );
        if (!result?.success) return false;
      }

      setOwnerAccount({
        email: normalizedEmail,
        passwordHash: pass,
        storeName: resolvedStoreName,
      });
      setIsOwner(true);
      return true;
    } catch (err) {
      console.error('Error registering owner:', err);
      return false;
    }
  };

  const loginOwner = async (email: string, pass: string): Promise<boolean> => {
    try {
      const result = await loginOwnerAction(email, pass);
      if (result.success) {
        setIsOwner(true);
        setOwnerAccount({
          email,
          passwordHash: pass,
          storeName: result.storeName || store.name,
        });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error logging in owner:', err);
      return false;
    }
  };

  // --- Customer Auth ---
  const registerCustomer = async (
    email: string,
    pass: string,
    firstName: string,
    surname: string,
    phone: string
  ): Promise<boolean> => {
    try {
      const result = await registerCustomerAction(
        email,
        pass,
        firstName,
        surname,
        phone
      );
      if (result.success) {
        setCustomerAccount({ email, passwordHash: pass, storeName: '' });
        setIsCustomer(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error registering customer:', err);
      return false;
    }
  };

  const loginCustomer = async (email: string, pass: string): Promise<boolean> => {
    try {
      const result = loginCustomerAction
        ? await loginCustomerAction(email, pass)
        : { success: true };

      if (result.success) {
        setIsCustomer(true);
        setCustomerAccount({ email, passwordHash: pass, storeName: '' });
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error logging in customer:', err);
      return false;
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      const result = await resetPasswordAction(email);
      if (result.success) {
        alert(
          `Password reset successful! Your temporary password is: ${result.tempPassword}`
        );
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error resetting password:', err);
      return false;
    }
  };

  // --- Store Branding ---
  const handleUpdateStoreBranding = async (
    name: string,
    bannerUrl: string,
    profileUrl: string
  ) => {
    await updateStoreBranding(name, bannerUrl, profileUrl);
    setStore((prev: StoreInfo) => ({ ...prev, name, bannerUrl, profileUrl }));
  };

  const updateStoreInfo = async (updates: Partial<StoreInfo>) => {
    const newName = updates.name || store.name;
    const newBanner = updates.bannerUrl || store.bannerUrl;
    const newProfile = updates.profileUrl || store.profileUrl;

    await updateStoreBranding(newName, newBanner, newProfile);
    setStore((prev: StoreInfo) => ({ ...prev, ...updates }));
  };

  // --- Inventory / Items ---
  const addItem = async (newItemData: NewItemInput) => {
    await addItemAction({
      name: newItemData.name,
      price: newItemData.price,
      category: newItemData.category,
      imageUrl: newItemData.imageUrl,
    });
    const updatedItems: Item[] = await getItems();
    setItems(updatedItems);
  };

  const updateItem = async (id: string, updates: Partial<Item>) => {
    const target = items.find((i: Item) => i.id === id);
    if (!target) return;

    const merged = {
      name: updates.name ?? target.name,
      price: updates.price ?? target.price,
      category: updates.category ?? target.category,
      imageUrl: updates.imageUrl ?? target.imageUrl,
    };

    await updateItemAction(id, merged);
    const updatedItems: Item[] = await getItems();
    setItems(updatedItems);
  };

  const deleteItem = async (id: string) => {
    await deleteItemAction(id);
    setItems((prev: Item[]) => prev.filter((item: Item) => item.id !== id));
  };

  // --- Cart ---
  const addToCart = (item: Item) => {
    setCart((prev: CartItem[]) => {
      const existing = prev.find((i: CartItem) => i.id === item.id);
      if (existing) {
        return prev.map((i: CartItem) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev: CartItem[]) => prev.filter((i: CartItem) => i.id !== id));
  };

  const clearCart = () => setCart([]);

  // --- Orders ---
  const placeOrder = async (
    customerName: string,
    customerPhone: string
  ): Promise<Order> => {
    const totalAmount = cart.reduce((sum: number, item: CartItem) => {
      const { finalPrice } = calculateDiscount(item.price);
      return sum + finalPrice * item.quantity;
    }, 0);

    const newOrder: Order = await placeOrderAction(
      customerName,
      customerPhone,
      cart,
      totalAmount
    );
    setOrders((prev: Order[]) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const verifyOrderPin = async (pin: string): Promise<boolean> => {
    return await verifyOrderPinAction(pin);
  };

  return (
    <StoreContext.Provider
      value={{
        store,
        items,
        cart,
        orders,
        isOwner,
        isCustomer,
        ownerAccount,
        customerAccount,
        setIsOwner,
        setIsCustomer,
        registerOwner,
        loginOwner,
        registerCustomer,
        loginCustomer,
        resetPassword,
        updateStoreInfo,
        updateStoreBranding: handleUpdateStoreBranding,
        addItem,
        updateItem,
        deleteItem,
        addToCart,
        removeFromCart,
        clearCart,
        placeOrder,
        verifyOrderPin,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
};
