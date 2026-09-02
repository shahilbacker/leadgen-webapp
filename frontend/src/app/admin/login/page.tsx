'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push('/admin');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (role: 'admin' | 'viewer') => {
    if (role === 'admin') {
      setEmail('admin@example.com');
      setPassword('AdminPass123!');
    } else {
      setEmail('viewer@example.com');
      setPassword('ViewerPass123!');
    }
    setError(null);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3.5, sm: 5 },
            borderRadius: 4,
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Back link */}
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 3, color: '#64748b' }}
            size="small"
          >
            Back to Landing Page
          </Button>

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                mb: 1.5,
              }}
            >
              <LockOutlinedIcon fontSize="medium" />
            </Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Admin Portal
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in with your JWT-authenticated credentials to manage incoming leads.
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                required
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />

              <TextField
                fullWidth
                required
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.6, fontSize: '1rem', mt: 1 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Dashboard'}
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ my: 4 }}>
            <Chip label="DEMO ROLES SWITCHER" size="small" sx={{ fontSize: '0.7rem', fontWeight: 600 }} />
          </Divider>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, textAlign: 'center' }}>
            Click below to instantly populate credentials and test Role-Based Access Control (RBAC):
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<AdminPanelSettingsIcon />}
              onClick={() => fillCredentials('admin')}
              size="small"
              sx={{ py: 1.2 }}
            >
              Fill Admin (Full Access)
            </Button>
            <Button
              fullWidth
              variant="outlined"
              color="secondary"
              startIcon={<VisibilityIcon />}
              onClick={() => fillCredentials('viewer')}
              size="small"
              sx={{ py: 1.2 }}
            >
              Fill Viewer (Read-Only)
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
