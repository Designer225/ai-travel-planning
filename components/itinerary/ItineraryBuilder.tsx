'use client';

import { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { MapPin, Sparkles, Save, Share2, Download, Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EditableTripHeader } from './EditableTripHeader';
import { EditableDayCard } from './EditableDayCard';
import { TripPlan, DayActivity, TripDay } from '@/types';
import { toast, Toaster } from 'sonner';

interface ItineraryBuilderProps {
  onBack?: () => void;
}

export default function ItineraryBuilder({ onBack }: ItineraryBuilderProps = {}) {
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    destination: 'Tokyo, Japan',
    startDate: '2025-04-01',
    endDate: '2025-04-05',
    days: [
      {
        day: 1,
        date: 'April 1, 2025',
        title: 'Arrival & Shibuya Exploration',
        activities: [
          {
            id: '1',
            time: '14:00',
            title: 'Arrive at Narita Airport',
            description: 'Take the Narita Express to Shibuya Station (90 min, Â¥3,250)',
            category: 'transport',
          },
          {
            id: '2',
            time: '16:00',
            title: 'Check-in at Hotel',
            description: 'Hotel in Shibuya district',
            location: 'Shibuya',
            category: 'accommodation',
          },
          {
            id: '3',
            time: '18:00',
            title: 'Shibuya Crossing & Hachiko Statue',
            description: "Experience the world's busiest pedestrian crossing",
            location: 'Shibuya',
            category: 'activity',
          },
          {
            id: '4',
            time: '20:00',
            title: 'Dinner at Ichiran Ramen',
            description: 'Famous tonkotsu ramen in private booth',
            location: 'Shibuya',
            category: 'food',
          },
        ],
      },
      {
        day: 2,
        date: 'April 2, 2025',
        title: 'Traditional Tokyo - Asakusa & Ueno',
        activities: [
          {
            id: '5',
            time: '09:00',
            title: 'Visit Senso-ji Temple',
            description: "Tokyo's oldest temple with traditional shopping street",
            location: 'Asakusa',
            category: 'activity',
          },
          {
            id: '6',
            time: '12:00',
            title: 'Lunch at Nakamise Shopping Street',
            description: 'Try traditional snacks and street food',
            location: 'Asakusa',
            category: 'food',
          },
          {
            id: '7',
            time: '14:00',
            title: 'Ueno Park & Museums',
            description: 'Visit museums or enjoy cherry blossoms if in season',
            location: 'Ueno',
            category: 'activity',
          },
        ],
      },
      {
        day: 3,
        date: 'April 3, 2025',
        title: 'Modern Tokyo - Harajuku & Shinjuku',
        activities: [
          {
            id: '9',
            time: '10:00',
            title: 'Meiji Shrine',
            description: 'Peaceful Shinto shrine in forested area',
            location: 'Harajuku',
            category: 'activity',
          },
          {
            id: '10',
            time: '12:00',
            title: 'Takeshita Street Shopping',
            description: 'Trendy fashion and quirky shops',
            location: 'Harajuku',
            category: 'activity',
          },
        ],
      },
    ],
    budget: '$2,000 - $2,500',
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
    setTripPlan(prev => ({
      ...prev,
      days: prev.days.map((day, idx) => {
        if (idx !== dayIndex) return day;
        return {
          ...day,
          activities: day.activities.map(activity =>
            activity.id === activityId ? { ...activity, ...updates } : activity
          ),
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

  const handleSave = () => {
    // Simulate save
    toast.success('Itinerary saved successfully!');
    console.log('Saving itinerary:', tripPlan);
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

  return (
    <DndProvider backend={HTML5Backend}>
      <Toaster position="top-right" richColors />
      <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <header className="border-b bg-white/80 backdrop-blur-sm shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {onBack && (
                  <Button variant="ghost" size="sm" className="gap-2" onClick={onBack}>
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
                <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSave}
                  className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
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
                  variant="outline"
                  onClick={handleAddDay}
                  className="w-full border-dashed border-2 h-16 gap-2 hover:bg-blue-50 hover:border-blue-300"
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
      </div>
    </DndProvider>
  );
}

