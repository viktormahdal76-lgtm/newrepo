import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Users, MapPin } from 'lucide-react';

interface UpgradePromptProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  onUpgrade: () => void;
}

export function UpgradePrompt({ open, onClose, feature, onUpgrade }: UpgradePromptProps) {
  const featureMessages: Record<string, { title: string; description: string; icon: any }> = {
    advanced_filters: {
      title: 'Advanced Filters',
      description: 'Unlock advanced filtering options to find exactly who you\'re looking for.',
      icon: Zap,
    },
    extended_profiles: {
      title: 'Extended Profiles',
      description: 'View detailed profiles with more information about potential connections.',
      icon: Users,
    },
    unlimited_connections: {
      title: 'Unlimited Connections',
      description: 'Connect with unlimited people and expand your network without limits.',
      icon: Users,
    },
    extended_radius: {
      title: 'Extended Detection Radius',
      description: 'Increase your detection radius to find people further away.',
      icon: MapPin,
    },
  };

  const info = featureMessages[feature] || featureMessages.advanced_filters;
  const Icon = info.icon;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Icon className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-2xl">{info.title}</DialogTitle>
          <DialogDescription className="text-center">{info.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-purple-600" />
              <span className="font-semibold text-purple-900">Pro Features Include:</span>
            </div>
            <ul className="space-y-1 text-sm text-purple-800">
              <li>• Up to 50 connections</li>
              <li>• 200m detection radius</li>
              <li>• Advanced filters</li>
              <li>• Extended profiles</li>
            </ul>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={onUpgrade} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
            Upgrade Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
