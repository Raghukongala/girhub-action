import React, { useState } from 'react';
import { Container, Card, CardContent, TextField, Button, Typography, Box, Tab, Tabs, Alert, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useAuth } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/users/login', { email: form.email, password: form.password });
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('/api/users/register', form);
      login(res.data.user, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: 'center', mb: 3, color: '#ff6b35' }}>
            RK Shop
          </Typography>
          <Tabs value={tab} onChange={(e, v) => setTab(v)} centered sx={{ mb: 3 }}>
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {tab === 0 ? (
            <Box component="form" onSubmit={handleLogin}>
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} margin="normal" required />
              <TextField fullWidth label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} margin="normal" required />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2, py: 1.5, background: 'linear-gradient(45deg, #ff6b35, #f7931e)' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
          ) : (
            <Box component="form" onSubmit={handleRegister}>
              <TextField fullWidth label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} margin="normal" required />
              <TextField fullWidth label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} margin="normal" required />
              <TextField fullWidth label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} margin="normal" />
              <TextField fullWidth label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} margin="normal" required />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 2, py: 1.5, background: 'linear-gradient(45deg, #ff6b35, #f7931e)' }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Login;
