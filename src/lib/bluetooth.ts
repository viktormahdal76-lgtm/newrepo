// Web Bluetooth API for BLE scanning
// Note: Only works in Chrome/Edge on HTTPS, requires user interaction

export const BLE_SERVICE_UUID = '0000180a-0000-1000-8000-00805f9b34fb'; // Device Info Service
export const APP_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0'; // Custom service for app

export interface BLEDevice {
  id: string;
  name: string;
  rssi: number; // Signal strength
  distance: number; // Estimated distance in meters
  lastSeen: Date;
  deviceData?: any;
}

export class BluetoothScanner {
  private scanning = false;
  private devices = new Map<string, BLEDevice>();
  private scanCallback?: (devices: BLEDevice[]) => void;
  private scanInterval?: number;

  // Check if Web Bluetooth is supported
  static isSupported(): boolean {
    return 'bluetooth' in navigator;
  }

  // Estimate distance from RSSI (signal strength)
  // RSSI to distance formula: d = 10 ^ ((TxPower - RSSI) / (10 * n))
  // TxPower = -59 (typical), n = 2 (path loss exponent)
  private estimateDistance(rssi: number): number {
    const txPower = -59;
    const n = 2;
    const distance = Math.pow(10, (txPower - rssi) / (10 * n));
    return Math.round(distance * 100) / 100; // Round to 2 decimals
  }

  async startScanning(callback: (devices: BLEDevice[]) => void): Promise<void> {
    if (!BluetoothScanner.isSupported()) {
      throw new Error('Web Bluetooth is not supported in this browser');
    }

    this.scanning = true;
    this.scanCallback = callback;

    try {
      // Request Bluetooth device with filters
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [BLE_SERVICE_UUID, APP_SERVICE_UUID]
      });

      // Start continuous scanning
      this.scanInterval = window.setInterval(async () => {
        if (!this.scanning) return;
        await this.scanForDevices();
      }, 2000); // Scan every 2 seconds

      await this.scanForDevices();
    } catch (error) {
      this.scanning = false;
      throw error;
    }
  }

  private async scanForDevices(): Promise<void> {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: [BLE_SERVICE_UUID, APP_SERVICE_UUID]
      });

      if (device.id) {
        const bleDevice: BLEDevice = {
          id: device.id,
          name: device.name || 'Unknown Device',
          rssi: -60, // Web Bluetooth doesn't expose RSSI directly
          distance: this.estimateDistance(-60),
          lastSeen: new Date(),
        };

        this.devices.set(device.id, bleDevice);
        this.notifyCallback();
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Scan error:', error);
    }
  }

  stopScanning(): void {
    this.scanning = false;
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = undefined;
    }
  }

  private notifyCallback(): void {
    if (this.scanCallback) {
      const deviceList = Array.from(this.devices.values());
      this.scanCallback(deviceList);
    }
  }

  getDevices(): BLEDevice[] {
    return Array.from(this.devices.values());
  }

  clearDevices(): void {
    this.devices.clear();
  }

  isScanning(): boolean {
    return this.scanning;
  }
}

export const bluetoothScanner = new BluetoothScanner();
