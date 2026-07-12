"use client";

import { ReactLenis } from 'lenis/react';
import CustomCursor from './CustomCursor';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root>
      <CustomCursor />
      {children}
    </ReactLenis>
  );
}
