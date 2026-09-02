'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { submitLead, LeadSubmissionData } from '../lib/api';

export default function LeadForm() {
  const [formData, setFormData] = useState<LeadSubmissionData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    source: 'landing_page_main',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Full name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid business email address.';
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 6) {
      newErrors.phone = 'Please provide a valid direct phone number.';
    }

    if (!formData.message.trim() || formData.message.trim().length < 10) {
      newErrors.message = 'Please provide details on your inquiry (min. 10 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await submitLead(formData);
      setSuccessMessage(response.message || 'Inquiry submitted successfully! A representative will contact you.');
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        source: 'landing_page_main',
      });
      setErrors({});
    } catch (err: any) {
      if (err.data) {
        // Backend validation errors mapping
        const backendErrors: { [key: string]: string } = {};
        for (const [key, val] of Object.entries(err.data)) {
          backendErrors[key] = Array.isArray(val) ? val[0] : String(val);
        }
        setErrors(backendErrors);
      }
      setErrorMessage(err.message || 'Unable to submit your inquiry at this moment. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="section" id="contact" sx={{ py: { xs: 8, md: 12 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left Column: Context & Value Props */}
          <Grid item xs={12} md={5}>
            <Chip
              label="GET IN TOUCH"
              sx={{
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                color: '#2563eb',
                fontWeight: 700,
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                mb: 2,
                borderRadius: 2,
              }}
            />
            {/* Semantic H2 */}
            <Typography component="h2" variant="h2" sx={{ mb: 2.5 }}>
              Ready to Accelerate Your Enterprise Pipeline?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Schedule a comprehensive 30-minute growth architecture review with one of our Senior
              Demand Strategists. We will evaluate your current funnels and deliver a tailored
              acquisition roadmap.
            </Typography>

            <Stack spacing={3}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    flexShrink: 0,
                  }}
                >
                  <BusinessOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Bespoke Account Modeling
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We reverse-engineer your closed-won deals to target the highest-yield accounts.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#f5f3ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#7c3aed',
                    flexShrink: 0,
                  }}
                >
                  <PhoneInTalkOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Direct Account Executive Hand-off
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Leads are pre-screened and delivered with full stakeholder context.
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2.5,
                    backgroundColor: '#ecfdf5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#059669',
                    flexShrink: 0,
                  }}
                >
                  <EmailOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    Instant Email Confirmation
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automated SLA alerting ensures rapid follow-up within 15 minutes.
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Grid>

          {/* Right Column: Interactive Lead Capture Form */}
          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3.5, sm: 5 },
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                boxShadow: '0 20px 35px -10px rgba(0, 0, 0, 0.07)',
                backgroundColor: '#ffffff',
              }}
            >
              <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
                Request Consultation
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Fill out the form below to receive your customized pipeline audit.
              </Typography>

              {successMessage && (
                <Alert
                  severity="success"
                  icon={<CheckCircleIcon fontSize="inherit" />}
                  sx={{ mb: 3, borderRadius: 2 }}
                >
                  {successMessage}
                </Alert>
              )}

              {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {errorMessage}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit} noValidate>
                <Grid container spacing={2.5}>
                  {/* Name Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="lead-name"
                      name="name"
                      label="Full Name"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      error={Boolean(errors.name)}
                      helperText={errors.name}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  {/* Email Field */}
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      required
                      id="lead-email"
                      name="email"
                      type="email"
                      label="Business Email"
                      placeholder="e.g. john@enterprise.com"
                      value={formData.email}
                      onChange={handleChange}
                      error={Boolean(errors.email)}
                      helperText={errors.email}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  {/* Phone Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      id="lead-phone"
                      name="phone"
                      label="Direct Phone Number"
                      placeholder="e.g. +1 (555) 234-5678"
                      value={formData.phone}
                      onChange={handleChange}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  {/* Message Field */}
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      multiline
                      rows={4}
                      id="lead-message"
                      name="message"
                      label="Project Scope or Primary Growth Goal"
                      placeholder="Tell us about your target accounts, current pipeline challenges, or timeline..."
                      value={formData.message}
                      onChange={handleChange}
                      error={Boolean(errors.message)}
                      helperText={errors.message}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      disabled={isSubmitting}
                      endIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
                      sx={{
                        py: 1.8,
                        fontSize: '1.05rem',
                        mt: 1,
                      }}
                    >
                      {isSubmitting ? 'Securing Your Consultation...' : 'Submit Inquiry'}
                    </Button>
                  </Grid>
                </Grid>

                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, textAlign: 'center' }}>
                  🔒 We respect your privacy. Zero spam. Information is handled in accordance with strict security standards.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
