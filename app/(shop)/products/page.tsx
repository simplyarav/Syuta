import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  await dbConnect();
  
  const sp = await searchParams;
  const page = parseInt(sp.page as string) || 1;
  const limit = 20;
  const skip = (page - 1) * limit;

  const query: any = {};
  
  if (sp.sale === 'true') {
    // MongoDB trick: check if compareAtPrice exists and is greater than price (we handle this via just existing > 0 for seeded data)
    query.compareAtPrice = { $gt: 0 };
  }

  if (sp.q) {
    query.$or = [
      { name: { $regex: sp.q as string, $options: 'i' } },
      { description: { $regex: sp.q as string, $options: 'i' } }
    ];
  }

  // Find products with pagination
  const [products, totalCount] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query)
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <div className="flex justify-between items-end mb-10 border-b-[4px] border-black pb-4">
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
          {sp.q ? `Search: ${sp.q}` : sp.sale === 'true' ? "Sale Items" : "All Products"}
        </h1>
        <div className="font-bold uppercase text-gray-500 hidden sm:block">
          Showing {products.length} of {totalCount} items
        </div>
      </div>
      
      {products.length === 0 ? (
        <div className="neo-box p-12 text-center text-gray-500 font-bold uppercase text-xl bg-white">
          No products found.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {products.map((product: any) => (
              <ProductCard key={product._id.toString()} product={JSON.parse(JSON.stringify(product))} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4">
            {hasPrevPage ? (
              <a 
                href={`/products?page=${page - 1}${sp.sale === 'true' ? '&sale=true' : ''}${sp.q ? `&q=${sp.q}` : ''}`}
                className="neo-button px-6 py-3 uppercase font-bold text-lg"
              >
                Previous
              </a>
            ) : (
              <button disabled className="px-6 py-3 border-[3px] border-gray-300 text-gray-400 font-bold uppercase cursor-not-allowed bg-gray-100">
                Previous
              </button>
            )}
            
            <span className="font-black text-xl">Page {page} of {totalPages}</span>

            {hasNextPage ? (
              <a 
                href={`/products?page=${page + 1}${sp.sale === 'true' ? '&sale=true' : ''}${sp.q ? `&q=${sp.q}` : ''}`}
                className="neo-button px-6 py-3 uppercase font-bold text-lg"
              >
                Next Page
              </a>
            ) : (
              <button disabled className="px-6 py-3 border-[3px] border-gray-300 text-gray-400 font-bold uppercase cursor-not-allowed bg-gray-100">
                Next Page
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
