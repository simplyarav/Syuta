import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import CheckoutClient from "./CheckoutClient";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/checkout");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-5xl font-black uppercase mb-10 border-b-[4px] border-black pb-4">Checkout</h1>
      <CheckoutClient userEmail={session.user?.email || ""} userName={session.user?.name || ""} />
    </div>
  );
}
