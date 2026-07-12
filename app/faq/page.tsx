"use client";

import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How do your clothes fit?",
    answer: "Our garments feature a modern, slightly oversized streetwear fit. If you prefer a more tailored look, we recommend sizing down. Please check our Size Guide for exact measurements before ordering."
  },
  {
    question: "When will my order ship?",
    answer: "All orders are processed within 1-2 business days. Once shipped, standard delivery within India takes 3-7 business days depending on your location."
  },
  {
    question: "Do you offer Cash on Delivery (COD)?",
    answer: "Currently, we only accept prepaid orders (UPI, Cards, Netbanking, Wallets) via our secure Razorpay gateway to ensure faster and safer contact-less deliveries. COD is not available."
  },
  {
    question: "Can I return or exchange my order?",
    answer: "Yes! We have a 7-day hassle-free return and exchange policy for unused items in their original packaging with tags attached. Sale items are final and cannot be returned."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is dispatched, you will receive a tracking link via email and SMS. You can also track the status in your account under 'Order History'."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI (Google Pay, PhonePe, Paytm), Netbanking, and popular digital wallets."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 font-bold uppercase hover:underline mb-8">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4">
            FAQ
          </h1>
          <p className="mt-6 text-xl font-bold max-w-2xl">
            Everything you need to know about shopping with SYUTA.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={index} className="border-[4px] border-black bg-white shadow-[4px_4px_0px_0px_#fce762] transition-all">
                <button 
                  className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <h3 className="font-black text-xl uppercase pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {isOpen ? <ChevronUp size={24} strokeWidth={3} /> : <ChevronDown size={24} strokeWidth={3} />}
                  </div>
                </button>
                {isOpen && (
                  <div className="p-6 pt-0 font-bold text-lg border-t-[4px] border-black bg-[#f4f4f0]">
                    <p className="mt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
