import { useState, useEffect } from 'react';
import { getPusherClient } from '@/lib/pusherClient';

export function useSharedCart(code: string, guestName: string) {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial fetch
  useEffect(() => {
    if (!code) return;
    fetch(`/api/cart/shared/${code}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) setError(data.error);
        else setCart(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [code]);

  // Pusher Subscription
  useEffect(() => {
    if (!code) return;
    const pusher = getPusherClient();
    if (!pusher) return;

    const channelName = `shared-cart-${code}`;
    const channel = pusher.subscribe(channelName);

    channel.bind('cart-updated', (data: { cart: any }) => {
      console.log('Real-time cart update received:', data);
      setCart(data.cart);
    });

    return () => {
      pusher.unsubscribe(channelName);
    };
  }, [code]);

  // Actions
  const addItem = async (item: any) => {
    await fetch(`/api/cart/shared/${code}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'add', item, guestName }),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const removeItem = async (productId: string) => {
    // Optimistic update locally
    if (cart) {
      setCart({ ...cart, items: cart.items.filter((i:any) => i.product !== productId) });
    }
    await fetch(`/api/cart/shared/${code}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'remove', item: { product: productId }, guestName }),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    // Optimistic update
    if (cart) {
      const newItems = cart.items.map((i:any) => i.product === productId ? { ...i, quantity } : i);
      setCart({ ...cart, items: newItems });
    }
    await fetch(`/api/cart/shared/${code}`, {
      method: 'POST',
      body: JSON.stringify({ action: 'update', item: { product: productId, quantity }, guestName }),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  return { cart, loading, error, addItem, removeItem, updateQuantity };
}
