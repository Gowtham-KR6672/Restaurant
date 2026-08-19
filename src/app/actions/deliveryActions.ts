'use server';

import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

export async function markItemDelivered(orderId: string, itemId: string) {
  await dbConnect();
  
  await Order.updateOne(
    { _id: orderId, "items._id": itemId },
    { "$set": { "items.$.status": "Delivered" } }
  );

  // Check if ALL items in order are Delivered
  const order = await Order.findById(orderId);
  if (order) {
    const allDelivered = order.items.every((i: any) => i.status === 'Delivered');
    if (allDelivered && order.status !== 'Delivered') {
      order.status = 'Delivered';
      await order.save();
    }
  }

  revalidatePath('/delivery');
}
