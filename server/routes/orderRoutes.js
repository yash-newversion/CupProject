import express from 'express';
import { inMemory, recordActivity } from '../services/dataStore.js';
import { Order } from '../models/Order.js';
import { getIsConnected } from '../config/db.js';

const router = express.Router();

// Create new customer order
router.post('/', async (req, res) => {
  try {
    const { userId, customerName, customerEmail, items, totalAmount, deliveryAddress, pricing } = req.body;

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `C2E-${randomSuffix}`;
    const trackingId = `BD-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const newOrder = {
      _id: `ord-${Date.now()}`,
      orderId,
      userId: userId || 'usr-guest',
      customerName: customerName || 'Valued Connoisseur',
      customerEmail: customerEmail || 'guest@cup2eat.in',
      status: 'Baking in Atelier',
      statusCode: 'processing',
      trackingId,
      courier: 'BlueDart Express Air',
      estimatedDelivery: 'Saturday, 16 Nov • By 2:00 PM',
      totalAmount: totalAmount || 1897,
      itemsSummary: items?.map((i) => `${i.title} (${i.variant})`).join(' + ') || 'Artisanal Tasting Set',
      items: items || [],
      deliveryAddress: deliveryAddress || {
        recipient: customerName || 'Aarav Sharma',
        street: 'Villa 14, The Palms Sanctuary, 100 Ft Road',
        locality: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038'
      },
      pricing: pricing || {
        subtotal: totalAmount,
        discount: 0,
        shipping: 0,
        packaging: 0,
        total: totalAmount
      },
      steps: [
        {
          step: 1,
          label: '1. Order Placed & Secured',
          desc: 'Payment confirmed via Razorpay. Batch assigned to Atelier oven queue #08.',
          time: 'Just Now',
          status: 'completed'
        },
        {
          step: 2,
          label: '2. Recipe Formulated & Inspected',
          desc: 'Ancient oat grain blend measured and stone-milled to precise micron gauge.',
          time: 'Est. in 30 mins',
          status: 'completed'
        },
        {
          step: 3,
          label: '3. Fresh Baking & Cocoa Glaze',
          desc: 'Currently baking at 175°C. Hot vessels will receive tempered Belgian chocolate coating.',
          time: 'Active Now',
          status: 'active'
        },
        {
          step: 4,
          label: '4. Nitrogen Air-Seal & Courier Handover',
          desc: 'Individual nitrogen flush foil sealing for guaranteed 6-month shelf crunchiness.',
          time: 'Est. Tomorrow, 10:00 AM',
          status: 'pending'
        },
        {
          step: 5,
          label: '5. BlueDart Temperature-Monitored Transit',
          desc: 'Dispatched via climate-controlled air transit.',
          time: 'Est. 15 Nov',
          status: 'pending'
        },
        {
          step: 6,
          label: '6. Delivered & Ready to Savor',
          desc: 'Doorstep delivery with tasting instruction booklet.',
          time: 'Est. 16 Nov, By 2:00 PM',
          status: 'pending'
        }
      ],
      createdAt: new Date()
    };

    inMemory.orders.unshift(newOrder);

    // Update customer stats
    const customer = inMemory.users.find(
      (u) => u._id === userId || u.email.toLowerCase() === (customerEmail || '').toLowerCase()
    );
    if (customer && customer.stats) {
      const itemsCount = items?.reduce((sum, i) => sum + (i.quantity || 1), 0) || 1;
      customer.stats.cupsSaved += itemsCount * 6;
      customer.stats.co2OffsetKg = Number((customer.stats.co2OffsetKg + itemsCount * 0.4).toFixed(1));
      customer.stats.rewardPoints += Math.round((totalAmount || 1000) * 0.1);
    }

    if (getIsConnected()) {
      try {
        await Order.create(newOrder);
      } catch (err) {
        console.warn('Mongo save error for order:', err.message);
      }
    }

    // Record activity for Admin Panel!
    await recordActivity({
      userId: newOrder.userId,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      eventType: 'order_placed',
      description: `Customer ${newOrder.customerName} placed Order #${newOrder.orderId} (₹${newOrder.totalAmount.toLocaleString('en-IN')})`
    });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Error processing order' });
  }
});

// Get orders (filtered by email if query param passed)
router.get('/', (req, res) => {
  const { email } = req.query;
  if (email) {
    const filtered = inMemory.orders.filter(
      (o) => o.customerEmail?.toLowerCase() === email.toLowerCase()
    );
    return res.json(filtered);
  }
  res.json(inMemory.orders);
});

export default router;
