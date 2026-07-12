import Link from "next/link";
import PatternArt from "./PatternArt";

export default function ShopByCategory() {
  const categories = [
    { name: "Hoodies & Sweats", slug: "sweats", color: "bg-[#33ccff]", patternType: "none", garmentType: "hoodie" },
    { name: "Accessories", slug: "accessories", color: "bg-[#fce762]", patternType: "none", garmentType: "tote" },
    { name: "New Drops", slug: "new", href: "/products", color: "bg-[#ff3366]", patternType: "none", garmentType: "tee" }
  ];

  return (
    <section className="mb-24 gs-reveal">
      <div className="flex justify-between items-end mb-10 border-b-[4px] border-black pb-4">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Shop by Category</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {categories.map((cat, i) => (
          <Link key={i} href={cat.href || `/categories/${cat.slug}`} data-cursor-text="EXPLORE" className={`gs-item group block neo-box p-0 overflow-hidden relative min-h-[300px]`}>
            <div className="absolute inset-0 z-0 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500">
               <PatternArt patternType={cat.patternType} garmentType={cat.garmentType} />
            </div>
            <div className={`absolute inset-0 ${cat.color} mix-blend-multiply opacity-80 group-hover:opacity-20 transition-opacity duration-500`}></div>
            <div className="absolute inset-0 p-8 flex items-end">
              <h3 className="text-4xl font-black uppercase text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] group-hover:-translate-y-2 transition-transform duration-300">
                {cat.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
