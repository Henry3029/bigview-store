import mongoose, { Schema, Document } from 'mongoose';

export interface IItem extends Document {
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
}

const ItemSchema = new Schema<IItem>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  category: { type: String, required: true, default: 'Groceries' },
}, { timestamps: true });

export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
