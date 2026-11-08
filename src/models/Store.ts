import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  firstName?: string;
  surname?: string;
  phone?: string;
  bannerUrl: string;
  profileUrl: string;
  ownerEmail: string;
  passwordHash: string;
}

const StoreSchema = new Schema<IStore>(
  {
    name: { type: String, required: true, trim: true },
    firstName: { type: String, trim: true },
    surname: { type: String, trim: true },
    phone: { type: String, trim: true },
    bannerUrl: { type: String, default: '' },
    profileUrl: { type: String, default: '' },
    ownerEmail: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Store = mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);

export default Store;
