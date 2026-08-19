import { Schema, Document, Model } from 'mongoose';
import { getDb } from '@/lib/db';

export interface ITable extends Document {
  number: number;
  qrToken: string; // unique token for the table URL
}

const TableSchema = new Schema<ITable>({
  number: { type: Number, required: true, unique: true },
  qrToken: { type: String, required: true, unique: true }
}, { timestamps: true });

const coreDb = getDb('core');
const Table: Model<ITable> = coreDb.models.Table || coreDb.model<ITable>('Table', TableSchema);
export default Table;
