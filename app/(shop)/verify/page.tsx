"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }

    fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Email verified successfully") {
          setStatus("success");
          setMessage("Email verified successfully! You can now log in.");
        } else {
          setStatus("error");
          setMessage(data.message || "Failed to verify email.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("An error occurred during verification.");
      });
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="neo-box bg-white p-8 md:p-12 w-full max-w-md text-center">
        <h1 className="text-3xl font-black uppercase mb-6 tracking-tighter border-b-[3px] border-black pb-4">
          Email Verification
        </h1>
        
        {status === "loading" && (
          <div className="animate-pulse font-bold text-lg">{message}</div>
        )}
        
        {status === "success" && (
          <div>
            <div className="bg-[#4caf50] text-white p-4 font-bold uppercase mb-6 border-[3px] border-black">
              {message}
            </div>
            <Link href="/login" className="neo-button inline-block px-8 py-3 w-full text-center">
              Proceed to Login
            </Link>
          </div>
        )}
        
        {status === "error" && (
          <div>
            <div className="bg-[#ff3366] text-white p-4 font-bold uppercase mb-6 border-[3px] border-black">
              {message}
            </div>
            <Link href="/" className="neo-button inline-block px-8 py-3 w-full text-center">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center font-bold text-xl uppercase">Loading...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
