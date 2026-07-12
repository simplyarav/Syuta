import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category"; // Required for .populate('category')
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import { formatPrice } from "@/lib/utils";
import PatternArt from "@/components/PatternArt";

async function getProduct(slug: string) {
  await dbConnect();
  const product = await Product.findOne({ slug }).populate('category').lean();
  if (!product) return null;
  return JSON.parse(JSON.stringify(product));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="neo-box aspect-square bg-white flex items-center justify-center p-12 overflow-hidden relative group">
          {product.images && product.images.length > 0 ? (
             <img 
               src={product.images[0]} 
               alt={product.name}
               className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
             />
          ) : product.patternType ? (
             <PatternArt patternType={product.patternType} garmentType={product.garmentType} />
          ) : (
             <div className="w-full h-full bg-black opacity-10"></div>
          )}
        </div>
        
        <div className="flex flex-col justify-center">
          <p className="text-gray-500 font-bold uppercase mb-2 tracking-widest">{(product.category as any)?.name}</p>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 leading-none">{product.name}</h1>
          <p className="text-5xl font-black mb-8">{formatPrice(product.price)}</p>
          
          <p className="text-xl font-medium mb-12 leading-relaxed border-l-[4px] border-black pl-6 py-2 bg-white/50">
            {product.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6">
             <AddToCartButton product={{
               _id: product._id,
               name: product.name,
               price: product.price,
               image: product.images?.[0] || ""
             }} />
             <BuyNowButton product={{
               _id: product._id,
               name: product.name,
               price: product.price,
               image: product.images?.[0] || ""
             }} />
          </div>
        </div>
      </div>
    </div>
  );
}
