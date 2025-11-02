export interface LocationCoordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type LocationPermissionStatus = 'prompt' | 'granted' | 'denied';

class LocationService {
  private watchId: number | null = null;
  private currentLocation: LocationCoordinates | null = null;
  private listeners: Set<(location: LocationCoordinates) => void> = new Set();

  // Check if app is running as installed PWA
  isInstalledApp(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           document.referrer.includes('android-app://');
  }

  // Check if we've already asked for permission in this installed app
  hasAskedForPermission(): boolean {
    return localStorage.getItem('locationPermissionAsked') === 'true';
  }

  // Mark that we've asked for permission
  markPermissionAsked(): void {
    localStorage.setItem('locationPermissionAsked', 'true');
  }
  async checkPermission(): Promise<LocationPermissionStatus> {
    // Check if we've already granted permission in this session
    const hasGranted = localStorage.getItem('locationPermissionGranted') === 'true';
    if (hasGranted) {
      return 'granted';
    }
    
    // Check if user has explicitly denied
    const hasDenied = localStorage.getItem('locationPermissionDenied') === 'true';
    if (hasDenied) {
      return 'denied';
    }
    
    // Otherwise, we need to ask (prompt state)
    return 'prompt';
  }

  // Try to determine actual permission state
  private async checkActualPermission(): Promise<LocationPermissionStatus> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve('granted'),
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            resolve('denied');
          } else {
            resolve('prompt');
          }
        },
        { timeout: 1000, maximumAge: Infinity }
      );
    });
  }



  async requestPermission(): Promise<LocationPermissionStatus> {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          // Store that permission was granted
          localStorage.setItem('locationPermissionGranted', 'true');
          localStorage.removeItem('locationPermissionDenied');
          resolve('granted');
        },
        (error) => {
          console.error('Location permission denied:', error);
          // Store that permission was denied
          localStorage.setItem('locationPermissionDenied', 'true');
          localStorage.removeItem('locationPermissionGranted');
          resolve('denied');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  }




  startTracking(callback: (location: LocationCoordinates) => void) {
    this.listeners.add(callback);
    if (this.watchId === null) {
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          this.currentLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.listeners.forEach(listener => listener(this.currentLocation!));
        },
        (error) => console.error('Location tracking error:', error),
        { enableHighAccuracy: true, maximumAge: 30000, timeout: 27000 }
      );
    }
  }

  stopTracking(callback?: (location: LocationCoordinates) => void) {
    if (callback) {
      this.listeners.delete(callback);
    }
    if (this.listeners.size === 0 && this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  getCurrentLocation(): LocationCoordinates | null {
    return this.currentLocation;
  }

  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c); // Distance in meters
  }
}

export const locationService = new LocationService();
