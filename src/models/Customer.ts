import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
  firstName: string;
  surname: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: 'customer' | 'owner';
  createdAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
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
const Customer = mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
