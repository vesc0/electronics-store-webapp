const { body, validationResult } = require('express-validator');
const Product = require('../models/ProductModel');

const validateOrder = async (req, res, next) => {
    try {
        // Validation and sanitization rules
        await Promise.all([
            body('name').trim().isLength({ min: 2, max: 30 }).withMessage('Name must be 2-30 characters long.').run(req),
            body('address').trim().isLength({ min: 2, max: 80 }).withMessage('Address must be 2-80 characters long.').run(req),
            body('phone').trim().matches(/^\+?[0-9]\d{1,14}$/).withMessage('Phone number must be valid.').run(req),
            body('email').isEmail().withMessage('Email must be valid.').normalizeEmail().run(req),
            body('items')
                .isArray({ min: 1 })
                .withMessage('Items should be an array with at least one product')
                .custom((items) => {
                    return items.every(
                        (item) =>
                            typeof item._id === 'string' &&
                            typeof item.quantity === 'number' &&
                            item.quantity > 0
                    );
                })
                .withMessage('Invalid items')
                .run(req),
        ]);

        // Check validation results
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Recalculate prices based on database values
        const { items } = req.body;
        const productIds = items.map((item) => item._id);
        const products = await Product.find({ _id: { $in: productIds } });

        if (products.length !== items.length) {
            return res.status(400).json({ message: 'Some products do not exist' });
        }

        // Calculate total amount and update items with server-side prices
        let totalAmount = 0;
        const updatedItems = items.map((item) => {
            const product = products.find((p) => p._id.toString() === item._id);
            if (!product) {
                throw new Error('Product not found');
            }
            const price = product.price;
            totalAmount += price * item.quantity;

            return {
                ...item,
                price, // Ensure server-side price is used
            };
        });

        // Add delivery fee if necessary
        if(totalAmount < 19) {
            totalAmount += 5;
        }

        // Update request body with recalculated data
        req.body.items = updatedItems;
        req.body.totalAmount = totalAmount;

        // Pass control to the next middleware
        next();
    } catch (error) {
        res.status(500).json({ message: 'Error validating or processing the order', error });
    }
};

module.exports = validateOrder;