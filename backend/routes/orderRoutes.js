const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const authAdmin = require('../middlewares/authAdminMiddleware');
const validateOrder = require('../middlewares/validateOrderMiddleware');

router.post('/', validateOrder , async (req, res) => {
  try {
    const { items, name, address, phone, email, totalAmount } = req.body;

    const newOrder = new Order({
      items,
      name,
      address,
      phone,
      email,
      totalAmount,
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error placing order', error });
  }
});

// Protected routes with authAdmin
router.get('/', authAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order updated successfully', updatedOrder });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
});

module.exports = router;