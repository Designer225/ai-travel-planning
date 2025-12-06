'use client';

import { memo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Button } from '@/app/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import { Calendar, MapPin, DollarSign, Users, Plane, Utensils, Hotel, Navigation, Save, Edit2, X } from 'lucide-react';
import { TripPlan, TripDay, DayActivity } from '@/types';
import { createTrip, saveItinerary } from '@/app/lib/tripActions';
import { setCurrentItinerary } from '@/app/lib/itineraryActions';
import { toast } from 'sonner';
import { EditableTripHeader } from '../itinerary/EditableTripHeader';
import { EditableDayCard } from '../itinerary/EditableDayCard';

interface TripPanelProps {
  tripPlan: TripPlan | null;
  setTripPlan: (plan: TripPlan | null) => void;
  onSendMessage?: (message: string) => void;
}

const categoryIcons = {
  transport: Plane,
  activity: Navigation,
  food: Utensils,
  accommodation: Hotel,
  other: MapPin,
};

const categoryColors = {
  transport: 'bg-blue-100 text-blue-700 border-blue-200',
  activity: 'bg-purple-100 text-purple-700 border-purple-200',
  food: 'bg-orange-100 text-orange-700 border-orange-200',
  accommodation: 'bg-green-100 text-green-700 border-green-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const TripPanel = memo(function TripPanel({ tripPlan, setTripPlan, onSendMessage }: TripPanelProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);

  const handleSave = async () => {
    if (!tripPlan || tripPlan.days.length === 0) {
      toast.error('Please generate an itinerary before saving');
      return;
    }

    setIsSaving(true);
    try {
      // Create a new trip
      const titleFallback = tripPlan.title || tripPlan.destination || 'New Trip';
      const createResult = await createTrip(
        titleFallback,
        tripPlan.destination || 'Destination TBD',
        tripPlan.startDate,
        tripPlan.endDate
      );

      if (!createResult.success || !createResult.tripId) {
        toast.error(createResult.error || 'Failed to create trip');
        setIsSaving(false);
        return;
      }

      // Save the itinerary
      const saveResult = await saveItinerary(createResult.tripId, tripPlan);
      if (saveResult.success) {
        // Set as current itinerary and navigate to itinerary builder
        const setItineraryResult = await setCurrentItinerary(createResult.tripId);
        if (setItineraryResult.success) {
          toast.success('Itinerary saved successfully! Redirecting to editor...');
          router.push(`/itinerary-builder?tripId=${createResult.tripId}`);
        } else {
          toast.success('Itinerary saved! You can find it in My Trips.');
          // Still navigate even if setting current itinerary fails
          router.push(`/itinerary-builder?tripId=${createResult.tripId}`);
        }
      } else {
        toast.error(saveResult.error || 'Failed to save itinerary');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save itinerary');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleDiscard = () => {
    setShowDiscardDialog(true);
  };

  const confirmDiscard = () => {
    setTripPlan(null);
    setIsEditMode(false);
    setShowDiscardDialog(false);
    toast.success('Itinerary discarded');
  };

  const handleUpdateTrip = (updates: Partial<TripPlan>) => {
    if (!tripPlan) return;
    setTripPlan({ ...tripPlan, ...updates });
  };

  const handleUpdateDay = (dayIndex: number, updates: Partial<TripDay>) => {
    if (!tripPlan) return;
    setTripPlan({
      ...tripPlan,
      days: tripPlan.days.map((day, idx) => 
        idx === dayIndex ? { ...day, ...updates } : day
      ),
    });
  };

  const handleUpdateActivity = (dayIndex: number, activityId: string, updates: Partial<DayActivity>) => {
    if (!tripPlan) return;
    const parseTimeToMinutes = (time?: string | null) => {
      if (!time) return Number.POSITIVE_INFINITY;
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);
      if (isNaN(hour) || isNaN(minute)) return Number.POSITIVE_INFINITY;
      return hour * 60 + minute;
    };

    setTripPlan({
      ...tripPlan,
      days: tripPlan.days.map((day, idx) => {
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
    });
  };

  const handleDeleteActivity = (dayIndex: number, activityId: string) => {
    if (!tripPlan) return;
    setTripPlan({
      ...tripPlan,
      days: tripPlan.days.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.filter(activity => activity.id !== activityId),
        };
      }),
    });
  };

  const handleAddActivity = (dayIndex: number) => {
    if (!tripPlan) return;
    const newActivity: DayActivity = {
      id: `new-${Date.now()}`,
      time: '09:00',
      title: 'New Activity',
      description: '',
      category: 'activity',
    };
    setTripPlan({
      ...tripPlan,
      days: tripPlan.days.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: [...day.activities, newActivity],
        };
      }),
    });
  };

  const handleMoveActivity = (fromDayIndex: number, fromActivityId: string, toDayIndex: number, toPosition: number) => {
    if (!tripPlan) return;
    // Find the activity to move
    const fromDay = tripPlan.days[fromDayIndex];
    const activityIndex = fromDay.activities.findIndex(a => a.id === fromActivityId);
    if (activityIndex === -1) return;

    const activity = fromDay.activities[activityIndex];

    setTripPlan({
      ...tripPlan,
      days: tripPlan.days.map((day, idx) => {
        if (idx === fromDayIndex) {
          // Remove from source day
          return {
            ...day,
            activities: day.activities.filter((_, i) => i !== activityIndex),
          };
        } else if (idx === toDayIndex) {
          // Add to target day at position
          const newActivities = [...day.activities];
          newActivities.splice(toPosition, 0, activity);
          return {
            ...day,
            activities: newActivities,
          };
        }
        return day;
      }),
    });
  };

  if (!tripPlan) {
    const examplePrompts = [
      "Plan a 5-day trip to Tokyo",
      "Create a romantic 3-day Paris itinerary",
      "I want to visit Bali for a week",
      "Plan a budget-friendly trip to London",
    ];

    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl w-full">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Your Trip Plan Will Appear Here</h2>
          <p className="text-gray-600 mb-8">
            Start chatting with the AI assistant to create your personalized travel itinerary. 
            I'll build a detailed day-by-day plan as we discuss your preferences.
          </p>
          
          {/* Example Prompts */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-4">Try asking:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer text-left w-full"
                  onClick={() => {
                    if (onSendMessage) {
                      onSendMessage(prompt);
                    }
                  }}
                >
                  <p className="text-sm text-gray-700 font-medium">"{prompt}"</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Trip Header */}
      <div className="p-6 bg-white border-b">
        {isEditMode ? (
          <div>
            <EditableTripHeader tripPlan={tripPlan} onUpdate={handleUpdateTrip} />
            <div className="flex items-center justify-end gap-2 mt-4">
              <Button
                onClick={() => setIsEditMode(false)}
                variant="outline"
                size="sm"
              >
                Exit Edit Mode
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl mb-2">{tripPlan.destination}</h2>
              <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                {tripPlan.startDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{tripPlan.startDate}</span>
                    {tripPlan.endDate && <span> - {tripPlan.endDate}</span>}
                  </div>
                )}
                {tripPlan.travelers && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{tripPlan.travelers} {tripPlan.travelers === 1 ? 'traveler' : 'travelers'}</span>
                  </div>
                )}
                {tripPlan.budget && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span>{tripPlan.budget}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 ml-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {tripPlan.days.length} {tripPlan.days.length === 1 ? 'day' : 'days'}
              </Badge>
              {tripPlan.days.length > 0 && (
                <>
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    className="gap-2"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="gap-2"
                    size="sm"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    onClick={handleDiscard}
                    variant="outline"
                    className="gap-2 text-red-600 border-red-300 hover:bg-red-600 hover:text-white hover:border-red-600 transition-colors"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                    Discard
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Itinerary */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {isEditMode ? (
          <DndProvider backend={HTML5Backend}>
            <div className="p-6 space-y-6">
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
          </DndProvider>
        ) : (
          <div className="p-6 space-y-6">
            {tripPlan.days.map((day, index) => (
              <Card key={day.day} className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                      <span className="text-lg">{day.day}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl mb-1">{day.title}</h3>
                    {day.date && <p className="text-sm text-gray-600">{day.date}</p>}
                  </div>
                </div>

                <div className="space-y-4 ml-16">
                  {day.activities.map((activity, actIndex) => {
                    const Icon = categoryIcons[activity.category];
                    return (
                      <div key={activity.id} className="relative">
                        {actIndex !== day.activities.length - 1 && (
                          <div className="absolute left-4 top-10 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 pt-1">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${categoryColors[activity.category]}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className="font-medium">{activity.title}</h4>
                              <span className="text-sm text-gray-500 flex-shrink-0">{activity.time}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                            {activity.location && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="w-3 h-3" />
                                <span>{activity.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Discard Confirmation Dialog */}
      <AlertDialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard Itinerary?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to discard this itinerary? This action cannot be undone and you'll lose all the generated content.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDiscard}
              className="bg-red-600 hover:bg-red-700"
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});



