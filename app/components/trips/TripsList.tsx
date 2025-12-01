'use client';

import { startTransition, useState, useEffect } from 'react';
import { TripCard } from './TripCard';
import { toast } from 'sonner';
import { tryCopyItinerary, tryEnterItineraryBuilder } from '@/app/lib/clientUserGate';
import { useRouter } from 'next/navigation';
import { getUserTrips, deleteTrip, copyTrip, updateTrip } from '@/app/lib/tripActions';

export interface Trip {
  id: number;
  title: string;
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

export function TripsList({ tripType, searchQuery }: TripsListProps) {
  const router = useRouter();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, [tripType]);

  const loadTrips = async () => {
    setLoading(true);
    const result = await getUserTrips(tripType);
    if (result.success && result.trips) {
      setTrips(result.trips);
    } else {
      toast.error(result.error || 'Failed to load trips');
      setTrips([]);
    }
    setLoading(false);
  };

  const handleCancelTrip = async (tripId: number) => {
    const result = await updateTrip(tripId, { status: 'saved' });
    if (result.success) {
      toast.success('Trip has been canceled');
      loadTrips();
    } else {
      toast.error(result.error || 'Failed to cancel trip');
    }
  };

  const handleDeleteTrip = async (tripId: number) => {
    const result = await deleteTrip(tripId);
    if (result.success) {
      toast.success('Trip has been deleted');
      loadTrips();
    } else {
      toast.error(result.error || 'Failed to delete trip');
    }
  };

  const handleEditTrip = (tripId: number) => {
    startTransition(async () => {
      await tryEnterItineraryBuilder(router, undefined, tripId);
    });
  };

  const handleCopyTrip = async (tripId: number) => {
    const result = await copyTrip(tripId);
    if (result.success && result.newTripId) {
      toast.success('Trip copied successfully');
      startTransition(async () => {
        await tryEnterItineraryBuilder(router, undefined, result.newTripId);
      });
    } else {
      toast.error(result.error || 'Failed to copy trip');
    }
  };

  const filteredTrips = trips.filter((trip) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      trip.destination.toLowerCase().includes(searchLower) ||
      trip.title?.toLowerCase().includes(searchLower) ||
      false
    );
  });

  if (loading) {
    return (
      <p className="text-gray-500 text-center py-12">Loading trips...</p>
    );
  }

  if (filteredTrips.length === 0) {
    return (
      <p className="text-gray-500 text-center py-12">
        {searchQuery ? 'No trips found matching your search' : `No ${tripType} trips yet`}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
