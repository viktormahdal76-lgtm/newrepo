import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Users, Check, X, Clock } from 'lucide-react';

const ConnectionsScreen: React.FC = () => {
  const { 
    connections, 
    nearbyUsers, 
    acceptConnection, 
    declineConnection 
  } = useAppContext();

  const pendingConnections = connections.filter(c => c.status === 'pending');
  const acceptedConnections = connections.filter(c => c.status === 'accepted');

  const getUserById = (id: string) => 
    nearbyUsers.find(user => user.id === id);

  return (
    <div className="flex flex-col h-full bg-gray-50 p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Connections</h1>
        </div>
        <Badge variant="outline" className="flex items-center gap-1">
          {acceptedConnections.length} Connected
        </Badge>
      </div>

      <div className="flex-1 space-y-6">
        {/* Pending Requests */}
        {pendingConnections.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Pending Requests ({pendingConnections.length})
            </h2>
            <div className="space-y-3">
              {pendingConnections.map((connection) => {
                const user = getUserById(connection.userId);
                if (!user) return null;

                return (
                  <Card key={connection.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.distance}m away</p>
                          <p className="text-xs text-gray-500">{user.bio}</p>
                          <div className="flex gap-1 mt-1">
                            {user.interests.slice(0, 2).map((interest) => (
                              <Badge key={interest} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => acceptConnection(connection.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white p-2"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => declineConnection(connection.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Accepted Connections */}
        {acceptedConnections.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Check className="w-5 h-5 text-green-500" />
              Connected ({acceptedConnections.length})
            </h2>
            <div className="space-y-3">
              {acceptedConnections.map((connection) => {
                const user = getUserById(connection.userId);
                if (!user) return null;

                return (
                  <Card key={connection.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-gray-600">{user.distance}m away</p>
                          <p className="text-xs text-gray-500">{user.bio}</p>
                          <div className="flex gap-1 mt-1">
                            {user.interests.slice(0, 3).map((interest) => (
                              <Badge key={interest} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Message
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700"
                        >
                          Meet Up
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {connections.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No connections yet</h3>
            <p className="text-gray-500 mb-4">
              Start scanning to find people nearby and send connection requests
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Start Scanning
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsScreen;