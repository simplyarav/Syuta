"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hoverText, setHoverText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(true);
  const hasInjectedStyle = useRef(false);

  // Check if device supports hover (not a touch device)
  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsFinePointer(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Handle hardware cursor tracking using plain vanilla JS for zero lag
  useEffect(() => {
    if (!isFinePointer) return;

    let rafId: number;
    let mouseX = -100;
    let mouseY = -100;

    const moveCursor = (e: MouseEvent) => {
      // On first movement, hijack the global cursor CSS
      if (!hasInjectedStyle.current) {
        hasInjectedStyle.current = true;
        if (cursorRef.current) cursorRef.current.style.opacity = "1";
        
        const style = document.createElement("style");
        style.id = "global-cursor-none";
        style.innerHTML = "* { cursor: none !important; }";
        document.head.appendChild(style);
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    // Use requestAnimationFrame for buttery smooth hardware syncing
    const renderLoop = () => {
      if (cursorRef.current && hasInjectedStyle.current) {
        // translate3d forces GPU acceleration
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(renderLoop);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, input, [role="button"], [data-cursor-text]');
      
      if (interactive) {
        setIsHovering(true);
        if (interactive.hasAttribute('data-cursor-text')) {
          setHoverText(interactive.getAttribute('data-cursor-text') || "");
        } else if (interactive.tagName.toLowerCase() === 'a' || interactive.tagName.toLowerCase() === 'button') {
          setHoverText("VIEW");
        } else {
          setHoverText("");
        }
      } else {
        setIsHovering(false);
        setHoverText("");
      }
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    rafId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafId);
      
      const style = document.getElementById("global-cursor-none");
      if (style) style.remove();
      hasInjectedStyle.current = false;
    };
  }, [isFinePointer]);

  // Don't render on mobile/touch screens
  if (!isFinePointer) return null;

  return (
    <div 
      ref={cursorRef} 
      className={`pointer-events-none fixed left-0 top-0 z-[10000] flex items-center justify-center transition-[width,height,background-color,border-color] duration-300 ease-out opacity-0 will-change-transform ${
        isHovering 
          ? "w-16 h-16 bg-[#ff3366] border-[3px] border-black text-white font-black text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" 
          : "w-4 h-4 bg-transparent border-[3px] border-black"
      }`}
      style={{ transform: "translate(-100px, -100px)" }}
    >
      {isHovering && hoverText && <span className="uppercase tracking-wider">{hoverText}</span>}
    </div>
  );
}
