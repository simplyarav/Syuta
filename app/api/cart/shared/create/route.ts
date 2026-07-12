import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SharedCart from '@/models/SharedCart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { items, guestName } = await req.json();
    
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    await dbConnect();

    // Generate random 6 character code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // 24 hour TTL
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const addedBy = (session?.user as any)?.name || guestName || 'Guest';

    const formattedItems = items.map((item: any) => ({
      product: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
      addedBy
    }));

    const sharedCart = await SharedCart.create({
      code,
      items: formattedItems,
      createdBy: session?.user ? (session.user as any)._id : undefined,
      expiresAt
    });

    return NextResponse.json({ code: sharedCart.code });
  } catch (error: any) {
    console.error('Shared cart create error:', error);
    return NextResponse.json({ error: 'Internal server error creating shared cart' }, { status: 500 });
  }
}
