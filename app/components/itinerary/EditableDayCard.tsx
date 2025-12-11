'use client';

import { useMemo, useState } from 'react';
import { Card } from '@/app/components/ui/card';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
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

export default function EditableDayCard({
  day,
  dayIndex,
  onUpdateDay,
  onUpdateActivity,
  onDeleteActivity,
  onMoveActivity,
  onAddActivity,
}: EditableDayCardProps) {
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(day.title);
  const [editDate, setEditDate] = useState(day.date || '');

  const parsedEditDate = useMemo(() => {
    if (!editDate) return undefined;
    // editDate is stored as YYYY-MM-DD; construct using local time to avoid TZ shifts
    const [year, month, dayOfMonth] = editDate.split('-').map((v) => parseInt(v, 10));
    if (!year || !month || !dayOfMonth) return undefined;
    const d = new Date(year, month - 1, dayOfMonth);
    return isNaN(d.getTime()) ? undefined : d;
  }, [editDate]);

  const formattedDisplayDate = useMemo(() => {
    if (!parsedEditDate) return '';
    return parsedEditDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [parsedEditDate]);

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
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Date</label>
                    <Input
                      type="date"
                      value={editDate}
                      onChange={(e) => {
                        const date = new Date(e.target.value);
                        if (isNaN(date.getTime())) {
                          // Invalid date
                          setEditDate('');
                          return;
                        }
                        
                        const year = date.getFullYear();
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const dayOfMonth = String(date.getDate()).padStart(2, '0');
                        const formatted = `${year}-${month}-${dayOfMonth}`;
                        setEditDate(formatted);
                      }}
                      sx={{
                        width: "100%",
                        justifyContent: "start",
                        textAlign: "left",
                        color: "#000",
                        borderColor: "#000",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl mb-1">{day.title}</h3>
                  {day.date && (
                    <p className="text-sm text-gray-600">
                      {formatDisplayDate(day.date)}
                    </p>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={handleToggleEditMode}
              variant={isEditMode ? "contained" : "outlined"}
              className="gap-2"
              sx={{
                color: isEditMode ? "#fff" : "#000",
                background: isEditMode ? "#000" : "#fff",
                gap: 1,
                border: "none",
                ":hover": {
                  backgroundColor: isEditMode ? "#333" : "#eeeeee"
                }
              }}
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
          variant="outlined"
          className="w-full border-dashed gap-2"
          sx={{
            width: "100%",
            border: "dashed 1px",
            gap: 1,
            color: "#000",
            ":hover": {
              backgroundColor: "#f3e5f5",
              borderColor: "#ba68c8"
            }
          }}
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>
    </Card>
  );
}
