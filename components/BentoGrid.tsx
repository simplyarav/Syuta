"use client";

import Link from 'next/link';
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function BentoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseStyle = "border-[3px] border-black text-black flex items-center justify-center group overflow-hidden hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300";

  useGSAP(() => {
    if (!containerRef.current) return;
    
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const cells = containerRef.current!.querySelectorAll('.bento-cell');
      
      cells.forEach((cell, index) => {
        // Create a subtle staggering parallax effect only on desktop
        const speed = index % 2 === 0 ? 0.05 : -0.05;
        
        gsap.to(cell, {
          yPercent: speed * 100,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          }
        });
      });
    });

    return () => mm.revert();
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
      {/* Large Featured Item */}
      <Link href="/products" data-cursor-text="SHOP" className={`bento-cell md:col-span-2 md:row-span-2 bg-[#ff3366] p-10 min-h-[450px] relative flex-col items-start justify-end ${baseStyle}`}>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-0 duration-500"></div>
        <div className="z-10 relative">
          <h2 className="text-5xl lg:text-7xl font-black uppercase mb-6 leading-none tracking-tighter mix-blend-overlay">New<br/>Collection</h2>
          <span className="neo-button-secondary inline-block px-8 py-4 text-lg bg-white">Shop Drops</span>
        </div>
      </Link>
      
      {/* Medium Items */}
      <Link href="/categories/sweats" data-cursor-text="SHOP" className={`bento-cell md:col-span-2 bg-[#33ccff] p-8 min-h-[220px] ${baseStyle}`}>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter group-hover:scale-110 transition-transform origin-center duration-300">Hoodies & Sweats</h2>
      </Link>
      
      <Link href="/categories/accessories" data-cursor-text="SHOP" className={`bento-cell bg-[#fce762] p-8 min-h-[220px] ${baseStyle}`}>
        <h2 className="text-3xl font-black uppercase tracking-tighter group-hover:-rotate-12 group-hover:scale-110 transition-transform duration-300 text-center">Gear &<br/>Accessories</h2>
      </Link>
      
      <Link href="/products?sale=true" data-cursor-text="SALE" className={`bento-cell bg-[#00ff66] p-8 min-h-[220px] !border-dashed !border-[4px] ${baseStyle}`}>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-black group-hover:animate-pulse z-10">Sale<br/>50%</h2>
      </Link>
    </div>
  );
}
