export interface DayActivity {
  id: string;
  time: string;
  title: string;
  description: string;
  location?: string;
  category: 'transport' | 'activity' | 'food' | 'accommodation' | 'other';
}

export interface TripDay {
  day: number;
  date?: string;
  title: string;
  activities: DayActivity[];
}

export interface TripPlan {
  destination: string;
  startDate?: string;
  endDate?: string;
  days: TripDay[];
  budget?: string;
  travelers?: number;
}

export default interface SiteUser {
    id: number;
    firstName: string;
    lastName: string;
    bio: string;
    email: string;
    location: string;
    avatarUrl: string;
}

export type DestinationType = "attraction" | "food" | "lodging";

export interface Destination {
  id: number;
  name: string;
  type: DestinationType;
  lat: number;
  lng: number;
  description: string;
  tags: string[];
  rating: number;
  priceLevel?: string;
}
