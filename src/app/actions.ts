'use server';

import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import Store from '@/models/Store';
import Order from '@/models/Orders';
import Customer from '@/models/Customer';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';

interface OrderInputItem {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

// --- STORE ACTIONS ---
export async function getStoreInfo() {
  await dbConnect();
  let store = await Store.findOne();
  if (!store) {
    const defaultPasswordHash = await bcrypt.hash('eldgate2026', 10);
    store = await Store.create({
      name: 'BIGVIEW Store',
      bannerUrl:
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
      profileUrl:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      ownerEmail: 'mom@eldgate.ng',
      passwordHash: defaultPasswordHash,
    });
  }
  return JSON.parse(JSON.stringify(store));
}

export async function updateStoreBranding(
  name: string,
  bannerUrl: string,
  profileUrl: string
) {
  await dbConnect();
  await Store.findOneAndUpdate(
    {},
    { name, bannerUrl, profileUrl },
    { upsert: true }
  );
  revalidatePath('/');
}

// --- ITEM / INVENTORY ACTIONS ---
export async function getItems() {
  await dbConnect();
  const items = await Item.find({}).sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(items));
}

export async function addItemAction(data: {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}) {
  await dbConnect();
  await Item.create(data);
  revalidatePath('/');
}

export async function updateItemAction(
  id: string,
  updates: { name: string; price: number; category: string; imageUrl: string }
) {
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
export async function placeOrderAction(
  customerName: string,
  customerPhone: string,
  cartItems: OrderInputItem[],
  totalAmount: number
) {
  await dbConnect();

  if (!Array.isArray(cartItems) || cartItems.length === 0) {
    throw new Error('Cannot place an order with an empty cart.');
  }

  const verificationPin = Math.floor(100000 + Math.random() * 900000).toString();

  const order = await Order.create({
    customerName: customerName.trim(),
    phone: customerPhone.trim(),
    items: cartItems.map((i) => ({
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

// --- REGISTER OWNER ACTION ---
export async function registerOwnerAction(
  email: string,
  passwordInput: string,
  storeName: string,
  firstName: string,
  surname: string,
  phone: string,
  bannerUrl?: string,
  profileUrl?: string
) {
  await dbConnect();

  const normalizedEmail = email.trim().toLowerCase();

  const existingStore = await Store.findOne({ ownerEmail: normalizedEmail });
  if (existingStore) {
    return {
      success: false,
      message: 'An account with this email already exists.',
    };
  }

  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  await Store.create({
    name: storeName.trim() || 'BIGVIEW Store',
    firstName: firstName.trim(),
    surname: surname.trim(),
    phone: phone.trim(),
    ownerEmail: normalizedEmail,
    passwordHash: hashedPassword,
    bannerUrl:
      bannerUrl ||
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl:
      profileUrl ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        `${firstName.trim()} ${surname.trim()}`
      )}&background=48BB78&color=fff`,
  });

  revalidatePath('/');
  return { success: true, message: 'Store registered successfully!' };
}

// --- AUTH & OWNER ACTIONS ---
export async function loginOwnerAction(email: string, pass: string) {
  await dbConnect();
  const normalizedEmail = email.trim().toLowerCase();

  const store = await Store.findOne({ ownerEmail: normalizedEmail });

  if (!store) {
    if (normalizedEmail === 'mom@eldgate.ng' && pass === 'eldgate2026') {
      return { success: true, message: 'Welcome back, Mom!' };
    }
    return { success: false, message: 'Store owner email not found.' };
  }

  const isPasswordValid = await bcrypt.compare(pass, store.passwordHash);

  if (!isPasswordValid) {
    return { success: false, message: 'Incorrect password.' };
  }

  return { success: true, storeName: store.name };
}

export async function resetPasswordAction(email: string) {
  await dbConnect();
  const normalizedEmail = email.trim().toLowerCase();

  const store = await Store.findOne({ ownerEmail: normalizedEmail });

  if (!store && normalizedEmail !== 'mom@eldgate.ng') {
    return {
      success: false,
      message: 'Email not registered in the database.',
    };
  }

  const plainTempPassword = 'temp' + Math.floor(1000 + Math.random() * 9000);
  const hashedTempPassword = await bcrypt.hash(plainTempPassword, 10);

  await Store.findOneAndUpdate(
    { ownerEmail: normalizedEmail },
    { passwordHash: hashedTempPassword },
    { new: true }
  );

  return { success: true, tempPassword: plainTempPassword };
}

// --- CUSTOMER AUTH ACTIONS ---
export async function registerCustomerAction(
  email: string,
  pass: string,
  firstName: string,
  surname: string,
  phone: string
) {
  try {
    await dbConnect();

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await Customer.findOne({ email: normalizedEmail });

    if (existingUser) {
      return {
        success: false,
        message:
          'An account with this email already exists. Please sign in instead.',
      };
    }

    const hashedPassword = await bcrypt.hash(pass, 10);

    await Customer.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName: firstName.trim(),
      surname: surname.trim(),
      phone: phone.trim(),
    });

    return {
      success: true,
      message: 'Welcome to Bigview! Your account has been created successfully.',
    };
  } catch (error) {
    console.error('Failed to register customer:', error);
    return {
      success: false,
      message:
        'We encountered an issue while creating your account. Please try again shortly.',
    };
  }
}

export async function loginCustomerAction(email: string, pass: string) {
  try {
    await dbConnect();
    const customer = await Customer.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!customer) {
      return { success: false, message: 'Invalid Email or password' };
    }

    const isPasswordValid = await bcrypt.compare(pass, customer.password);

    if (!isPasswordValid) {
      return { success: false, message: 'Invalid Email or password' };
    }

    return {
      success: true,
      customer: {
        email: customer.email,
        firstName: customer.firstName,
        surname: customer.surname,
        phone: customer.phone,
      },
    };
  } catch (error) {
    console.error('Failed to login customer:', error);
    return {
      success: false,
      message: 'An unexpected error occurred during sign-in.',
    };
  }
}
