'use client';

import { startTransition, useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MapPin, Sparkles, Save, Share2, Download, Plus, ArrowLeft, ShoppingCart } from 'lucide-react';
import { Button } from '@mui/material';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import EditableTripHeader from './EditableTripHeader';
import EditableDayCard from './EditableDayCard';
import { TripPlan, DayActivity, TripDay } from '@/types';
import { toast, Toaster } from 'sonner';
import { Navigation } from '../layout/Navigation';
import { ThemeProvider } from '@mui/material';
import { theme } from '@/app/lib/themes';
import { useRouter, useSearchParams } from 'next/navigation';
import { tryCheckout } from '@/app/lib/clientUserGate';
import { getTripById, saveItinerary, createTrip } from '@/app/lib/tripActions';
import { getCurrentItineraryId, getCurrentItinerary } from '@/app/lib/itineraryActions';

interface ItineraryBuilderProps {
  onBack?: () => void;
}

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
    const parseTimeToMinutes = (time?: string | null) => {
      if (!time) return Number.POSITIVE_INFINITY;
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      if (isNaN(hour) || isNaN(minute)) return Number.POSITIVE_INFINITY;
      return hour * 60 + minute;
    };

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
    loadTripData();
  }, []);

  const loadTripData = async () => {
    setLoading(true);
    try {
      // Check for tripId in URL params
      const urlTripId = searchParams?.get('tripId');
      if (urlTripId) {
        const id = parseInt(urlTripId);
        if (!isNaN(id)) {
          const result = await getTripById(id);
          if (result.success && result.tripPlan) {
            setTripPlan(result.tripPlan);
            setTripId(id);
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
          setLoading(false);
          return;
        }
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
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <p className="text-gray-500">Loading itinerary...</p>
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
                    <Button variant="outlined" sx={{
                      gap: 2,
                      border: "none",
                      color: "#000",
                      ":hover": {
                        backgroundColor: "#eee"
                      }
                    }} onClick={onBack}>
                      <ArrowLeft className="w-4 h-4" />
                      Back to Chat
                    </Button>
                  )}
                  {onBack && <div className="h-6 w-px bg-gray-300" />}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <MapPin className="w-8 h-8 text-blue-600" />
                      <Sparkles className="w-4 h-4 text-purple-500 absolute -top-1 -right-1" />
                    </div>
                    <div>
                      <h1 className="text-xl">Itinerary Builder</h1>
                      <p className="text-sm text-gray-600">Edit and organize your trip</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="outlined" onClick={handleShare} sx={{
                    color: "#000",
                    border: "none",
                    gap: 1,
                    ":hover": {
                      backgroundColor: "#eee"
                    }
                  }}>
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="outlined" onClick={handleExport} sx={{
                    color: "#000",
                    border: "none",
                    gap: 1,
                    ":hover": {
                      backgroundColor: "#eee"
                    }
                  }}>
                    <Download className="w-4 h-4" />
                    Export PDF
                  </Button>
                  <Button 
                    variant='contained'
                    onClick={handleSave}
                    className="gradient-button"
                    sx={{
                      gap: 1
                    }}
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                  <Button 
                    variant='contained'
                    onClick={handleCheckout}
                    className="gradient-button"
                    sx={{
                      gap: 1
                    }}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Checkout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
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
                    variant="outlined"
                    onClick={handleAddDay}
                    className="w-full border-dashed border-2 h-16 gap-2 hover:bg-blue-50 hover:border-blue-300"
                    sx={{
                      border: "dashed 1px #000",
                      color: "#000"
                    }}
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




