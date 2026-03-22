const express = require('express');
const router = express.Router();
const db = require('../config/db');

// ✅ POST - Add item
router.post('/', async (req, res) => {
    const { product_name, quantity, price, sku } = req.body;

    const [result] = await db.execute(
        'INSERT INTO inventory (product_name, quantity, price, sku) VALUES (?, ?, ?, ?)',
        [product_name, quantity, price, sku]
    );

    res.json({ id: result.insertId, message: 'Item added' });
});

// ✅ GET ALL
router.get('/', async (req, res) => {
    const [rows] = await db.execute('SELECT * FROM inventory');
    res.json(rows);
});

// ✅ GET ONE ITEM
router.get('/:id', async (req, res) => {
    const [rows] = await db.execute(
        'SELECT * FROM inventory WHERE id = ?',
        [req.params.id]
    );

    res.json(rows[0]);
});

// ✅ UPDATE QUANTITY
router.put('/:id', async (req, res) => {
    const { quantity } = req.body;

    await db.execute(
        'UPDATE inventory SET quantity = ? WHERE id = ?',
        [quantity, req.params.id]
    );

    res.json({ message: 'Inventory updated' });
});

module.exports = router;