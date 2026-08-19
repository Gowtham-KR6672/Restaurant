import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Table from '@/models/Table';
import MenuItem from '@/models/MenuItem';

export async function GET() {
  try {
    await dbConnect();
    const orders = await Order.find({
      status: { $in: ['Received', 'Confirmed', 'Preparing'] }
    })
    .populate({ path: 'table', model: Table })
    .populate({ path: 'items.menuItem', model: MenuItem })
    .sort({ createdAt: 1 })
    .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
