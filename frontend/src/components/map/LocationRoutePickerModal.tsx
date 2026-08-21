import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  IconButton,
  Card,
  Chip,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VELOUR_TOKENS } from '../../theme/palette';
import { reverseGeocode, LocationGeocodeResult } from '../../services/geocodingService';

// Custom Marker Pins
const pickupIcon = L.divIcon({
  className: 'custom-pickup-pin',
  html: `<div style="
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #00D9C0;
    border: 3px solid #FFFFFF;
    box-shadow: 0 0 12px #00D9C0, 0 0 24px rgba(0, 217, 192, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
    font-weight: 800;
    font-size: 11px;
    font-family: sans-serif;
  ">P</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const dropoffIcon = L.divIcon({
  className: 'custom-dropoff-pin',
  html: `<div style="
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: #A855F7;
    border: 3px solid #FFFFFF;
    box-shadow: 0 0 12px #A855F7, 0 0 24px rgba(168, 85, 247, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFF;
    font-weight: 800;
    font-size: 11px;
    font-family: sans-serif;
  ">D</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Map View Bounds Auto-Fitter
const AutoFitBounds: React.FC<{
  pickup: LocationGeocodeResult | null;
  dropoff: LocationGeocodeResult | null;
}> = ({ pickup, dropoff }) => {
  const map = useMap();

  useEffect(() => {
    if (pickup && dropoff) {
      const bounds = L.latLngBounds([
        [pickup.lat, pickup.lng],
        [dropoff.lat, dropoff.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else if (pickup) {
      map.setView([pickup.lat, pickup.lng], 13);
    } else if (dropoff) {
      map.setView([dropoff.lat, dropoff.lng], 13);
    }
  }, [pickup, dropoff, map]);

  return null;
};

interface LocationRoutePickerModalProps {
  open: boolean;
  onClose: () => void;
  initialPickup?: LocationGeocodeResult;
  initialDropoff?: LocationGeocodeResult;
  onConfirm: (pickup: LocationGeocodeResult, dropoff: LocationGeocodeResult) => void;
}

export const LocationRoutePickerModal: React.FC<LocationRoutePickerModalProps> = ({
  open,
  onClose,
  initialPickup,
  initialDropoff,
  onConfirm,
}) => {
  const [pickup, setPickup] = useState<LocationGeocodeResult | null>(initialPickup || null);
  const [dropoff, setDropoff] = useState<LocationGeocodeResult | null>(initialDropoff || null);
  const [selectionMode, setSelectionMode] = useState<'auto' | 'pickup' | 'dropoff'>('auto');
  const [loadingGeocode, setLoadingGeocode] = useState<boolean>(false);

  // Synchronize state when modal opens
  useEffect(() => {
    if (open) {
      setPickup(initialPickup || null);
      setDropoff(initialDropoff || null);
      setSelectionMode('auto');
    }
  }, [open, initialPickup, initialDropoff]);

  const handleMapClick = async (lat: number, lng: number) => {
    setLoadingGeocode(true);
    const geocoded = await reverseGeocode(lat, lng);
    setLoadingGeocode(false);

    if (selectionMode === 'pickup') {
      setPickup(geocoded);
      setSelectionMode('auto');
    } else if (selectionMode === 'dropoff') {
      setDropoff(geocoded);
      setSelectionMode('auto');
    } else {
      // Auto mode: 1st click = pickup, 2nd click = dropoff
      if (!pickup) {
        setPickup(geocoded);
      } else if (!dropoff) {
        setDropoff(geocoded);
      } else {
        // If both already set and clicked in auto mode, update dropoff or restart
        setDropoff(geocoded);
      }
    }
  };

  const handleReset = () => {
    setPickup(null);
    setDropoff(null);
    setSelectionMode('auto');
  };

  const handleConfirm = () => {
    if (pickup && dropoff) {
      onConfirm(pickup, dropoff);
      onClose();
    }
  };

  // Map Click Handler Sub-component
  const MapClickEventHandler = () => {
    useMapEvents({
      click(e) {
        handleMapClick(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const center: [number, number] = pickup
    ? [pickup.lat, pickup.lng]
    : dropoff
    ? [dropoff.lat, dropoff.lng]
    : [40.7549, -73.9840];

  // Helper text for status header
  const getStatusText = () => {
    if (selectionMode === 'pickup') return 'Click map to update Pickup location 🟢';
    if (selectionMode === 'dropoff') return 'Click map to update Drop-off location 🟣';
    if (!pickup) return 'Click the map to select PICKUP location (1/2) 🟢';
    if (!dropoff) return 'Click the map to select DROP-OFF location (2/2) 🟣';
    return 'Route selected! Confirm or adjust locations below. ✨';
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: VELOUR_TOKENS.bgSurface1,
          border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          borderRadius: 3,
          boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Modal Header */}
      <DialogTitle
        sx={{
          p: 2.5,
          backgroundColor: VELOUR_TOKENS.bgSurface2,
          borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 217, 192, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justify: 'center',
            }}
          >
            <MapIcon sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 20 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#FFF', fontSize: 15 }}>
              Select Route on Map
            </Typography>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11 }}>
              Two-click interactive coordinate selection with live reverse geocoding
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: VELOUR_TOKENS.textSecondary }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      {/* Instruction Banner */}
      <Box
        sx={{
          px: 2.5,
          py: 1.2,
          backgroundColor:
            selectionMode !== 'auto'
              ? 'rgba(234, 179, 8, 0.15)'
              : pickup && dropoff
              ? 'rgba(0, 217, 192, 0.12)'
              : 'rgba(168, 85, 247, 0.12)',
          borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: 12.5, color: '#FFF' }}>
          {getStatusText()}
        </Typography>
        {loadingGeocode && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={14} color="inherit" sx={{ color: VELOUR_TOKENS.accentTeal }} />
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontSize: 11 }}>
              Resolving place name...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Map Container */}
      <DialogContent sx={{ p: 0, height: 420, position: 'relative' }}>
        <MapContainer
          center={center}
          zoom={13}
          style={{ width: '100%', height: '100%', backgroundColor: '#060709' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            maxZoom={19}
          />

          <MapClickEventHandler />
          <AutoFitBounds pickup={pickup} dropoff={dropoff} />

          {/* Pickup Marker (🟢 Cyan) */}
          {pickup && (
            <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
              <Popup>
                <div style={{ color: '#111', fontFamily: 'sans-serif' }}>
                  <strong style={{ color: '#008070' }}>🟢 Pickup Location</strong>
                  <br />
                  {pickup.name}
                  <br />
                  <small style={{ color: '#666' }}>{pickup.subtitle}</small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Drop-off Marker (🟣 Purple) */}
          {dropoff && (
            <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
              <Popup>
                <div style={{ color: '#111', fontFamily: 'sans-serif' }}>
                  <strong style={{ color: '#7E22CE' }}>🟣 Drop-off Location</strong>
                  <br />
                  {dropoff.name}
                  <br />
                  <small style={{ color: '#666' }}>{dropoff.subtitle}</small>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Connecting Polyline Route Line */}
          {pickup && dropoff && (
            <Polyline
              positions={[
                [pickup.lat, pickup.lng],
                [dropoff.lat, dropoff.lng],
              ]}
              pathOptions={{
                color: VELOUR_TOKENS.accentTeal,
                weight: 3.5,
                dashArray: '8, 8',
                opacity: 0.85,
              }}
            />
          )}
        </MapContainer>
      </DialogContent>

      {/* Selected Locations Info Cards */}
      <Box sx={{ p: 2, backgroundColor: VELOUR_TOKENS.bgSurface2, borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}` }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Pickup Info Card */}
          <Card
            sx={{
              p: 1.5,
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              border: `1px solid ${pickup ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.borderSubtle}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentTeal, fontWeight: 700, fontSize: 11 }}>
                🟢 PICKUP LOCATION
              </Typography>
              {pickup && (
                <Button
                  size="small"
                  onClick={() => setSelectionMode('pickup')}
                  sx={{
                    fontSize: 10,
                    py: 0.1,
                    px: 0.8,
                    color: selectionMode === 'pickup' ? '#FFF' : VELOUR_TOKENS.accentTeal,
                    backgroundColor: selectionMode === 'pickup' ? VELOUR_TOKENS.accentTeal : 'rgba(0, 217, 192, 0.1)',
                    '&:hover': { backgroundColor: VELOUR_TOKENS.accentTeal, color: '#FFF' },
                  }}
                >
                  Change Pickup
                </Button>
              )}
            </Box>
            {pickup ? (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                  📍 {pickup.name}
                </Typography>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
                  {pickup.subtitle}
                </Typography>
                <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, opacity: 0.7 }}>
                  {pickup.lat.toFixed(5)}, {pickup.lng.toFixed(5)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontStyle: 'italic' }}>
                Click map to select pickup...
              </Typography>
            )}
          </Card>

          {/* Drop-off Info Card */}
          <Card
            sx={{
              p: 1.5,
              backgroundColor: VELOUR_TOKENS.bgSurface1,
              border: `1px solid ${dropoff ? VELOUR_TOKENS.accentLavender : VELOUR_TOKENS.borderSubtle}`,
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.accentLavender, fontWeight: 700, fontSize: 11 }}>
                🟣 DROP-OFF LOCATION
              </Typography>
              {dropoff && (
                <Button
                  size="small"
                  onClick={() => setSelectionMode('dropoff')}
                  sx={{
                    fontSize: 10,
                    py: 0.1,
                    px: 0.8,
                    color: selectionMode === 'dropoff' ? '#FFF' : VELOUR_TOKENS.accentLavender,
                    backgroundColor: selectionMode === 'dropoff' ? VELOUR_TOKENS.accentLavender : 'rgba(168, 85, 247, 0.1)',
                    '&:hover': { backgroundColor: VELOUR_TOKENS.accentLavender, color: '#FFF' },
                  }}
                >
                  Change Drop-off
                </Button>
              )}
            </Box>
            {dropoff ? (
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#FFF', fontSize: 13 }}>
                  📍 {dropoff.name}
                </Typography>
                <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 11, display: 'block' }}>
                  {dropoff.subtitle}
                </Typography>
                <Typography className="mono-num" variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 10, opacity: 0.7 }}>
                  {dropoff.lat.toFixed(5)}, {dropoff.lng.toFixed(5)}
                </Typography>
              </Box>
            ) : (
              <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontStyle: 'italic' }}>
                Click map to select drop-off...
              </Typography>
            )}
          </Card>
        </Box>
      </Box>

      {/* Modal Actions Footer */}
      <DialogActions sx={{ p: 2, backgroundColor: VELOUR_TOKENS.bgSurface1, justifyContent: 'space-between' }}>
        <Button
          size="small"
          onClick={handleReset}
          startIcon={<RestartAltIcon fontSize="small" />}
          sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, textTransform: 'none' }}
        >
          Reset Selection
        </Button>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={onClose} sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={!pickup || !dropoff}
            startIcon={<CheckCircleIcon fontSize="small" />}
            sx={{
              backgroundColor: VELOUR_TOKENS.accentPrimary,
              color: '#FFF',
              fontWeight: 700,
              fontSize: 12.5,
              px: 2.5,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimary },
              '&.Mui-disabled': { backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'rgba(255, 255, 255, 0.3)' },
            }}
          >
            Confirm Route
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};
