import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Radar, 
  Users, 
  Calendar,
  MessageCircle, 
  User
} from 'lucide-react';
import { AppScreen } from '@/types';

const BottomNavigation: React.FC = () => {
  const { currentScreen, setCurrentScreen, connections, chats, meetups } = useAppContext();

  const navItems: Array<{
    screen: AppScreen;
    icon: React.ComponentType<any>;
    label: string;
    badge?: number;
  }> = [
    {
      screen: 'radar',
      icon: Radar,
      label: 'Radar',
    },
    {
      screen: 'connections',
      icon: Users,
      label: 'Connections',
      badge: connections.filter(c => c.status === 'pending').length,
    },
    {
      screen: 'meetups',
      icon: Calendar,
      label: 'Meetups',
      badge: meetups.filter(m => m.status === 'pending').length,
    },
    {
      screen: 'chat',
      icon: MessageCircle,
      label: 'Chat',
      badge: chats.reduce((sum, chat) => sum + chat.unreadCount, 0),
    },
    {
      screen: 'profile',
      icon: User,
      label: 'Profile',
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ screen, icon: Icon, label, badge }) => (
          <Button
            key={screen}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 p-2 h-auto relative ${
              currentScreen === screen
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setCurrentScreen(screen)}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
            {badge && badge > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 w-5 h-5 p-0 text-xs flex items-center justify-center"
              >
                {badge > 9 ? '9+' : badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default BottomNavigation;
