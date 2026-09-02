'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useScrollTrigger,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Services', href: '#services' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 20,
  });

  const handleDrawerToggle = () => {
    setMobileOpen((prev) => !prev);
  };

  return (
    <AppBar
      position="sticky"
      elevation={trigger ? 4 : 0}
      sx={{
        backgroundColor: trigger ? 'rgba(255, 255, 255, 0.92)' : '#ffffff',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: trigger ? 'rgba(226, 232, 240, 0.8)' : 'transparent',
        transition: 'all 0.3s ease-in-out',
        color: '#0f172a',
      }}
      component="nav"
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 74 }}>
          {/* Brand Logo */}
          <Box
            component={Link}
            href="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1.2,
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 10px rgba(37, 99, 235, 0.3)',
              }}
            >
              <RocketLaunchIcon fontSize="small" />
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Apex<span style={{ color: '#2563eb' }}>Growth</span>
            </Typography>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                href={item.href}
                sx={{
                  color: '#475569',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': { color: '#2563eb', backgroundColor: 'transparent' },
                }}
              >
                {item.label}
              </Button>
            ))}

            <Button
              variant="outlined"
              color="primary"
              component={Link}
              href={user ? '/admin' : '/admin/login'}
              startIcon={<LockOutlinedIcon />}
              sx={{
                ml: 2,
                borderRadius: 2,
                borderColor: '#cbd5e1',
                color: '#334155',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                },
              }}
            >
              {user ? `Admin (${user.role})` : 'Admin Portal'}
            </Button>

            <Button
              variant="contained"
              color="primary"
              href="#contact"
              sx={{
                ml: 1,
                borderRadius: 2,
                px: 2.5,
              }}
            >
              Get Started
            </Button>
          </Box>

          {/* Mobile Hamburger Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, p: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <RocketLaunchIcon color="primary" />
          <Typography variant="h6" fontWeight={700}>
            ApexGrowth
          </Typography>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                component="a"
                href={item.href}
                onClick={handleDrawerToggle}
                sx={{ borderRadius: 1.5, mb: 0.5 }}
              >
                <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem disablePadding sx={{ mt: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              component={Link}
              href={user ? '/admin' : '/admin/login'}
              startIcon={<LockOutlinedIcon />}
              onClick={handleDrawerToggle}
            >
              {user ? 'Admin Dashboard' : 'Admin Login'}
            </Button>
          </ListItem>
          <ListItem disablePadding sx={{ mt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              component="a"
              href="#contact"
              onClick={handleDrawerToggle}
            >
              Request Consult
            </Button>
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}
