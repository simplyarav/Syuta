"use client";

import { useRef, useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductCarousel({ products }: { products: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const lastInteractionTime = useRef<number>(0);

  // Duplicate products to create a seamless infinite loop effect
  const extendedProducts = [...products, ...products, ...products];

  const updateScrollState = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
      
      // Seamless loop jump logic
      // If we scroll past 2/3 of the container, jump back to 1/3
      // If we scroll before 1/3 of the container, jump forward to 2/3
      const thirdWidth = scrollWidth / 3;
      if (scrollLeft >= thirdWidth * 2) {
        scrollContainerRef.current.scrollLeft = scrollLeft - thirdWidth;
      } else if (scrollLeft <= 0) {
        scrollContainerRef.current.scrollLeft = thirdWidth;
      }
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      // Start in the middle section for infinite scroll in both directions
      scrollContainer.scrollLeft = scrollContainer.scrollWidth / 3;
      updateScrollState();
      
      scrollContainer.addEventListener("scroll", updateScrollState);
      window.addEventListener("resize", updateScrollState);
      
      return () => {
        scrollContainer.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }
  }, [products]);

  // Autoplay Logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animateScroll = (time: number) => {
      if (scrollContainerRef.current) {
        const timeSinceInteraction = Date.now() - lastInteractionTime.current;
        const isInteracting = timeSinceInteraction < 3000; // Pause for 3s after any click/interaction
        
        if (!isHovered && !isInteracting) {
          const deltaTime = time - lastTime;
          // Drift speed: approx 30px per second
          const scrollSpeed = 0.03; 
          
          if (deltaTime > 0 && deltaTime < 100) { // Avoid huge jumps if tab was inactive
             scrollContainerRef.current.scrollLeft += (deltaTime * scrollSpeed);
          }
        }
      }
      lastTime = time;
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const handleInteraction = () => {
    lastInteractionTime.current = Date.now();
  };

  const scroll = (direction: "left" | "right") => {
    handleInteraction();
    if (scrollContainerRef.current) {
      // Scroll by roughly 1 item width
      const scrollAmount = scrollContainerRef.current.clientWidth > 768 ? 
        scrollContainerRef.current.clientWidth * 0.25 : 
        scrollContainerRef.current.clientWidth * 0.8; 
        
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="neo-box p-12 text-center text-gray-500 font-bold uppercase text-xl bg-white gs-item">
        No featured products yet. Add some in the admin panel!
      </div>
    );
  }

  return (
    <div 
      className="relative group gs-item"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleInteraction}
    >
      {/* Navigation Buttons */}
      <button 
        onClick={() => scroll("left")}
        className="absolute left-0 md:-left-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#fce762] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hidden md:flex"
        aria-label="Scroll left"
      >
        <ChevronLeft size={24} strokeWidth={3} />
      </button>

      <button 
        onClick={() => scroll("right")}
        className="absolute right-0 md:-right-6 top-1/2 -translate-y-1/2 z-10 p-3 bg-[#fce762] border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all hidden md:flex"
        aria-label="Scroll right"
      >
        <ChevronRight size={24} strokeWidth={3} />
      </button>

      {/* Carousel Container */}
      <div 
        ref={scrollContainerRef}
        onWheel={handleInteraction}
        className="flex gap-8 overflow-x-auto hide-scrollbar pb-6 pt-2 px-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {extendedProducts.map((product, index) => (
          <div 
            key={`${product._id}-${index}`} 
            className="w-[85vw] sm:w-[calc(50%-1rem)] md:w-[calc(25%-1.5rem)] flex-shrink-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
      
      {/* CSS to hide scrollbar for webkit */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
