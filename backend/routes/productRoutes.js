const express = require('express');
const Product = require('../models/ProductModel');
const router = express.Router();
const authAdmin = require('../middlewares/authAdminMiddleware');
const crypto = require("crypto");

// Protected route with authAdmin
router.get('/cloudinary-signature', authAdmin, (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const paramsToSign = {
      timestamp,
      upload_preset: 'product_images',
    };

    const signature = crypto
      .createHash('sha256')
      .update(
        Object.entries(paramsToSign)
          .sort()
          .map(([key, value]) => `${key}=${value}`)
          .join('&') + process.env.CLOUDINARY_API_SECRET
      )
      .digest('hex');

    res.json({ signature, timestamp });
  } catch (error) {
    console.error("Error generating signature:", error);
    res.status(500).json({ error: 'Failed to generate signature' });
  }
});

// Public routes
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch similar products' });
  }
});

// Protected routes with authAdmin
router.post('/', authAdmin, async (req, res) => {
  const { name, category, price, imageUrl } = req.body;
  try {
    const newProduct = new Product({ name, category, price, imageUrl });
    await newProduct.save();
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

router.put('/:id', authAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

router.delete('/:id', authAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
