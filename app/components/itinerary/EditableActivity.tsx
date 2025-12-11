'use client';

import { useState } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
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
                onChange={(e) => setEditValues({ ...editValues, category: e.target.value })}
                sx={{
                  width: "100%"
                }}
              >
                <MenuItem value="transport">Transport</MenuItem>
                <MenuItem value="activity">Activity</MenuItem>
                <MenuItem value="food">Food</MenuItem>
                <MenuItem value="accommodation">Accommodation</MenuItem>
                <MenuItem value="other">Other</MenuItem>
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
            <TextField
              value={editValues.description}
              onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
              placeholder="Activity description"
              rows={3}
              multiline={true}
              sx={{
                width: "100%"
              }}
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
            <Button onClick={handleSave} variant='contained' sx={{
              gap: 1,
              backgroundColor: "#000",
              ":hover": {
                backgroundColor: "#333"
              }
            }}>
              <Check className="w-4 h-4" />
              Save
            </Button>
            <Button onClick={handleCancel} variant="outlined" sx={{
              gap: 1,
              border: "#777 1px",
              color: "#000",
              ":hover": {
                backgroundColor: "#eee"
              }
            }}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={onDelete} variant="contained" sx={{
              gap: 1,
              backgroundColor: "#d50000",
              ":hover": {
                backgroundColor: "#ff5252"
              },
              marginLeft: "auto"
            }}>
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
        <Button onClick={handleStartEdit} variant="outlined" sx={{
          gap: 1,
          border: "none",
          color: "#000",
          ":hover": {
            backgroundColor: "#eee"
          }
        }}>
          <Edit2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
