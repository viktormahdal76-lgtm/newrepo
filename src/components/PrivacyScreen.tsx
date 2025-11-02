import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Shield, Eye, Lock, Database, MapPin } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Shield className="w-6 h-6 text-green-600" />
        <h1 className="text-2xl font-bold text-gray-800">Privacy Policy</h1>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">We collect minimal information to provide our proximity-based social networking service:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Profile information (name, age, bio, interests)</li>
              <li>Approximate location for proximity detection</li>
              <li>Device identifiers for Bluetooth connectivity</li>
              <li>Messages and connection history</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-600" />
              Location Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">Your location privacy is paramount:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>We never store your exact GPS coordinates</li>
              <li>Proximity detection uses Bluetooth Low Energy</li>
              <li>Location data is processed locally on your device</li>
              <li>You can disable discovery mode at any time</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-600" />
              Data Usage & Storage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">We handle your data responsibly:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>All messages are encrypted end-to-end</li>
              <li>Profile data is stored securely with encryption</li>
              <li>We never sell your personal information</li>
              <li>Data is only used to improve app functionality</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-600" />
              Your Rights & Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">You have full control over your privacy:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>Delete your account and all data anytime</li>
              <li>Control who can discover and contact you</li>
              <li>Export your data in standard formats</li>
              <li>Opt out of any data collection features</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center py-4">
          <p className="text-sm text-gray-500">Last updated: September 2025</p>
          <p className="text-xs text-gray-400 mt-2">
            Questions? Contact us at privacy@huddleme.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyScreen;