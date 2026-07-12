"use client";

import { useRef } from 'react';
import { formatPrice } from '@/lib/utils';
import Link from "next/link";
import gsap from "gsap";
import PatternArt from "./PatternArt";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    price: number;
    compareAtPrice?: number;
    images?: string[];
    slug: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !window.matchMedia("(pointer: fine)").matches) return;
    
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - left - width / 2) / 25;
    const y = (e.clientY - top - height / 2) / 25;

    gsap.to(cardRef.current, {
      rotateY: x,
      rotateX: -y,
      ease: "power2.out",
      transformPerspective: 1000,
      duration: 0.5,
    });
    
    if (imageRef.current) {
       gsap.to(imageRef.current, {
          scale: 1.08,
          x: x * 1.5,
          y: y * 1.5,
          duration: 0.5,
          ease: "power2.out"
       });
    }
  };

  const handleMouseLeave = () => {
    if (!cardRef.current || !window.matchMedia("(pointer: fine)").matches) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      ease: "elastic.out(1, 0.5)",
      duration: 1.2,
    });
    
    if (imageRef.current) {
       gsap.to(imageRef.current, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.5)"
       });
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="block" style={{ perspective: "1000px" }}>
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="neo-box overflow-hidden relative group bg-white cursor-pointer h-full flex flex-col"
      >
        <div className="relative w-full aspect-square border-b-[3px] border-black overflow-hidden bg-gray-100 p-8 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
             <img 
               ref={imageRef}
               src={product.images[0]} 
               alt={product.name}
               className="w-full h-full object-contain mix-blend-multiply drop-shadow-xl"
             />
          ) : (product as any).patternType ? (
             <PatternArt patternType={(product as any).patternType} garmentType={(product as any).garmentType} />
          ) : (
            <div ref={imageRef} className="w-32 h-32 bg-black rounded-full opacity-10"></div>
          )}
        </div>
        
        <div className="p-5 flex flex-col flex-1 justify-between bg-white z-10 relative">
          <h3 className="font-bold text-xl uppercase truncate mb-4">{product.name}</h3>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-sm font-bold text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
              <p className="font-black text-2xl">
                {formatPrice(product.price)}
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="ml-2 text-xs font-black text-red-500 uppercase tracking-tighter align-middle">Sale</span>
                )}
              </p>
            </div>
            <span className="text-xs font-black uppercase bg-[#fce762] border-[3px] border-black px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              View
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
