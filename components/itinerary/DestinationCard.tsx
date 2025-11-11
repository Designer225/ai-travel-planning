'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Calendar, Sparkles } from 'lucide-react';
import { Destination } from '@/data/destinations';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface DestinationCardProps {
  destination: Destination;
  onSelect: () => void;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function DestinationCard({ destination, onSelect }: DestinationCardProps) {

  const bestMonthsStr = destination.bestMonths
    .map(m => monthNames[m - 1])
    .join(', ');

  // Generate a consistent placeholder image based on destination name
  const imageHash = destination.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const imageId = 400 + (imageHash % 600);
  const placeholderImage = `https://picsum.photos/seed/${destination.id}/${imageId}/300`;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <ImageWithFallback
          src={placeholderImage}
          alt={destination.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-900 hover:bg-white">
            {destination.region}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-xl mb-1">{destination.name}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="w-3 h-3" />
            <span>{destination.country}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {destination.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="text-gray-700">
              ${destination.averageBudgetPerDay.budget}-${destination.averageBudgetPerDay.luxury}/day
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-gray-700">Best: {bestMonthsStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-gray-700">
              {destination.idealDuration} {destination.idealDuration === 1 ? 'day' : 'days'} ideal
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {destination.activities.slice(0, 3).map((activity) => (
            <Badge key={activity} variant="secondary" className="text-xs">
              {activity}
            </Badge>
          ))}
          {destination.activities.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{destination.activities.length - 3}
            </Badge>
          )}
        </div>

        <Button 
          onClick={onSelect}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          Plan Trip Here
        </Button>
      </div>
    </Card>
  );
}
