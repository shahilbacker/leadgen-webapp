'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  Stack,
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const testimonials = [
  {
    name: 'Elena Rostova',
    role: 'VP of Revenue Operations',
    company: 'CloudMatrix Software',
    content:
      'ApexGrowth transformed our inbound sales conversion within 45 days. We saw qualified demo requests surge by 210% with zero decline in deal size. The automated lead qualification alone saves our SDRs 15 hours a week.',
    rating: 5,
    avatarColor: '#2563eb',
    avatarText: 'ER',
  },
  {
    name: 'Marcus Vance',
    role: 'Chief Commercial Officer',
    company: 'FinTech Nexus',
    content:
      'Before ApexGrowth, our cost-per-acquisition was unsustainable. Their account-based acquisition sequences booked meetings with 4 Fortune 500 financial institutions within our first quarter of rollout. The ROI has been staggering.',
    rating: 5,
    avatarColor: '#7c3aed',
    avatarText: 'MV',
  },
  {
    name: 'Aisha Patel',
    role: 'Head of Global Marketing',
    company: 'Synapse Security',
    content:
      'The pipeline consistency has been a game-changer for our board reporting. We went from guessing month-to-month lead flow to a predictable, repeatable enterprise client pipeline.',
    rating: 5,
    avatarColor: '#059669',
    avatarText: 'AP',
  },
];

export default function Testimonials() {
  return (
    <Box component="section" id="testimonials" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#f8fafc' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: { xs: 6, md: 8 } }}>
          <Chip
            label="PROVEN RESULTS"
            sx={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              mb: 2,
              borderRadius: 2,
            }}
          />
          {/* Semantic H2 */}
          <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
            Trusted by Leaders at High-Growth Enterprises
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Discover how forward-thinking B2B teams leverage our demand generation engine to dominate
            their respective sectors.
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Grid container spacing={4}>
          {testimonials.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  p: 2,
                  borderRadius: 4,
                  position: 'relative',
                  backgroundColor: '#ffffff',
                }}
              >
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Rating value={item.rating} readOnly size="small" />
                    <FormatQuoteIcon sx={{ color: '#cbd5e1', fontSize: 32 }} />
                  </Box>

                  <Typography
                    variant="body1"
                    sx={{
                      fontStyle: 'italic',
                      color: '#334155',
                      mb: 3,
                      lineHeight: 1.6,
                    }}
                  >
                    &ldquo;{item.content}&rdquo;
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: item.avatarColor,
                        fontWeight: 700,
                        width: 44,
                        height: 44,
                      }}
                    >
                      {item.avatarText}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                        {item.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block">
                        {item.role}
                      </Typography>
                      <Typography variant="caption" fontWeight={600} color="primary.main">
                        {item.company}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
