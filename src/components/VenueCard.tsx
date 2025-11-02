import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star } from 'lucide-react';
import { Venue } from '@/types';

interface VenueCardProps {
  venue: Venue;
  onSelect?: (venue: Venue) => void;
  selected?: boolean;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, onSelect, selected }) => {
  return (
    <Card 
      className={`overflow-hidden cursor-pointer transition-all hover:shadow-lg ${
        selected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect?.(venue)}
    >
      <img 
        src={venue.image} 
        alt={venue.name} 
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-sm">{venue.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {venue.type}
          </Badge>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
          <MapPin className="w-3 h-3" />
          <span>{venue.distance} mi away</span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span>{venue.rating}</span>
        </div>
      </div>
    </Card>
  );
};

export default VenueCard;
