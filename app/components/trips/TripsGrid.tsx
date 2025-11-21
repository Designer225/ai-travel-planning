'use client';

import { TripCard } from './TripCard';

export interface Trip {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
}

interface TripsGridProps {
  trips: Trip[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TripsGrid({ trips, onEdit, onDelete }: TripsGridProps) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-12" role="status">
        <p className="text-xl text-gray-600">No trips found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
      {trips.map(trip => (
        <TripCard
          key={trip.id}
          id={trip.id}
          image={trip.image}
          title={trip.title}
          location={trip.location}
          date={trip.date}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
