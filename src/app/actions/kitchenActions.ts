'use server';

import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

export async function acceptOrder(orderId: string) {
  await dbConnect();
  await Order.findByIdAndUpdate(orderId, { status: 'Preparing' });
  revalidatePath('/kitchen');
}

export async function updateOrderItemStatus(orderId: string, itemId: string, newStatus: string) {
  await dbConnect();
  
  await Order.updateOne(
    { _id: orderId, "items._id": itemId },
    { "$set": { "items.$.status": newStatus } }
  );

  // Check if all items in the order are now "Prepared" or beyond
  const order = await Order.findById(orderId);
  if (order) {
    const allPrepared = order.items.every((i: any) => i.status === 'Prepared' || i.status === 'Delivered');
    if (allPrepared && order.status !== 'Prepared') {
      order.status = 'Prepared';
      await order.save();
    }
  }

  revalidatePath('/kitchen');
}
