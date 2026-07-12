"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SizeGuideClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tapeMarkerRef = useRef<HTMLDivElement>(null);
  const shootLineRef = useRef<HTMLDivElement>(null);
  
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setShouldAnimate(false);
    }
    if (window.innerWidth < 1024) {
      setShouldAnimate(false);
    }
  }, []);

  useGSAP(() => {
    if (!shouldAnimate) return;

    // Task 2: Sync the marker down the tape based on page scroll
    // We scrub the marker's Y position from 0 to viewport height
    gsap.to(tapeMarkerRef.current, {
      y: () => window.innerHeight - 100, // Move down most of the screen
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
      }
    });

    // Task 3: Row-highlight tie-in
    // Grab all rows from the tables
    const rows = gsap.utils.toArray(".size-row") as HTMLElement[];
    
    rows.forEach((row) => {
      ScrollTrigger.create({
        trigger: row,
        start: "top center", 
        onEnter: () => shootHighlightLine(row),
        onEnterBack: () => shootHighlightLine(row)
      });
    });

    function shootHighlightLine(row: HTMLElement) {
      // Get vertical center of the row relative to viewport
      const rowRect = row.getBoundingClientRect();
      const markerRect = tapeMarkerRef.current?.getBoundingClientRect();
      
      if (!shootLineRef.current || !markerRect) return;

      // Ensure line originates from the marker's current Y position
      gsap.set(shootLineRef.current, {
        top: markerRect.top + markerRect.height / 2,
        left: markerRect.right,
        width: 0,
        opacity: 1
      });

      gsap.to(shootLineRef.current, {
        width: rowRect.left - markerRect.right, // stretch across to the table
        duration: 0.2,
        ease: "power2.out",
        onComplete: () => {
          gsap.to(shootLineRef.current, { opacity: 0, duration: 0.2, delay: 0.1 });
        }
      });
    }

  }, { scope: containerRef, dependencies: [shouldAnimate] });

  // Generate repeating tick marks for the tape
  const renderTapeMarks = () => {
    const marks = [];
    for (let i = 0; i <= 40; i++) {
      marks.push(
        <div key={i} className="flex items-center relative h-12 w-full">
          <div className="w-6 h-[2px] bg-black opacity-30"></div>
          <span className="absolute left-8 font-black text-xs text-black opacity-40">{i}</span>
          
          {/* Minor ticks */}
          <div className="absolute top-3 left-0 w-3 h-[1px] bg-black opacity-20"></div>
          <div className="absolute top-6 left-0 w-4 h-[1.5px] bg-black opacity-20"></div>
          <div className="absolute top-9 left-0 w-3 h-[1px] bg-black opacity-20"></div>
        </div>
      );
    }
    return marks;
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f4f4f0] text-black relative">
      
      {/* Task 1: Vertical Tape Strip */}
      <div className="hidden lg:block fixed top-0 left-0 w-16 h-full border-r-[3px] border-black/20 z-0 pointer-events-none bg-[#f4f4f0]/50 backdrop-blur-sm">
        <div className="absolute inset-0 overflow-hidden">
          {renderTapeMarks()}
        </div>
        
        {/* Task 2: Tape Marker */}
        {shouldAnimate && (
          <div 
            ref={tapeMarkerRef}
            className="absolute left-0 top-0 w-full h-4 bg-[#ff3366] border-y-[2px] border-black shadow-[0_2px_0_0_#000] z-10"
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[8px] border-r-black"></div>
          </div>
        )}
      </div>

      {/* Task 3: Shooting Line */}
      {shouldAnimate && (
        <div 
          ref={shootLineRef}
          className="fixed h-[2px] bg-[#ff3366] opacity-0 z-10 pointer-events-none"
          style={{ transformOrigin: "left center" }}
        ></div>
      )}

      {/* Page Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl relative z-10 lg:pl-32">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 font-bold uppercase hover:underline mb-8">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4">
            Size Guide
          </h1>
          <p className="mt-6 text-xl font-bold max-w-2xl">
            Our garments feature a modern, slightly oversized streetwear fit. If you prefer a more tailored look, we recommend sizing down. All measurements are in inches unless specified otherwise.
          </p>
        </div>

        {/* Tops Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-black uppercase mb-6 bg-black text-white p-4 inline-block border-[3px] border-black shadow-[4px_4px_0px_0px_#fce762]">
            Tops (Tees & Hoodies)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-[4px] border-black bg-white">
              <thead>
                <tr className="bg-black text-white uppercase text-lg">
                  <th className="border-[3px] border-black p-4 text-left font-black">Size</th>
                  <th className="border-[3px] border-black p-4 text-left font-black">Chest (in)</th>
                  <th className="border-[3px] border-black p-4 text-left font-black">Length (in)</th>
                  <th className="border-[3px] border-black p-4 text-left font-black">Sleeve (in)</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg">
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#fce762]">XS</td>
                  <td className="border-[3px] border-black p-4">38 - 40</td>
                  <td className="border-[3px] border-black p-4">26.5</td>
                  <td className="border-[3px] border-black p-4">32</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#fce762]">S</td>
                  <td className="border-[3px] border-black p-4">40 - 42</td>
                  <td className="border-[3px] border-black p-4">27.5</td>
                  <td className="border-[3px] border-black p-4">33</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#fce762]">M</td>
                  <td className="border-[3px] border-black p-4">42 - 44</td>
                  <td className="border-[3px] border-black p-4">28.5</td>
                  <td className="border-[3px] border-black p-4">34</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#fce762]">L</td>
                  <td className="border-[3px] border-black p-4">44 - 46</td>
                  <td className="border-[3px] border-black p-4">29.5</td>
                  <td className="border-[3px] border-black p-4">35</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#fce762]">XL</td>
                  <td className="border-[3px] border-black p-4">46 - 48</td>
                  <td className="border-[3px] border-black p-4">30.5</td>
                  <td className="border-[3px] border-black p-4">36</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#fce762]">XXL</td>
                  <td className="border-[3px] border-black p-4">48 - 50</td>
                  <td className="border-[3px] border-black p-4">31.5</td>
                  <td className="border-[3px] border-black p-4">37</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bottoms Section */}
        <section>
          <h2 className="text-3xl font-black uppercase mb-6 bg-black text-white p-4 inline-block border-[3px] border-black shadow-[4px_4px_0px_0px_#ff3366]">
            Bottoms (Joggers & Pants)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-[4px] border-black bg-white">
              <thead>
                <tr className="bg-black text-white uppercase text-lg">
                  <th className="border-[3px] border-black p-4 text-left font-black">Size</th>
                  <th className="border-[3px] border-black p-4 text-left font-black">Waist (in)</th>
                  <th className="border-[3px] border-black p-4 text-left font-black">Inseam (in)</th>
                  <th className="border-[3px] border-black p-4 text-left font-black">Outseam (in)</th>
                </tr>
              </thead>
              <tbody className="font-bold text-lg">
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#0055ff] text-white">XS</td>
                  <td className="border-[3px] border-black p-4">28 - 29</td>
                  <td className="border-[3px] border-black p-4">28</td>
                  <td className="border-[3px] border-black p-4">38</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#0055ff] text-white">S</td>
                  <td className="border-[3px] border-black p-4">30 - 31</td>
                  <td className="border-[3px] border-black p-4">29</td>
                  <td className="border-[3px] border-black p-4">39</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#0055ff] text-white">M</td>
                  <td className="border-[3px] border-black p-4">32 - 33</td>
                  <td className="border-[3px] border-black p-4">30</td>
                  <td className="border-[3px] border-black p-4">40</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#0055ff] text-white">L</td>
                  <td className="border-[3px] border-black p-4">34 - 35</td>
                  <td className="border-[3px] border-black p-4">31</td>
                  <td className="border-[3px] border-black p-4">41</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#0055ff] text-white">XL</td>
                  <td className="border-[3px] border-black p-4">36 - 38</td>
                  <td className="border-[3px] border-black p-4">32</td>
                  <td className="border-[3px] border-black p-4">42</td>
                </tr>
                <tr className="hover:bg-gray-100 transition-colors size-row">
                  <td className="border-[3px] border-black p-4 font-black text-center bg-[#0055ff] text-white">XXL</td>
                  <td className="border-[3px] border-black p-4">39 - 41</td>
                  <td className="border-[3px] border-black p-4">32.5</td>
                  <td className="border-[3px] border-black p-4">43</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}
