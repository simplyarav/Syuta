"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

interface Order {
  _id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  razorpayOrderId: string;
  items: {
    product: {
      _id: string;
      name: string;
      images: string[];
      slug: string;
    } | null;
    quantity: number;
    price: number;
    _id: string;
  }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/user/orders");
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || "Failed to fetch orders");
        
        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="text-2xl font-black uppercase animate-pulse">Loading orders...</div>;
  }

  if (error) {
    return <div className="neo-box bg-[#ff3366] text-white p-6 font-bold uppercase">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-5xl font-black uppercase mb-10 tracking-tighter border-b-[4px] border-black pb-4">Order History</h1>
      
      {orders.length === 0 ? (
        <div className="neo-box bg-white p-12 text-center">
          <p className="text-xl font-bold uppercase text-gray-500 mb-6">No orders found.</p>
          <Link href="/" className="neo-button inline-block px-8 py-3">Start Shopping</Link>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {orders.map((order) => (
            <div key={order._id} className="neo-box bg-[#fce762] flex flex-col overflow-hidden">
              <div className="bg-white border-b-[3px] border-black p-6 flex flex-col md:flex-row justify-between md:items-center gap-6">
                <div>
                  <p className="text-sm font-bold uppercase text-gray-500 mb-1">Order Placed</p>
                  <p className="font-black text-xl">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-gray-500 mb-1">Total</p>
                  <p className="font-black text-xl">{formatPrice(order.totalAmount)}</p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-gray-500 mb-1">Status</p>
                  <p className={`inline-block px-3 py-1 border-[3px] border-black font-black uppercase text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                    order.status === 'paid' ? 'bg-[#33ccff] text-black' : 
                    order.status === 'pending' ? 'bg-white text-black' : 
                    'bg-[#ff3366] text-white'
                  }`}>
                    {order.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold uppercase text-gray-500 mb-1">Order ID</p>
                  <p className="font-bold font-mono text-sm truncate w-32 md:w-auto">{order.razorpayOrderId || order._id}</p>
                </div>
              </div>
              
              <div className="p-6 bg-[#f4f4f0] flex flex-col gap-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-6 bg-white border-[3px] border-black p-4">
                    <div className="w-20 h-20 bg-gray-100 border-[3px] border-black flex items-center justify-center p-2 flex-shrink-0 relative">
                      {item.product?.images?.[0] ? (
                        <img src={item.product.images[0]} alt={item.product?.name || "Product"} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                        <div className="w-full h-full bg-black opacity-10"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      {item.product ? (
                        <Link href={`/products/${item.product.slug}`} className="font-bold text-xl uppercase hover:underline underline-offset-4 decoration-[3px] leading-tight block">
                          {item.product.name}
                        </Link>
                      ) : (
                        <span className="font-bold text-xl uppercase text-gray-400">Product Unavailable</span>
                      )}
                      <div className="flex gap-6 mt-2 font-medium">
                        <p>Qty: <span className="font-black text-lg">{item.quantity}</span></p>
                        <p>Price: <span className="font-black text-lg">{formatPrice(item.price)}</span></p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
