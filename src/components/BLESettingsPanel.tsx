
const checkLocationPermission = async () => {
  const result = await Permissions.query({ name: 'location' });
  if (result.state !== 'granted') {
    const requestResult = await Permissions.request({ name: 'location' });
    if (requestResult.state !== 'granted') {
      alert('Location permission is required for BLE scanning.');
      return false;
    }
  }
  return true;
};

import { Permissions } from '@capacitor/core';
import React from 'react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Bluetooth, Radio, Zap } from 'lucide-react';

interface BLESettingsPanelProps {
  autoConnect: boolean;
  onAutoConnectChange: (enabled: boolean) => void;
  scanInterval: number;
  onScanIntervalChange: (interval: number) => void;
  signalThreshold: number;
  onSignalThresholdChange: (threshold: number) => void;
}

const BLESettingsPanel: React.FC<BLESettingsPanelProps> = ({
  autoConnect,
  onAutoConnectChange,
  scanInterval,
  onScanIntervalChange,
  signalThreshold,
  onSignalThresholdChange,
}) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Bluetooth className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-lg">BLE Settings</h3>
      </div>

      {/* Auto-Connect Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-500" />
          <Label htmlFor="auto-connect" className="text-sm font-medium">
            Auto-Connect on Match
          </Label>
        </div>
        <Switch
          id="auto-connect"
          checked={autoConnect}
          onCheckedChange={onAutoConnectChange}
        />
      </div>
      <p className="text-xs text-gray-500 ml-6">
        Automatically send connection requests when matching interests detected
      </p>

      {/* Scan Interval */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-blue-500" />
          <Label className="text-sm font-medium">
            Scan Interval: {scanInterval}s
          </Label>
        </div>
        <Slider
          value={[scanInterval]}
          onValueChange={(value) => onScanIntervalChange(value[0])}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          How often to scan for nearby devices (lower = more battery usage)
        </p>
      </div>

      {/* Signal Threshold */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">
          Signal Threshold: {signalThreshold}m
        </Label>
        <Slider
          value={[signalThreshold]}
          onValueChange={(value) => onSignalThresholdChange(value[0])}
          min={10}
          max={200}
          step={10}
          className="w-full"
        />
        <p className="text-xs text-gray-500">
          Maximum distance to detect users
        </p>
      </div>
    </Card>
  );
};

export default BLESettingsPanel;
