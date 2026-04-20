import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Badge, Box, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StoreIcon from '@mui/icons-material/Store';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ background: 'linear-gradient(90deg, #ff6b35, #f7931e)' }}>
      <Toolbar>
        <StoreIcon sx={{ mr: 1 }} />
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>
          RK Shop
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {user ? (
            <>
              <Button color="inherit" onClick={() => navigate('/orders')}>Orders</Button>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
          )}
          <IconButton color="inherit" onClick={() => navigate('/cart')}>
            <Badge badgeContent={cart.reduce((s, i) => s + i.quantity, 0)} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
