"use client";

import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate network delay
    setTimeout(() => {
      setStatus("success");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 font-bold uppercase hover:underline mb-8">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4">
            Contact Us
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <p className="text-xl font-bold mb-8">
              Got a question about an order, a sizing query, or just want to say what's up? Drop us a line. We're here to help.
            </p>
            
            <div className="space-y-8">
              <div className="neo-box p-6 bg-white">
                <h3 className="font-black uppercase text-xl mb-2 text-[#0055ff]">Email Support</h3>
                <p className="font-bold text-lg">support@syuta.com</p>
                <p className="text-sm font-bold text-gray-500 mt-2">Expect a reply within 24 hours.</p>
              </div>
              
              <div className="neo-box p-6 bg-white">
                <h3 className="font-black uppercase text-xl mb-2 text-[#ff3366]">Business Inquiries</h3>
                <p className="font-bold text-lg">collab@syuta.com</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            {status === "success" ? (
              <div className="neo-box p-12 text-center bg-[#fce762]">
                <h3 className="text-3xl font-black uppercase mb-4">Message Sent!</h3>
                <p className="font-bold text-lg">
                  Thanks for reaching out. Our team will get back to you shortly.
                </p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 neo-button px-6 py-3"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="neo-box p-8 bg-white flex flex-col gap-6">
                <div>
                  <label className="block font-black uppercase mb-2">Name</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-bold focus:outline-none focus:ring-4 ring-black/20 transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block font-black uppercase mb-2">Email Address</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-bold focus:outline-none focus:ring-4 ring-black/20 transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block font-black uppercase mb-2">Message</label>
                  <textarea 
                    required 
                    rows={5}
                    placeholder="How can we help you today?"
                    className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-bold focus:outline-none focus:ring-4 ring-black/20 transition-all resize-none" 
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="neo-button px-8 py-4 flex items-center justify-center gap-3 text-lg w-full mt-2"
                >
                  {status === "submitting" ? "Sending..." : (
                    <>Submit <Send size={20} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
