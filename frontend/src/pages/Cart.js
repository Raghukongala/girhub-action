import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, IconButton, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart, useAuth } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, removeFromCart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) return navigate('/login');
    navigate('/checkout');
  };

  if (cart.length === 0) return (
    <Container sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h5">Your cart is empty!</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>Shop Now</Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>Shopping Cart</Typography>
      {cart.map(item => (
        <Card key={item._id} sx={{ mb: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img src={item.image} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }} />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
              <Typography color="primary">₹{item.price.toLocaleString()} x {item.quantity}</Typography>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toLocaleString()}</Typography>
            <IconButton onClick={() => removeFromCart(item._id)} color="error"><DeleteIcon /></IconButton>
          </CardContent>
        </Card>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Total: ₹{total.toLocaleString()}</Typography>
        <Button variant="contained" size="large" onClick={handleCheckout}
          sx={{ background: 'linear-gradient(45deg, #ff6b35, #f7931e)' }}>
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
}

export default Cart;
