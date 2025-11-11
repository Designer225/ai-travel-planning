'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Check, X, Plus } from 'lucide-react';
import { TripDay, DayActivity } from '@/types';
import { EditableActivity } from './EditableActivity';
import { DraggableActivity } from './DraggableActivity';
import { ActivityDropZone } from './ActivityDropZone';

interface EditableDayCardProps {
  day: TripDay;
  dayIndex: number;
  onUpdateDay: (updates: Partial<TripDay>) => void;
  onUpdateActivity: (activityId: string, updates: Partial<DayActivity>) => void;
  onDeleteActivity: (activityId: string) => void;
  onMoveActivity: (fromDayIndex: number, fromActivityId: string, toDayIndex: number, toPosition: number) => void;
  onAddActivity: () => void;
}

export function EditableDayCard({
  day,
  dayIndex,
  onUpdateDay,
  onUpdateActivity,
  onDeleteActivity,
  onMoveActivity,
  onAddActivity,
}: EditableDayCardProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(day.title);
  const [editDate, setEditDate] = useState(day.date || '');

  const handleSaveTitle = () => {
    onUpdateDay({ title: editTitle, date: editDate });
  };

  const handleCancelTitle = () => {
    setEditTitle(day.title);
    setEditDate(day.date || '');
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      // Exiting edit mode - save title if it was changed
      if (editTitle !== day.title || editDate !== (day.date || '')) {
        handleSaveTitle();
      }
    } else {
      // Entering edit mode - initialize edit values
      setEditTitle(day.title);
      setEditDate(day.date || '');
    }
    setIsEditMode(!isEditMode);
  };

  const handleDrop = (activityId: string, fromDayIndex: number, position: number) => {
    onMoveActivity(fromDayIndex, activityId, dayIndex, position);
  };

  return (
    <Card className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4 mb-6">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
            <span className="text-lg">{day.day}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Day title"
                    className="text-xl"
                  />
                  <Input
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    placeholder="Date (e.g., April 1, 2025)"
                    className="text-sm"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-xl mb-1">{day.title}</h3>
                  {day.date && <p className="text-sm text-gray-600">{day.date}</p>}
                </div>
              )}
            </div>
            <Button
              onClick={handleToggleEditMode}
              variant={isEditMode ? "default" : "ghost"}
              size="sm"
              className="gap-2"
            >
              {isEditMode ? (
                <>
                  <Check className="w-4 h-4" />
                  Done
                </>
              ) : (
                <>
                  <Edit2 className="w-4 h-4" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 ml-16">
        {/* Drop zone before first activity */}
        {isEditMode && (
          <ActivityDropZone
            dayIndex={dayIndex}
            position={0}
            onDrop={handleDrop}
            isFirst={true}
          />
        )}

        {day.activities.map((activity, actIndex) => (
          <div key={activity.id}>
            {isEditMode ? (
              <DraggableActivity
                activity={activity}
                dayIndex={dayIndex}
                activityIndex={actIndex}
              >
                <EditableActivity
                  activity={activity}
                  onUpdate={(updates) => onUpdateActivity(activity.id, updates)}
                  onDelete={() => onDeleteActivity(activity.id)}
                  showDragHandle={true}
                />
              </DraggableActivity>
            ) : (
              <EditableActivity
                activity={activity}
                onUpdate={(updates) => onUpdateActivity(activity.id, updates)}
                onDelete={() => onDeleteActivity(activity.id)}
                showDragHandle={false}
              />
            )}
            
            {/* Drop zone after each activity */}
            {isEditMode && (
              <ActivityDropZone
                dayIndex={dayIndex}
                position={actIndex + 1}
                onDrop={handleDrop}
              />
            )}
          </div>
        ))}

        {/* Add Activity Button */}
        <Button
          onClick={onAddActivity}
          variant="outline"
          size="sm"
          className="w-full border-dashed gap-2 hover:bg-purple-50 hover:border-purple-300"
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>
    </Card>
  );
}
