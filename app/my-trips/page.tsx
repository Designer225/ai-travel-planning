'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { TripCard } from '@/components/TripCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';

const mockTrips = [
  {
    id: '1',
    title: 'Paris Adventure',
    location: 'Paris, France',
    date: 'Dec 15-22, 2025',
    image: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2Mjk2NTA2NHww&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '2',
    title: 'Tokyo Experience',
    location: 'Tokyo, Japan',
    date: 'Jan 10-20, 2026',
    image: 'https://images.unsplash.com/photo-1640871426525-a19540c45a39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b2t5byUyMGphcGFuJTIwY2l0eXxlbnwxfHx8fDE3NjI4OTY4MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '3',
    title: 'Bali Retreat',
    location: 'Bali, Indonesia',
    date: 'Feb 5-15, 2026',
    image: 'https://images.unsplash.com/photo-1729605411113-daa81a7836b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwYmVhY2glMjB0cm9waWNhbHxlbnwxfHx8fDE3NjI5OTQyMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    id: '4',
    title: 'New York City Break',
    location: 'New York, USA',
    date: 'Mar 1-7, 2026',
    image: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXclMjB5b3JrJTIwY2l0eSUyMHNreWxpbmV8ZW58MXx8fHwxNzYyOTg4MTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export default function MyTrips() {
  const [trips, setTrips] = useState(mockTrips);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = trips.filter(trip =>
    trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string) => {
    console.log('Edit trip:', id);
    // Handle edit functionality
  };

  const handleDelete = (id: string) => {
    setTrips(trips.filter(trip => trip.id !== id));
  };

  const handleCreateTrip = () => {
    console.log('Create new trip');
    // Handle create trip functionality
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main id="main-content" className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl mb-6">My Trips</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Button onClick={handleCreateTrip} className="bg-blue-600 hover:bg-blue-700" aria-label="Create a new trip">
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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Search your trips by title or location"
              />
            </div>
          </div>
        </div>
        
        {filteredTrips.length === 0 ? (
          <div className="text-center py-12" role="status">
            <p className="text-xl text-gray-600">No trips found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {filteredTrips.map(trip => (
              <TripCard
                key={trip.id}
                id={trip.id}
                image={trip.image}
                title={trip.title}
                location={trip.location}
                date={trip.date}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
