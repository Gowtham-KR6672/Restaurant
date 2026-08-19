import { Schema, Document, Model } from 'mongoose';
import { getDb } from '@/lib/db';

export interface ICategory extends Document {
  name: string;
  order: number;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  order: { type: Number, default: 0 }
}, { timestamps: true });

const coreDb = getDb('core');
const Category: Model<ICategory> = coreDb.models.Category || coreDb.model<ICategory>('Category', CategorySchema);
export default Category;
