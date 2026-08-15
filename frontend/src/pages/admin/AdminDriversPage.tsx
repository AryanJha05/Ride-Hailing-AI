import React, { useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import StarIcon from '@mui/icons-material/Star';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { PageShell } from '../../components/layout/PageShell';
import { VELOUR_TOKENS } from '../../theme/palette';
import {
  useAdminDrivers,
  useCreateDriverMutation,
  useUpdateDriverMutation,
} from '../../hooks/useRideApi';
import { DriverRecord } from '../../types/api.types';

export const AdminDriversPage: React.FC = () => {
  // Queries & Mutations
  const { data: drivers = [], isLoading, isError, refetch } = useAdminDrivers();
  const createDriverMutation = useCreateDriverMutation();
  const updateDriverMutation = useUpdateDriverMutation();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Selected driver for View/Edit/Actions
  const [selectedDriver, setSelectedDriver] = useState<DriverRecord | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<HTMLElement | null>(null);

  // Form states for Create
  const [addForm, setAddForm] = useState({
    name: '',
    email: '',
    phone: '',
    driver_id: '',
    license_number: '',
    status: 'Active',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createdCredentials, setCreatedCredentials] = useState<{ email: string; temp_password?: string } | null>(null);

  // Form states for Edit
  const [editForm, setEditForm] = useState({
    phone: '',
    license_number: '',
    status: 'Active',
  });

  // Action Menu Handlers
  const handleOpenActionMenu = (event: React.MouseEvent<HTMLElement>, driver: DriverRecord) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedDriver(driver);
  };

  const handleCloseActionMenu = () => {
    setActionMenuAnchor(null);
  };

  const handleOpenViewModal = () => {
    handleCloseActionMenu();
    setIsViewModalOpen(true);
  };

  const handleOpenEditModal = () => {
    handleCloseActionMenu();
    if (selectedDriver) {
      setEditForm({
        phone: selectedDriver.phone || '',
        license_number: selectedDriver.license_number || '',
        status: selectedDriver.status || 'Active',
      });
    }
    setIsEditModalOpen(true);
  };

  const handleToggleStatus = () => {
    handleCloseActionMenu();
    if (!selectedDriver) return;
    const newStatus = selectedDriver.status === 'Inactive' ? 'Active' : 'Inactive';
    updateDriverMutation.mutate(
      { driverId: selectedDriver.id, payload: { status: newStatus } },
      {
        onSuccess: () => {
          refetch();
        },
      }
    );
  };

  // Add Driver Handler
  const handleCreateDriver = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError(null);

    if (!addForm.name.trim() || !addForm.email.trim()) {
      setCreateError('Full Name and Email are required.');
      return;
    }

    createDriverMutation.mutate(
      {
        name: addForm.name.trim(),
        email: addForm.email.trim(),
        phone: addForm.phone.trim() || undefined,
        driver_id: addForm.driver_id.trim() || undefined,
        license_number: addForm.license_number.trim() || undefined,
        status: addForm.status,
      },
      {
        onSuccess: (newDriver) => {
          setIsAddModalOpen(false);
          setCreatedCredentials({
            email: newDriver.email,
            temp_password: newDriver.temp_password || 'driver123',
          });
          setIsSuccessModalOpen(true);
          setAddForm({
            name: '',
            email: '',
            phone: '',
            driver_id: '',
            license_number: '',
            status: 'Active',
          });
          refetch();
        },
        onError: (err: any) => {
          setCreateError(err.response?.data?.detail || 'Unable to create driver account.');
        },
      }
    );
  };

  // Edit Driver Handler
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriver) return;

    updateDriverMutation.mutate(
      {
        driverId: selectedDriver.id,
        payload: editForm,
      },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          refetch();
        },
      }
    );
  };

  // Filtered drivers list
  const filteredDrivers = drivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.driver_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || driver.status.toUpperCase() === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <PageShell title="Driver Management Directory">
      <Grid container spacing={3}>
        {/* Top Header Card */}
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justify: 'space-between',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: 2,
              p: 3,
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              borderRadius: 2,
              border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#FFF' }}>
                Drivers
              </Typography>
              <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mt: 0.5 }}>
                Manage driver accounts, status and operational information.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsAddModalOpen(true)}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                color: '#FFF',
                fontWeight: 700,
                px: 3,
                py: 1.2,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#7C3AED',
                },
              }}
            >
              Add Driver
            </Button>
          </Box>
        </Grid>

        {/* Filter and Search Bar */}
        <Grid item xs={12}>
          <Card
            sx={{
              p: 2,
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              borderColor: VELOUR_TOKENS.borderSubtle,
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              gap: 2,
              alignItems: 'center',
            }}
          >
            <TextField
              size="small"
              placeholder="Search Drivers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: VELOUR_TOKENS.textTertiary, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
                backgroundColor: VELOUR_TOKENS.bgSurface2,
                borderRadius: 1,
                '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                '& input': { color: '#FFF', fontSize: 14 },
              }}
            />

            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{
                  backgroundColor: VELOUR_TOKENS.bgSurface2,
                  color: '#FFF',
                  fontSize: 13,
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  '& .MuiSvgIcon-root': { color: VELOUR_TOKENS.textSecondary },
                }}
              >
                <MenuItem value="ALL">All Statuses</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="OFFLINE">Offline</MenuItem>
                <MenuItem value="INACTIVE">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>

        {/* Driver Table */}
        <Grid item xs={12}>
          <Card sx={{ p: 3, backgroundColor: VELOUR_TOKENS.bgSurface1, borderColor: VELOUR_TOKENS.borderSubtle }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8, gap: 2 }}>
                <CircularProgress size={28} sx={{ color: VELOUR_TOKENS.accentTeal }} />
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary }}>
                  Loading drivers...
                </Typography>
              </Box>
            ) : isError ? (
              <Alert severity="error" sx={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                Unable to load drivers. Please check your backend connection or credentials.
              </Alert>
            ) : filteredDrivers.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  No drivers found.
                </Typography>
                <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textTertiary, mt: 1 }}>
                  Try adjusting your search criteria or click "+ Add Driver" to register a new driver.
                </Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ backgroundColor: VELOUR_TOKENS.bgSurface2, borderRadius: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>DRIVER ID</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>NAME</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>EMAIL</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>STATUS</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>RATING</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>TRIPS</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>EARNINGS</TableCell>
                      <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 12 }}>ACTIONS</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredDrivers.map((driver) => {
                      const isDriverActive = driver.status.toUpperCase() === 'ACTIVE';
                      const isDriverOffline = driver.status.toUpperCase() === 'OFFLINE';

                      return (
                        <TableRow
                          key={driver.id}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
                          }}
                        >
                          <TableCell sx={{ color: VELOUR_TOKENS.accentLavender, fontFamily: VELOUR_TOKENS.fontMono, fontWeight: 700, fontSize: 12 }}>
                            {driver.driver_id}
                          </TableCell>
                          <TableCell sx={{ color: '#FFF', fontWeight: 600, fontSize: 13 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar
                                sx={{
                                  width: 32,
                                  height: 32,
                                  backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
                                  color: VELOUR_TOKENS.accentLavender,
                                  fontSize: 12,
                                  fontWeight: 700,
                                }}
                              >
                                {driver.name.charAt(0)}
                              </Avatar>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                                {driver.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 13 }}>{driver.email}</TableCell>
                          <TableCell>
                            <Chip
                              icon={
                                <FiberManualRecordIcon
                                  sx={{
                                    fontSize: '10px !important',
                                    color: isDriverActive
                                      ? `${VELOUR_TOKENS.accentTeal} !important`
                                      : isDriverOffline
                                      ? '#8E8C9A !important'
                                      : '#EF4444 !important',
                                  }}
                                />
                              }
                              label={driver.status}
                              size="small"
                              sx={{
                                backgroundColor: isDriverActive
                                  ? 'rgba(0, 217, 192, 0.1)'
                                  : isDriverOffline
                                  ? 'rgba(255, 255, 255, 0.04)'
                                  : 'rgba(239, 68, 68, 0.1)',
                                color: isDriverActive
                                  ? VELOUR_TOKENS.accentTeal
                                  : isDriverOffline
                                  ? VELOUR_TOKENS.textSecondary
                                  : '#EF4444',
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            />
                          </TableCell>
                          <TableCell sx={{ color: '#FFF', fontWeight: 700 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <StarIcon sx={{ color: VELOUR_TOKENS.accentGold, fontSize: 16 }} />
                              <Typography className="mono-num" variant="body2" sx={{ fontWeight: 700, color: '#FFF' }}>
                                {driver.rating?.toFixed(2) || '5.00'}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.textPrimary, fontWeight: 600 }}>
                            {driver.total_trips?.toLocaleString() || 0}
                          </TableCell>
                          <TableCell className="mono-num" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700 }}>
                            ${driver.total_earnings?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleOpenActionMenu(e, driver)}
                              sx={{ color: VELOUR_TOKENS.textSecondary }}
                            >
                              <MoreVertIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Row Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleCloseActionMenu}
        PaperProps={{
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            color: '#FFF',
            minWidth: 160,
          },
        }}
      >
        <MenuItem onClick={handleOpenViewModal} sx={{ fontSize: 13, gap: 1.5 }}>
          <VisibilityOutlinedIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentTeal }} />
          View Details
        </MenuItem>
        <MenuItem onClick={handleOpenEditModal} sx={{ fontSize: 13, gap: 1.5 }}>
          <EditOutlinedIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentLavender }} />
          Edit Driver
        </MenuItem>
        <Divider sx={{ borderColor: VELOUR_TOKENS.borderSubtle }} />
        <MenuItem onClick={handleToggleStatus} sx={{ fontSize: 13, gap: 1.5 }}>
          {selectedDriver?.status === 'Inactive' ? (
            <>
              <CheckCircleOutlinedIcon fontSize="small" sx={{ color: VELOUR_TOKENS.accentTeal }} />
              Activate Account
            </>
          ) : (
            <>
              <BlockOutlinedIcon fontSize="small" sx={{ color: '#EF4444' }} />
              Deactivate Driver
            </>
          )}
        </MenuItem>
      </Menu>

      {/* Modal 1: Add Driver Form */}
      <Dialog
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            color: '#FFF',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
          Create Driver Account
        </DialogTitle>
        <form onSubmit={handleCreateDriver}>
          <DialogContent sx={{ py: 3 }}>
            {createError && (
              <Alert severity="error" sx={{ mb: 2, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#F87171' }}>
                {createError}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  FULL NAME *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. John Smith"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                  required
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  EMAIL ADDRESS *
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  type="email"
                  placeholder="john.smith@rideai.nyc"
                  value={addForm.email}
                  onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                  required
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  PHONE NUMBER
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="+1 (555) 019-2834"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  DRIVER ID (OPTIONAL)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Auto-generated e.g. NYC-DRV-005"
                  value={addForm.driver_id}
                  onChange={(e) => setAddForm({ ...addForm, driver_id: e.target.value })}
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  LICENSE NUMBER
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="NYC-TLC-99412"
                  value={addForm.license_number}
                  onChange={(e) => setAddForm({ ...addForm, license_number: e.target.value })}
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  INITIAL STATUS
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select
                    value={addForm.status}
                    onChange={(e) => setAddForm({ ...addForm, status: e.target.value })}
                    sx={{
                      backgroundColor: VELOUR_TOKENS.bgSurface2,
                      color: '#FFF',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                      '& .MuiSvgIcon-root': { color: VELOUR_TOKENS.textSecondary },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Offline">Offline</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 2.5, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
            <Button
              onClick={() => setIsAddModalOpen(false)}
              sx={{ color: VELOUR_TOKENS.textSecondary, textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createDriverMutation.isPending}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                color: '#FFF',
                fontWeight: 700,
                textTransform: 'none',
                px: 3,
              }}
            >
              {createDriverMutation.isPending ? 'Creating Driver...' : 'Create Driver'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Modal 2: Created Driver Credentials Display */}
      <Dialog
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            color: '#FFF',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>
          Driver Created Successfully
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, mb: 2 }}>
            The authenticated driver account has been created with role <strong>DRIVER</strong>. You can now use these credentials on the <code>/login</code> screen.
          </Typography>

          <Card sx={{ p: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, borderColor: VELOUR_TOKENS.borderSubtle }}>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
              LOGIN EMAIL
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', mb: 1.5 }}>
              {createdCredentials?.email}
            </Typography>

            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary, display: 'block' }}>
              TEMPORARY PASSWORD
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: 700,
                color: VELOUR_TOKENS.accentGold,
                fontFamily: VELOUR_TOKENS.fontMono,
                fontSize: 15,
              }}
            >
              {createdCredentials?.temp_password}
            </Typography>
          </Card>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              if (createdCredentials) {
                navigator.clipboard.writeText(
                  `Email: ${createdCredentials.email}\nPassword: ${createdCredentials.temp_password}`
                );
              }
            }}
            startIcon={<ContentCopyIcon />}
            sx={{ color: VELOUR_TOKENS.accentLavender, textTransform: 'none' }}
          >
            Copy Credentials
          </Button>
          <Button
            variant="contained"
            onClick={() => setIsSuccessModalOpen(false)}
            sx={{ backgroundColor: VELOUR_TOKENS.accentPrimary, color: '#FFF', textTransform: 'none' }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal 3: View Driver Details */}
      <Dialog
        open={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            color: '#FFF',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
          Driver Operational Details
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {selectedDriver && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    backgroundColor: VELOUR_TOKENS.accentPrimaryDim,
                    color: VELOUR_TOKENS.accentLavender,
                    fontWeight: 700,
                    fontSize: 20,
                  }}
                >
                  {selectedDriver.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>
                    {selectedDriver.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: VELOUR_TOKENS.accentLavender, fontFamily: VELOUR_TOKENS.fontMono }}
                  >
                    {selectedDriver.driver_id}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>EMAIL</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>{selectedDriver.email}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>PHONE</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>{selectedDriver.phone}</Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>LICENSE NUMBER</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#FFF' }}>{selectedDriver.license_number}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary }}>STATUS</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: VELOUR_TOKENS.accentTeal }}>{selectedDriver.status}</Typography>
              </Grid>

              <Grid item xs={4}>
                <Card sx={{ p: 1.5, backgroundColor: VELOUR_TOKENS.bgSurface2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary }}>RATING</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentGold }}>{selectedDriver.rating}</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ p: 1.5, backgroundColor: VELOUR_TOKENS.bgSurface2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary }}>TOTAL TRIPS</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#FFF' }}>{selectedDriver.total_trips}</Typography>
                </Card>
              </Grid>
              <Grid item xs={4}>
                <Card sx={{ p: 1.5, backgroundColor: VELOUR_TOKENS.bgSurface2, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textTertiary }}>EARNINGS</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: VELOUR_TOKENS.accentTeal }}>${selectedDriver.total_earnings}</Typography>
                </Card>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsViewModalOpen(false)} sx={{ color: VELOUR_TOKENS.textSecondary }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal 4: Edit Driver */}
      <Dialog
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface1,
            border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
            color: '#FFF',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
          Edit Operational Information
        </DialogTitle>
        <form onSubmit={handleSaveEdit}>
          <DialogContent sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  PHONE NUMBER
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  LICENSE NUMBER
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={editForm.license_number}
                  onChange={(e) => setEditForm({ ...editForm, license_number: e.target.value })}
                  sx={{
                    mt: 0.5,
                    backgroundColor: VELOUR_TOKENS.bgSurface2,
                    borderRadius: 1,
                    '& input': { color: '#FFF' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                  }}
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 600 }}>
                  OPERATIONAL STATUS
                </Typography>
                <FormControl fullWidth size="small" sx={{ mt: 0.5 }}>
                  <Select
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    sx={{
                      backgroundColor: VELOUR_TOKENS.bgSurface2,
                      color: '#FFF',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: VELOUR_TOKENS.borderSubtle },
                      '& .MuiSvgIcon-root': { color: VELOUR_TOKENS.textSecondary },
                    }}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Offline">Offline</MenuItem>
                    <MenuItem value="Inactive">Inactive (Disable Auth)</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsEditModalOpen(false)} sx={{ color: VELOUR_TOKENS.textSecondary }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={updateDriverMutation.isPending}
              sx={{ backgroundColor: VELOUR_TOKENS.accentPrimary, color: '#FFF' }}
            >
              Save Changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageShell>
  );
};
