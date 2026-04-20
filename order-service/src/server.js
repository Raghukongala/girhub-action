const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const axios = require('axios');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service:3004';

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb-service:27017/ecommerce')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: Number,
  status: { type: String, default: 'PENDING', enum: ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'] },
  shippingAddress: {
    name: String,
    address: String,
    city: String,
    pincode: String
  },
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'order-service' }));

app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, shippingAddress } = req.body;
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const order = await Order.create({ userId, items, totalAmount, shippingAddress });

    // Process payment
    const payment = await axios.post(`${PAYMENT_SERVICE_URL}/api/payments/process`, {
      orderId: order._id, amount: totalAmount, userId
    });

    order.status = 'PAID';
    order.paymentId = payment.data.paymentId;
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

app.listen(PORT, () => console.log(`Order service running on port ${PORT}`));
