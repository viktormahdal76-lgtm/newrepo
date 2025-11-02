// BLE Service with real-time scanning simulation
export interface BLEUserData {
  userId: string;
  name: string;
  age: number;
  gender: string;
  interests: string[];
  bio: string;
  avatar: string;
  rssi: number;
  distance: number;
  lastSeen: Date;
  isOnline: boolean;
}

export class BLEService {
  private scanning = false;
  private devices = new Map<string, BLEUserData>();
  private scanCallback?: (devices: BLEUserData[]) => void;
  private scanInterval?: number;
  private autoConnectEnabled = false;
  private userInterests: string[] = [];

  startScanning(callback: (devices: BLEUserData[]) => void, userInterests: string[] = [], autoConnect = false): void {
    this.scanning = true;
    this.scanCallback = callback;
    this.userInterests = userInterests;
    this.autoConnectEnabled = autoConnect;
    this.performScan();
    this.scanInterval = window.setInterval(() => {
      if (this.scanning) {
        this.updateDeviceSignals();
        this.performScan();
      }
    }, 3000);
  }

  private performScan(): void {
    const users: BLEUserData[] = [
      { userId: 'ble-1', name: 'Alex Chen', age: 25, gender: 'male', interests: ['Coffee', 'Tech', 'Music'], bio: 'Software engineer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', rssi: -50, distance: 0, lastSeen: new Date(), isOnline: true },
      { userId: 'ble-2', name: 'Sarah Johnson', age: 29, gender: 'female', interests: ['Design', 'Hiking', 'Photography'], bio: 'UX Designer', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', rssi: -65, distance: 0, lastSeen: new Date(), isOnline: true },
      { userId: 'ble-3', name: 'Mike Rodriguez', age: 32, gender: 'male', interests: ['Startups', 'Running', 'Tech'], bio: 'Entrepreneur', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', rssi: -80, distance: 0, lastSeen: new Date(), isOnline: true },
    ];
    users.forEach(user => {
      user.distance = this.calculateDistance(user.rssi);
      this.devices.set(user.userId, user);
      if (this.autoConnectEnabled && this.hasMatchingInterests(user)) {
        window.dispatchEvent(new CustomEvent('ble-auto-connect', { detail: { userId: user.userId, user } }));
      }
    });
    this.notifyCallback();
  }

  private updateDeviceSignals(): void {
    this.devices.forEach(device => {
      device.rssi = Math.max(-100, Math.min(-30, device.rssi + (Math.random() * 10 - 5)));
      device.distance = this.calculateDistance(device.rssi);
      device.lastSeen = new Date();
    });
  }

  private calculateDistance(rssi: number): number {
    const ratio = (-59 - rssi) / (10 * 2.5);
    return Math.round(Math.pow(10, ratio) * 100) / 100;
  }

  private hasMatchingInterests(user: BLEUserData): boolean {
    return this.userInterests.length > 0 && user.interests.some(i => this.userInterests.includes(i));
  }

  private notifyCallback(): void {
    if (this.scanCallback) {
      this.scanCallback(Array.from(this.devices.values()).sort((a, b) => a.distance - b.distance));
    }
  }

  stopScanning(): void {
    this.scanning = false;
    if (this.scanInterval) clearInterval(this.scanInterval);
  }

  isScanning(): boolean { return this.scanning; }
  getDevices(): BLEUserData[] { return Array.from(this.devices.values()); }
  clearDevices(): void { this.devices.clear(); }
}

export const bleService = new BLEService();
