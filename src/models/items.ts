import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IItem extends Document {
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
  stock?: number;
}

const ItemSchema: Schema<IItem> = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Item: Model<IItem> =
  mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);

export default Item;
