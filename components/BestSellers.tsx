import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductCard from "./ProductCard";
import ProductCarousel from "./ProductCarousel";

export default async function BestSellers() {
  try {
    await dbConnect();
    // Fetch latest 8 products as "best sellers"
    const products = await Product.find({}).sort({ _id: -1 }).limit(8).lean();
    
    // Convert to plain objects to avoid serialization issues
    const plainProducts = JSON.parse(JSON.stringify(products));

    return (
      <section className="mb-24 gs-reveal">
        <div className="flex justify-between items-end mb-10 border-b-[4px] border-black pb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Best Sellers</h2>
        </div>
        
        <ProductCarousel products={plainProducts} />
      </section>
    );
  } catch (e) {
    return null;
  }
}
