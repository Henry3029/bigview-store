export interface UserAccount {
  email: string;
  passwordHash: string; // Stored securely in a real backend / database
  storeName: string;
}

export interface StoreInfo {
  name: string;
  bannerUrl: string;
  profileUrl: string;
  ownerEmail: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: string;
}

export interface CartItem extends Item {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  status: 'PENDING_CONFIRMATION' | 'PAID_VERIFIED';
  verificationPin: string; // 6-digit PIN for fraud prevention
  createdAt: string;
}
