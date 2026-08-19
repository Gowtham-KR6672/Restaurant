import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { tableId, items } = body;

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Invalid order data' }, { status: 400 });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (menuItem) {
        totalAmount += menuItem.price * item.quantity;
        orderItems.push({
          menuItem: menuItem._id,
          quantity: item.quantity,
          status: 'Pending'
        });
      }
    }

    const trackingId = uuidv4().substring(0, 8).toUpperCase();

    const newOrder = await Order.create({
      trackingId,
      table: tableId,
      items: orderItems,
      status: 'Received',
      paymentStatus: 'Pending',
      totalAmount
    });

    return NextResponse.json({ trackingId: newOrder.trackingId, orderId: newOrder._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
