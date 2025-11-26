'use client';

import { useState } from 'react';
import { Navigation } from '../layout/Navigation';
import { TripsHeader } from './TripsHeader';
import { TripsList } from './TripsList';
import { Button } from '../ui/button';
import { TripsListHeader } from './TripsListHeader';
import { ScrollArea } from '@radix-ui/react-scroll-area';

export default function Trips() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');

  const handleCreateTrip = () => {
    console.log('Create new trip');
    // Handle create trip functionality
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header>
        <Navigation/>
      </header>
      
      <main id="main-content" className="flex flex-col flex-1 overflow-hidden container mx-auto px-4 py-8">
        <TripsHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onCreateTrip={handleCreateTrip}
        />
        
        {/* Tabs */}
        <TripsListHeader
          activeTab={activeTab}
          onSetActiveTab={setActiveTab}
        />
        
        <ScrollArea className='h-full overflow-auto'>
        {/* Trips List */}
        <div className="mt-6">
          <TripsList 
            tripType={activeTab} 
            searchQuery={searchQuery}
          />
        </div>
        </ScrollArea>
      </main>
    </div>
  );
}
