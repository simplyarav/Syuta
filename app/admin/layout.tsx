import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-2">
          <Link href="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
            Dashboard
          </Link>
          <Link href="/admin/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-200 rounded">
            Products
          </Link>
          <Link href="/" className="block px-4 py-2 text-blue-600 hover:bg-blue-100 rounded mt-8">
            Back to Store
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
