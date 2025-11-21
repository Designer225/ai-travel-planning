'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Edit, Trash2 } from 'lucide-react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface TripCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TripCard({ id, image, title, location, date, onEdit, onDelete }: TripCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow" role="article" aria-label={`Trip to ${title}`}>
      <div className="aspect-video w-full overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={`${title} destination image`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-2xl mb-2">{title}</h3>
        
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span><span className="sr-only">Location: </span>{location}</span>
        </div>
        
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span><span className="sr-only">Dates: </span>{date}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onEdit(id)}
            aria-label={`Edit ${title} trip`}
          >
            <Edit className="w-4 h-4 mr-2" aria-hidden="true" />
            Edit trip
          </Button>
          <Button 
            variant="outline" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(id)}
            aria-label={`Delete ${title} trip`}
          >
            <Trash2 className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
