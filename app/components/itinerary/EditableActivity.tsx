'use client';

import { useState } from 'react';
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

export function EditableActivity({ activity, onUpdate, onDelete, showDragHandle = false }: EditableActivityProps) {
  const [isEditing, setIsEditing] = useState(false);
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

  if (isEditing) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-300">
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Time</label>
              <Input
                type="time"
                value={editValues.time}
                onChange={(e) => setEditValues({ ...editValues, time: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">Category</label>
              <Select
                value={editValues.category}
                onValueChange={(value) => setEditValues({ ...editValues, category: value as typeof editValues.category })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transport">ðŸš— Transport</SelectItem>
                  <SelectItem value="activity">ðŸŽ¯ Activity</SelectItem>
                  <SelectItem value="food">ðŸ½ï¸ Food</SelectItem>
                  <SelectItem value="accommodation">ðŸ¨ Accommodation</SelectItem>
                  <SelectItem value="other">ðŸ“ Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Title</label>
            <Input
              value={editValues.title}
              onChange={(e) => setEditValues({ ...editValues, title: e.target.value })}
              placeholder="Activity title"
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Description</label>
            <Textarea
              value={editValues.description}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Activity description"
              rows={2}
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Location</label>
            <Input
              value={editValues.location}
              onChange={(e) => setEditValues({ ...editValues, location: e.target.value })}
              placeholder="Location (optional)"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button onClick={handleSave} size="sm" className="gap-2">
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outline" size="sm" className="gap-2">
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={onDelete} variant="destructive" size="sm" className="gap-2 ml-auto">
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors ${showDragHandle ? 'cursor-move' : ''}`}>
      <div className="flex-shrink-0 flex items-center">
        {showDragHandle && (
          <GripVertical className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mr-1" />
        )}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${categoryColors[activity.category]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
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

      <div className="flex-shrink-0 flex items-start opacity-0 group-hover:opacity-100 transition-opacity">
        <Button onClick={handleStartEdit} variant="ghost" size="sm" className="h-8 gap-1">
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}
