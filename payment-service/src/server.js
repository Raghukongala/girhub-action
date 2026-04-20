const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3004;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb-service:27017/ecommerce')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, default: () => uuidv4() },
  orderId: String,
  userId: String,
  amount: Number,
  status: { type: String, default: 'SUCCESS', enum: ['SUCCESS', 'FAILED', 'PENDING'] },
  method: { type: String, default: 'SIMULATED' },
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model('Payment', paymentSchema);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'payment-service' }));

app.post('/api/payments/process', async (req, res) => {
  try {
    const { orderId, amount, userId } = req.body;
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 500));
    const payment = await Payment.create({ orderId, amount, userId, status: 'SUCCESS' });
    res.json({ paymentId: payment.paymentId, status: 'SUCCESS', amount });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/payments/:orderId', async (req, res) => {
  const payment = await Payment.findOne({ orderId: req.params.orderId });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json(payment);
});

app.listen(PORT, () => console.log(`Payment service running on port ${PORT}`));
