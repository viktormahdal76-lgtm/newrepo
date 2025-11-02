import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Radar, Users, Wifi, WifiOff, Filter, Calendar, Bluetooth, Radio, Lock, MapPin } from 'lucide-react';
import FilterPanel from './FilterPanel';
import MeetupProposal from './MeetupProposal';
import LocationPermissionModal from './LocationPermissionModal';
import { User } from '@/types';
import { useSubscription } from '@/hooks/useSubscription';
import { TIER_LIMITS, canAccessFeature } from '@/lib/subscription-service';
import { UpgradePrompt } from './UpgradePrompt';
import { useNavigate } from 'react-router-dom';

const RadarScreen: React.FC = () => {
  const { 
    nearbyUsers, 
    isScanning, 
    scanRadius, 
    startScanning, 
    stopScanning,
    sendConnectionRequest,
    proposeMeetup,
    currentUser,
    connections,
    locationPermission,
    requestLocationPermission
  } = useAppContext();
  const navigate = useNavigate();
  const { tier } = useSubscription(currentUser?.id || null);
  const [pulseAnimation, setPulseAnimation] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [showMeetupProposal, setShowMeetupProposal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [filters, setFilters] = useState({
    ageRange: [18, 80] as [number, number],
    gender: 'any',
    maxDistance: TIER_LIMITS[tier].detectionRadius,
    interests: [] as string[],
  });
  const [filteredUsers, setFilteredUsers] = useState(nearbyUsers);

  const tierLimits = TIER_LIMITS[tier];
  const connectionCount = connections.length;
  const canAddMoreConnections = connectionCount < tierLimits.maxConnections;

  // Check location permission when starting scan
  useEffect(() => {
    if (locationPermission === 'prompt' || locationPermission === 'denied') {
      setShowLocationModal(true);
    }
  }, [locationPermission]);


  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setPulseAnimation(prev => (prev + 1) % 3);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  useEffect(() => {
    const filtered = nearbyUsers.filter(user => {
      if (user.age < filters.ageRange[0] || user.age > filters.ageRange[1]) return false;
      if (filters.gender !== 'any' && user.gender !== filters.gender) return false;
      if (user.distance > filters.maxDistance) return false;
      if (filters.interests.length > 0 && !filters.interests.some(interest => user.interests.includes(interest))) return false;
      return true;
    });
    setFilteredUsers(filtered);
  }, [nearbyUsers, filters]);

  const handleConnect = (userId: string) => {
    if (!canAddMoreConnections) {
      setUpgradeFeature('unlimited_connections');
      setShowUpgradePrompt(true);
      return;
    }
    sendConnectionRequest(userId);
  };

  const handleProposeMeetup = (user: User) => {
    setSelectedUser(user);
    setShowMeetupProposal(true);
  };

  const handleUpgrade = () => {
    setShowUpgradePrompt(false);
    navigate('/pricing');
  };

  const handleAllowLocation = async () => {
    await requestLocationPermission();
    setShowLocationModal(false);
  };

  const handleDenyLocation = () => {
    setShowLocationModal(false);
  };



  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-green-50 p-4 pt-2 overflow-y-auto">
      {/* Connection Limit Banner */}
      {!canAddMoreConnections && (
        <div className="bg-amber-100 border border-amber-300 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-amber-700" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Connection Limit Reached</p>
              <p className="text-xs text-amber-700">
                You've reached your {tier === 'free' ? 'free tier' : 'current'} limit of {tierLimits.maxConnections} connections. 
                <button onClick={handleUpgrade} className="underline ml-1 font-semibold">Upgrade now</button>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Radar className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Nearby</h1>
          <Badge variant="secondary" className="text-xs">
            {connectionCount}/{tierLimits.maxConnections === Infinity ? '∞' : tierLimits.maxConnections}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (!canAccessFeature(tier, 'advanced_filters')) {
                setUpgradeFeature('advanced_filters');
                setShowUpgradePrompt(true);
              } else {
                setShowFilters(true);
              }
            }}
            className="flex items-center gap-1"
          >
            <Filter className="w-4 h-4" />
            Filter
            {!canAccessFeature(tier, 'advanced_filters') && <Lock className="w-3 h-3 ml-1" />}
          </Button>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {filteredUsers.length}
          </Badge>
        </div>
      </div>


      <div className="flex-1">
        {/* BLE Status Indicator */}
        {isScanning && (
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mb-4 flex items-center gap-2">
            <Bluetooth className="w-5 h-5 text-blue-600 animate-pulse" />
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900">BLE Scanning Active</p>
              <p className="text-xs text-blue-700">Detecting nearby users via Bluetooth Low Energy</p>
            </div>
            <Radio className={`w-5 h-5 text-blue-600 ${pulseAnimation === 0 ? 'opacity-100' : pulseAnimation === 1 ? 'opacity-50' : 'opacity-25'}`} />
          </div>
        )}

        {/* Scan Control */}
        <div className="text-center mb-6">
          <Button
            onClick={isScanning ? stopScanning : startScanning}
            size="lg"
            className={`${
              isScanning 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-600 hover:bg-blue-700'
            } text-white px-8 py-3 rounded-full shadow-lg transition-all`}
          >
            {isScanning ? (
              <>
                <WifiOff className="w-5 h-5 mr-2" />
                Stop BLE Scan
              </>
            ) : (
              <>
                <Bluetooth className="w-5 h-5 mr-2" />
                Start BLE Scan
              </>
            )}
          </Button>
          <p className="text-sm text-gray-600 mt-2 flex items-center justify-center gap-1">
            <Radio className="w-4 h-4" />
            Real-time distance tracking • Auto-connect on match
          </p>
        </div>


        {/* Nearby Users List */}
        {filteredUsers.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-800">Nearby People</h3>
            {filteredUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.distance}m away • {user.age}, {user.gender}</p>
                      <p className="text-xs text-gray-500">{user.bio}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.interests.slice(0, 3).map(interest => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleConnect(user.id)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                      disabled={!canAddMoreConnections}
                    >
                      {canAddMoreConnections ? 'Connect' : (
                        <>
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleProposeMeetup(user)}
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Calendar className="w-4 h-4" />
                      Meetup
                    </Button>
                  </div>

                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <FilterPanel
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {selectedUser && (
        <MeetupProposal
          isOpen={showMeetupProposal}
          onClose={() => {
            setShowMeetupProposal(false);
            setSelectedUser(null);
          }}
          recipient={selectedUser}
          onPropose={(venue, time, message) => {
            proposeMeetup(selectedUser.id, venue, time, message);
            setShowMeetupProposal(false);
            setSelectedUser(null);
          }}
        />
      )}

      <LocationPermissionModal
        isOpen={showLocationModal}
        onAllow={handleAllowLocation}
        onDeny={handleDenyLocation}
        isDenied={locationPermission === 'denied'}
      />

      <UpgradePrompt
        open={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        feature={upgradeFeature}
        onUpgrade={handleUpgrade}
      />
    </div>
  );
};

export default RadarScreen;
