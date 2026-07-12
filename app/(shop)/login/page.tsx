"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };



  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="neo-box bg-white p-8 md:p-12 w-full max-w-md">
        <h1 className="text-4xl font-black uppercase mb-8 text-center tracking-tighter">Welcome Back</h1>
        
        {error && (
          <div className="bg-[#ff3366] text-white p-3 font-bold uppercase text-sm mb-6 border-[3px] border-black">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20 transition-all" 
            />
          </div>
          <div>
            <label className="block font-bold mb-2 uppercase text-sm">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-[3px] border-black p-4 bg-[#f4f4f0] font-medium focus:outline-none focus:ring-4 ring-black/20 transition-all" 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="neo-button w-full py-4 text-xl mt-4 disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>


        <p className="mt-8 text-center font-bold text-sm">
          New here? <Link href="/register" className="text-[#ff3366] hover:underline underline-offset-4 decoration-[2px]">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
