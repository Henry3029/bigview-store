import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrderItem {
  itemId?: string;
  name: string;
  category?: string;
  quantity: number;
  price: number;
  originalPrice?: number;
  discountAmount?: number;
}

export interface IOrder extends Document {
  customerName: string;
  customerEmail?: string;
  phone: string;
  items: IOrderItem[];
  totalAmount: number;
  verificationPin: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    itemId: { type: String },
    name: { type: String, required: true },
    category: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number },
    discountAmount: { type: Number, default: 0 },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    items: { type: [OrderItemSchema], required: true },
    totalAmount: { type: Number, required: true, min: 0 },
    verificationPin: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
