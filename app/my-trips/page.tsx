'use client';

import { useState } from 'react';
import { Navigation } from '../components/layout/Navigation';
import { TripsHeader } from '../components/trips/TripsHeader';
import { TripsList } from '../components/trips/TripsList';
import { Button } from '../components/ui/button';
import { TripsListHeader } from '../components/trips/TripsListHeader';

export default function MyTrips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');

  const handleCreateTrip = () => {
    console.log('Create new trip');
    // Handle create trip functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        <TripsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTrip={handleCreateTrip}
        />
        
        {/* Tabs */}
        <div>
          <TripsListHeader
            activeTab={activeTab}
            onSetActiveTab={setActiveTab}
          />

          {/* Trips List */}
          <div className="mt-6">
            <TripsList 
              tripType={activeTab} 
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
