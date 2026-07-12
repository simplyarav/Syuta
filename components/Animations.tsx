"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Animations() {
  useGSAP(() => {
    // Reveal sections globally based on class names
    const reveals = document.querySelectorAll(".gs-reveal");
    
    reveals.forEach((section) => {
      const items = section.querySelectorAll(".gs-item");
      if (items.length > 0) {
        gsap.fromTo(items, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            }
          }
        );
      } else {
        gsap.fromTo(section, 
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
            }
          }
        );
      }
    });
  });

  return null;
}
