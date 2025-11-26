'use client';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Plus, Search } from 'lucide-react';

interface TripsHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateTrip: () => void;
}

export function TripsHeader({ searchQuery, onSearchChange, onCreateTrip }: TripsHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl mb-6">My Trips</h1>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Button onClick={onCreateTrip} className="bg-blue-600 hover:bg-blue-700" aria-label="Create a new trip">
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          Create new trip
        </Button>
        
        <div className="relative flex-1 sm:max-w-md">
          <label htmlFor="search-trips" className="sr-only">Search trips</label>
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
          <Input
            id="search-trips"
            type="search"
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
            aria-label="Search your trips by title or location"
          />
        </div>
      </div>
    </div>
  );
}
