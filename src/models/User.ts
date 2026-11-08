import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  surname: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'owner';
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    surname: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    phone: { type: String, trim: true },
    role: { type: String, enum: ['customer', 'owner'], default: 'customer' },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Prevent re-compilation errors in Next.js hot-reloading environment
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
