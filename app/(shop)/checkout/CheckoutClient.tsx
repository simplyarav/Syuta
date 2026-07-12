"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { formatPrice } from "@/lib/utils";

export default function CheckoutClient({ userEmail, userName }: { userEmail: string, userName: string }) {
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Fallback in case the script is already loaded from a previous navigation
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      setIsRazorpayLoaded(true);
    }
  }, []);

  const [fullName, setFullName] = useState(userName);
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const router = useRouter();

  if (items.length === 0) {
    return (
      <div className="neo-box p-12 text-center bg-white">
        <h2 className="text-2xl font-bold uppercase mb-4">Your cart is empty</h2>
        <button onClick={() => router.push('/')} className="neo-button px-8 py-3">Return to Shop</button>
      </div>
    );
  }

  const handlePincodeChange = async (val: string) => {
    setPincode(val);
    setPincodeError("");
    
    if (/^\d{6}$/.test(val)) {
      setIsFetchingPincode(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val}`);
        const data = await res.json();
        
        if (data && data[0] && data[0].Status === "Success") {
          const postOffice = data[0].PostOffice[0];
          setCity(postOffice.District || postOffice.Region || postOffice.Block || "");
          setState(postOffice.State || "");
        } else {
          setPincodeError("Pincode not found");
        }
      } catch (err) {
        setPincodeError("Failed to verify pincode");
      } finally {
        setIsFetchingPincode(false);
      }
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        setLoading(false);
        return;
      }
      if (!/^\d{6}$/.test(pincode)) {
        alert("Please enter a valid 6-digit pincode.");
        setLoading(false);
        return;
      }
      if (!fullName.trim() || !line1.trim() || !city.trim() || !state.trim()) {
        alert("Please fill in all required address fields.");
        setLoading(false);
        return;
      }

      if (typeof window === "undefined" || !(window as any).Razorpay) {
        alert("Payment gateway is securely loading. Please try again in a few seconds.");
        setLoading(false);
        return;
      }
      
      const shippingAddress = { fullName, phone, line1, line2, city, state, pincode };

      // 1. Create order on backend
      const res = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, shippingAddress }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      // 2. Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "SYUTA.",
        description: "Test Transaction",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 3. Verify payment
          const verifyRes = await fetch('/api/checkout/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            alert("Payment successful! Order placed.");
            router.push('/');
          } else {
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: userName,
          email: userEmail,
        },
        theme: {
          color: "#000000",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error: any) {
      alert(`Checkout Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <Script 
        src="https://checkout.razorpay.com/v1/checkout.js" 
        strategy="afterInteractive"
        onLoad={() => setIsRazorpayLoaded(true)}
        onReady={() => setIsRazorpayLoaded(true)}
      />
      
      <div className="neo-box bg-white p-8 self-start">
        <h2 className="text-2xl font-black uppercase mb-6 border-b-[3px] border-black pb-2">Shipping Details</h2>
        <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-6">
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Full Name *</label>
            <input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20" />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Email Address</label>
            <input required type="email" defaultValue={userEmail} readOnly className="w-full border-[3px] border-black p-4 bg-gray-200 cursor-not-allowed font-medium text-gray-500" />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Phone Number *</label>
            <input required type="tel" maxLength={10} placeholder="10-digit mobile number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, ''))} className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20" />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Address Line 1 *</label>
            <input required type="text" placeholder="House no., flat, building" value={line1} onChange={e => setLine1(e.target.value)} className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20" />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm flex justify-between">
              <span>Address Line 2</span>
              <span className="text-gray-500 font-normal text-xs">Optional</span>
            </label>
            <input type="text" placeholder="Street, area, landmark" value={line2} onChange={e => setLine2(e.target.value)} className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold mb-2 uppercase text-sm flex justify-between">
                <span>Pincode *</span>
                {isFetchingPincode && <span className="text-gray-500 text-xs animate-pulse">Loading...</span>}
              </label>
              <input required type="text" maxLength={6} placeholder="6 digits" value={pincode} onChange={e => handlePincodeChange(e.target.value.replace(/\D/g, ''))} className={`w-full border-[3px] ${pincodeError ? 'border-[#ff3366]' : 'border-black'} p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20`} />
              {pincodeError && <p className="text-[#ff3366] text-xs font-bold mt-1 uppercase">{pincodeError}</p>}
            </div>
            <div>
              <label className="block font-bold mb-2 uppercase text-sm">City *</label>
              <input required type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20" />
            </div>
          </div>

          <div>
            <label className="block font-bold mb-2 uppercase text-sm">State *</label>
            <input required type="text" value={state} onChange={e => setState(e.target.value)} className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20" />
          </div>
        </form>
      </div>

      <div className="self-start">
        <div className="neo-box bg-[#fce762] p-8">
          <h2 className="text-2xl font-black uppercase mb-6 border-b-[3px] border-black pb-2">Order Summary</h2>
          <div className="flex flex-col gap-4 mb-8">
            {items.map(item => (
              <div key={item._id} className="flex justify-between items-center border-b-[3px] border-black pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white border-[3px] border-black flex items-center justify-center p-1">
                     {item.image ? (
                       <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                     ) : (
                       <div className="w-full h-full bg-black opacity-10"></div>
                     )}
                  </div>
                  <span className="font-bold">{item.quantity}x {item.name}</span>
                </div>
                <span className="font-black text-xl">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-3xl font-black border-t-[4px] border-black pt-6">
            <span>TOTAL</span>
            <span>{formatPrice(getTotal())}</span>
          </div>
          <button 
            type="submit" 
            form="checkout-form"
            disabled={loading}
            className="neo-button w-full mt-8 py-5 text-2xl disabled:opacity-50 transition-all"
          >
            {loading ? "Processing..." : "Pay Securely"}
          </button>
        </div>
      </div>
    </div>
  );
}
