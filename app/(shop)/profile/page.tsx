import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="neo-box bg-[#33ccff] p-8 md:p-12">
      <h1 className="text-5xl font-black uppercase mb-8 tracking-tighter">My Profile</h1>
      
      <div className="bg-white border-[3px] border-black p-8 flex flex-col gap-8">
        <div>
          <p className="text-sm font-bold uppercase text-gray-500 mb-2">Name</p>
          <p className="text-3xl font-black uppercase leading-none">{session?.user?.name || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-gray-500 mb-2">Email Address</p>
          <p className="text-xl font-medium">{session?.user?.email || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-gray-500 mb-3">Account Role</p>
          <p className="inline-block px-4 py-2 bg-[#fce762] border-[3px] border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            {(session?.user as any)?.role || "User"}
          </p>
        </div>
      </div>
    </div>
  );
}
