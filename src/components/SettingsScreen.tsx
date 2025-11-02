import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

import { useSubscription } from '@/hooks/useSubscription';
import { TIER_LIMITS } from '@/lib/subscription-service';
import { Badge } from '@/components/ui/badge';
import { Settings, Radar, LogOut, DollarSign, Crown, ShieldCheck } from 'lucide-react';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  isAdmin?: boolean;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, isAdmin = false }) => {
  const { scanRadius, setScanRadius, logout, currentUser } = useAppContext();
  const { tier } = useSubscription(currentUser?.id || null);
  const tierLimits = TIER_LIMITS[tier];
  const [autoConnect, setAutoConnect] = useState(true);
  const [scanInterval, setScanInterval] = useState(3);
  const [signalThreshold, setSignalThreshold] = useState(100);

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        </div>
        <Badge variant={tier === 'free' ? 'secondary' : 'default'} className="flex items-center gap-1">
          {tier !== 'free' && <Crown className="w-3 h-3" />}
          {tier.toUpperCase()}
        </Badge>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto">
        {isAdmin && (
          <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <Button onClick={() => onNavigate('admin')} className="w-full bg-blue-600 hover:bg-blue-700">
              <ShieldCheck className="w-4 h-4 mr-2" />Admin Dashboard
            </Button>
          </Card>
        )}

        {tier === 'free' && (
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-purple-900">Upgrade to Pro</h3>
                <p className="text-sm text-purple-700">Unlock unlimited connections</p>
              </div>
              <Button onClick={() => onNavigate('pricing')} className="bg-gradient-to-r from-purple-600 to-pink-600">
                Upgrade
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-4">
          <h3 className="font-semibold mb-2">Your Plan</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• Connections: {tierLimits.maxConnections === Infinity ? 'Unlimited' : tierLimits.maxConnections}</p>
            <p>• Radius: {tierLimits.detectionRadius}m</p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Radar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Discovery</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Scan Radius: {scanRadius}m</label>
              <Slider value={[scanRadius]} onValueChange={(v) => setScanRadius(v[0])} max={500} min={50} step={25} />
            </div>
          </div>
        </Card>

        <BLESettingsPanel autoConnect={autoConnect} onAutoConnectChange={setAutoConnect} scanInterval={scanInterval} onScanIntervalChange={setScanInterval} signalThreshold={signalThreshold} onSignalThresholdChange={setSignalThreshold} />

        <Card className="p-4">
          <Button variant="outline" className="w-full justify-start" onClick={() => onNavigate('pricing')}>
            <DollarSign className="w-4 h-4 mr-2" />Pricing Plans
          </Button>
        </Card>

        <Card className="p-4">
          <Button variant="outline" className="w-full justify-start text-red-600" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />Sign Out
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SettingsScreen;
