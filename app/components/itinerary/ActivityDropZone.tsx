'use client';

import { useDrop } from 'react-dnd';
import React from 'react';

interface ActivityDropZoneProps {
  dayIndex: number;
  position: number;
  onDrop: (activityId: string, fromDayIndex: number, position: number) => void;
  isFirst?: boolean;
}

const ItemType = 'ACTIVITY';

export function ActivityDropZone({ dayIndex, position, onDrop, isFirst = false }: ActivityDropZoneProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemType,
    drop: (item: { activityId: string; dayIndex: number; activityIndex: number }) => {
      // Don't drop if it's the same position
      if (item.dayIndex === dayIndex && item.activityIndex === position) {
        return;
      }
      // Adjust position if dragging within same day downwards
      const adjustedPosition = 
        item.dayIndex === dayIndex && item.activityIndex < position 
          ? position - 1 
          : position;
      
      onDrop(item.activityId, item.dayIndex, adjustedPosition);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [dayIndex, position, onDrop]);

  const isActive = isOver && canDrop;

  return (
    <div
      ref={(el: HTMLDivElement | null) => drop(el)}
      className={`transition-all ${
        isActive
          ? 'h-12 bg-blue-100 border-2 border-blue-400 border-dashed rounded-lg'
          : isFirst
          ? 'h-2'
          : 'h-1'
      }`}
    >
      {isActive && (
        <div className="flex items-center justify-center h-full text-sm text-blue-600">
          Drop here
        </div>
      )}
    </div>
  );
}
