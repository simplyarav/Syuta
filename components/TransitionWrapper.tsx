"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

// Next.js App Router frozen router workaround for exit animations
function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = React.useContext(LayoutRouterContext);
  const frozen = useRef(context).current;

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

import React from "react";

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <React.Fragment key={pathname}>
        {/* Left Mall Glass Door */}
        <motion.div
          className="fixed left-0 top-0 bottom-0 w-1/2 bg-[#f8fafc]/10 backdrop-blur-md border-[16px] border-r-[8px] border-[#cbd5e1] z-[9998] shadow-2xl pointer-events-none flex items-center justify-end overflow-hidden"
          initial={{ x: "0%" }} // Starts closed in the middle
          animate={{ x: "-100%" }} // Opens to the left
          exit={{ x: "0%" }} // Closes to the middle
          transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
        >
          {/* Brand Logo Decal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase text-black rotate-[-90deg] md:rotate-0 translate-x-[25%] md:translate-x-0">SYUTA.</span>
          </div>
          {/* Safety frosted stripe across the middle */}
          <div className="absolute top-[55%] left-0 right-0 h-4 bg-white/20 backdrop-blur-xl"></div>
          {/* Vertical metal door handle */}
          <div className="w-5 h-96 bg-gradient-to-b from-[#f1f5f9] via-[#94a3b8] to-[#f1f5f9] rounded-sm mr-4 md:mr-8 shadow-md border border-[#64748b] z-10 flex items-center justify-center">
            <div className="w-1 h-80 bg-white/30 rounded-full"></div>
          </div>
        </motion.div>
        
        {/* Right Mall Glass Door */}
        <motion.div
          className="fixed right-0 top-0 bottom-0 w-1/2 bg-[#f8fafc]/10 backdrop-blur-md border-[16px] border-l-[8px] border-[#cbd5e1] z-[9998] shadow-[-20px_0_40px_rgba(0,0,0,0.1)] pointer-events-none flex items-center justify-start overflow-hidden"
          initial={{ x: "0%" }} // Starts closed in the middle
          animate={{ x: "100%" }} // Opens to the right
          exit={{ x: "0%" }} // Closes to the middle
          transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
        >
          {/* Brand Logo Decal */}
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <span className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase text-black rotate-[-90deg] md:rotate-0 -translate-x-[25%] md:translate-x-0">SYUTA.</span>
          </div>
          {/* Safety frosted stripe across the middle */}
          <div className="absolute top-[55%] left-0 right-0 h-4 bg-white/20 backdrop-blur-xl"></div>
          {/* Vertical metal door handle */}
          <div className="w-5 h-96 bg-gradient-to-b from-[#f1f5f9] via-[#94a3b8] to-[#f1f5f9] rounded-sm ml-4 md:ml-8 shadow-md border border-[#64748b] z-10 flex items-center justify-center">
            <div className="w-1 h-80 bg-white/30 rounded-full"></div>
          </div>
        </motion.div>
        
        {/* Page content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6, ease: [0.45, 0, 0.55, 1], delay: 0.1 }}
          className="flex-1 flex flex-col w-full h-full"
        >
          <FrozenRouter>{children}</FrozenRouter>
        </motion.div>
      </React.Fragment>
    </AnimatePresence>
  );
}
