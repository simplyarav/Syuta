import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/api/auth/signin?callbackUrl=/profile");
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-12">
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="neo-box bg-white p-6 sticky top-28">
            <h2 className="text-2xl font-black uppercase mb-6 border-b-[3px] border-black pb-2">Account</h2>
            <nav className="flex flex-col gap-4 font-bold uppercase text-sm tracking-wide">
              <Link href="/profile" className="hover:underline underline-offset-4 decoration-[3px]">
                My Profile
              </Link>
              <Link href="/profile/orders" className="hover:underline underline-offset-4 decoration-[3px]">
                Order History
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </aside>
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
