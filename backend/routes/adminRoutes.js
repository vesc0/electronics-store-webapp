const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authAdmin = require('../middlewares/authAdminMiddleware');
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Compare provided email with stored value
  if (email !== process.env.ADMIN_EMAIL) return res.status(401).json({ message: 'Invalid email' });

  // Compare provided password hash with stored password hash. If it is a match, assign admin role and add jwt
  bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH, (err, isMatch) => {
    if (err || !isMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ email: process.env.ADMIN_EMAIL, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
   
    // Set the JWT token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
    });

    res.json({ message: 'Login successful' });
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  res.json({ message: 'Logged out successfully' });
});

router.get('/admin', authAdmin, (req, res) => {
  res.send('Welcome to the admin page!');
});

router.get('/analytics', authAdmin, async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.find();

    // Total sales (only for paid orders)
    const payedSales = orders
      .filter(order => order.paymentStatus === 'payed')
      .reduce((total, order) => total + order.totalAmount, 0);

    // Order count
    const orderCount = orders.length;

    // Sales in the last 7 days
    const today = new Date();
    const last7DaysSales = Array(7).fill(0);
    orders.forEach(order => {
      if (order.paymentStatus === 'payed') {
        const orderDate = new Date(order.date);
        const diffInDays = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays >= 0 && diffInDays < 7) {
          last7DaysSales[6 - diffInDays] += order.totalAmount;
        }
      }
    });

    // Order status counts
    const orderStatusData = orders.reduce((acc, order) => {
      acc[order.deliveryStatus] = (acc[order.deliveryStatus] || 0) + 1;
      return acc;
    }, { delivered: 0, canceled: 0, processing: 0 });

    // Payment status counts
    const paymentStatusData = orders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, { payed: 0, failed: 0, awaiting: 0 });

    // Most ordered items
    const itemQuantities = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        itemQuantities[item.name] = (itemQuantities[item.name] || 0) + item.quantity;
      });
    });

    const mostOrderedItems = Object.entries(itemQuantities)
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity);
    
    const topItems = mostOrderedItems.slice(0, 4);
    const otherQuantity = mostOrderedItems.slice(4).reduce((sum, item) => sum + item.quantity, 0);
    if (otherQuantity > 0) topItems.push({ name: 'Other', quantity: otherQuantity });

    // Product count
    const productCount = await Product.countDocuments();

    res.json({
      sales: payedSales,
      last7DaysSales,
      orderCount,
      productCount,
      mostOrderedItems: topItems,
      orderStatusData,
      paymentStatusData,
    });
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    res.status(500).json({ message: 'Error fetching analytics data' });
  }
});

module.exports = router;