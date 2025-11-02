import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Shield } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';

const LocationPermissionModal: React.FC = () => {
  const { requestLocationPermission, closeLocationModal, showLocationModal } = useAppContext();

  console.log('LocationPermissionModal render, showLocationModal:', showLocationModal);

  const handleAllow = async () => {
    console.log('Allow button clicked');
    // Close modal first to allow browser permission prompt to show
    closeLocationModal();
    // Request permission after modal closes
    await requestLocationPermission();
  };

  const handleDeny = () => {
    console.log('Deny button clicked');
    // Store that user denied permission
    localStorage.setItem('locationPermissionDenied', 'true');
    closeLocationModal();
  };


  return (
    <Dialog open={showLocationModal} onOpenChange={(open) => !open && closeLocationModal()}>

      <DialogContent className="sm:max-w-md">

        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              <MapPin className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <DialogTitle className="text-center text-xl">Enable Location Services</DialogTitle>
          <DialogDescription className="text-center">
            HuddleMe needs access to your location to find and connect with nearby users.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          <div className="flex items-start gap-3">
            <Navigation className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Find Nearby Users</p>
              <p className="text-xs text-gray-600">Discover people around you in real-time</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Privacy Protected</p>
              <p className="text-xs text-gray-600">Your exact location is never shared</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button onClick={handleAllow} className="w-full bg-blue-600 hover:bg-blue-700">
            Allow Location Access
          </Button>
          <Button onClick={handleDeny} variant="outline" className="w-full">
            Deny
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationPermissionModal;
