"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AmbientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setShouldAnimate(false);
    }

    // Disable on very small screens to save battery/performance
    if (window.innerWidth < 768) {
      setShouldAnimate(false);
    }
  }, []);

  useGSAP(() => {
    if (!shouldAnimate) return;

    // 1. Skylight Glow Animation (slow drifting blobs)
    gsap.to(".glow-blob-1", {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      duration: 25,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
    
    gsap.to(".glow-blob-2", {
      x: "random(-150, 150)",
      y: "random(-100, 100)",
      duration: 30,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    gsap.to(".glow-blob-3", {
      x: "random(-100, 100)",
      y: "random(-150, 150)",
      duration: 28,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // 2. Storefront Parallax Strips (tied to scroll)
    gsap.to(".parallax-band-1", {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
      xPercent: -30,
      ease: "none",
    });

    gsap.to(".parallax-band-2", {
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      },
      xPercent: 20,
      ease: "none",
    });

  }, { scope: containerRef, dependencies: [shouldAnimate] });

  if (!shouldAnimate) return null;

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#f4f4f0]"
    >
      {/* LAYER 1: Skylight Glows */}
      <div className="absolute inset-0 opacity-40 mix-blend-multiply">
        <div className="glow-blob-1 absolute top-[10%] left-[20%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#fce762] rounded-full blur-[100px] opacity-30"></div>
        <div className="glow-blob-2 absolute top-[40%] right-[10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#ff3366] rounded-full blur-[120px] opacity-20"></div>
        <div className="glow-blob-3 absolute bottom-[10%] left-[30%] w-[45vw] h-[45vw] max-w-[550px] max-h-[550px] bg-[#0055ff] rounded-full blur-[110px] opacity-20"></div>
      </div>

      {/* LAYER 2: Storefront Strips */}
      {/* We use width > 100vw so they can scrub horizontally without leaving empty space */}
      <div className="absolute inset-0 flex flex-col justify-around opacity-15">
        
        {/* Band 1 */}
        <div className="parallax-band-1 flex gap-8 w-[150vw] translate-x-12">
          <div className="h-48 w-64 border-[3px] border-black bg-white"></div>
          <div className="h-48 w-96 border-[3px] border-black bg-[#fce762]"></div>
          <div className="h-48 w-48 border-[3px] border-black bg-[#ff3366]"></div>
          <div className="h-48 w-72 border-[3px] border-black bg-white"></div>
          <div className="h-48 w-80 border-[3px] border-black bg-[#0055ff]"></div>
          <div className="h-48 w-64 border-[3px] border-black bg-[#fce762]"></div>
        </div>

        {/* Band 2 */}
        <div className="parallax-band-2 flex gap-12 w-[150vw] -translate-x-[20vw] mt-24">
          <div className="h-32 w-80 border-[3px] border-black bg-[#ff3366]"></div>
          <div className="h-32 w-48 border-[3px] border-black bg-white"></div>
          <div className="h-32 w-96 border-[3px] border-black bg-[#0055ff]"></div>
          <div className="h-32 w-64 border-[3px] border-black bg-[#fce762]"></div>
          <div className="h-32 w-72 border-[3px] border-black bg-white"></div>
          <div className="h-32 w-80 border-[3px] border-black bg-[#ff3366]"></div>
        </div>

      </div>
    </div>
  );
}
