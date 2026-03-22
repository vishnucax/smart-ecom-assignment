require('dotenv').config();
const express = require('express');

const app = express();
app.use(express.json());

// Routes
const inventoryRoutes = require('./src/routes/inventory');
const cartRoutes = require('./src/routes/cart');
const paymentRoutes = require('./src/routes/payment');
const startConsumer = require('./src/consumers/inventoryConsumer');

// RabbitMQ
const { connectRabbitMQ } = require('./src/config/rabbitmq');

// Use routes
app.use('/inventory', inventoryRoutes);
app.use('/cart', cartRoutes);
app.use('/payment', paymentRoutes);

// Connect RabbitMQ
connectRabbitMQ().then(() => {
    startConsumer();
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});