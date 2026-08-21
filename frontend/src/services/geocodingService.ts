export interface LocationGeocodeResult {
  lat: number;
  lng: number;
  name: string;
  subtitle: string;
  fullAddress?: string;
}

const geocodeCache = new Map<string, LocationGeocodeResult>();

/**
 * Performs reverse geocoding for a pair of latitude/longitude coordinates.
 * Returns human-readable place name and subtitle for UI display.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationGeocodeResult> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  const fallback: LocationGeocodeResult = {
    lat,
    lng,
    name: 'Selected Location',
    subtitle: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`;
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return fallback;
    }

    const data = await response.json();
    const address = data.address || {};

    // Extract primary place name
    const primaryName =
      address.neighbourhood ||
      address.suburb ||
      address.city_district ||
      address.amenity ||
      address.building ||
      address.road ||
      address.city ||
      address.town ||
      'Selected Location';

    // Extract secondary city / state / region info
    const cityOrCounty = address.city || address.town || address.municipality || address.county || '';
    const stateOrCountry = address.state || address.country || '';
    const subtitleParts = [cityOrCounty, stateOrCountry].filter(Boolean);
    const subtitle = subtitleParts.length > 0 ? subtitleParts.join(', ') : `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    const result: LocationGeocodeResult = {
      lat,
      lng,
      name: primaryName,
      subtitle: subtitle,
      fullAddress: data.display_name,
    };

    geocodeCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.warn('Reverse geocoding error or timeout:', error);
    return fallback;
  }
}
