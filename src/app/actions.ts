'use server';

import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import Store from '@/models/Store';
import Order from '@/models/Order';
import Customer from '@/models/Customer'; // Add this import at the top
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
//testing
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
  // imageUrl will now contain either a base64 data string or an uploaded asset path
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
  return !!order; // Returns true or false correctly
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

  // Check if store/owner already exists in MongoDB
  const existingStore = await Store.findOne({ ownerEmail: normalizedEmail });
  if (existingStore) {
    return { success: false, message: 'An account with this email already exists.' };
  }

  // 1. Hash the password securely with bcrypt before saving
  const hashedPassword = await bcrypt.hash(passwordInput, 10);

  // Create new store record in MongoDB with the SECURE HASHED password
  await Store.create({
    name: storeName || 'BIGVIEW Store',
    firstName,
    surname,
    phone,
    ownerEmail: normalizedEmail,
    passwordHash: hashedPassword, // <--- Store the hash, not the raw password!
    bannerUrl: bannerUrl || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    profileUrl: profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + surname)}&background=48BB78&color=fff`,
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
    // Fallback default for your mom's initial store setup
    if (normalizedEmail === 'mom@eldgate.ng' && pass === 'eldgate2026') {
      return { success: true, message: 'Welcome back, Mom!' };
    }
    return { success: false, message: 'Store owner email not found.' };
  }

  // Compare the input password against the stored bcrypt hash
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
  
  // If the store doesn't exist and isn't the fallback mom account, reject it
  if (!store && normalizedEmail !== 'mom@eldgate.ng') {
    return { success: false, message: 'Email not registered in the database.' };
  }

  // Generate a secure temporary password string to show the user
  const plainTempPassword = 'temp' + Math.floor(1000 + Math.random() * 9000);
  
  // Hash the temporary password so bcrypt.compare() will succeed during login
  const hashedTempPassword = await bcrypt.hash(plainTempPassword, 10);
  
  // Update the existing record securely without upserting accidental new stores
  await Store.findOneAndUpdate(
    { ownerEmail: normalizedEmail },
    { passwordHash: hashedTempPassword },
    { new: true }
  );

  // Return the plain text temporary password *only* so it can be displayed to the user once
  return { success: true, tempPassword: plainTempPassword };
}

// Add these to your src/app/actions.ts file

export async function registerCustomerAction(email: string, pass: string, firstName: string, surname: string, phone: string) {
  try {
    await dbConnect(); // Ensure DB is connected
    
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await Customer.findOne({ email: normalizedEmail });
    
    if (existingUser) { 
      return { success: false, message: 'An account with this email already exists. Please sign in instead.' }; 
    }
    // Hash the password securely with a salt round of 10
    const hashedPassword = await bcrypt.hash(pass, 10);
    
    await Customer.create({ 
      email: normalizedEmail, 
      password: hashedPassword,
      firstName, 
      surname, 
      phone 
    });
    
    return { success: true, message: 'Welcome to Bigview! Your account has been created successfully.' };
  } catch (error) {
    console.error('Failed to register customer:', error);
    return { success: false, message: 'We encountered an issue while creating your account. Please try again shortly.' };
  }
}


export async function loginCustomerAction(email: string, pass: string) {
  try {
    await dbConnect();
    const customer = await Customer.findOne({ email: email.trim().toLowerCase() });
    
    if (!customer) {
      return { success: false, message: 'Invalid Email or password' };
    }

    // Compare the entered password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(pass, customer.password);
    
    if (!isPasswordValid) {
      return { success: false, message: 'Invalid Email or password' };
    }

    return { success: true, customer: { email: customer.email, firstName: customer.firstName } };
  } catch (error) {
    console.error('Failed to login customer:', error);
    return { success: false, message: 'An unexpected error occurred during sign-in.' };
  }
}


