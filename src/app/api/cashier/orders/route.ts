import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Table from '@/models/Table';

export async function GET() {
  try {
    await dbConnect();
    // Fetch orders that are not Completed
    const orders = await Order.find({ status: { $ne: 'Completed' } })
    .populate({ path: 'table', model: Table })
    .sort({ createdAt: -1 })
    .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
