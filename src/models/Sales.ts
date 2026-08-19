import { Schema, Document, Model } from 'mongoose';
import { getDb } from '@/lib/db';

export interface ISales extends Document {
  date: Date;
  totalRevenue: number;
  ordersCount: number;
}

const SalesSchema = new Schema<ISales>({
  date: { type: Date, required: true },
  totalRevenue: { type: Number, required: true, default: 0 },
  ordersCount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const salesDb = getDb('sales');
const Sales: Model<ISales> = salesDb.models.Sales || salesDb.model<ISales>('Sales', SalesSchema);
export default Sales;
