"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="neo-box bg-[#fce762] p-8 md:p-12 w-full max-w-md">
        <h1 className="text-4xl font-black uppercase mb-8 text-center tracking-tighter">Join the Club</h1>
        
        {success ? (
          <div className="text-center">
            <div className="bg-[#4caf50] text-white p-6 font-bold text-lg mb-6 border-[3px] border-black">
              Account created successfully! Please check your email inbox to verify your account before logging in.
            </div>
            <Link href="/login" className="neo-button inline-block w-full py-4 text-xl">
              Go to Login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-[#ff3366] text-white p-3 font-bold uppercase text-sm mb-6 border-[3px] border-black">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-6">
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-[3px] border-black p-4 bg-white font-medium focus:outline-none focus:ring-4 ring-black/20 transition-all" 
                />
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-[3px] border-black p-4 bg-white font-medium focus:outline-none focus:ring-4 ring-black/20 transition-all" 
                />
              </div>
              <div>
                <label className="block font-bold mb-2 uppercase text-sm">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-[3px] border-black p-4 bg-white font-medium focus:outline-none focus:ring-4 ring-black/20 transition-all" 
                />
              </div>
              <button 
                type="submit" 
                disabled={loading}
                className="neo-button w-full py-4 text-xl mt-4 disabled:opacity-50"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-8 text-center font-bold text-sm">
              Already have an account? <Link href="/login" className="text-black hover:underline underline-offset-4 decoration-[2px]">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
