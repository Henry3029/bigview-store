import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface IOrder extends Document {
  customerName: string;
  customerPhone: string;
  items: IOrderItem[];
  totalAmount: number;
  status: 'PENDING_CONFIRMATION' | 'PAID_VERIFIED';
  verificationPin: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  items: [{
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    imageUrl: { type: String, required: true },
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['PENDING_CONFIRMATION', 'PAID_VERIFIED'], default: 'PAID_VERIFIED' },
  verificationPin: { type: String, required: true, unique: true },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
