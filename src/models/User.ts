import { Schema, Document, Model } from 'mongoose';
import { getDb } from '@/lib/db';

export interface IUser extends Document {
  name: string;
  username: string;
  passwordHash: string;
  role: 'admin' | 'kitchen' | 'supplier' | 'cashier';
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'kitchen', 'supplier', 'cashier'],
    default: 'cashier'
  }
}, { timestamps: true });

const coreDb = getDb('core');
const User: Model<IUser> = coreDb.models.User || coreDb.model<IUser>('User', UserSchema);
export default User;
