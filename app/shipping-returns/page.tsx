import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Shipping & Returns | SYUTA",
  description: "Information on our shipping timelines and 7-day return policy.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f0] text-black">
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 font-bold uppercase hover:underline mb-8">
            <ArrowLeft size={20} /> Back to Shop
          </Link>
          <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter border-b-[4px] border-black pb-4">
            Shipping & Returns
          </h1>
        </div>

        <div className="space-y-12">
          {/* Shipping */}
          <section className="neo-box p-8 bg-white">
            <h2 className="text-3xl font-black uppercase mb-6 bg-black text-white p-3 inline-block shadow-[4px_4px_0px_0px_#0055ff]">
              Shipping Policy
            </h2>
            <div className="font-bold text-lg space-y-4">
              <p>
                We currently ship everywhere within India. Once your order is placed, our team works hard to pack and dispatch it within <strong>1-2 business days</strong>.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4 border-l-[4px] border-black pl-8 ml-2">
                <li><strong>Standard Delivery:</strong> 3-7 business days depending on your pin code.</li>
                <li><strong>Tracking:</strong> A tracking link will be provided via email/SMS the moment your package leaves our warehouse.</li>
                <li><strong>Shipping Costs:</strong> Shipping is calculated dynamically at checkout based on your location and cart weight. We often run free shipping promotions.</li>
              </ul>
              <p className="mt-4">
                <em>Please note: We do not offer Cash on Delivery (COD) at this time. All orders must be prepaid.</em>
              </p>
            </div>
          </section>

          {/* Returns */}
          <section className="neo-box p-8 bg-white">
            <h2 className="text-3xl font-black uppercase mb-6 bg-black text-white p-3 inline-block shadow-[4px_4px_0px_0px_#ff3366]">
              7-Day Returns & Exchanges
            </h2>
            <div className="font-bold text-lg space-y-4">
              <p>
                Not feeling the fit? No problem. We accept returns and size exchanges within <strong>7 days of delivery</strong>.
              </p>
              <div className="bg-[#fce762] border-[3px] border-black p-4 my-6 shadow-[4px_4px_0px_0px_#000]">
                <h3 className="font-black uppercase text-xl mb-2">Conditions for Return</h3>
                <ul className="list-disc pl-6">
                  <li>Items must be unworn, unwashed, and in their original condition.</li>
                  <li>Original tags and packaging must be intact.</li>
                  <li>Sale items or limited edition drops are final sale and non-returnable.</li>
                </ul>
              </div>
              <h3 className="font-black uppercase text-xl mt-6">How to initiate a return:</h3>
              <p>
                Please email us at <strong>support@syuta.com</strong> with your Order ID and reason for return. Our team will approve the request and arrange a reverse pickup within 24-48 hours. 
              </p>
              <p>
                <em>Note: A nominal reverse shipping fee of ₹100 is deducted from your refund amount. In case of size exchanges, the reverse pickup and new delivery are completely free.</em>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
