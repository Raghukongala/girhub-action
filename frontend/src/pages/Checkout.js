import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Alert, CircularProgress, Divider } from '@mui/material';
import axios from 'axios';
import { useCart, useAuth } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [address, setAddress] = useState({ name: user?.name || '', address: '', city: '', pincode: '' });

  const handleOrder = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await axios.post('/api/orders', {
        userId: user.id,
        items: cart.map(i => ({ productId: i._id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        shippingAddress: address
      }, { headers: { Authorization: `Bearer ${token}` } });
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.error || 'Order failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Checkout</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Shipping Address</Typography>
            <Box component="form" onSubmit={handleOrder}>
              <TextField fullWidth label="Full Name" value={address.name} onChange={e => setAddress({ ...address, name: e.target.value })} margin="normal" required />
              <TextField fullWidth label="Address" value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} margin="normal" required />
              <TextField fullWidth label="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} margin="normal" required />
              <TextField fullWidth label="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} margin="normal" required />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2, py: 1.5, background: 'linear-gradient(45deg, #ff6b35, #f7931e)' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : `Pay ₹${total.toLocaleString()}`}
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1, minWidth: 300 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Order Summary</Typography>
            {cart.map(item => (
              <Box key={item._id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>{item.name} x{item.quantity}</Typography>
                <Typography>₹{(item.price * item.quantity).toLocaleString()}</Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>₹{total.toLocaleString()}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Checkout;
