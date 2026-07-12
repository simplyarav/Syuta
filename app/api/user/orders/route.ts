import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product'; // ensure Product model is registered for populate
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const orders = await Order.find({ user: (session.user as any).id })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(orders);
  } catch (error: any) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json({ error: 'Internal server error fetching orders' }, { status: 500 });
  }
}
