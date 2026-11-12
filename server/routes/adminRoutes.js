import express from 'express';
import { inMemory, recordActivity } from '../services/dataStore.js';
import { User } from '../models/User.js';
import { Order } from '../models/Order.js';
import { CustomerActivity } from '../models/CustomerActivity.js';
import { getIsConnected } from '../config/db.js';

const router = express.Router();

// Get Executive KPI stats
router.get('/stats', async (req, res) => {
  try {
    const customers = inMemory.users.filter((u) => u.role === 'customer');
    const onlineCount = customers.filter((u) => u.isOnline).length;
    const totalOrders = inMemory.orders.length;
    const totalRevenue = inMemory.orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    const activeBaking = inMemory.orders.filter((o) => o.statusCode === 'processing' || o.statusCode === 'baking').length;
    const totalCupsSaved = customers.reduce((sum, c) => sum + (c.stats?.cupsSaved || 0), 0);

    res.json({
      activeCustomersOnline: onlineCount,
      totalCustomers: customers.length,
      totalOrders,
      totalRevenue,
      activeBaking,
      totalCupsSaved,
      mongoConnected: getIsConnected()
    });
  } catch (err) {
    res.status(500).json({ message: 'Error calculating stats' });
  }
});

// Get all customers with online/offline status and order totals
router.get('/customers', async (req, res) => {
  try {
    const customers = inMemory.users
      .filter((u) => u.role === 'customer')
      .map((c) => {
        const userOrders = inMemory.orders.filter(
          (o) => o.userId === c._id || o.customerEmail?.toLowerCase() === c.email.toLowerCase()
        );
        const totalSpend = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        return {
          _id: c._id,
          name: c.name,
          email: c.email,
          phone: c.phone,
          avatar: c.avatar,
          tier: c.tier,
          memberSince: c.memberSince,
          isOnline: Boolean(c.isOnline),
          lastLogin: c.lastLogin,
          loginCount: c.loginCount || 1,
          lastIp: c.lastIp || '127.0.0.1',
          stats: c.stats,
          preferences: c.preferences,
          orderCount: userOrders.length,
          totalSpend
        };
      });

    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving customers' });
  }
});

// Get live activity feed (customer logins, registrations, orders)
router.get('/activities', async (req, res) => {
  try {
    res.json(inMemory.activities);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving activities' });
  }
});

// Get all orders across the atelier
router.get('/orders', async (req, res) => {
  try {
    res.json(inMemory.orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving orders' });
  }
});

// Update order status (Admin fulfillment control)
router.patch('/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, statusCode } = req.body;

    const order = inMemory.orders.find((o) => o.orderId === orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (statusCode) order.statusCode = statusCode;

    await recordActivity({
      userId: order.userId || 'admin',
      customerName: 'Atelier Admin',
      customerEmail: 'admin@cup2eat.in',
      eventType: 'profile_update',
      description: `Order #${orderId} status updated to "${order.status}"`
    });

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

export default router;
