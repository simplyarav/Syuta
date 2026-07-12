require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Define schemas directly for standalone script execution
const categorySchema = new mongoose.Schema({
  name: String,
  slug: String,
  description: String,
});
const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

const priceHistorySchema = new mongoose.Schema({
  price: { type: Number, required: true },
  changedAt: { type: Date, default: Date.now }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: String,
  slug: { type: String, unique: true },
  description: String,
  price: Number,
  compareAtPrice: Number,
  priceHistory: [priceHistorySchema],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  patternType: String,
  garmentType: String,
  isPlaceholderArt: Boolean,
  stock: Number,
  featured: Boolean,
});
const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function fetchUnsplashImages(query) {
  if (!process.env.UNSPLASH_ACCESS_KEY) {
    console.warn('⚠️ UNSPLASH_ACCESS_KEY missing. Using empty images.');
    return [];
  }
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${process.env.UNSPLASH_ACCESS_KEY}&per_page=20&orientation=squarish`);
    const data = await res.json();
    return (data.results || []).map(r => r.urls.regular);
  } catch (error) {
    console.error(`Failed to fetch from Unsplash for query "${query}":`, error);
    return [];
  }
}

async function seed() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("Missing MONGODB_URI in .env.local");

    await mongoose.connect(mongoUri);
    
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Seed Categories
    const apparel = await Category.create({ name: 'Hoodies & Sweats', slug: 'sweats', description: 'Heavyweight essential sweats.' });
    const tees = await Category.create({ name: 'Tees & Tops', slug: 'tees', description: 'Essential cotton basics.' });
    const bottoms = await Category.create({ name: 'Bottoms', slug: 'bottoms', description: 'Utility and comfort.' });
    const accessories = await Category.create({ name: 'Accessories', slug: 'accessories', description: 'Everyday streetwear gear.' });

    const garments = [
      { type: 'hoodie', basePrice: 2000, variance: 500, category: apparel._id, query: 'hoodie flat lay streetwear' },
      { type: 'tee', basePrice: 750, variance: 150, category: tees._id, query: 't-shirt flat lay streetwear' },
      { type: 'bomber', basePrice: 3250, variance: 750, category: apparel._id, query: 'bomber jacket streetwear' },
      { type: 'joggers', basePrice: 1500, variance: 300, category: bottoms._id, query: 'joggers pants streetwear' },
      { type: 'cap', basePrice: 550, variance: 150, category: accessories._id, query: 'baseball cap streetwear' },
      { type: 'tote', basePrice: 750, variance: 250, category: accessories._id, query: 'tote bag flat lay streetwear' }
    ];

    const styles = ['Oversized Fleece', 'Relaxed Fit', 'Heavyweight Cotton', 'Vintage Washed', 'Ribbed', 'Essential', 'Utility Canvas'];
    const colors = ['Charcoal', 'Sand', 'Olive', 'Black', 'Heather Grey', 'Off-White', 'Navy'];

    console.log('Fetching placeholder images from Unsplash (optimised per garment type)...');
    
    // Cache images by garment type to avoid hitting rate limits
    const imageCache = {};
    for (const garment of garments) {
      console.log(`Fetching images for ${garment.type}...`);
      imageCache[garment.type] = await fetchUnsplashImages(garment.query);
      await sleep(1500); // 1.5s delay to safely respect 50 req/hr limits
    }

    const products = [];
    let slugCounter = 1;

    for (let i = 0; i < 100; i++) {
      // Pick random combinations
      const garment = garments[Math.floor(Math.random() * garments.length)];
      const style = styles[Math.floor(Math.random() * styles.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const name = `${style} ${garment.type.charAt(0).toUpperCase() + garment.type.slice(1)} — ${color}`;
      
      // Calculate realistic pricing
      const varianceAmount = Math.floor(Math.random() * (garment.variance * 2)) - garment.variance;
      let price = garment.basePrice + varianceAmount;
      
      let compareAtPrice = undefined;
      // ~20% on sale
      if (Math.random() < 0.20) {
         compareAtPrice = price + Math.floor(price * (Math.random() * 0.4 + 0.1)); // 10% to 50% higher
      }

      // Assign a placeholder image from the cache
      const cachedImages = imageCache[garment.type];
      const images = [];
      if (cachedImages && cachedImages.length > 0) {
        images.push(cachedImages[Math.floor(Math.random() * cachedImages.length)]);
      }

      // Generate a description
      const descAdjectives = ['heavyweight', 'premium', 'statement', 'comfortable', 'structured', 'durable'];
      const descAdj = descAdjectives[Math.floor(Math.random() * descAdjectives.length)];
      const description = `A ${descAdj} ${garment.type} featuring a ${style.toLowerCase()} finish in classic ${color}. *Note: Images are Unsplash placeholders.*`;

      products.push({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + slugCounter++,
        description,
        price,
        compareAtPrice,
        category: garment.category,
        garmentType: garment.type,
        patternType: 'none',
        isPlaceholderArt: true,
        stock: Math.floor(Math.random() * 100) + 10,
        featured: Math.random() < 0.15, // ~15% featured
        images
      });
    }

    await Product.insertMany(products);
    console.log(`Successfully generated and seeded ${products.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
