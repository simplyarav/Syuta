import BentoGrid from "@/components/BentoGrid";
import ProductCarousel from "@/components/ProductCarousel";
import BestSellers from "@/components/BestSellers";
import ShopByCategory from "@/components/ShopByCategory";
import BrandStrip from "@/components/BrandStrip";
import Newsletter from "@/components/Newsletter";
import Animations from "@/components/Animations";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

async function getFeaturedProducts() {
  try {
    await dbConnect();
    const products = await Product.find({ featured: true }).limit(8).lean();
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="container mx-auto px-4 py-12 flex-1 flex flex-col">
      <BentoGrid />
      <BestSellers />
      <ShopByCategory />
      
      <section className="mb-24 gs-reveal">
        <div className="flex justify-between items-end mb-10 border-b-[4px] border-black pb-4">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Featured Drops</h2>
        </div>
        
        <ProductCarousel products={featuredProducts} />
      </section>

      <BrandStrip />
      <Newsletter />
      
      <Animations />
    </div>
  );
}
