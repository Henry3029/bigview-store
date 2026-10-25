import mongoose, { Schema, Document } from 'mongoose';

export interface IStore extends Document {
  name: string;
  bannerUrl: string;
  profileUrl: string;
  ownerEmail: string;
  passwordHash: string;
}

const StoreSchema = new Schema<IStore>({
  name: { type: String, required: true, default: 'EL.D.Gate' },
  bannerUrl: { type: String, required: true },
  profileUrl: { type: String, required: true },
  ownerEmail: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Store || mongoose.model<IStore>('Store', StoreSchema);
