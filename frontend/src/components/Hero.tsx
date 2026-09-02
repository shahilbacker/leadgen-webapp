'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';

export default function Hero() {
  return (
    <Box
      component="header"
      sx={{
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 8, md: 12 },
        pb: { xs: 10, md: 14 },
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37, 99, 235, 0.15), rgba(255, 255, 255, 0))',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', maxWidth: 860, mx: 'auto', mb: { xs: 6, md: 8 } }}>
          {/* Tagline Badge */}
          <Chip
            icon={<TrendingUpIcon fontSize="small" sx={{ color: '#2563eb !important' }} />}
            label="ENTERPRISE B2B DEMAND ENGINE 2026"
            sx={{
              backgroundColor: 'rgba(37, 99, 235, 0.08)',
              color: '#2563eb',
              fontWeight: 700,
              fontSize: '0.78rem',
              letterSpacing: '0.08em',
              mb: 3,
              py: 2,
              px: 1,
              borderRadius: 3,
              border: '1px solid rgba(37, 99, 235, 0.2)',
            }}
          />

          {/* Semantic H1 Headline */}
          <Typography
            component="h1"
            variant="h1"
            sx={{
              mb: 3,
              background: 'linear-gradient(135deg, #0f172a 30%, #334155 70%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Scale Your Enterprise Pipeline with Predictable High-Intent Leads
          </Typography>

          {/* Subheading */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              fontWeight: 400,
              lineHeight: 1.6,
              mb: 4,
              maxWidth: 720,
              mx: 'auto',
            }}
          >
            Turn unqualified outbound noise into contracted revenue. We design bespoke,
            multi-channel customer acquisition funnels that deliver enterprise buyers directly to
            your sales calendar.
          </Typography>

          {/* Action Buttons */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            sx={{ mb: 4 }}
          >
            <Button
              variant="contained"
              size="large"
              href="#contact"
              endIcon={<ArrowForwardIcon />}
              sx={{
                py: 1.8,
                px: 3.5,
                fontSize: '1.05rem',
              }}
            >
              Get Free Pipeline Audit
            </Button>
            <Button
              variant="outlined"
              size="large"
              href="#services"
              sx={{
                py: 1.8,
                px: 3.5,
                fontSize: '1.05rem',
                borderColor: '#cbd5e1',
                color: '#334155',
                '&:hover': {
                  borderColor: '#2563eb',
                  backgroundColor: 'rgba(37, 99, 235, 0.04)',
                },
              }}
            >
              Explore Solutions
            </Button>
          </Stack>

          {/* Trust Guarantees */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            justifyContent="center"
            alignItems="center"
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <CheckCircleIcon sx={{ fontSize: 18, color: '#10b981' }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Guaranteed SQL Delivery
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <SecurityIcon sx={{ fontSize: 18, color: '#2563eb' }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                GDPR & CCPA Compliant
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <SpeedIcon sx={{ fontSize: 18, color: '#7c3aed' }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Live Within 7 Business Days
              </Typography>
            </Box>
          </Stack>
        </Box>

        {/* Hero Performance Metric Cards */}
        <Grid container spacing={3}>
          {[
            {
              metric: '340%',
              label: 'Average Pipeline Acceleration',
              detail: 'Calculated over 90-day onboarding cycles',
            },
            {
              metric: '94.8%',
              label: 'Lead Qualification Accuracy',
              detail: 'Directly verified by sales engineering teams',
            },
            {
              metric: '$48.5M',
              label: 'Closed ARR Sourced in 2025',
              detail: 'Across 120+ high-growth tech enterprises',
            },
          ].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
                  textAlign: 'center',
                }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: '#2563eb',
                    mb: 1,
                  }}
                >
                  {item.metric}
                </Typography>
                <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 700, mb: 0.5 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.detail}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
