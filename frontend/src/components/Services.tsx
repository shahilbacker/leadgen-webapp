'use client';

import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import HubIcon from '@mui/icons-material/Hub';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SyncAltIcon from '@mui/icons-material/SyncAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const services = [
  {
    icon: <TrackChangesIcon sx={{ fontSize: 32, color: '#2563eb' }} />,
    tag: 'INBOUND & SEARCH',
    title: 'High-Intent Inbound Funnels',
    description:
      'We capture buyers actively comparing enterprise vendors using intent-driven landing pages, technical content clusters, and paid search targeting.',
    features: [
      'Conversion-optimized multi-step forms',
      'Dynamic audience personalization',
      'Full-funnel attribution tracking',
    ],
  },
  {
    icon: <HubIcon sx={{ fontSize: 32, color: '#7c3aed' }} />,
    tag: 'ABM & OUTBOUND',
    title: 'Account-Based Target Penetration',
    description:
      'Pinpoint key decision-makers at tier-1 enterprise accounts with orchestrated multi-channel sequences across email, LinkedIn, and phone.',
    features: [
      'Verified corporate decision-maker data',
      'Personalized pitch angles per vertical',
      'Deliverability & domain protection setup',
    ],
  },
  {
    icon: <PsychologyIcon sx={{ fontSize: 32, color: '#059669' }} />,
    tag: 'INTELLIGENT SCORING',
    title: 'Automated Lead Qualification',
    description:
      'Eliminate unqualified tire-kickers. Every inquiry is verified, enriched with firmographic data, and scored against your Ideal Customer Profile (ICP).',
    features: [
      'Real-time email and phone validation',
      'Revenue and employee size enrichment',
      'Instant routing to senior account executives',
    ],
  },
  {
    icon: <SyncAltIcon sx={{ fontSize: 32, color: '#ea580c' }} />,
    tag: 'INFRASTRUCTURE',
    title: 'CRM & Pipeline Integration',
    description:
      'Seamlessly connect your leads into Salesforce, HubSpot, or PostgreSQL with custom webhooks, zero latency, and automated SLA alerting.',
    features: [
      'Native REST and webhook data forwarding',
      'Real-time Slack / Email notifications',
      'Two-way sync and lead status tracking',
    ],
  },
];

export default function Services() {
  return (
    <Box component="section" id="services" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="lg">
        {/* Section Header */}
        <Box sx={{ textAlign: 'center', maxWidth: 720, mx: 'auto', mb: { xs: 6, md: 8 } }}>
          <Chip
            label="OUR CORE CAPABILITIES"
            sx={{
              backgroundColor: 'rgba(124, 58, 237, 0.08)',
              color: '#7c3aed',
              fontWeight: 700,
              fontSize: '0.75rem',
              letterSpacing: '0.08em',
              mb: 2,
              borderRadius: 2,
            }}
          />
          {/* Semantic H2 */}
          <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
            Engineered Demand Generation & Growth Systems
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Everything your revenue operations team needs to build, validate, and scale high-velocity
            enterprise pipeline without adding headcount.
          </Typography>
        </Box>

        {/* Services Grid */}
        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  p: 1.5,
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {service.icon}
                  </Box>

                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      letterSpacing: '0.05em',
                      display: 'block',
                      mb: 0.5,
                    }}
                  >
                    {service.tag}
                  </Typography>

                  <Typography variant="h4" component="h3" sx={{ mb: 1.5, fontWeight: 700 }}>
                    {service.title}
                  </Typography>

                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {service.description}
                  </Typography>

                  <List disablePadding>
                    {service.features.map((feature, fIdx) => (
                      <ListItem key={fIdx} disableGutters sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CheckCircleOutlineIcon sx={{ fontSize: 18, color: '#10b981' }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={feature}
                          primaryTypographyProps={{
                            variant: 'body2',
                            color: 'text.primary',
                            fontWeight: 500,
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
