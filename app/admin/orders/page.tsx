import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== 'admin') {
    redirect('/auth/signin');
  }

  await dbConnect();
  
  const sp = await searchParams;
  
  let sortOption: any = { createdAt: -1 };
  if (sp?.sort === 'risk') {
    sortOption = { 'returnRisk.score': -1, createdAt: -1 };
  }

  const orders = await Order.find().populate('user', 'name email').sort(sortOption).lean();

  return (
    <div className="p-8 max-w-7xl mx-auto font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter border-b-4 border-black inline-block">
          Orders Management
        </h1>
        <a 
          href={sp?.sort === 'risk' ? '?sort=date' : '?sort=risk'}
          className="px-4 py-2 border-2 border-black font-bold uppercase transition-transform hover:-translate-y-1 hover:translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-yellow-300 text-black"
        >
          {sp?.sort === 'risk' ? 'Sort by Newest' : 'Sort by High Risk'}
        </a>
      </div>

      <div className="border-4 border-black overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-max">
          <thead>
            <tr className="bg-black text-white uppercase text-sm font-bold tracking-wider">
              <th className="p-4 border-r-2 border-black">Order ID</th>
              <th className="p-4 border-r-2 border-black">Customer</th>
              <th className="p-4 border-r-2 border-black">Total</th>
              <th className="p-4 border-r-2 border-black">Status</th>
              <th className="p-4">Return Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black">
            {orders.map((order: any) => {
              const risk = order.returnRisk;
              let badgeColor = 'bg-gray-200';
              if (risk) {
                if (risk.score < 30) badgeColor = 'bg-green-400';
                else if (risk.score <= 60) badgeColor = 'bg-yellow-400';
                else badgeColor = 'bg-red-500';
              }

              return (
                <tr key={order._id.toString()} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-sm border-r-2 border-black">{order._id.toString().slice(-8)}</td>
                  <td className="p-4 font-bold border-r-2 border-black">
                    {order.user?.name || 'Unknown'}<br/>
                    <span className="text-xs text-gray-500 font-normal">{order.user?.email}</span>
                  </td>
                  <td className="p-4 font-bold border-r-2 border-black">₹{order.totalAmount}</td>
                  <td className="p-4 border-r-2 border-black">
                    <span className="px-2 py-1 uppercase text-xs font-bold border-2 border-black rounded-full bg-blue-100">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 relative group">
                    {risk ? (
                      <div className="inline-block relative">
                        <span className={`px-3 py-1 font-black border-2 border-black uppercase text-xs ${badgeColor} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-help`}>
                          Risk: {risk.score}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-10">
                          <p className="font-bold mb-1 border-b-2 border-black pb-1">Triggered Factors:</p>
                          {risk.factors.length > 0 ? (
                            <ul className="list-disc pl-4 text-xs font-medium space-y-1">
                              {risk.factors.map((f: string, i: number) => (
                                <li key={i}>{f}</li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-xs text-gray-500">None detected.</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Not scored</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-8 text-center font-bold text-gray-500">No orders found.</div>
        )}
      </div>
    </div>
  );
}
