'use server';

import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import Store from '@/models/Store';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

// --- STORE ACTIONS ---
export async function getStoreInfo() {
  await dbConnect();
  let store = await Store.findOne();
  if (!store) {
    // Seed default store if none exists
    store = await Store.create({
      name: 'EL.D.Gate',
      bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      ownerEmail: 'mom@eldgate.ng',
      passwordHash: 'eldgate2026',
    });
  }
  return JSON.parse(JSON.stringify(store));
}

export async function updateStoreBranding(name: string, bannerUrl: string, profileUrl: string) {
  await dbConnect();
  await Store.findOneAndUpdate({}, { name, bannerUrl, profileUrl }, { upsert: true });
  revalidatePath('/');
}

// --- ITEM / INVENTORY ACTIONS ---
export async function getItems() {
  await dbConnect();
  const items = await Item.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export async function addItemAction(data: { name: string; price: number; category: string; imageUrl: string }) {
  await dbConnect();
  await Item.create(data);
  revalidatePath('/');
}

export async function updateItemAction(id: string, updates: { name: string; price: number; category: string; imageUrl: string }) {
  await dbConnect();
  await Item.findByIdAndUpdate(id, updates);
  revalidatePath('/');
}

export async function deleteItemAction(id: string) {
  await dbConnect();
  await Item.findByIdAndDelete(id);
  revalidatePath('/');
}

// --- ORDER & PIN VERIFICATION ACTIONS ---
export async function placeOrderAction(customerName: string, customerPhone: string, cartItems: any[], totalAmount: number) {
  await dbConnect();
  const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

  const order = await Order.create({
    customerName,
    customerPhone,
    items: cartItems.map(i => ({
      itemId: i.id || i._id,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      imageUrl: i.imageUrl,
    })),
    totalAmount,
    status: 'PAID_VERIFIED',
    verificationPin,
  });

  revalidatePath('/');
  return JSON.parse(JSON.stringify(order));
}

export async function verifyOrderPinAction(pin: string) {
  await dbConnect();
  const order = await Order.findOne({ verificationPin: pin.trim() });
  return !!order;
}
