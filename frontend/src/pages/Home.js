import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardMedia, CardContent, CardActions, Typography, Button, TextField, Box, Chip, Rating } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import axios from 'axios';
import { useCart } from '../context/AppContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [search, category]);

  const fetchProducts = async () => {
    const res = await axios.get(`/api/products?search=${search}&category=${category}`);
    setProducts(res.data.products);
  };

  const fetchCategories = async () => {
    const res = await axios.get('/api/products/category/list');
    setCategories(res.data);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #ff6b35, #f7931e)',
        borderRadius: 3, p: 4, mb: 4, color: 'white', textAlign: 'center'
      }}>
        <Typography variant="h3" sx={{ fontWeight: 800 }}>Welcome to RK Shop</Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
          Deployed on AWS EKS • GitHub Actions • ArgoCD
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {['AWS EKS', 'GitHub Actions', 'ArgoCD', 'Terraform', 'Docker', 'K8s'].map(t => (
            <Chip key={t} label={t} sx={{ background: 'rgba(255,255,255,0.2)', color: 'white' }} />
          ))}
        </Box>
      </Box>

      {/* Search & Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          label="Search products..." size="small" value={search}
          onChange={e => setSearch(e.target.value)} sx={{ flexGrow: 1 }}
        />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip label="All" onClick={() => setCategory('')} color={category === '' ? 'primary' : 'default'} />
          {categories.map(c => (
            <Chip key={c} label={c} onClick={() => setCategory(c)} color={category === c ? 'primary' : 'default'} />
          ))}
        </Box>
      </Box>

      {/* Products */}
      <Grid container spacing={3}>
        {products.map(product => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', '&:hover': { transform: 'translateY(-4px)', transition: '0.3s' } }}>
              <CardMedia component="img" height="200" image={product.image} alt={product.name} sx={{ objectFit: 'cover' }} />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{product.description}</Typography>
                <Rating value={product.rating} readOnly size="small" />
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>₹{product.price.toLocaleString()}</Typography>
                <Chip label={product.category} size="small" sx={{ mt: 0.5 }} />
              </CardContent>
              <CardActions>
                <Button fullWidth variant="contained" startIcon={<AddShoppingCartIcon />}
                  onClick={() => addToCart(product)}
                  sx={{ background: 'linear-gradient(45deg, #ff6b35, #f7931e)' }}>
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;
