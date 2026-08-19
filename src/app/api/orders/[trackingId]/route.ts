import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import MenuItem from '@/models/MenuItem';

export async function GET(req: Request, { params }: { params: Promise<{ trackingId: string }> }) {
  try {
    await dbConnect();
    const { trackingId } = await params;
    const order = await Order.findOne({ trackingId }).populate({ path: 'items.menuItem', model: MenuItem }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
