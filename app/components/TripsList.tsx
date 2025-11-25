import { useState } from 'react';
import { TripCard } from './TripCard';
import { toast } from 'sonner';

export interface Trip {
  id: string;
  title?: string;
  destination: string;
  dateRange?: string;
  tripTime: string;
  activities: number;
  imageUrl: string;
}

interface TripsListProps {
  tripType: 'upcoming' | 'past' | 'saved';
  searchQuery: string;
}

const MOCK_UPCOMING_TRIPS: Trip[] = [
  {
    id: '1',
    destination: 'Paris, France',
    dateRange: 'Dec 15 - Dec 22, 2025',
    tripTime: '7 days',
    activities: 18,
    imageUrl: 'https://images.unsplash.com/photo-1549144511-f099e773c147?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxQYXJpcyUyMEZyYW5jZXxlbnwxfHx8fDE3NjI4MTEyNjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '2',
    destination: 'Tokyo, Japan',
    dateRange: 'Jan 10 - Jan 20, 2026',
    tripTime: '10 days',
    activities: 25,
    imageUrl: 'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUb2t5byUyMEphcGFufGVufDF8fHx8MTc2Mjc0MDYyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '3',
    destination: 'New York, USA',
    dateRange: 'Nov 20 - Nov 25, 2025',
    tripTime: '5 days',
    activities: 12,
    imageUrl: 'https://images.unsplash.com/photo-1543716091-a840c05249ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxOZXclMjBZb3JrJTIwQ2l0eXxlbnwxfHx8fDE3NjI4NDM3ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

const MOCK_PAST_TRIPS: Trip[] = [
  {
    id: '4',
    destination: 'Barcelona, Spain',
    dateRange: 'Aug 5 - Aug 12, 2025',
    tripTime: '7 days',
    activities: 20,
    imageUrl: 'https://images.unsplash.com/photo-1593368858664-a7fe556ab936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCYXJjZWxvbmElMjBTcGFpbnxlbnwxfHx8fDE3NjI4NDM3ODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '5',
    destination: 'Rome, Italy',
    dateRange: 'Jun 1 - Jun 8, 2025',
    tripTime: '7 days',
    activities: 22,
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSb21lJTIwSXRhbHl8ZW58MXx8fHwxNzYyODExMjY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '6',
    destination: 'London, UK',
    dateRange: 'Apr 15 - Apr 19, 2025',
    tripTime: '4 days',
    activities: 15,
    imageUrl: 'https://images.unsplash.com/photo-1569865867048-34cfce8d58fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxMb25kb24lMjBVS3xlbnwxfHx8fDE3NjI4NDM3ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

const MOCK_SAVED_TRIPS: Trip[] = [
  {
    id: '7',
    title: 'Ultimate Beach Getaway',
    destination: 'Maldives',
    tripTime: '5 days',
    activities: 10,
    imageUrl: 'https://images.unsplash.com/photo-1622779536320-bb5f5b501a06?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNYWxkaXZlcyUyMGJlYWNofGVufDF8fHx8MTc2Mjg0Mzc4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '8',
    title: 'Mountain Adventure',
    destination: 'Swiss Alps',
    tripTime: '6 days',
    activities: 14,
    imageUrl: 'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTd2lzcyUyMEFscHN8ZW58MXx8fHwxNzYyODQzNzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '9',
    title: 'Cultural Exploration',
    destination: 'Kyoto, Japan',
    tripTime: '8 days',
    activities: 16,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxLeW90byUyMEphcGFufGVufDF8fHx8MTc2Mjg0Mzc4M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export function TripsList({ tripType, searchQuery }: TripsListProps) {
  const [upcomingTrips, setUpcomingTrips] = useState(MOCK_UPCOMING_TRIPS);
  const [pastTrips, setPastTrips] = useState(MOCK_PAST_TRIPS);
  const [savedTrips, setSavedTrips] = useState(MOCK_SAVED_TRIPS);

  const handleCancelTrip = (tripId: string) => {
    setUpcomingTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    toast.success('Trip has been canceled');
  };

  const handleDeleteTrip = (tripId: string) => {
    setSavedTrips((prev) => prev.filter((trip) => trip.id !== tripId));
    toast.success('Trip has been deleted');
  };

  const handleEditTrip = (tripId: string) => {
    // This would open the itinerary builder
    console.log('Edit trip:', tripId);
  };

  const handleCopyTrip = (tripId: string) => {
    // This would open the itinerary builder
    console.log('Copy trip:', tripId);
  };

  const getCurrentTrips = () => {
    switch (tripType) {
      case 'upcoming':
        return upcomingTrips;
      case 'past':
        return pastTrips;
      case 'saved':
        return savedTrips;
    }
  };

  const filteredTrips = getCurrentTrips().filter((trip) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      trip.destination.toLowerCase().includes(searchLower) ||
      trip.title?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  if (filteredTrips.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">
          {searchQuery ? 'No trips found matching your search' : `No ${tripType} trips yet`}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTrips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          type={tripType}
          onCancel={handleCancelTrip}
          onDelete={handleDeleteTrip}
          onEdit={handleEditTrip}
          onCopy={handleCopyTrip}
        />
      ))}
    </div>
  );
}