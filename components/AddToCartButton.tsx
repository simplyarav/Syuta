"use client";

import { useCartStore } from "@/store/useCartStore";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button 
      onClick={() => addItem({ ...product, quantity: 1 })}
      className="neo-button w-full sm:w-auto px-12 py-5 text-2xl flex-1 text-center"
    >
      Add to Cart
    </button>
  );
}
