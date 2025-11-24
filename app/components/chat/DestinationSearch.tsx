'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Slider } from '@/app/components/ui/slider';
import { Separator } from '@/app/components/ui/separator';
import { 
  Search, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Palmtree, 
  Mountain, 
  Sparkles,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { destinations, activityTypes, vibeTypes, climateTypes, budgetRanges, Destination } from '@/data/destinations';
import { DestinationCard } from '@/app/components/itinerary/DestinationCard';

interface DestinationSearchProps {
  open: boolean;
  onClose: () => void;
  onSelectDestination: (destination: Destination) => void;
}

export function DestinationSearch({ open, onClose, onSelectDestination }: DestinationSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedClimate, setSelectedClimate] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 1000]);
  const [durationRange, setDurationRange] = useState<[number, number]>([1, 14]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          dest.name.toLowerCase().includes(query) ||
          dest.country.toLowerCase().includes(query) ||
          dest.region.toLowerCase().includes(query) ||
          dest.description.toLowerCase().includes(query) ||
          dest.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Activities filter
      if (selectedActivities.length > 0) {
        const hasActivity = selectedActivities.some(activity => 
          dest.activities.includes(activity)
        );
        if (!hasActivity) return false;
      }

      // Vibe filter
      if (selectedVibes.length > 0) {
        const hasVibe = selectedVibes.some(vibe => 
          dest.vibe.includes(vibe)
        );
        if (!hasVibe) return false;
      }

      // Climate filter
      if (selectedClimate.length > 0) {
        if (!selectedClimate.includes(dest.climate)) return false;
      }

      // Budget filter
      const avgBudget = dest.averageBudgetPerDay.midRange;
      if (avgBudget < budgetRange[0] || avgBudget > budgetRange[1]) {
        return false;
      }

      // Duration filter
      if (dest.idealDuration < durationRange[0] || dest.idealDuration > durationRange[1]) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedActivities, selectedVibes, selectedClimate, budgetRange, durationRange]);

  const handleActivityToggle = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const handleVibeToggle = (vibe: string) => {
    setSelectedVibes(prev => 
      prev.includes(vibe) 
        ? prev.filter(v => v !== vibe)
        : [...prev, vibe]
    );
  };

  const handleClimateToggle = (climate: string) => {
    setSelectedClimate(prev => 
      prev.includes(climate) 
        ? prev.filter(c => c !== climate)
        : [...prev, climate]
    );
  };

  const clearAllFilters = () => {
    setSelectedActivities([]);
    setSelectedVibes([]);
    setSelectedClimate([]);
    setBudgetRange([0, 1000]);
    setDurationRange([1, 14]);
    setSearchQuery('');
  };

  const activeFilterCount = 
    selectedActivities.length + 
    selectedVibes.length + 
    selectedClimate.length +
    (budgetRange[0] !== 0 || budgetRange[1] !== 1000 ? 1 : 0) +
    (durationRange[0] !== 1 || durationRange[1] !== 14 ? 1 : 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!w-[96vw] !max-w-[96vw] h-[90vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            Discover Your Next Destination
          </DialogTitle>
          <DialogDescription>
            Browse and filter destinations to find your perfect trip
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-0 flex-1 min-h-0 overflow-hidden">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-80 lg:w-80 xl:w-96 border-r bg-gray-50 flex flex-col flex-shrink-0`}>
            <div className="p-4 border-b bg-white flex-shrink-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">Filters</h3>
                {activeFilterCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto py-1 px-2 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>
              {activeFilterCount > 0 && (
                <Badge variant="secondary">{activeFilterCount} active</Badge>
              )}
            </div>

            <ScrollArea className="flex-1 h-full">
              <div className="p-4 space-y-6 pr-3">
                {/* Budget */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm">Daily Budget</h4>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={budgetRange}
                      onValueChange={(value) => setBudgetRange(value as [number, number])}
                      min={0}
                      max={1000}
                      step={10}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>${budgetRange[0]}</span>
                      <span>${budgetRange[1] === 1000 ? '1000+' : budgetRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Trip Duration */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm">Trip Duration (days)</h4>
                  </div>
                  <div className="space-y-3">
                    <Slider
                      value={durationRange}
                      onValueChange={(value) => setDurationRange(value as [number, number])}
                      min={1}
                      max={14}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{durationRange[0]} days</span>
                      <span>{durationRange[1] === 14 ? '14+' : durationRange[1]} days</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Activities */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Mountain className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm">Activities</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activityTypes.slice(0, 12).map((activity) => (
                      <Badge
                        key={activity}
                        variant={selectedActivities.includes(activity) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleActivityToggle(activity)}
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Vibe */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm">Vibe</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {vibeTypes.slice(0, 10).map((vibe) => (
                      <Badge
                        key={vibe}
                        variant={selectedVibes.includes(vibe) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => handleVibeToggle(vibe)}
                      >
                        {vibe}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Climate */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Palmtree className="w-4 h-4 text-gray-600" />
                    <h4 className="text-sm">Climate</h4>
                  </div>
                  <div className="space-y-2">
                    {climateTypes.map((climate) => (
                      <div key={climate.value} className="flex items-center gap-2">
                        <Checkbox
                          id={climate.value}
                          checked={selectedClimate.includes(climate.value)}
                          onCheckedChange={() => handleClimateToggle(climate.value)}
                        />
                        <label
                          htmlFor={climate.value}
                          className="text-sm cursor-pointer flex-1"
                        >
                          {climate.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* Search Bar */}
            <div className="p-4 border-b bg-white flex-shrink-0">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search destinations, countries, or activities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-600">
                  {filteredDestinations.length} {filteredDestinations.length === 1 ? 'destination' : 'destinations'} found
                </p>
              </div>
            </div>

            {/* Results */}
            <ScrollArea className="flex-1 h-full">
              <div className="p-4 pr-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {filteredDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onSelect={() => onSelectDestination(destination)}
                  />
                ))}
                {filteredDestinations.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg mb-2">No destinations found</h3>
                    <p className="text-gray-600 text-sm">Try adjusting your filters or search terms</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}



