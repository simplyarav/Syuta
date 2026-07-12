"use client";

import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

interface BuyNowButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
  };
}

export default function BuyNowButton({ product }: BuyNowButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleBuyNow = () => {
    addItem({ ...product, quantity: 1 });
    router.push("/checkout");
  };

  return (
    <button 
      onClick={handleBuyNow}
      className="neo-button-secondary w-full sm:w-auto px-12 py-5 text-2xl flex-1 text-center"
    >
      Buy Now
    </button>
  );
}
