export interface Item {
  id: string;
  _id?: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface CartItem extends Item {
  quantity: number;
}

export interface OrderItem {
  itemId?: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  customerName: string;
  customerPhone?: string;
  phone?: string;
  items: OrderItem[];
  totalAmount: number;
  verificationPin: string;
  status?: string;
  createdAt?: string;
}

export interface StoreInfo {
  name: string;
  bannerUrl: string;
  profileUrl: string;
  ownerEmail?: string;
  firstName?: string;
  surname?: string;
  phone?: string;
}

export interface UserAccount {
  email: string;
  name?: string;
  role?: 'owner' | 'customer';
  phone?: string;
  passwordHash?: string;
  storeName?: string;
}

