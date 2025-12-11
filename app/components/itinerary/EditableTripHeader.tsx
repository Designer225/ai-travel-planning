'use client';

import { useState } from 'react';
import { Card } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Calendar, MapPin, DollarSign, Users, Edit2, Check, X } from 'lucide-react';
import { TripPlan } from '@/types';

interface EditableTripHeaderProps {
  tripPlan: TripPlan;
  onUpdate: (updates: Partial<TripPlan>) => void;
}

export function EditableTripHeader({ tripPlan, onUpdate }: EditableTripHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({
    destination: tripPlan.destination,
    startDate: tripPlan.startDate || '',
    endDate: tripPlan.endDate || '',
    budget: tripPlan.budget || '',
    travelers: tripPlan.travelers || 1,
  });

  const handleStartEdit = () => {
    setEditValues({
      destination: tripPlan.destination,
      startDate: tripPlan.startDate || '',
      endDate: tripPlan.endDate || '',
      budget: tripPlan.budget || '',
      travelers: tripPlan.travelers || 1,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({
      destination: tripPlan.destination,
      startDate: tripPlan.startDate || '',
      endDate: tripPlan.endDate || '',
      budget: tripPlan.budget || '',
      travelers: tripPlan.travelers || 1,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card
        className="p-6 bg-white shadow-sm"
        tabIndex={0}
        aria-label="Edit trip header"
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            handleCancel();
          }
        }}
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 mb-1 block">Destination</label>
            <Input
              value={editValues.destination}
              onChange={(e) => setEditValues({ ...editValues, destination: e.target.value })}
              placeholder="Enter destination"
              className="text-xl"
              aria-label="Trip destination"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Start Date</label>
              <Input
                type="date"
                value={editValues.startDate}
                onChange={(e) => setEditValues({ ...editValues, startDate: e.target.value })}
                aria-label="Trip start date"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">End Date</label>
              <Input
                type="date"
                value={editValues.endDate}
                onChange={(e) => setEditValues({ ...editValues, endDate: e.target.value })}
                aria-label="Trip end date"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Budget</label>
              <Input
                value={editValues.budget}
                onChange={(e) => setEditValues({ ...editValues, budget: e.target.value })}
                placeholder="e.g., $2,000 - $2,500"
                aria-label="Trip budget"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Travelers</label>
              <Input
                type="number"
                min="1"
                value={editValues.travelers}
                onChange={(e) => setEditValues({ ...editValues, travelers: parseInt(e.target.value) || 1 })}
                aria-label="Number of travelers"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSave} size="sm" className="gap-2" aria-label="Save trip header">
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2" aria-label="Cancel trip header edits">
              <X className="w-4 h-4" />
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className="p-6 bg-white shadow-sm"
      tabIndex={0}
      aria-label="Trip summary"
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleStartEdit();
        }
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl mb-3">{tripPlan.destination}</h2>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
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
        
        <div className="flex items-start gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {tripPlan.days.length} {tripPlan.days.length === 1 ? 'day' : 'days'}
          </Badge>
          <Button
            onClick={handleStartEdit}
            variant="ghost"
            size="sm"
            className="gap-2"
            aria-label="Edit trip header"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  );
}
