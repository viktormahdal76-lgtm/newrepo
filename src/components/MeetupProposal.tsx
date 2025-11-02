import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { mockVenues } from '@/data/venues';
import VenueCard from './VenueCard';
import { Venue, User } from '@/types';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';

interface MeetupProposalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: User;
  onPropose: (venue: Venue, time: Date, message: string) => void;
}

const MeetupProposal: React.FC<MeetupProposalProps> = ({ 
  isOpen, 
  onClose, 
  recipient,
  onPropose 
}) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [message, setMessage] = useState('');

  const filteredVenues = mockVenues.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePropose = () => {
    if (selectedVenue && selectedDate && selectedTime) {
      const dateTime = new Date(`${selectedDate}T${selectedTime}`);
      onPropose(selectedVenue, dateTime, message);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Propose Meetup with {recipient.name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label>Search Venues</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Coffee shops, restaurants, parks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
            {filteredVenues.map(venue => (
              <VenueCard
                key={venue.id}
                venue={venue}
                selected={selectedVenue?.id === venue.id}
                onSelect={setSelectedVenue}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label>Time</Label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Message (Optional)</Label>
            <Textarea
              placeholder="Add a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handlePropose}
            disabled={!selectedVenue || !selectedDate || !selectedTime}
            className="w-full"
          >
            Send Proposal
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MeetupProposal;
