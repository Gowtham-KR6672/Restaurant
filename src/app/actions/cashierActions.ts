'use server';

import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

export async function markOrderPaid(orderId: string) {
  await dbConnect();
  
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  const allDelivered = order.items.every((i: any) => i.status === 'Delivered');
  if (!allDelivered) {
    throw new Error('All items must be delivered before payment completion');
  }

  order.paymentStatus = 'Paid';
  order.status = 'Completed';
  // We keep the tracking ID intact so the user can download the PDF invoice from it,
  // but the tracking UI will block further real-time status and only show completion UI.
  await order.save();

  revalidatePath('/cashier');
}
