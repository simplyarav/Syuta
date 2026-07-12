import ProductCard from "@/components/ProductCard";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

async function getCategoryAndProducts(slug: string, page: number, limit: number) {
  await dbConnect();
  const category = await Category.findOne({ slug }).lean();
  if (!category) return null;
  
  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    Product.find({ category: category._id }).skip(skip).limit(limit).lean(),
    Product.countDocuments({ category: category._id })
  ]);

  return { 
    category: JSON.parse(JSON.stringify(category)), 
    products: JSON.parse(JSON.stringify(products)),
    totalCount
  };
}

export default async function CategoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = parseInt(sp.page as string) || 1;
  const limit = 20;

  const data = await getCategoryAndProducts(slug, page, limit);
  
  if (!data) notFound();

  const totalPages = Math.ceil(data.totalCount / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-10 border-b-[4px] border-black pb-4">
        <h1 className="text-5xl font-black uppercase">{data.category.name}</h1>
        <div className="font-bold uppercase text-gray-500 hidden sm:block">
          Showing {data.products.length} of {data.totalCount} items
        </div>
      </div>
      
      {data.products.length === 0 ? (
         <div className="neo-box p-12 text-center text-gray-500 font-bold uppercase text-xl">
            No products found in this category.
          </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {data.products.map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4">
            {hasPrevPage ? (
              <a 
                href={`/categories/${slug}?page=${page - 1}`}
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
                href={`/categories/${slug}?page=${page + 1}`}
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
