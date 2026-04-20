const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://mongodb-service:27017/ecommerce')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB error:', err));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  image: { type: String, default: 'https://via.placeholder.com/300' },
  stock: { type: Number, default: 100 },
  rating: { type: Number, default: 4.0 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

// Seed products
const seedProducts = async () => {
  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany([
      { name: 'iPhone 15 Pro', description: 'Latest Apple smartphone', price: 99999, category: 'Electronics', stock: 50, rating: 4.8 },
      { name: 'Samsung Galaxy S24', description: 'Premium Android phone', price: 79999, category: 'Electronics', stock: 30, rating: 4.6 },
      { name: 'Nike Air Max', description: 'Comfortable running shoes', price: 8999, category: 'Footwear', stock: 100, rating: 4.5 },
      { name: 'Levi\'s Jeans', description: 'Classic denim jeans', price: 2999, category: 'Clothing', stock: 200, rating: 4.3 },
      { name: 'MacBook Pro M3', description: 'Powerful laptop', price: 199999, category: 'Electronics', stock: 20, rating: 4.9 },
      { name: 'Sony Headphones', description: 'Noise cancelling headphones', price: 24999, category: 'Electronics', stock: 75, rating: 4.7 },
      { name: 'Adidas T-Shirt', description: 'Sports t-shirt', price: 1499, category: 'Clothing', stock: 300, rating: 4.2 },
      { name: 'Coffee Maker', description: 'Automatic coffee machine', price: 5999, category: 'Home', stock: 60, rating: 4.4 },
    ]);
    console.log('Products seeded!');
  }
};

mongoose.connection.once('open', seedProducts);

app.get('/health', (req, res) => res.json({ status: 'healthy', service: 'product-service' }));

app.get('/api/products', async (req, res) => {
  const { category, search, page = 1, limit = 8 } = req.query;
  const query = {};
  if (category) query.category = category;
  if (search) query.name = { $regex: search, $options: 'i' };
  const products = await Product.find(query).skip((page - 1) * limit).limit(parseInt(limit));
  const total = await Product.countDocuments(query);
  res.json({ products, total, pages: Math.ceil(total / limit) });
});

app.get('/api/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

app.get('/api/products/category/list', async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
});

app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
