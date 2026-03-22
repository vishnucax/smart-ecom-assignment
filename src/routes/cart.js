const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ POST - Add item to cart
router.post('/', async (req, res) => {
    const { product_id, quantity } = req.body;

    // Get product price from inventory
    const [product] = await db.execute(
        'SELECT price FROM inventory WHERE id = ?',
        [product_id]
    );

    if (product.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
    }

    const price = product[0].price;
    const total_price = price * quantity;

    // Insert into cart
    await db.execute(
        'INSERT INTO cart (product_id, quantity, total_price) VALUES (?, ?, ?)',
        [product_id, quantity, total_price]
    );

    res.json({ message: 'Item added to cart', total_price });
});

// ✅ GET - View cart
router.get('/', async (req, res) => {
    const [rows] = await db.execute(
        `SELECT c.id, c.product_id, c.quantity, c.total_price, i.product_name 
     FROM cart c 
     JOIN inventory i ON c.product_id = i.id`
    );

    res.json(rows);
});

module.exports = router;