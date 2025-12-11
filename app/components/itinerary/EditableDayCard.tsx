'use client';

import { useMemo, useRef, useState } from 'react';
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
  onDeleteDay: () => void;
  enableDragAndDrop?: boolean;
  onFocusDayByIndex?: (dayIndex: number) => void;
  registerDayRef?: (node: HTMLDivElement | null) => void;
}

export default function EditableDayCard({
  day,
  dayIndex,
  onUpdateDay,
  onUpdateActivity,
  onDeleteActivity,
  onMoveActivity,
  onAddActivity,
  onDeleteDay,
  enableDragAndDrop = false,
  onFocusDayByIndex,
  registerDayRef,
}: EditableDayCardProps) {
  const formatDisplayDate = (dateStr?: string) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [isChildEditing, setIsChildEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(day.title);
  const [editDate, setEditDate] = useState(day.date || '');
  const cardRef = useRef<HTMLDivElement>(null);
  const activitiesContainerRef = useRef<HTMLDivElement>(null);
  const dayLabel = day.title || `Day ${day.day}`;

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

  const focusDayCard = (targetIndex: number) => {
    if (onFocusDayByIndex) {
      onFocusDayByIndex(targetIndex);
      return;
    }
    const cards = document.querySelectorAll<HTMLElement>('[data-day-card]');
    if (targetIndex >= 0 && targetIndex < cards.length) {
      cards[targetIndex].focus();
    }
  };

  const focusActivityByIndex = (targetIndex: number) => {
    const nodes = activitiesContainerRef.current?.querySelectorAll<HTMLElement>('[data-activity-id]');
    if (!nodes || targetIndex < 0 || targetIndex >= nodes.length) return;
    nodes[targetIndex].focus();
  };

  const allowDrag = enableDragAndDrop || isEditMode;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const tagName = target?.tagName;
    const isFormField = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'].includes(tagName || '');
    if (isFormField && event.key !== 'Escape') {
      return;
    }
    if (event.key === 'Enter' && !isChildEditing) {
      event.preventDefault();
      handleToggleEditMode();
      return;
    }
    if (event.key === 'Escape' && isEditMode) {
      event.preventDefault();
      handleCancelTitle();
      setIsEditMode(false);
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusDayCard(dayIndex + 1);
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusDayCard(dayIndex - 1);
    }
  };

  return (
    <Card
      className="p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      data-day-card
      aria-label={`Day ${day.day}: ${dayLabel}`}
      ref={(node) => {
        cardRef.current = node;
        if (registerDayRef) registerDayRef(node);
      }}
    >
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
                    aria-label={`Edit title for day ${day.day}`}
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-600">Date</label>
                    <Input
                      type="date"
                      value={editDate}
                      aria-label={`Pick a date for day ${day.day}`}
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
                    {/* <label className="text-xs text-gray-700">Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal text-sm"
                          aria-label={`Pick a date for day ${day.day}`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {parsedEditDate ? (
                            formattedDisplayDate
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="p-0 w-auto">
                        <Calendar
                          numberOfMonths={1}
                          mode="single"
                          selected={parsedEditDate}
                          onSelect={(date) => {
                            if (!date) {
                              setEditDate('');
                              return;
                            }
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const dayOfMonth = String(date.getDate()).padStart(2, '0');
                            const formatted = `${year}-${month}-${dayOfMonth}`;
                            setEditDate(formatted);
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover> */}
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
              size='small'
              sx={{
                color: isEditMode ? "#fff" : "#000",
                background: isEditMode ? "#000" : "#fff",
                gap: 1,
                border: "none",
                marginRight: 1,
                ":hover": {
                  backgroundColor: isEditMode ? "#333" : "#eeeeee"
                }
              }}
              aria-label={isEditMode ? `Save edits for day ${day.day}` : `Edit details for day ${day.day}`}
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
            <Button
              onClick={onDeleteDay}
              variant="outlined"
              size="small"
              sx={{
                color: '#e53935',
                borderColor: "#ef9a9a",
                ":hover": {
                  backgroundColor: '#ffebee'
                }
              }}
              className="gap-2"
              aria-label={`Delete ${dayLabel}`}
            >
              <X className="w-4 h-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 ml-16" ref={activitiesContainerRef}>
        {/* Drop zone before first activity */}
        {allowDrag && (
          <ActivityDropZone
            dayIndex={dayIndex}
            position={0}
            onDrop={handleDrop}
            isFirst={true}
            aria-label={`Drop activity at start of ${dayLabel}`}
          />
        )}

        {day.activities.map((activity, actIndex) => (
          <div key={activity.id}>
            {allowDrag ? (
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
                  onFocusNext={day.activities[actIndex + 1] ? () => focusActivityByIndex(actIndex + 1) : undefined}
                  onFocusPrev={day.activities[actIndex - 1] ? () => focusActivityByIndex(actIndex - 1) : undefined}
                  onFocusNextDay={() => focusDayCard(dayIndex + 1)}
                  onFocusPrevDay={() => focusDayCard(dayIndex - 1)}
                  dayLabel={day.title}
                  setIsChildEditing={setIsChildEditing}
                />
              </DraggableActivity>
            ) : (
              <EditableActivity
                activity={activity}
                onUpdate={(updates) => onUpdateActivity(activity.id, updates)}
                onDelete={() => onDeleteActivity(activity.id)}
                showDragHandle={false}
                onFocusNext={day.activities[actIndex + 1] ? () => focusActivityByIndex(actIndex + 1) : undefined}
                onFocusPrev={day.activities[actIndex - 1] ? () => focusActivityByIndex(actIndex - 1) : undefined}
                onFocusNextDay={() => focusDayCard(dayIndex + 1)}
                onFocusPrevDay={() => focusDayCard(dayIndex - 1)}
                dayLabel={day.title}
                setIsChildEditing={setIsChildEditing}
              />
            )}
            
            {/* Drop zone after each activity */}
            {allowDrag && (
              <ActivityDropZone
                dayIndex={dayIndex}
                position={actIndex + 1}
                onDrop={handleDrop}
                aria-label={`Drop activity after ${activity.title}`}
              />
            )}
          </div>
        ))}

        {/* Add Activity Button */}
        <Button
          onClick={onAddActivity}
          variant="outlined"
          className="w-full border-dashed gap-2"
          size='small'
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
          // variant="outline"
          // size="sm"
          // className="w-full border-dashed gap-2 hover:bg-purple-50 hover:border-purple-300"
          // aria-label={`Add activity to ${dayLabel}`}
        >
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>
    </Card>
  );
}
