'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Button,
  Chip,
  Tooltip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
  Alert,
  Stack,
  Toolbar,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import { useAuth } from '../../context/AuthContext';
import { fetchLeads, deleteLead, LeadItem } from '../../lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, accessToken, isLoading: authLoading, logout, isAdmin, isViewer } = useAuth();

  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Pagination & Filtering
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Delete Confirmation Dialog state
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/admin/login');
    }
  }, [user, authLoading, router]);

  const loadLeads = useCallback(async () => {
    if (!accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLeads(accessToken);
      setLeads(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load leads.');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      loadLeads();
    }
  }, [accessToken, loadLeads]);

  const handleDeleteClick = (lead: LeadItem) => {
    setSelectedLead(lead);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedLead || !accessToken) return;
    setDeleting(true);
    try {
      await deleteLead(selectedLead.id, accessToken);
      setSuccess(`Lead for ${selectedLead.name} successfully deleted.`);
      setLeads((prev) => prev.filter((l) => l.id !== selectedLead.id));
      setDialogOpen(false);
      setSelectedLead(null);
    } catch (err: any) {
      setError(err.message || 'Could not delete lead.');
    } finally {
      setDeleting(false);
    }
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.phone.toLowerCase().includes(query) ||
      lead.message.toLowerCase().includes(query) ||
      lead.source.toLowerCase().includes(query)
    );
  });

  const paginatedLeads = filteredLeads.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (authLoading || (!user && loading)) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8fafc', pb: 8 }}>
      {/* Top Admin Header Bar */}
      <Paper
        elevation={0}
        sx={{
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', height: 70 }}>
            {/* Left Brand & Return */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                component={Link}
                href="/"
                startIcon={<ArrowBackIcon />}
                size="small"
                sx={{ color: '#64748b' }}
              >
                Website
              </Button>
              <Typography variant="h6" fontWeight={800} color="#0f172a">
                ApexGrowth <span style={{ color: '#2563eb' }}>Leads Console</span>
              </Typography>
            </Stack>

            {/* Right Profile & Actions */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Chip
                icon={isAdmin ? <AdminPanelSettingsIcon /> : <VisibilityIcon />}
                label={user?.role.toUpperCase()}
                color={isAdmin ? 'primary' : 'default'}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  letterSpacing: '0.05em',
                  bgcolor: isAdmin ? '#2563eb' : '#e2e8f0',
                  color: isAdmin ? '#ffffff' : '#334155',
                }}
              />
              <Typography variant="body2" fontWeight={600} color="#334155" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user?.email}
              </Typography>
              <IconButton onClick={loadLeads} title="Refresh leads" color="primary">
                <RefreshIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="inherit"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ borderColor: '#cbd5e1', color: '#475569' }}
              >
                Logout
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </Paper>

      {/* Main Content Area */}
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        {/* Role Explanation Alert */}
        {isViewer && (
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>Viewer Role Active:</strong> You have read-only access to view and export incoming leads.
            Deleting records is restricted to administrators.
          </Alert>
        )}

        {isAdmin && (
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            <strong>Administrator Role Active:</strong> Full privileges enabled. You can inspect submissions and delete records.
          </Alert>
        )}

        {error && (
          <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        )}

        {/* Dashboard Metrics / Search Toolbar */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Box>
              <Typography variant="h5" fontWeight={800} sx={{ mb: 0.5 }}>
                Incoming Leads Pipeline
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Submissions: <strong>{leads.length}</strong> | Filtered Results: <strong>{filteredLeads.length}</strong>
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search by name, email, or content..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              sx={{ minWidth: { xs: '100%', sm: 340 } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" sx={{ color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </Paper>

        {/* Leads Data Table */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 3,
            border: '1px solid #e2e8f0',
            overflow: 'hidden',
            backgroundColor: '#ffffff',
          }}
        >
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-label="leads data table">
              <TableHead>
                <TableRow>
                  <TableCell>Contact Person</TableCell>
                  <TableCell>Direct Channels</TableCell>
                  <TableCell sx={{ minWidth: 260 }}>Inquiry / Message</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Date Submitted</TableCell>
                  <TableCell align="right">Role Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <CircularProgress size={32} />
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
                        Fetching verified leads from database...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : paginatedLeads.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                      <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                        No leads match your criteria.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try clearing your search query or submit a test lead from the landing page.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedLeads.map((lead) => (
                    <TableRow key={lead.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      {/* Name */}
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                          {lead.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {lead.id.substring(0, 8)}...
                        </Typography>
                      </TableCell>

                      {/* Contact Info */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <MailOutlineIcon sx={{ fontSize: 15, color: '#2563eb' }} />
                            <Typography variant="body2" color="primary.main">
                              {lead.email}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <PhoneIcon sx={{ fontSize: 15, color: '#64748b' }} />
                            <Typography variant="body2" color="text.secondary">
                              {lead.phone}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      {/* Message Content */}
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            color: '#334155',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {lead.message}
                        </Typography>
                      </TableCell>

                      {/* Acquisition Source */}
                      <TableCell>
                        <Chip
                          label={lead.source || 'Direct Web'}
                          size="small"
                          sx={{
                            backgroundColor: '#eff6ff',
                            color: '#1d4ed8',
                            fontWeight: 600,
                            fontSize: '0.72rem',
                          }}
                        />
                      </TableCell>

                      {/* Created At */}
                      <TableCell>
                        <Typography variant="body2" color="#0f172a" fontWeight={500}>
                          {new Date(lead.created_at).toLocaleDateString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Typography>
                      </TableCell>

                      {/* Role Check Action: Admin vs Viewer */}
                      <TableCell align="right">
                        {isAdmin ? (
                          <Tooltip title="Delete Lead (Admin Only)">
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDeleteClick(lead)}
                              sx={{
                                border: '1px solid #fee2e2',
                                '&:hover': { backgroundColor: '#fef2f2' },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ) : (
                          <Tooltip title="Viewer role: Read-only access. Deleting requires Admin privileges.">
                            <span>
                              <IconButton
                                size="small"
                                disabled
                                sx={{
                                  border: '1px solid #f1f5f9',
                                }}
                              >
                                <DeleteOutlineIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredLeads.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => !deleting && setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Delete Lead Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to permanently remove the inquiry from{' '}
            <strong>{selectedLead?.name}</strong> ({selectedLead?.email})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setDialogOpen(false)} disabled={deleting} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} color="inherit" /> : <DeleteOutlineIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete Lead'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
