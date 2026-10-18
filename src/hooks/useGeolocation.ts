import { useCallback, useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export function useGeolocation() {
  const { userLocation, locationPermission, setUserLocation, setLocationPermission } =
    useAppStore();

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationPermission('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationPermission('granted');
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.warn('Geolocation error:', error.message);
        setLocationPermission('denied');
        setUserLocation(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes cache
      }
    );
  }, [setLocationPermission, setUserLocation]);

  // Check permission status on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        if (result.state === 'granted') {
          requestLocation();
        }
        result.addEventListener('change', () => {
          setLocationPermission(result.state as 'granted' | 'denied' | 'prompt');
        });
      });
    }
  }, [requestLocation, setLocationPermission]);

  return {
    userLocation,
    locationPermission,
    requestLocation,
    hasLocation: !!userLocation,
    isPermissionDenied: locationPermission === 'denied',
  };
}
