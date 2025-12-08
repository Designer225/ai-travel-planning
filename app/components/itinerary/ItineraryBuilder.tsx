'use client';

import { startTransition, useState, useEffect, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MapPin, Sparkles, Save, Share2, Download, Plus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { EditableTripHeader } from './EditableTripHeader';
import { EditableDayCard } from './EditableDayCard';
import { TripPlan, DayActivity, TripDay } from '@/types';
import { toast, Toaster } from 'sonner';
import { Navigation } from '../layout/Navigation';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/app/lib/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import { tryCheckout } from '@/app/lib/clientUserGate';
import { getTripById, saveItinerary, createTrip } from '@/app/lib/tripActions';
import { getCurrentItineraryId, setCurrentItinerary } from '@/app/lib/itineraryActions';

interface ItineraryBuilderProps {
  onBack?: () => void;
}

const AI_PLAN_STORAGE_KEY = 'ai-itinerary-plan';

const normalizeCategory = (category?: string): DayActivity['category'] => {
  const normalized = (category || '').toLowerCase();
  if (['transport', 'activity', 'food', 'accommodation', 'other'].includes(normalized)) {
    return normalized as DayActivity['category'];
  }
  if (normalized.includes('food') || normalized.includes('restaurant') || normalized.includes('dinner')) {
    return 'food';
  }
  if (normalized.includes('hotel') || normalized.includes('stay')) {
    return 'accommodation';
  }
  if (normalized.includes('flight') || normalized.includes('train') || normalized.includes('bus')) {
    return 'transport';
  }
  return 'activity';
};

const parseAiTripPlan = (raw: unknown): TripPlan | null => {
  if (!raw) return null;
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!parsed || typeof parsed !== 'object') return null;

    const daysInput = Array.isArray((parsed as any).days) ? (parsed as any).days : [];

    const mappedDays: TripDay[] = daysInput.map((day: any, idx: number) => {
      const activitiesInput = Array.isArray(day.activities) ? day.activities : [];
      const activities: DayActivity[] = activitiesInput.map((activity: any, aIdx: number) => {
        const id =
          typeof activity.id === 'string'
            ? activity.id
            : typeof activity.id === 'number'
              ? activity.id.toString()
              : (typeof crypto !== 'undefined' && crypto.randomUUID)
                ? crypto.randomUUID()
                : `activity-${Date.now()}-${idx}-${aIdx}`;

        return {
          id,
          time: typeof activity.time === 'string' ? activity.time : '09:00',
          title: typeof activity.title === 'string' ? activity.title : 'New Activity',
          description: typeof activity.description === 'string' ? activity.description : 'Add details about this activity',
          location: typeof activity.location === 'string' ? activity.location : undefined,
          category: normalizeCategory(activity.category),
        };
      });

      const numericDay =
        typeof day.day === 'number'
          ? day.day
          : typeof day.day === 'string' && !Number.isNaN(parseInt(day.day, 10))
            ? parseInt(day.day, 10)
            : idx + 1;

      return {
        day: numericDay,
        title: typeof day.title === 'string' ? day.title : `Day ${idx + 1}`,
        date: typeof day.date === 'string' ? day.date : undefined,
        activities,
      };
    });

    const days = mappedDays.length
      ? mappedDays
      : [
          {
            day: 1,
            title: 'Day 1',
            activities: [],
          },
        ];

    const normalizeDate = (value?: unknown) => (typeof value === 'string' ? value : undefined);
    const numericTravelers =
      typeof (parsed as any).travelers === 'number' && !Number.isNaN((parsed as any).travelers)
        ? (parsed as any).travelers
        : undefined;

    return {
      title: typeof (parsed as any).title === 'string' ? (parsed as any).title : undefined,
      destination: typeof (parsed as any).destination === 'string' ? (parsed as any).destination : 'Custom Trip',
      startDate: normalizeDate((parsed as any).startDate),
      endDate: normalizeDate((parsed as any).endDate),
      days,
      budget: typeof (parsed as any).budget === 'string' ? (parsed as any).budget : undefined,
      travelers: numericTravelers,
    };
  } catch (error) {
    console.error('Failed to parse AI itinerary payload', error);
    return null;
  }
};

const parseTimeToMinutes = (time?: string | null) => {
  if (!time) return Number.POSITIVE_INFINITY;
  const [hourStr, minuteStr] = time.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  if (isNaN(hour) || isNaN(minute)) return Number.POSITIVE_INFINITY;
  return hour * 60 + minute;
};

export default function ItineraryBuilder({ onBack }: ItineraryBuilderProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tripId, setTripId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const [tripPlan, setTripPlan] = useState<TripPlan>({
    // Blank slate for new trips; other flows that load an existing trip
    // will overwrite this state in loadTripData().
    destination: '',
    startDate: '',
    endDate: '',
    days: [
      {
        day: 1,
        title: 'Day 1',
        date: '',
        activities: [],
      },
    ],
    budget: '',
    travelers: 1,
  });

  const tripIdParam = useMemo(() => searchParams?.get('tripId'), [searchParams]);
  const aiPlanParam = useMemo(() => searchParams?.get('aiPlan'), [searchParams]);

  const handleUpdateTrip = (updates: Partial<TripPlan>) => {
    setTripPlan(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateDay = (dayIndex: number, updates: Partial<TripDay>) => {
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => 
        idx === dayIndex ? { ...day, ...updates } : day
      ),
    }));
  };

  const handleUpdateActivity = (dayIndex: number, activityId: string, updates: Partial<DayActivity>) => {
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => {
        if (idx !== dayIndex) return day;

        let updatedActivities = day.activities.map(activity =>
          activity.id === activityId ? { ...activity, ...updates } : activity
        );

        // If time was updated, keep activities sorted chronologically
        if (updates.time !== undefined) {
          updatedActivities = [...updatedActivities].sort(
            (a, b) => parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
          );
        }

        return {
          ...day,
          activities: updatedActivities,
        };
      }),
    }));
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId),
        };
      }),
    }));
  };

  const handleMoveActivity = (fromDayIndex: number, fromActivityId: string, toDayIndex: number, toPosition: number) => {
    setTripPlan(prev => {
      // Deep clone the days array to avoid mutation
      const newDays = prev.days.map(day => ({
        ...day,
        activities: [...day.activities],
      }));
      
      // Find and remove the activity from source day
      const sourceDay = newDays[fromDayIndex];
      const activityIndex = sourceDay.activities.findIndex(a => a.id === fromActivityId);
      if (activityIndex === -1) return prev;
      
      const [activity] = sourceDay.activities.splice(activityIndex, 1);
      
      // Add to target day at position
      const targetDay = newDays[toDayIndex];
      targetDay.activities.splice(toPosition, 0, activity);
      
      return { ...prev, days: newDays };
    });
  };

  const handleAddActivity = (dayIndex: number) => {
    const newActivity: DayActivity = {
      id: `activity-${Date.now()}`,
      time: '10:00',
      title: 'New Activity',
      description: 'Add details about this activity',
      category: 'activity',
    };

    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => 
        idx === dayIndex 
          ? { ...day, activities: [...day.activities, newActivity] }
          : day
      ),
    }));
  };

  const handleAddDay = () => {
    const newDay: TripDay = {
      day: tripPlan.days.length + 1,
      title: 'New Day',
      activities: [],
    };

    setTripPlan(prev => ({
      ...prev,
      days: [...prev.days, newDay],
    }));
  };

  useEffect(() => {
    loadTripData(tripIdParam, aiPlanParam);
  }, [tripIdParam, aiPlanParam]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(AI_PLAN_STORAGE_KEY, JSON.stringify(tripPlan));
  }, [tripPlan]);

  useEffect(() => {
    if (!tripId) return;
    const currentParam = searchParams?.get('tripId');
    if (currentParam === String(tripId)) return;
    const params = new URLSearchParams(searchParams?.toString());
    params.set('tripId', String(tripId));
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [tripId, router, searchParams]);

  const loadTripData = async (tripIdFromUrl?: string | null, aiPlanFromUrl?: string | null) => {
    setLoading(true);
    try {
      // Check for tripId in URL params
      const urlTripId = tripIdFromUrl;
      if (urlTripId) {
        const id = parseInt(urlTripId);
        if (!isNaN(id)) {
          const result = await getTripById(id);
          if (result.success && result.tripPlan) {
            setTripPlan(result.tripPlan);
            setTripId(id);
            await setCurrentItinerary(id);
            setLoading(false);
            return;
          }
        }
      }

      // Check for current itinerary in session
      const currentItineraryId = await getCurrentItineraryId();
      if (currentItineraryId) {
        const result = await getTripById(currentItineraryId);
        if (result.success && result.tripPlan) {
          setTripPlan(result.tripPlan);
          setTripId(currentItineraryId);
          await setCurrentItinerary(currentItineraryId);
          setLoading(false);
          return;
        }
      }

      const aiPayload = aiPlanFromUrl ? decodeURIComponent(aiPlanFromUrl) : null;
      const storedPlan = typeof window !== 'undefined' ? sessionStorage.getItem(AI_PLAN_STORAGE_KEY) : null;
      const aiPlan = parseAiTripPlan(aiPayload || storedPlan);
      if (aiPlan) {
        setTripPlan(aiPlan);
        setTripId(null);
        setLoading(false);
        return;
      }

      // No existing trip, start with default
      setTripId(null);
    } catch (error) {
      console.error('Error loading trip:', error);
      toast.error('Failed to load trip');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      let currentTripId = tripId;

      // If no tripId, create a new trip
      if (!currentTripId) {
        const titleFallback =
          tripPlan.title ||
          tripPlan.destination ||
          'New Trip';

        const createResult = await createTrip(
          titleFallback,
          tripPlan.destination || 'Destination TBD',
          tripPlan.startDate,
          tripPlan.endDate
        );
        if (!createResult.success || !createResult.tripId) {
          toast.error(createResult.error || 'Failed to create trip');
          return;
        }
        currentTripId = createResult.tripId;
        setTripId(currentTripId);
      }

      // Save the itinerary
      const result = await saveItinerary(currentTripId, tripPlan);
      if (result.success) {
        await setCurrentItinerary(currentTripId);
        toast.success('Itinerary saved successfully!');
      } else {
        toast.error(result.error || 'Failed to save itinerary');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save itinerary');
    }
  };

  const handleShare = () => {
    // Simulate share
    toast.success('Share link copied to clipboard!');
    console.log('Sharing itinerary:', tripPlan);
  };

  const handleExport = () => {
    // Simulate export to PDF
    toast.success('Exporting itinerary to PDF...');
    console.log('Exporting itinerary:', tripPlan);
  };

  const handleCheckout = () => {
    // simulate checkout current trip
    toast.success('Checking out current itinerary...');
    console.log('Checking out itinerary:', tripPlan);
    startTransition(async () => {
      await tryCheckout(tripPlan, router);
    });
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <p className="text-gray-700">Loading itinerary...</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" richColors />
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <ThemeProvider theme={theme}>
          {/* Header */}
          <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
            <Navigation />
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {onBack && (
                    <Button variant="ghost" size="sm" className="gap-2" onClick={onBack} aria-label="Back to chat">
                      <ArrowLeft className="w-4 h-4" />
                      Back to Chat
                    </Button>
                  )}
                  {onBack && <div className="h-6 w-px bg-gray-300" />}
                  <div className="flex items-center gap-3">
                    <div className="relative" aria-hidden>
                      <MapPin className="w-8 h-8 text-blue-600" />
                      <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
                    </div>
                    <div>
                      <h1 className="text-xl">Itinerary Builder</h1>
                      <p className="text-sm text-gray-700">Edit and organize your trip</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleShare} className="gap-2" aria-label="Share itinerary">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleExport} className="gap-2" aria-label="Export itinerary to PDF">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSave}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    aria-label="Save itinerary changes"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleCheckout}
                    className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    aria-label="Proceed to checkout for this itinerary"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden" role="main">
            <ScrollArea className="h-full">
              <div className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Editable Trip Header */}
                <EditableTripHeader tripPlan={tripPlan} onUpdate={handleUpdateTrip} />

                {/* Days List */}
                <div className="space-y-6 mt-8">
                  {tripPlan.days.map((day, index) => (
                    <EditableDayCard
                      key={day.day}
                      day={day}
                      dayIndex={index}
                      onUpdateDay={(updates) => handleUpdateDay(index, updates)}
                      onUpdateActivity={(activityId, updates) => handleUpdateActivity(index, activityId, updates)}
                      onDeleteActivity={(activityId) => handleDeleteActivity(index, activityId)}
                      onMoveActivity={handleMoveActivity}
                      onAddActivity={() => handleAddActivity(index)}
                    />
                  ))}
                </div>

                {/* Add Day Button */}
                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={handleAddDay}
                    className="w-full border-dashed border-2 h-16 gap-2 hover:bg-blue-50 hover:border-blue-300"
                    aria-label="Add another itinerary day"
                  >
                    <Plus className="w-5 h-5" />
                    Add Another Day
                  </Button>
                </div>

                {/* Bottom Padding */}
                <div className="h-20" />
              </div>
            </ScrollArea>
          </div>
        </ThemeProvider>
      </div>
    </DndProvider>
  );
}
