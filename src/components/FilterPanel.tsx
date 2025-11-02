import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X, Filter } from 'lucide-react';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    ageRange: [number, number];
    gender: string;
    maxDistance: number;
    interests: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const availableInterests = ['Music', 'Sports', 'Travel', 'Food', 'Art', 'Technology', 'Gaming', 'Fitness', 'Reading', 'Movies'];

  const toggleInterest = (interest: string) => {
    const newInterests = filters.interests.includes(interest)
      ? filters.interests.filter(i => i !== interest)
      : [...filters.interests, interest];
    onFiltersChange({ ...filters, interests: newInterests });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Age Range</label>
            <Slider
              value={filters.ageRange}
              onValueChange={(value) => onFiltersChange({ ...filters, ageRange: value as [number, number] })}
              max={80}
              min={18}
              step={1}
              className="mb-2"
            />
            <div className="flex justify-between text-sm text-gray-500">
              <span>{filters.ageRange[0]}</span>
              <span>{filters.ageRange[1]}</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Gender</label>
            <Select value={filters.gender} onValueChange={(value) => onFiltersChange({ ...filters, gender: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Max Distance: {filters.maxDistance}m</label>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={(value) => onFiltersChange({ ...filters, maxDistance: value[0] })}
              max={1000}
              min={10}
              step={10}
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Interests</label>
            <div className="flex flex-wrap gap-2">
              {availableInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={filters.interests.includes(interest) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onFiltersChange({ ageRange: [18, 80], gender: 'any', maxDistance: 500, interests: [] })}
            >
              Clear All
            </Button>
            <Button className="flex-1" onClick={onClose}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterPanel;