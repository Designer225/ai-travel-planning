'use client';

import { useRef, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { Edit2, Check, X, Trash2, MapPin, GripVertical } from 'lucide-react';
import { Plane, Utensils, Hotel, Navigation } from 'lucide-react';
import { DayActivity } from '@/types';

interface EditableActivityProps {
  activity: DayActivity;
  onUpdate: (updates: Partial<DayActivity>) => void;
  onDelete: () => void;
  showDragHandle?: boolean;
  onFocusNext?: () => void;
  onFocusPrev?: () => void;
  dayLabel?: string;
  onFocusNextDay?: () => void;
  onFocusPrevDay?: () => void;
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

const categoryLabels = {
  transport: 'Transport',
  activity: 'Activity',
  food: 'Food',
  accommodation: 'Accommodation',
  other: 'Other',
};

export function EditableActivity({
  activity,
  onUpdate,
  onDelete,
  showDragHandle = false,
  onFocusNext,
  onFocusPrev,
  dayLabel,
  onFocusNextDay,
  onFocusPrevDay,
}: EditableActivityProps) {
  const [isEditing, setIsEditing] = useState(false);
  const fieldRefs = useRef<(HTMLElement | null)[]>([]);
  const [editValues, setEditValues] = useState({
    time: activity.time,
    title: activity.title,
    description: activity.description,
    location: activity.location || '',
    category: activity.category,
  });

  const handleStartEdit = () => {
    setEditValues({
      time: activity.time,
      title: activity.title,
      description: activity.description,
      location: activity.location || '',
      category: activity.category,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    onUpdate(editValues);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const Icon = categoryIcons[activity.category];

  const formatTimeTo12Hour = (time: string) => {
    if (!time) return '';
    const [hourStr, minuteStr] = time.split(':');
    const hour = parseInt(hourStr, 10);
    const minute = parseInt(minuteStr, 10);
    if (isNaN(hour) || isNaN(minute)) return time;

    const suffix = hour >= 12 ? 'PM' : 'AM';
    const hour12 = ((hour + 11) % 12) + 1; // 0->12, 13->1, etc.
    const paddedMinutes = minute.toString().padStart(2, '0');

    return `${hour12}:${paddedMinutes} ${suffix}`;
  };

  const focusField = (index: number) => {
    const el = fieldRefs.current[index];
    if (el) {
      el.focus();
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
        el.select();
      }
    }
  };

  const handleFieldKeyDown = (event: React.KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusField(index + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusField(index - 1);
    }
  };

  const handleKeyboardNavigation = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isEditing && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      handleStartEdit();
      return;
    }
    if (isEditing && event.key === 'Escape') {
      event.preventDefault();
      handleCancel();
      return;
    }
    if (!isEditing && event.key === 'ArrowDown' && onFocusNext) {
      event.preventDefault();
      onFocusNext();
    }
    if (!isEditing && event.key === 'ArrowUp' && onFocusPrev) {
      event.preventDefault();
      onFocusPrev();
    } else if (!isEditing && event.key === 'ArrowUp' && onFocusPrevDay) {
      event.preventDefault();
      onFocusPrevDay();
    }
    if (!isEditing && event.key === 'ArrowDown' && !onFocusNext && onFocusNextDay) {
      event.preventDefault();
      onFocusNextDay();
    }
  };

  if (isEditing) {
    return (
      <div
        className="bg-gray-50 rounded-lg p-4 border-2 border-blue-300"
        onKeyDown={handleKeyboardNavigation}
        tabIndex={0}
        aria-label={`Editing ${activity.title} details`}
        role="group"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-700 mb-1 block">Time</label>
              <Input
                type="time"
                value={editValues.time}
                onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
                aria-label="Activity start time"
                ref={(el) => { fieldRefs.current[0] = el; }}
                onKeyDown={(e) => handleFieldKeyDown(e, 0)}
              />
            </div>
            <div>
              <label className="text-xs text-gray-700 mb-1 block">Category</label>
              <Select
                value={editValues.category}
                onValueChange={(value) => setEditValues({ ...editValues, category: value as typeof editValues.category })}
              >
                <SelectTrigger
                  aria-label="Activity category"
                  ref={(el) => { fieldRefs.current[1] = el; }}
                  onKeyDown={(e) => handleFieldKeyDown(e, 1)}
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">Transport</SelectItem>
                  <SelectItem value="activity">Activity</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-700 mb-1 block">Title</label>
            <Input
              value={editValues.title}
              onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
              placeholder="Activity title"
              aria-label="Activity title"
              ref={(el) => { fieldRefs.current[2] = el; }}
              onKeyDown={(e) => handleFieldKeyDown(e, 2)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-700 mb-1 block">Description</label>
            <Textarea
              value={editValues.description}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Activity description"
              rows={2}
              aria-label="Activity description"
              ref={(el) => { fieldRefs.current[3] = el; }}
              onKeyDown={(e) => handleFieldKeyDown(e, 3)}
            />
          </div>

          <div>
            <label className="text-xs text-gray-700 mb-1 block">Location</label>
            <Input
              value={editValues.location}
              onChange={(e) => setEditValues({ ...editValues, location: e.target.value })}
              placeholder="Location (optional)"
              aria-label="Activity location"
              ref={(el) => { fieldRefs.current[4] = el; }}
              onKeyDown={(e) => handleFieldKeyDown(e, 4)}
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button
              onClick={handleSave}
              size="sm"
              className="gap-2"
              aria-label={`Save changes to ${activity.title}`}
              ref={(el) => { fieldRefs.current[5] = el; }}
              onKeyDown={(e) => handleFieldKeyDown(e, 5)}
            >
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              size="sm"
              className="gap-2"
              aria-label={`Cancel editing ${activity.title}`}
              ref={(el) => { fieldRefs.current[6] = el; }}
              onKeyDown={(e) => handleFieldKeyDown(e, 6)}
            >
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button
              onClick={onDelete}
              variant="destructive"
              size="sm"
              className="gap-2 ml-auto"
              aria-label={`Delete ${activity.title}`}
              ref={(el) => { fieldRefs.current[7] = el; }}
              onKeyDown={(e) => handleFieldKeyDown(e, 7)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${showDragHandle ? 'cursor-move' : ''}`}
      tabIndex={0}
      role="group"
      aria-label={`${activity.title} on ${dayLabel || 'this day'} at ${formatTimeTo12Hour(activity.time)}`}
      onKeyDown={handleKeyboardNavigation}
      data-activity-id={activity.id}
    >
      <div className="flex-shrink-0 flex items-center">
        {showDragHandle && (
          <GripVertical
            className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity mr-1"
            aria-label={`Drag to move ${activity.title}`}
            role="img"
          />
        )}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${categoryColors[activity.category]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="font-medium">{activity.title}</h4>
          <span className="text-sm text-gray-500 flex-shrink-0">
            {formatTimeTo12Hour(activity.time)}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
        {activity.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin className="w-3 h-3" />
            <span>{activity.location}</span>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex items-start opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          onClick={handleStartEdit}
          variant="ghost"
          size="sm"
          className="h-8 gap-1"
          aria-label={`Edit activity ${activity.title}`}
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
