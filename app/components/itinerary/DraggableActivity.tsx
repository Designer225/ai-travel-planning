'use client';

import { ReactNode } from 'react';
import { useDrag } from 'react-dnd';

interface DraggableActivityProps {
  activity: {
    id: string;
    title: string;
  };
  dayIndex: number;
  activityIndex: number;
  children: ReactNode;
}

const ItemType = 'ACTIVITY';

export function DraggableActivity({ activity, dayIndex, activityIndex, children }: DraggableActivityProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemType,
    item: { 
      activityId: activity.id,
      dayIndex,
      activityIndex,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [activity.id, dayIndex, activityIndex]);

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
      aria-label={`Reorder ${activity.title}`}
      aria-grabbed={isDragging}
      role="group"
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
