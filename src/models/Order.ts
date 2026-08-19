import { Schema, Document, Model, Types } from 'mongoose';
import { getDb } from '@/lib/db';

export type OrderItemStatus = 'Pending' | 'Preparing' | 'Prepared' | 'Delivered';
export type OrderStatus = 'Received' | 'Confirmed' | 'Preparing' | 'Prepared' | 'Delivered' | 'Completed';
export type PaymentStatus = 'Pending' | 'Paid';

export interface IOrderItem {
  _id?: Types.ObjectId;
  menuItem: Types.ObjectId;
  quantity: number;
  status: OrderItemStatus;
}

export interface IOrder extends Document {
  trackingId: string;
  table: Types.ObjectId;
  items: IOrderItem[];
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  totalAmount: number;
}

const OrderItemSchema = new Schema<IOrderItem>({
  menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  status: { 
    type: String, 
    required: true,
    enum: ['Pending', 'Preparing', 'Prepared', 'Delivered'],
    default: 'Pending'
  }
});

const OrderSchema = new Schema<IOrder>({
  trackingId: { type: String, required: true, unique: true },
  table: { type: Schema.Types.ObjectId, ref: 'Table', required: true },
  items: [OrderItemSchema],
  status: {
    type: String,
    required: true,
    enum: ['Received', 'Confirmed', 'Preparing', 'Prepared', 'Delivered', 'Completed'],
    default: 'Received'
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['Pending', 'Paid'],
    default: 'Pending'
  },
  totalAmount: { type: Number, required: true, default: 0 }
}, { timestamps: true });

const orderDb = getDb('orders');
const Order: Model<IOrder> = orderDb.models.Order || orderDb.model<IOrder>('Order', OrderSchema);
export default Order;
