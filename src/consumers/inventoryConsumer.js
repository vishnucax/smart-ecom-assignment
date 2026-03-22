const db = require('../config/db');
const { getChannel } = require('../config/rabbitmq');

async function startConsumer() {
    const channel = getChannel();

    channel.consume('payment_processed', async (msg) => {
        const data = JSON.parse(msg.content.toString());

        console.log('Received payment event:', data);

        const cart_id = data.cart_id;

        // Get cart items
        const [items] = await db.execute(
            'SELECT product_id, quantity FROM cart WHERE id = ?',
            [cart_id]
        );

        // Update inventory
        for (let item of items) {
            await db.execute(
                'UPDATE inventory SET quantity = quantity - ? WHERE id = ?',
                [item.quantity, item.product_id]
            );
        }

        console.log('Inventory updated');

        channel.ack(msg);
    });
}

module.exports = startConsumer;