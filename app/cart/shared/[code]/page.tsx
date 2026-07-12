"use client";

import { useSharedCart } from '@/hooks/useSharedCart';
import { useState, use } from 'react';
import { Plus, Minus, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice } from "@/lib/utils";

export default function SharedCartPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [guestName, setGuestName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const router = useRouter();

  const { cart, loading, error, removeItem, updateQuantity } = useSharedCart(
    hasJoined ? code : '', 
    guestName
  );

  if (!hasJoined) {
    return (
      <div className="min-h-screen bg-[#f4f4f0] flex items-center justify-center p-4 font-sans">
        <div className="neo-box bg-white p-8 max-w-md w-full shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
          <h1 className="text-3xl font-black uppercase mb-4 text-center tracking-tighter flex items-center justify-center gap-2">
            <Users /> Join Shared Cart
          </h1>
          <p className="text-center font-bold mb-6">Enter a display name so your friends know who's adding what!</p>
          <input 
            type="text"
            value={guestName}
            onChange={e => setGuestName(e.target.value)}
            placeholder="Your Name..."
            className="w-full border-4 border-black p-3 font-bold text-lg mb-4 outline-none focus:bg-yellow-100 transition-colors"
          />
          <button 
            onClick={() => {
              if(guestName.trim()) setHasJoined(true);
            }}
            disabled={!guestName.trim()}
            className="neo-button w-full py-4 text-xl disabled:opacity-50"
          >
            Join Cart
          </button>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-3xl uppercase tracking-tighter bg-[#f4f4f0]">Loading Live Cart...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center font-black text-3xl uppercase tracking-tighter text-red-500 bg-[#f4f4f0]">Error: {error}</div>;

  const total = cart?.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;

  return (
    <div className="min-h-screen bg-[#f4f4f0] py-12 px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 border-b-4 border-black pb-4 gap-4">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-3">
              <Users size={36} /> Live Shared Cart
            </h1>
            <p className="font-bold mt-2 text-gray-600 uppercase">Room Code: <span className="bg-yellow-300 px-3 py-1 text-black border-2 border-black ml-2 font-black">{code}</span></p>
          </div>
          <button onClick={() => router.push('/')} className="px-6 py-3 border-4 border-black font-bold uppercase transition-transform hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
            Continue Shopping
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {cart?.items.length === 0 ? (
            <div className="neo-box bg-white p-12 text-center text-xl font-bold uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black">
              The cart is empty. Go add some items!
            </div>
          ) : (
            cart?.items.map((item: any) => (
              <div key={item.product} className="bg-white p-6 flex gap-6 relative border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {/* Attribution Badge */}
                <div className="absolute -top-4 -right-4 bg-purple-400 border-[3px] border-black px-4 py-1 font-black text-sm transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] whitespace-nowrap z-10">
                  Added by {item.addedBy}
                </div>

                <div className="w-32 h-32 bg-gray-100 border-[3px] border-black flex items-center justify-center p-2">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                    <div className="w-full h-full bg-black opacity-10"></div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-2xl uppercase leading-tight line-clamp-2">{item.name}</h3>
                    <p className="font-black text-2xl mt-2">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-[3px] border-black">
                      <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-2 hover:bg-gray-200">
                        <Minus size={20} strokeWidth={3} />
                      </button>
                      <span className="w-12 text-center font-bold text-lg border-x-[3px] border-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2 hover:bg-gray-200">
                        <Plus size={20} strokeWidth={3} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.product)} className="text-red-500 hover:text-white hover:bg-red-500 p-2 border-[3px] border-transparent hover:border-black transition-colors">
                      <Trash2 size={24} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8 bg-white p-8 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-8">
            <span className="text-2xl font-bold uppercase">Total</span>
            <span className="text-5xl font-black">{formatPrice(total)}</span>
          </div>
          <button className="neo-button w-full py-4 text-2xl uppercase" onClick={() => alert('Checkout not implemented for shared carts in MVP')}>
            Group Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
