import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Box, Chip, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const statusColors = { PENDING: 'warning', PAID: 'success', SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'error' };

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return navigate('/login');
    axios.get(`/api/orders/user/${user.id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>My Orders</Typography>
      {orders.length === 0 ? (
        <Typography>No orders yet!</Typography>
      ) : (
        orders.map(order => (
          <Card key={order._id} sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Order #{order._id.slice(-8).toUpperCase()}</Typography>
                <Chip label={order.status} color={statusColors[order.status]} size="small" />
              </Box>
              {order.items.map(item => (
                <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{item.name} x{item.quantity}</Typography>
                  <Typography>₹{(item.price * item.quantity).toLocaleString()}</Typography>
                </Box>
              ))}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                <Typography variant="subtitle2" color="text.secondary">{new Date(order.createdAt).toLocaleDateString()}</Typography>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>₹{order.totalAmount.toLocaleString()}</Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}
    </Container>
  );
}

export default Orders;
