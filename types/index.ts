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


