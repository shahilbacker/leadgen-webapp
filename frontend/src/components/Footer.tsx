'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Container, Typography, Grid, Stack, Divider } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        pt: 8,
        pb: 6,
        borderTop: '1px solid #1e293b',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} sx={{ mb: 6 }}>
          {/* Brand Col */}
          <Grid item xs={12} md={5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 2 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <RocketLaunchIcon fontSize="small" />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#ffffff' }}>
                Apex<span style={{ color: '#60a5fa' }}>Growth</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ maxWidth: 360, lineHeight: 1.7, color: '#94a3b8' }}>
              Precision demand generation, intent-driven inbound funnels, and enterprise lead
              acquisition infrastructure engineered for high-growth tech companies.
            </Typography>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Navigation
            </Typography>
            <Stack spacing={1.2}>
              <Link href="#services" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Capabilities & Services
              </Link>
              <Link href="#testimonials" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Client Case Studies
              </Link>
              <Link href="#contact" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem' }}>
                Request Consultation
              </Link>
              <Link href="/admin/login" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
                Admin Portal Login →
              </Link>
            </Stack>
          </Grid>

          {/* Compliance & Standards */}
          <Grid item xs={6} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#ffffff', mb: 2 }}>
              Enterprise Standards
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.7, color: '#94a3b8' }}>
              SOC2 Type II Certified Process • GDPR & CCPA Compliant Data Pipelines • 256-Bit SSL Encrypted Forms
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#64748b' }}>
              Headquarters: 100 Montgomery St, Suite 1800, San Francisco, CA 94104
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#1e293b', mb: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            © {new Date().getFullYear()} ApexGrowth Technologies Inc. All rights reserved.
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Built with Next.js App Router, Material UI, Express, PostgreSQL & MongoDB.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
