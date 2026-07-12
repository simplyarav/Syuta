import Link from "next/link";
import { Ruler } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#f4f4f0] border-t-[4px] border-black pt-16 pb-8 mt-auto gs-reveal">
      <div className="container mx-auto px-4 gs-item">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-5xl font-black tracking-tighter uppercase inline-block mb-6">
              SYUTA.
            </Link>
            <p className="font-bold max-w-sm mb-6">
              Neo-brutalist commerce platform redefining how you shop for the things you care about.
            </p>
            <div className="flex gap-4 flex-wrap">
              <a href="https://github.com/simplyarav" target="_blank" rel="noopener noreferrer" className="neo-box bg-white p-3 px-6 font-black uppercase text-sm flex items-center gap-2 hover:-translate-y-1 transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg> GitHub
              </a>
              <a href="https://linkedin.com/in/kaushtubhpandey" target="_blank" rel="noopener noreferrer" className="neo-box bg-white p-3 px-6 font-black uppercase text-sm flex items-center gap-2 hover:-translate-y-1 transition-all">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg> LinkedIn
              </a>
              <Link href="/size-guide" className="neo-box bg-white p-3 px-6 font-black uppercase text-sm flex items-center gap-2 hover:-translate-y-1 transition-all">
                <Ruler size={18} /> Size Guide
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-black uppercase text-xl mb-6 border-b-[3px] border-black pb-2 inline-block">Shop</h4>
            <ul className="flex flex-col gap-4 font-bold">
              <li><Link href="/products" className="hover:underline underline-offset-4 decoration-[2px]">All Products</Link></li>
              <li><Link href="/categories/sweats" className="hover:underline underline-offset-4 decoration-[2px]">Hoodies & Sweats</Link></li>
              <li><Link href="/categories/accessories" className="hover:underline underline-offset-4 decoration-[2px]">Accessories</Link></li>
              <li><Link href="/products?sale=true" className="hover:underline underline-offset-4 decoration-[2px] text-[#ff3366]">Sale</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black uppercase text-xl mb-6 border-b-[3px] border-black pb-2 inline-block">Support</h4>
            <ul className="flex flex-col gap-4 font-bold">
              <li><Link href="/faq" className="hover:underline underline-offset-4 decoration-[2px]">FAQ</Link></li>
              <li><Link href="/shipping-returns" className="hover:underline underline-offset-4 decoration-[2px]">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:underline underline-offset-4 decoration-[2px]">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:underline underline-offset-4 decoration-[2px]">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-[3px] border-black pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-bold text-sm">© {new Date().getFullYear()} SYUTA. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap">
            <div className="w-16 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Visa">
               <svg viewBox="0 0 38 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-auto">
                 <path d="M14.44 0L9.42 11.52H6.07L4.76 2.5C4.6 1.93 4.46 1.63 3.99 1.37C3.01 0.81 1.45 0.42 0 0.22L0.09 0H14.44ZM27.05 7.82C27.05 4.8 22.84 4.64 22.86 3.32C22.87 2.92 23.27 2.48 24.13 2.37C24.56 2.31 25.49 2.27 27.11 3.01L27.69 0.42C26.83 0.14 25.54 -0.06 24.12 0.01C20.97 0.01 18.78 1.68 18.77 4.09C18.74 5.86 20.35 6.84 21.57 7.42C22.81 8.02 23.24 8.4 23.23 8.91C23.22 9.69 22.28 10.04 21.36 10.06C19.53 10.1 18.33 9.57 17.41 9.15L16.81 11.83C17.67 12.22 19.34 12.57 21.1 12.59C24.47 12.59 26.6 10.93 26.63 8.5C26.65 8.1 27.05 7.82 27.05 7.82ZM35.79 11.52H38.56L36.03 0H33.27C32.48 0 31.95 0.45 31.64 1.16L27.02 11.52H30.41L31.08 9.65H35.21L35.79 11.52ZM32.06 7.02L33.72 2.56L34.68 7.02H32.06ZM17.15 11.52L18.9 0H15.65L13.88 11.52H17.15Z" fill="#1434CB"/>
               </svg>
            </div>
            <div className="w-16 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="Mastercard">
              <svg viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-auto">
                <circle cx="8" cy="8" r="8" fill="#EB001B"/>
                <circle cx="16" cy="8" r="8" fill="#F79E1B"/>
              </svg>
            </div>
            <div className="w-16 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" title="RuPay">
               <span className="font-black text-orange-600 text-[14px] uppercase leading-none tracking-tight">RuPay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
