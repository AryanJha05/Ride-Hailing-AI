import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MapIcon from '@mui/icons-material/Map';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { VELOUR_TOKENS } from '../../theme/palette';

// Custom Leaflet DivIcon for Pickup Location Marker (Teal)
const pickupIcon = L.divIcon({
  className: 'pickup-map-pin',
  html: `<div style="
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: ${VELOUR_TOKENS.accentTeal};
    border: 3px solid #FFFFFF;
    box-shadow: 0 0 0 4px rgba(0, 217, 192, 0.4), 0 0 20px ${VELOUR_TOKENS.accentTeal};
    display: flex;
    align-items: center;
    justify-content: center;
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

// Custom Leaflet DivIcon for Dropoff Location Marker (Gold)
const dropoffIcon = L.divIcon({
  className: 'dropoff-map-pin',
  html: `<div style="
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background-color: ${VELOUR_TOKENS.accentGold};
    border: 3px solid #FFFFFF;
    box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.4), 0 0 20px ${VELOUR_TOKENS.accentGold};
    display: flex;
    align-items: center;
    justify-content: center;
  "></div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export interface MapLocationPickerModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  markerType?: 'pickup' | 'dropoff';
  mode?: 'pickup' | 'dropoff';
  initialLat?: number;
  initialLng?: number;
  onConfirm: (lat: number, lng: number) => void;
}

// Inner helper component to capture map click events
function ClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Helper to validate if selected point is within NYC metro area
const isWithinNYC = (lat: number, lng: number): boolean => {
  return lat >= 40.45 && lat <= 40.95 && lng >= -74.30 && lng <= -73.60;
};

export const MapLocationPickerModal: React.FC<MapLocationPickerModalProps> = ({
  open,
  onClose,
  title,
  markerType,
  mode,
  initialLat = 40.7549,
  initialLng = -73.9840,
  onConfirm,
}) => {
  const activeMode = mode || markerType || 'pickup';
  const [selectedPos, setSelectedPos] = useState<[number, number]>([initialLat, initialLng]);

  useEffect(() => {
    if (open) {
      setSelectedPos([initialLat, initialLng]);
    }
  }, [open, initialLat, initialLng]);

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPos([lat, lng]);
  };

  const lat = selectedPos[0];
  const lng = selectedPos[1];
  const isValidNYC = isWithinNYC(lat, lng);

  const activeIcon = activeMode === 'pickup' ? pickupIcon : dropoffIcon;
  const accentColor = activeMode === 'pickup' ? VELOUR_TOKENS.accentTeal : VELOUR_TOKENS.accentGold;


  const handleConfirmLocation = () => {
    onConfirm(Number(lat.toFixed(6)), Number(lng.toFixed(6)));
    onClose();
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
          color: '#FFF',
          borderRadius: 3,
          border: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 2.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          backgroundColor: VELOUR_TOKENS.bgSurface2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <LocationOnIcon sx={{ color: accentColor, fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: 16, color: '#FFF' }}>
            {title}
          </Typography>
          <Chip
            label={markerType === 'pickup' ? 'Pickup Pin' : 'Drop-off Pin'}
            size="small"
            sx={{
              backgroundColor: markerType === 'pickup' ? 'rgba(0, 217, 192, 0.15)' : 'rgba(234, 179, 8, 0.15)',
              color: accentColor,
              fontWeight: 700,
              fontSize: 11,
              height: 22,
            }}
          />
        </Box>
        <IconButton onClick={onClose} size="small" sx={{ color: VELOUR_TOKENS.textSecondary }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Subtitle / Instruction */}
      <Box sx={{ px: 2.5, pt: 1.5, pb: 1, backgroundColor: VELOUR_TOKENS.bgSurface1 }}>
        <Typography variant="body2" sx={{ color: VELOUR_TOKENS.textSecondary, fontSize: 12.5 }}>
          Click anywhere on the interactive map below to place a location pin. Coordinates will be sent directly to the XGBoost V3 model.
        </Typography>
      </Box>

      {/* Map Container */}
      <DialogContent sx={{ p: 0, position: 'relative', height: 420 }}>
        {open && (
          <MapContainer
            center={[initialLat, initialLng]}
            zoom={13}
            style={{ width: '100%', height: '100%', backgroundColor: '#060709' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              maxZoom={19}
            />

            <ClickHandler onSelect={handleMapClick} />

            <Marker position={selectedPos} icon={activeIcon} />
          </MapContainer>
        )}

        {/* Selected Coordinates Overlay Badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 16,
            zIndex: 1000,
            backgroundColor: 'rgba(10, 10, 13, 0.88)',
            backdropFilter: 'blur(8px)',
            border: `1px solid ${accentColor}`,
            borderRadius: 2,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <MapIcon sx={{ color: accentColor, fontSize: 18 }} />
          <Box>
            <Typography variant="caption" sx={{ color: VELOUR_TOKENS.textSecondary, fontWeight: 700, fontSize: 10, display: 'block' }}>
              SELECTED COORDINATES
            </Typography>
            <Typography className="mono-num" variant="body2" sx={{ color: '#FFF', fontWeight: 700, fontSize: 13 }}>
              {lat.toFixed(5)}, {lng.toFixed(5)}
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      {/* Footer / Actions */}
      <DialogActions
        sx={{
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: 1.5,
          borderTop: `1px solid ${VELOUR_TOKENS.borderSubtle}`,
          backgroundColor: VELOUR_TOKENS.bgSurface2,
        }}
      >
        {!isValidNYC && (
          <Alert severity="warning" sx={{ backgroundColor: 'rgba(234, 179, 8, 0.12)', color: VELOUR_TOKENS.accentGold, border: `1px solid ${VELOUR_TOKENS.accentGold}`, py: 0.2 }}>
            Location is outside standard NYC metro area bounds. Predictions may have higher error outside NYC.
          </Alert>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, width: '100%' }}>
          <Button
            onClick={onClose}
            sx={{
              color: VELOUR_TOKENS.textSecondary,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmLocation}
            startIcon={<CheckCircleIcon />}
            sx={{
              backgroundColor: accentColor,
              color: markerType === 'pickup' ? '#000' : '#000',
              fontWeight: 700,
              fontSize: 13,
              px: 3,
              borderRadius: 2,
              '&:hover': { backgroundColor: accentColor },
            }}
          >
            Confirm Location
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export const LocationMapPicker = MapLocationPickerModal;
export { LocationRoutePickerModal } from './LocationRoutePickerModal';
export { LocationRoutePickerModal as LocationRoutePicker } from './LocationRoutePickerModal';



