import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Calendar, Clock, MapPin, Pencil, Trash2, Copy } from 'lucide-react';
import { Badge } from '../ui/badge';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import type { Trip } from './TripsList';

interface TripCardProps {
  trip: Trip;
  type: 'upcoming' | 'past' | 'saved';
  onCancel: (tripId: string) => void;
  onDelete: (tripId: string) => void;
  onEdit: (tripId: string) => void;
  onCopy: (tripId: string) => void;
}

export function TripCard({ trip, type, onCancel, onDelete, onEdit, onCopy }: TripCardProps) {
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  const handlePrimaryAction = () => {
    if (type === 'upcoming') {
      setShowWarningDialog(true);
    } else if (type === 'saved') {
      setShowWarningDialog(true);
    } else if (type === 'past') {
      onCopy(trip.id);
    }
  };

  const handleConfirmAction = () => {
    if (type === 'upcoming') {
      onCancel(trip.id);
    } else if (type === 'saved') {
      onDelete(trip.id);
    }
    setShowWarningDialog(false);
  };

  const getWarningContent = () => {
    if (type === 'upcoming') {
      return {
        title: 'Cancel Trip',
        description: 'Are you sure you want to cancel this trip? This action cannot be undone.',
      };
    } else {
      return {
        title: 'Delete Trip',
        description: 'Are you sure you want to delete this saved trip? This action cannot be undone.',
      };
    }
  };

  const warningContent = getWarningContent();

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow overflow-hidden">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <ImageWithFallback
            src={trip.imageUrl}
            alt={trip.title || trip.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 right-3">
            {type === 'upcoming' && (
              <Badge variant="default" className="flex-shrink-0">Upcoming</Badge>
            )}
            {type === 'past' && (
              <Badge variant="secondary" className="flex-shrink-0">Completed</Badge>
            )}
            {type === 'saved' && (
              <Badge variant="outline" className="flex-shrink-0 bg-white">Saved</Badge>
            )}
          </div>
        </div>

        <CardHeader>
          <div>
            <h3 className="text-gray-900 truncate">
              {trip.title || trip.destination}
            </h3>
            {trip.title && (
              <div className="flex items-center gap-1 mt-1 text-gray-600">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{trip.destination}</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trip.dateRange && (
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{trip.dateRange}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{trip.tripTime}</span>
            </div>
            <div className="text-gray-600">
              <span>{trip.activities} activities planned</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          {type === 'upcoming' && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(trip.id)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handlePrimaryAction}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
          {type === 'past' && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onCopy(trip.id)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          )}
          {type === 'saved' && (
            <>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onEdit(trip.id)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onCopy(trip.id)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handlePrimaryAction}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          )}
        </CardFooter>
      </Card>

      <Dialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{warningContent.title}</DialogTitle>
            <DialogDescription>
              {warningContent.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowWarningDialog(false)}
            >
              No
            </Button>
            <Button variant="destructive" onClick={handleConfirmAction}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
