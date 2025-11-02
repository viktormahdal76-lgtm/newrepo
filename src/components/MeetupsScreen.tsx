import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, MapPin, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Meetup } from '@/types';

const MeetupsScreen: React.FC = () => {
  const { meetups, acceptMeetup, declineMeetup, nearbyUsers, currentUser } = useAppContext();

  const getUserById = (id: string) => {
    return nearbyUsers.find(u => u.id === id);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const pendingMeetups = meetups.filter(m => m.status === 'pending');
  const acceptedMeetups = meetups.filter(m => m.status === 'accepted');
  const pastMeetups = meetups.filter(m => m.status === 'completed' || m.status === 'declined');

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Meetups</h1>
        <p className="text-sm text-gray-600">Manage your meetup proposals</p>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto">
        {pendingMeetups.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Pending ({pendingMeetups.length})
            </h2>
            <div className="space-y-3">
              {pendingMeetups.map(meetup => {
                const otherUser = getUserById(
                  meetup.proposerId === currentUser?.id ? meetup.recipientId : meetup.proposerId
                );
                const isProposer = meetup.proposerId === currentUser?.id;
                
                return (
                  <Card key={meetup.id} className="p-4">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback>{otherUser?.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{otherUser?.name}</h3>
                          <Badge variant={isProposer ? 'secondary' : 'default'}>
                            {isProposer ? 'Sent' : 'Received'}
                          </Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{meetup.venue.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(meetup.proposedTime)} at {formatTime(meetup.proposedTime)}</span>
                          </div>
                        </div>
                        {meetup.message && (
                          <p className="text-sm text-gray-500 mt-2 italic">"{meetup.message}"</p>
                        )}
                        {!isProposer && (
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              onClick={() => acceptMeetup(meetup.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => declineMeetup(meetup.id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Decline
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {acceptedMeetups.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Confirmed ({acceptedMeetups.length})
            </h2>
            <div className="space-y-3">
              {acceptedMeetups.map(meetup => {
                const otherUser = getUserById(
                  meetup.proposerId === currentUser?.id ? meetup.recipientId : meetup.proposerId
                );
                
                return (
                  <Card key={meetup.id} className="p-4 border-green-200 bg-green-50">
                    <div className="flex gap-3">
                      <Avatar>
                        <AvatarImage src={otherUser?.avatar} />
                        <AvatarFallback>{otherUser?.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-2">{otherUser?.name}</h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-medium">{meetup.venue.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(meetup.proposedTime)} at {formatTime(meetup.proposedTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {meetups.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No meetups yet</h3>
            <p className="text-sm text-gray-500">
              Start by proposing a meetup from the Radar screen
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetupsScreen;
