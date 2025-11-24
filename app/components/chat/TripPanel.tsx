'use client';

import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Card } from '@/app/components/ui/card';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, MapPin, DollarSign, Users, Plane, Utensils, Hotel, Navigation } from 'lucide-react';
import { TripPlan } from '@/types';

interface TripPanelProps {
  tripPlan: TripPlan | null;
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

export function TripPanel({ tripPlan }: TripPanelProps) {
  if (!tripPlan) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl mb-3">Your Trip Plan Will Appear Here</h2>
          <p className="text-gray-600 mb-6">
            Start chatting with the AI assistant to create your personalized travel itinerary. 
            I'll build a detailed day-by-day plan as we discuss your preferences.
          </p>
          <div className="grid grid-cols-2 gap-3 text-sm text-left">
            <div className="p-3 bg-white rounded-lg border">
              <Calendar className="w-5 h-5 text-blue-600 mb-2" />
              <div>Daily schedules</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <MapPin className="w-5 h-5 text-purple-600 mb-2" />
              <div>Locations & activities</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <Utensils className="w-5 h-5 text-orange-600 mb-2" />
              <div>Restaurant picks</div>
            </div>
            <div className="p-3 bg-white rounded-lg border">
              <Hotel className="w-5 h-5 text-green-600 mb-2" />
              <div>Accommodations</div>
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
        <div className="flex items-start justify-between mb-4">
          <div>
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
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {tripPlan.days.length} {tripPlan.days.length === 1 ? 'day' : 'days'}
          </Badge>
        </div>
      </div>

      {/* Itinerary */}
      <ScrollArea className="flex-1">
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
      </ScrollArea>
    </>
  );
}



