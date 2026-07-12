"use client";

import Link from 'next/link';
import { ShoppingCart, Search, User, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { items, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#f4f4f0] border-b-[3px] border-black">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="/" className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
            SYUTA.
          </Link>
          <nav className="hidden md:flex gap-8 font-bold uppercase text-sm tracking-wide">
            <Link href="/products" className="hover:underline underline-offset-4 decoration-[3px]">New Drops</Link>
            <Link href="/categories/sweats" className="hover:underline underline-offset-4 decoration-[3px]">Hoodies & Sweats</Link>
            <Link href="/categories/accessories" className="hover:underline underline-offset-4 decoration-[3px]">Accessories</Link>
          </nav>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setSearchOpen(!searchOpen)}
            className="p-2 border-2 border-transparent hover:border-black transition-colors rounded-none hidden sm:block relative z-50"
          >
            {searchOpen ? <X size={24} strokeWidth={2.5} /> : <Search size={24} strokeWidth={2.5} />}
          </button>
          <Link href="/profile" className="p-2 border-2 border-transparent hover:border-black transition-colors rounded-none">
            <User size={24} strokeWidth={2.5} />
          </Link>
          <button 
            onClick={() => setIsOpen(true)}
            className="p-2 md:px-4 flex items-center gap-2 md:gap-3 relative bg-[#fce762] text-black border-[3px] border-black hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <ShoppingCart size={20} strokeWidth={2.5} />
            <span className="font-bold text-sm hidden md:inline">CART</span>
            {mounted && itemCount > 0 && (
              <span className="absolute -top-3 -right-3 bg-[#ff3366] text-white border-[3px] border-black w-7 h-7 flex items-center justify-center text-xs font-black">
                {itemCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden p-2 border-[3px] border-black bg-white hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
      
      {/* Search Overlay */}
      {searchOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#fce762] border-b-[4px] border-black p-6 md:p-12 z-40 shadow-2xl flex justify-center animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl relative flex">
            <input
              type="text"
              autoFocus
              placeholder="SEARCH FOR STREETWEAR..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-3xl md:text-5xl font-black uppercase tracking-tighter bg-transparent border-b-[4px] border-black p-4 placeholder-black/30 focus:outline-none"
            />
            <button type="submit" className="absolute right-0 bottom-4 p-2 hover:bg-black hover:text-white transition-colors border-[3px] border-transparent hover:border-black">
              <Search size={32} strokeWidth={3} />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#f4f4f0] border-b-[3px] border-black flex flex-col p-6 z-40 md:hidden shadow-xl gap-4">
          <form onSubmit={(e) => { handleSearchSubmit(e); setMobileMenuOpen(false); }} className="w-full mb-4 relative flex">
             <input
                type="text"
                placeholder="SEARCH..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-[3px] border-black p-3 font-bold uppercase focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
             />
             <button type="submit" className="absolute right-0 top-0 bottom-0 p-3 hover:bg-black hover:text-white transition-colors border-l-[3px] border-transparent hover:border-black">
               <Search size={24} strokeWidth={3} />
             </button>
          </form>
          <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="py-4 font-black uppercase text-3xl border-b-[3px] border-black hover:pl-4 transition-all hover:bg-black hover:text-white">New Drops</Link>
          <Link href="/categories/sweats" onClick={() => setMobileMenuOpen(false)} className="py-4 font-black uppercase text-3xl border-b-[3px] border-black hover:pl-4 transition-all hover:bg-black hover:text-white">Hoodies & Sweats</Link>
          <Link href="/categories/accessories" onClick={() => setMobileMenuOpen(false)} className="py-4 font-black uppercase text-3xl border-b-[3px] border-black hover:pl-4 transition-all hover:bg-black hover:text-white">Accessories</Link>
          <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="py-4 font-black uppercase text-3xl text-[#ff3366] hover:pl-4 transition-all hover:bg-black hover:text-[#ff3366]">Account / Login</Link>
        </div>
      )}
    </header>
  );
}
