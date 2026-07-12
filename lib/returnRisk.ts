import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function calculateAndSaveReturnRisk(orderId: string) {
  try {
    await dbConnect();
    
    // Ensure Category model is loaded
    if (!Category) console.log('Category model not found'); 
    
    const order = await Order.findById(orderId).populate({
      path: 'items.product',
      populate: { path: 'category' }
    });
    
    // If order doesn't exist or risk is already calculated, skip
    if (!order || order.returnRisk?.score !== undefined) return;

    let score = 0;
    const factors: string[] = [];

    // Fetch past paid orders for this user
    const pastOrders = await Order.find({
      user: order.user,
      status: { $in: ['paid', 'shipped', 'refunded'] },
      _id: { $ne: order._id }
    }).populate({
      path: 'items.product',
      populate: { path: 'category' }
    });

    // Core factors for return risk:
    // 1. Lack of historical data (first-time buyers are statistically higher risk for returns).
    // 2. High financial value (>₹2000 items or >2x average order value) increases refund exposure.
    // 3. Purchasing size-sensitive items (apparel) without prior history in that category increases the likelihood of fit issues.

    if (pastOrders.length === 0) {
      score += 25;
      factors.push("First-time buyer (no prior paid orders)");
    }

    const hasHighValueItem = order.items.some((item: any) => item.price > 2000);
    if (hasHighValueItem) {
      score += 25;
      factors.push("Contains high-value item (>₹2000)");
    }

    const isApparel = (catName: string) => {
      if (!catName) return false;
      const lower = catName.toLowerCase();
      return lower.includes('apparel') || lower.includes('clothing') || lower.includes('t-shirt') || lower.includes('hoodie');
    };
    
    const orderHasApparel = order.items.some((item: any) => {
      const categoryName = item.product?.category?.name || '';
      return isApparel(categoryName) || (item.product?.garmentType && item.product.garmentType !== 'none');
    });

    if (orderHasApparel) {
      const pastApparelOrders = pastOrders.some(po => 
        po.items.some((item: any) => {
          const categoryName = item.product?.category?.name || '';
          return isApparel(categoryName) || (item.product?.garmentType && item.product.garmentType !== 'none');
        })
      );

      if (!pastApparelOrders) {
        score += 20;
        factors.push("Purchasing size-sensitive item with no prior category history");
      }
    }

    if (pastOrders.length > 0) {
      const avgPastValue = pastOrders.reduce((sum, o) => sum + o.totalAmount, 0) / pastOrders.length;
      if (order.totalAmount > avgPastValue * 2 && order.totalAmount > 500) {
        score += 15;
        factors.push(`Order value (₹${order.totalAmount}) is > 200% of historical avg (₹${Math.round(avgPastValue)})`);
      }
    }

    score = Math.min(score, 100);

    order.returnRisk = {
      score,
      factors,
      calculatedAt: new Date()
    };

    await order.save();
    console.log(`[Return Risk] Calculated score ${score} for order ${order._id}`);
  } catch (error) {
    console.error(`[Return Risk] Error calculating for order ${orderId}:`, error);
  }
}
