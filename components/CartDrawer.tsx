"use client";

import { useCartStore } from "@/store/useCartStore";
import { X, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, getTotal } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Prevent hydration mismatch for persisted store
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[100] transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white border-l-[4px] border-black shadow-[-8px_0px_0px_0px_rgba(0,0,0,1)] z-[110] transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b-[4px] border-black">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Your Cart</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 neo-box hover:bg-[#ff3366] hover:text-white transition-colors"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 bg-[#f4f4f0]">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 font-bold uppercase mt-12">
              Your cart is empty.
            </div>
          ) : (
            items.map((item) => (
              <div key={item._id} className="neo-box bg-white p-4 flex gap-4">
                <div className="w-24 h-24 bg-gray-100 border-[3px] border-black flex items-center justify-center p-2 relative">
                  {item.image ? (
                     <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                  ) : (
                     <div className="w-full h-full bg-black opacity-10"></div>
                  )}
                </div>
                <div className="flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-lg uppercase leading-tight line-clamp-2">{item.name}</h3>
                    <p className="font-black text-xl mt-1">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border-[3px] border-black">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="p-1 hover:bg-gray-200">
                        <Minus size={16} strokeWidth={3} />
                      </button>
                      <span className="w-8 text-center font-bold border-x-[3px] border-black">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="p-1 hover:bg-gray-200">
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-red-500 hover:text-white hover:bg-red-500 p-1 border-[3px] border-transparent hover:border-black transition-colors">
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t-[4px] border-black bg-white">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl font-bold uppercase">Total</span>
            <span className="text-4xl font-black">{formatPrice(getTotal())}</span>
          </div>
          <button 
            onClick={() => {
              setIsOpen(false);
              router.push('/checkout');
            }}
            disabled={items.length === 0}
            className="neo-button w-full py-4 text-2xl disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            Checkout
          </button>
          <button 
            onClick={async () => {
              try {
                const res = await fetch('/api/cart/shared/create', {
                  method: 'POST',
                  body: JSON.stringify({ items, guestName: 'Host' }),
                  headers: { 'Content-Type': 'application/json' }
                });
                const data = await res.json();
                if (data.code) {
                  const shareUrl = `${window.location.origin}/cart/shared/${data.code}`;
                  navigator.clipboard.writeText(shareUrl);
                  alert(`Share link copied to clipboard! \n${shareUrl}`);
                }
              } catch (e) {
                console.error("Failed to share cart", e);
                alert("Failed to create shared cart");
              }
            }}
            disabled={items.length === 0}
            className="w-full py-3 text-lg font-bold uppercase border-[3px] border-black bg-purple-400 hover:bg-purple-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-[4px] active:translate-x-[4px] active:shadow-none disabled:opacity-50"
          >
            Share Cart with Friends
          </button>
        </div>
      </div>
    </>
  );
}
