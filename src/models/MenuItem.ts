import { Schema, Document, Model, Types } from 'mongoose';
import { getDb } from '@/lib/db';

export interface IMenuItem extends Document {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: Types.ObjectId;
  isAvailable: boolean;
}

const MenuItemSchema = new Schema<IMenuItem>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

const coreDb = getDb('core');
const MenuItem: Model<IMenuItem> = coreDb.models.MenuItem || coreDb.model<IMenuItem>('MenuItem', MenuItemSchema);
export default MenuItem;
