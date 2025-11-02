import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import SyncStatusIndicator from './SyncStatusIndicator';

const AppHeader: React.FC = () => {
  const { setCurrentScreen } = useAppContext();

  return (
    <div className="flex items-center justify-between px-4 py-4 bg-gradient-to-r from-blue-600 to-green-600">
      <div className="flex items-center gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage 
            src="https://d64gsuwffb70l.cloudfront.net/68ab5f93edcb37324b4ec6b2_1756061824709_12a93fbe.webp" 
            alt="ProximityConnect" 
          />
        </Avatar>
        <h1 className="text-xl font-bold text-white">HuddleMe</h1>
      </div>
      <div className="flex items-center gap-2">
        <SyncStatusIndicator />
        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
          onClick={() => setCurrentScreen('settings')}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
};

export default AppHeader;
