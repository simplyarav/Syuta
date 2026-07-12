import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import SharedCart from '@/models/SharedCart';
import { pusherServer } from '@/lib/pusher';

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    await dbConnect();
    const cart = await SharedCart.findOne({ code });
    
    if (!cart) {
      return NextResponse.json({ error: 'Shared cart not found or expired' }, { status: 404 });
    }

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error('Shared cart GET error:', error);
    return NextResponse.json({ error: 'Internal server error fetching shared cart' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  try {
    const { code } = await params;
    const { action, item, guestName } = await req.json(); // action: 'add' | 'remove' | 'update'
    await dbConnect();
    
    const cart = await SharedCart.findOne({ code });
    if (!cart) return NextResponse.json({ error: 'Shared cart not found' }, { status: 404 });

    if (action === 'add') {
      const existingItem = cart.items.find((i: any) => i.product.toString() === item.product);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        cart.items.push({ ...item, addedBy: guestName || 'Guest' });
      }
    } else if (action === 'remove') {
      cart.items = cart.items.filter((i: any) => i.product.toString() !== item.product);
    } else if (action === 'update') {
      const existingItem = cart.items.find((i: any) => i.product.toString() === item.product);
      if (existingItem) {
        existingItem.quantity = item.quantity;
      }
    }

    await cart.save();

    // Trigger Pusher event to all connected clients
    if (pusherServer) {
      await pusherServer.trigger(`shared-cart-${code}`, 'cart-updated', {
        cart
      });
    }

    return NextResponse.json(cart);
  } catch (error: any) {
    console.error('Shared cart mutation error:', error);
    return NextResponse.json({ error: 'Internal server error mutating shared cart' }, { status: 500 });
  }
}
