const express = require('express');
const router = express.Router();
const db = require('../config/db');
const applyDiscount = require('../services/discount');
const { getChannel } = require('../config/rabbitmq');

// ✅ PROCESS PAYMENT
router.post('/process', async (req, res) => {
    const { cart_id, discountCode } = req.body;

    // Get cart total
    const [cart] = await db.execute(
        'SELECT SUM(total_price) as total FROM cart WHERE id = ?',
        [cart_id]
    );

    if (!cart[0].total) {
        return res.status(400).json({ message: 'Cart not found' });
    }

    let total = cart[0].total;

    // Apply discount
    const discount = applyDiscount(discountCode, total);

    const finalAmount = discount.finalAmount;

    // Insert payment
    const [result] = await db.execute(
        'INSERT INTO payments (order_id, amount, discount_applied, status) VALUES (?, ?, ?, ?)',
        [cart_id, finalAmount, discount.discountAmount > 0, 'success']
    );

    // Publish event to RabbitMQ
    const channel = getChannel();
    channel.sendToQueue(
        'payment_processed',
        Buffer.from(JSON.stringify({
            cart_id,
            payment_id: result.insertId,
            amount: finalAmount
        }))
    );

    res.json({
        payment_id: result.insertId,
        finalAmount,
        discount: discount.discountAmount
    });
});

module.exports = router;