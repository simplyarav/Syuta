"use client";

import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
    alert("Thanks for subscribing!");
  };

  return (
    <section className="mb-24 gs-reveal">
      <div className="neo-box bg-[#33ccff] p-8 md:p-16 flex flex-col items-center justify-center text-center gs-item">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4">Join the Cult</h2>
        <p className="font-bold text-lg mb-8 max-w-md">
          Subscribe to our newsletter for exclusive drops, early access to sales, and behind-the-scenes content.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 w-full max-w-xl">
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ENTER YOUR EMAIL" 
            className="flex-1 border-[3px] border-black p-4 font-black uppercase bg-white focus:outline-none focus:ring-4 ring-black/20 transition-all placeholder:text-gray-400"
          />
          <button type="submit" className="neo-button bg-black text-white px-8 py-4 text-xl">
            SUBSCRIBE
          </button>
        </form>
      </div>
    </section>
  );
}
